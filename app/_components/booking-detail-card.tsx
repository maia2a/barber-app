"use client"

import { InfoRow } from "@/app/_components/info-row"
import { Card, CardContent } from "@/app/_components/ui/card"
import { format, type Locale } from "date-fns"
import { type SerializedBookingWithDetails } from "../bookings/page"

interface BookingDetailsCardProps {
  booking: SerializedBookingWithDetails
  locale: Locale
}

export const BookingDetailsCard = ({
  booking,
  locale,
}: BookingDetailsCardProps) => {
  const { service, date: bookingDateObject } = booking
  const { name: serviceName, price: servicePriceString, barbershop } = service
  const { name: barbershopName } = barbershop

  const formattedDate = format(bookingDateObject, "dd 'de' MMMM", { locale })
  const formattedTime = format(bookingDateObject, "HH:mm", { locale })

  return (
    <Card className="mb-6 mt-3">
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{serviceName}</h2>
          <p className="text-sm font-bold">{servicePriceString}</p>
        </div>
        <InfoRow label="Data" value={formattedDate} />
        <InfoRow label="Horário" value={formattedTime} />
        <InfoRow label="Barbearia" value={barbershopName} />
      </CardContent>
    </Card>
  )
}
