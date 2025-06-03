"use client"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { deleteBooking } from "../_actions/delete-booking"
import { type SerializedBookingWithDetails } from "../bookings/page"
import { BookingDetailsCard } from "./booking-detail-card"
import { PhoneItem } from "./phone-item"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
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

interface BookingItemProps {
  booking: SerializedBookingWithDetails
}
export const BookingItem = ({ booking }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const {
    service: { barbershop },
  } = booking
  const isConfirmed = isFuture(booking.date)

  const handleOpenSheetChange = (open: boolean) => {
    setIsSheetOpen(open)
  }

  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      handleOpenSheetChange(false)
      toast.success("Reserva cancelada com sucesso!")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao cancelar reserva, tente novamente.")
    }
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleOpenSheetChange}>
      <SheetTrigger className="w-full">
        <Card className="min-w-[90%]">
          <CardContent className="flex justify-between p-0">
            <div className="flex flex-col gap-2 py-5 pl-5">
              <Badge
                className="w-fit"
                variant={isConfirmed ? "default" : "destructive"}
              >
                {isConfirmed ? "Confirmada" : "Finalizada"}
              </Badge>
              <h3 className="font-semibold">{booking.service.name}</h3>

              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={booking.service.barbershop.imageUrl} />
                </Avatar>
                <p className="text-sm font-semibold">
                  {booking.service.barbershop.name}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
              <p className="text-sm capitalize">
                {format(booking.date, "MMMM", { locale: ptBR })}{" "}
              </p>
              <p className="text-2xl">
                {format(booking.date, "dd", { locale: ptBR })}
              </p>
              <p className="text-sm">
                {format(booking.date, "HH:mm", { locale: ptBR })}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[85%]">
        <SheetHeader>
          <SheetTitle className="text-left">Informações da reserva</SheetTitle>
        </SheetHeader>
        <div className="relative flex h-[180px] w-full items-end">
          <Image
            src={"/map.svg"}
            className="object-cover"
            fill
            alt={`Mapa da barbearia ${booking.service.barbershop.name}`}
          />
          <Card className="z-50 mx-5 mb-3 w-full">
            <CardContent className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-11 w-11">
                <AvatarImage src={barbershop.imageUrl} />
              </Avatar>
              <div>
                <h3 className="font-bold">{barbershop.name}</h3>
                <p className="text-xs">{barbershop.address}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6">
          <Badge
            className="w-fit"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmada" : "Finalizada"}
          </Badge>
          <BookingDetailsCard booking={booking} locale={ptBR} />

          <div className="space-y-3">
            {barbershop.phones.map((phone, index) => (
              <PhoneItem key={index} phone={phone} />
            ))}
          </div>
        </div>
        <SheetFooter className="mt-6 p-4">
          <div
            className={`grid ${isConfirmed ? "grid-cols-2" : "grid-cols-1"} w-full gap-3`}
          >
            <SheetClose asChild>
              <Button className="w-full" variant={"outline"}>
                Voltar
              </Button>
            </SheetClose>

            {isConfirmed && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"destructive"} className="w-full">
                    Cancelar reserva
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-[90%]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Você quer cancelar a sua reserva?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Você esta cancelando a reserva da {barbershop.name}. Esta
                      ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant={"outline"} className="w-full">
                        Cancelar
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        variant={"destructive"}
                        className="w-full"
                        onClick={handleCancelBooking}
                      >
                        Confirmar
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
