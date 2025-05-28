"use client"

import { Calendar } from "@/app/_components/ui/calendar"
import type { Barbershop, BarbershopService, Booking } from "@prisma/client"
import { set, type Locale } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { createBooking } from "../_actions/create-booking"
import { getBookings } from "../_actions/get-bookings"
import { BookingConfirmationView } from "./booking-confirmation-view"
import SignInDialog from "./sign-in-dialog"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent } from "./ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

// Define ServiceItemProps interface
interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}

const ALL_POSSIBLE_TIMES_SLOTS = [
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
] as const

const CALENDAR_CLASSNAMES = {
  caption: "flex justify-center pt-1 relative items-center",
  caption_label: "text-sm font-medium",
  cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
  day_selected:
    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
  day_today: "bg-accent text-accent-foreground",
}
// --- Helper Functions for Time Slot Filtering ---
const parseTimeSlot = (
  timeSlotString: string,
): { hour: number; minutes: number } => {
  const [hourString, minutesString] = timeSlotString.split(":")
  return {
    hour: Number(hourString),
    minutes: Number(minutesString),
  }
}

// --- Time List Generation ---
const isTimeSlotBooked = (
  slotHour: number,
  slotMinutes: number,
  dailyBookings: Booking[],
): boolean => {
  return dailyBookings.some((booking) => {
    const bookingHour = booking.date.getHours()
    const bookingMinutes = booking.date.getMinutes()
    return bookingHour === slotHour && bookingMinutes === slotMinutes
  })
}

const getAvailableTimeSlots = (
  dailyBookings: Booking[],
  allTimeSlots: readonly string[],
): string[] => {
  return allTimeSlots.filter((timeSlot) => {
    const { hour: targetHour, minutes: targetMinutes } = parseTimeSlot(timeSlot)
    return !isTimeSlotBooked(targetHour, targetMinutes, dailyBookings)
  })
}


interface BookingCalendarViewProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  locale: Locale
  classNames: typeof CALENDAR_CLASSNAMES
}

const BookingCalendarView = ({
  selectedDate,
  onDateSelect,
  locale,
  classNames,
}: BookingCalendarViewProps) => (
  <div className="flex justify-center border-b border-solid border-secondary px-5 py-6">
    <Calendar
      mode="single"
      locale={locale}
      selected={selectedDate}
      onSelect={onDateSelect}
      fromDate={new Date()} // Disable past dates
      className="w-auto"
      classNames={classNames}
    />
  </div>
)

interface TimeSlotPickerViewProps {
  availableTimes: string[]
  selectedTime: string | undefined
  onTimeSelect: (time: string) => void
  isLoading: boolean
}

const TimeSlotPickerView = ({
  availableTimes,
  selectedTime,
  onTimeSelect,
  isLoading,
}: TimeSlotPickerViewProps) => (
  <div className="flex gap-3 overflow-x-auto border-b border-solid border-secondary p-5 [&::-webkit-scrollbar]:hidden">
    {isLoading && (
      <p className="w-full text-center text-sm text-gray-400">
        Carregando horários...
      </p>
    )}
    {!isLoading && availableTimes.length === 0 && (
      <p className="w-full text-center text-sm text-gray-400">
        Não há horários disponíveis para esta data.
      </p>
    )}
    {!isLoading &&
      availableTimes.map((time) => (
        <Button
          key={time}
          variant={selectedTime === time ? "default" : "outline"}
          className="rounded-full px-4 py-2 text-sm" // Adjusted padding and text size
          onClick={() => onTimeSelect(time)}
        >
          {time}
        </Button>
      ))}
  </div>
)


