// app/_components/booking/booking-details-card.tsx (Example path)
"use client"

import { InfoRow } from "@/app/_components/info-row"; // Import the shared InfoRow
import { Card, CardContent } from "@/app/_components/ui/card"; // Adjust path
import type { Prisma } from "@prisma/client";
import { format, type Locale } from "date-fns";

interface BookingDetailsCardProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true
        }
      }
    }
  }>
  locale: Locale
}

export const BookingDetailsCard = ({
  booking,
  locale,
}: BookingDetailsCardProps) => {
  const serviceName = booking.service.name
  const servicePrice = Number(booking.service.price)
  const bookingDateObject = booking.date
  const formattedDate = format(bookingDateObject, "dd 'de' MMMM", { locale })
  const formattedTime = format(bookingDateObject, "HH:mm", { locale })
  const barbershopName = booking.service.barbershop.name

  return (
    <Card className="mb-6 mt-3">
      {" "}
      {/* Example: Different card style */}
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{serviceName}</h2>
          <p className="text-sm font-bold">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(servicePrice))}
          </p>
        </div>
        <InfoRow label="Data" value={formattedDate} />
        <InfoRow label="Horário" value={formattedTime} />
        <InfoRow label="Barbearia" value={barbershopName} />
      </CardContent>
    </Card>
  )
}
