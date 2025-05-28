// app/_components/booking/booking-confirmation-view.tsx
"use client"

import { Card, CardContent } from "@/app/_components/ui/card"; // Adjust path to your ui components
import { format, type Locale } from "date-fns";
import { InfoRow } from "./info-row";

// Define the props interface
export interface BookingConfirmationViewProps {
  // Export if needed by consumers for typing
  serviceName: string
  servicePrice: string | number
  selectedDate: Date
  selectedTime: string
  barbershopName: string
  locale: Locale
}

// Define the BookingConfirmationView component
export const BookingConfirmationView = ({
  serviceName,
  servicePrice,
  selectedDate,
  selectedTime,
  barbershopName,
  locale,
}: BookingConfirmationViewProps) => (
  <div className="p-5">
    {" "}
    {/* This outer padding might be redundant if parent provides it */}
    <Card className="bg-muted/50">
      <CardContent className="space-y-2 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">{serviceName}</h2>
          <p className="text-base font-bold text-primary">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(servicePrice))}
          </p>
        </div>
        <InfoRow
          label="Data"
          value={format(selectedDate, "dd 'de' MMMM", { locale })}
        />
        <InfoRow label="Horário" value={selectedTime} />
        <InfoRow label="Barbearia" value={barbershopName} />
      </CardContent>
    </Card>
  </div>
)
