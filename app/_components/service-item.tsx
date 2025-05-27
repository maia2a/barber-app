"use client"

import { Calendar } from "@/app/_components/ui/calendar"
import type { Barbershop, BarbershopService, Booking } from "@prisma/client"
import { format, set } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createBooking } from "../_actions/create-booking"
import { getBookings } from "../_actions/get-bookings"
import SignInDialog from "./sign-in-dialog"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent } from "./ui/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]

const getTimeList = (bookings: Booking[]) => {
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minutes = Number(time.split(":")[1])

    // Check if the hour is already booked
    const hasBookingAtTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        bookings.some((booking) => booking.date.getMinutes() === minutes),
    )
    if (hasBookingAtTime) {
      return false
    }
    return true
  })
}

export const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [signInDialogOpen, setSignInDialogOpen] = useState(false)
  const { data } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDate) return
      const bookings = await getBookings({
        serviceId: service.id,
        date: selectedDate,
      })
      setDayBookings(bookings)
    }
    fetch()
  }, [selectedDate, service.id])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetOpen(true)
    }
    return setSignInDialogOpen(true)
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedDate(undefined)
      setSelectedTime(undefined)
      setDayBookings([])
    }
    setBookingSheetOpen(isOpen)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined) // Reset time selection when date changes
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate || !selectedTime) return
      const hour = selectedTime.split(":")[0]
      const minutes = selectedTime.split(":")[1]
      const newDate = set(selectedDate, {
        minutes: Number(minutes),
        hours: Number(hour),
      })
      toast.success("Reserva criada com sucesso!")
      await createBooking({
        serviceId: service.id,
        userId: data?.user as string,
        date: newDate,
      })
      handleSheetOpenChange(false) // Close the sheet after booking
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Erro ao criar reserva")
    }
  }

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          <div className="relative h-[110px] w-[110px]">
            <Image
              src={service.imageUrl}
              fill
              className="rounded-lg object-cover"
              alt={service.name}
            />
          </div>

          <div className="w-full space-y-3">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>

              <Sheet
                open={bookingSheetOpen}
                onOpenChange={handleSheetOpenChange}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                >
                  Reservar
                </Button>

                <SheetContent className="px-0">
                  <SheetHeader>
                    <SheetTitle className="text-center">
                      Fazer reserva
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex justify-center border-b">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      fromDate={new Date()}
                      selected={selectedDate}
                      onSelect={handleDateSelect}
                      className="w-auto"
                      classNames={{
                        caption:
                          "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-medium",
                        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                        day_selected:
                          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        day_today: "bg-accent text-accent-foreground",
                      }}
                    />
                  </div>

                  {selectedDate && (
                    <div className="flex gap-3 overflow-x-auto border-b p-5 [&::-webkit-scrollbar]:hidden">
                      {getTimeList(dayBookings).map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="rounded-full"
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  {selectedTime && selectedDate && (
                    <div className="p-5">
                      <Card>
                        <CardContent className="space-y-3 p-3">
                          <div className="flex justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <p className="text-sm font-bold">
                              {Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(Number(service.price))}
                            </p>
                          </div>

                          <InfoRow
                            label="Data"
                            value={format(selectedDate, "d 'de' MMMM", {
                              locale: ptBR,
                            })}
                          />
                          <InfoRow label="Horário" value={selectedTime} />
                          <InfoRow label="Barbearia" value={barbershop.name} />

                          <SheetFooter>
                            <SheetClose asChild>
                              <Button
                                variant="default"
                                className="w-full"
                                onClick={handleCreateBooking}
                              >
                                Reservar
                              </Button>
                            </SheetClose>
                          </SheetFooter>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogOpen}
        onOpenChange={(open) => setSignInDialogOpen(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <h2 className="text-sm text-gray-400">{label}</h2>
    <p className="text-sm">{value}</p>
  </div>
)
