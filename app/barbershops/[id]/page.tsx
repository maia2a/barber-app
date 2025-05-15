import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BarbershopPage({
  params,
}: {
  params: { id: string }
}) {
  const id = params.id

  const barbershop = await db.barbershop.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
    },
  })

  if (!barbershop) {
    return notFound()
  }

  return (
    <div>
      {/* Header */}
      <div className="relative h-[250px] w-full">
        <Image
          alt={barbershop.name}
          src={barbershop?.imageUrl}
          fill
          className="object-cover"
        />

        {/* Button */}
        <Button
          size={"icon"}
          className="absolute left-4 top-4"
          variant="secondary"
        >
          <Link href={"/"}>
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Button
          size={"icon"}
          className="absolute right-4 top-4"
          variant="secondary"
        >
          <MenuIcon />
        </Button>
      </div>

      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{barbershop.name}</h1>
        <div className="mb-2 flex items-center gap-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm text-gray-500">{barbershop?.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <StarIcon className="fill-primary text-primary" size={18} />
          <p className="text-sm text-gray-500">5,0 (889 avaliaçoes)</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop.description}</p>
      </div>
    </div>
  )
}