// --- Main ServiceItem Component ---
export const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data: session } = useSession()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dailyBookings, setDailyBookings] = useState<Booking[]>([])
  const [bookingSheetOpen, setBookingSheetOpen] = useState(false)
  const [signInDialogOpen, setSignInDialogOpen] = useState(false)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)

  useEffect(() => {
    const fetchBookingsForDate = async () => {
      if (!selectedDate) {
        setDailyBookings([])
        return
      }
      setIsLoadingBookings(true)
      try {
        const bookings = await getBookings({
          serviceId: service.id, // Assuming getBookings uses serviceId
          date: selectedDate,
        })
        setDailyBookings(bookings)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
        toast.error("Erro ao carregar horários disponíveis.")
        setDailyBookings([]) // Clear bookings on error
      } finally {
        setIsLoadingBookings(false)
      }
    }
    fetchBookingsForDate()
  }, [selectedDate, service.id])

  const availableTimes = useMemo(() => {
    return getAvailableTimeSlots(dailyBookings, ALL_POSSIBLE_TIMES_SLOTS)
  }, [dailyBookings])

  const handleBookingSheetTrigger = () => {
    if (session?.user) {
      setBookingSheetOpen(true)
    } else {
      setSignInDialogOpen(true)
    }
  }

  const handleSheetStateChange = (isOpen: boolean) => {
    setBookingSheetOpen(isOpen)
    if (!isOpen) {
      setSelectedDate(undefined)
      setSelectedTime(undefined)
      setDailyBookings([])
    }
  }

  const handleDateSelection = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(undefined) // Reset time selection when date changes
  }

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time)
  }

   const handleBookingSubmission = async () => {
    if (!selectedDate || !selectedTime || !session?.user?.id) return;

    setIsSubmittingBooking(true);
    try {
      const [hour, minutes] = selectedTime.split(":").map(Number);
      const bookingDate = set(selectedDate, { hours: hour, minutes });

      await createBooking({
        serviceId: service.id,
        userId: session.user.id,
        date: bookingDate,
      });
      toast.success("Reserva criada com sucesso! 🎉");
      handleSheetStateChange(false); // Close and reset sheet
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Erro ao criar reserva. Tente novamente.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="flex items-stretch gap-4 p-3">
          {" "}
          {/* Changed items-center to items-stretch */}
          <div className="relative h-[110px] w-[110px] flex-shrink-0">
            {" "}
            {/* Added flex-shrink-0 */}
            <Image
              src={service.imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, 110px" // More specific sizes
              className="rounded-lg object-cover"
              alt={service.name}
            />
          </div>
          <div className="flex flex-grow flex-col justify-between space-y-1">
            {" "}
            {/* Adjusted spacing */}
            <div>
              <h3 className="truncate text-sm font-semibold">{service.name}</h3>
              <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">
                {service.description}
              </p>{" "}
              {/* Adjusted text size and margin */}
            </div>
            <div className="mt-auto flex items-center justify-between">
              {" "}
              {/* Pushed to bottom */}
              <p className="text-sm font-bold text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBookingSheetTrigger}
              >
                Reservar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={bookingSheetOpen} onOpenChange={handleSheetStateChange}>
        <SheetContent className="flex flex-col p-0">
          {" "}
          {/* Added flex flex-col */}
          <SheetHeader className="border-b border-solid border-secondary px-5 py-4 text-center">
            {" "}
            {/* Adjusted padding */}
            <SheetTitle className="text-lg">Fazer Reserva</SheetTitle>{" "}
            {/* Increased font size */}
          </SheetHeader>
          <div className="flex-grow overflow-y-auto">
            {" "}
            {/* Allows content to scroll */}
            <BookingCalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelection}
              locale={ptBR}
              classNames={CALENDAR_CLASSNAMES}
            />
            {selectedDate && (
              <TimeSlotPickerView
                availableTimes={availableTimes}
                selectedTime={selectedTime}
                onTimeSelect={handleTimeSelection}
                isLoading={isLoadingBookings}
              />
            )}
            {selectedTime && selectedDate && (
              <BookingConfirmationView
                serviceName={service.name}
                servicePrice={Number(service.price)}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                barbershopName={barbershop.name}
                locale={ptBR}
              />
            )}
          </div>
          {selectedTime && selectedDate && (
            <SheetFooter className="border-t border-solid border-secondary px-5 py-4">
              {" "}
              {/* Adjusted padding */}
              <Button
                className="w-full"
                onClick={handleBookingSubmission}
                disabled={isSubmittingBooking || !selectedDate || !selectedTime}
              >
                {isSubmittingBooking ? "Reservando..." : "Confirmar Reserva"}
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={signInDialogOpen} onOpenChange={setSignInDialogOpen}>
        <DialogContent>
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}
