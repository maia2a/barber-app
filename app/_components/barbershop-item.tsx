import { Barbershop } from "@prisma/client"
import { StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"

interface BarbershopItemProps {
  barbershop: Barbershop
}

const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="min-w-[167px] overflow-hidden rounded-2xl">
      <CardContent className="p-0">
        {/* IMAGEM */}
        <div className="relative h-[159px] w-full">
          <Image
            alt={barbershop.name}
            fill
            className="rounded-2xl object-cover"
            src={barbershop.imageUrl}
          />

          {/* BADGE */}
          <Badge
            className="absolute left-2 top-2 flex items-center gap-1"
            variant="secondary"
          >
            <StarIcon size={12} className="fill-primary text-primary" />
            <p className="text-xs font-semibold">5,0</p>
          </Badge>
        </div>

        {/* TEXTO */}
        <div className="space-y-1 p-2">
          <h3 className="truncate font-semibold">{barbershop.name}</h3>
          <p className="truncate text-sm text-gray-400">{barbershop.address}</p>

          {/* BOTAO PARA RESERVAR */}
          <Link href={`/barbershops/${barbershop.id}`} passHref>
            <Button variant={"secondary"} className="mt-2 w-full">
              Reservar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
