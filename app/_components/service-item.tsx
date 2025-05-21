"use client"

import type { Barbershop, BarbershopService } from "@prisma/client"
import { format } from "date-fns"
import Image from "next/image"
import { useState } from "react"
import { ptBR } from "react-day-picker/locale"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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

export const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()

  const handleReserve = () => {
    if (selectedDate && selectedTime) {
      alert(
        `Reserva feita para o dia ${format(selectedDate, "d 'de' MMMM", { locale: ptBR })} às ${selectedTime} na barbearia ${barbershop.name}`,
      )
    }
  }

  return (
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm">
                  Reservar
                </Button>
              </SheetTrigger>

              <SheetContent className="px-0">
                <SheetHeader>
                  <SheetTitle className="text-center">Fazer reserva</SheetTitle>
                </SheetHeader>

                <div className="flex justify-center border-b">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-auto"
                    classNames={{
                      months: "flex flex-col space-y-4",
                      month: "space-y-4",
                      caption:
                        "flex justify-center items-center capitalize gap-2",
                      caption_label:
                        "text-base font-semibold capitalize tracking-wide",
                      nav: "flex items-center space-x-2",
                      nav_button:
                        "h-8 w-8 rounded-md border border-input bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                      table: "w-full border-collapse",
                      head_row: "flex",
                      head_cell:
                        "text-muted-foreground w-9 font-medium text-xs uppercase tracking-wide",
                      row: "flex w-full mt-1",
                      cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
                      day: "h-9 w-9 p-0 font-normal rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary focus:text-primary-foreground",
                      day_today: "border border-primary font-semibold",
                      day_outside:
                        "text-muted-foreground opacity-50 hover:bg-muted hover:text-foreground",
                      day_disabled:
                        "opacity-50 pointer-events-none text-muted-foreground",
                    }}
                  />
                </div>

                {selectedDate && (
                  <div className="flex gap-3 overflow-x-auto border-b p-5 [&::-webkit-scrollbar]:hidden">
                    {TIME_LIST.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="rounded-full"
                        onClick={() => setSelectedTime(time)}
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
                              variant="secondary"
                              className="w-full"
                              onClick={handleReserve}
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
  )
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <h2 className="text-sm text-gray-400">{label}</h2>
    <p className="text-sm">{value}</p>
  </div>
)
