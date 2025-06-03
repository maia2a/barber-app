import { PhoneItem } from "@/app/_components/phone-item"
import { ServiceItem } from "@/app/_components/service-item"
import { SidebarSheets } from "@/app/_components/sidebar-sheets"
import { Button } from "@/app/_components/ui/button"
import { db } from "@/app/_lib/prisma"
import {
  makeServiceSerializable,
  type SerializedService,
} from "@/app/_lib/types"
import type { Barbershop as PrismaBarbershop } from "@prisma/client"
import { ChevronLeftIcon, MapPinIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BarbershopPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params

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

  const serializableServices: SerializedService[] = barbershop.services.map(
    makeServiceSerializable,
  )

  const barbershopDataForClient: Pick<
    PrismaBarbershop,
    "id" | "name" | "address" | "imageUrl" | "phones"
  > = {
    id: barbershop.id,
    name: barbershop.name,
    address: barbershop.address,
    imageUrl: barbershop.imageUrl,
    phones: barbershop.phones,
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
          asChild
          size={"icon"}
          className="absolute left-4 top-4"
          variant="secondary"
        >
          <Link href={"/"}>
            <ChevronLeftIcon />
          </Link>
        </Button>

        {/* Sidebar */}
        <div className="absolute right-4 top-4">
          <SidebarSheets />
        </div>
      </div>

      {/* Barbershop Info */}
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

      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="font-bold uppercase text-gray-400">Serviços</h2>
        <div className="space-y-3">
          {serializableServices.map((service) => (
            <ServiceItem
              key={service.id}
              barbershop={barbershopDataForClient}
              service={service}
            />
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="space-y-3 p-5">
        {barbershop.phones.map((phone, index) => (
          <PhoneItem key={index} phone={phone} />
        ))}
      </div>
    </div>
  )
}
