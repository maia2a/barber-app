// lib/types.ts
import type { BarbershopService, Prisma } from "@prisma/client"

// --- NEW Types and Helper for Booking Serialization ---


export type RawBookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    service: {
      include: {
        barbershop: true
      }
    }
  }
}>

type OriginalServiceType = RawBookingWithDetails["service"]

export type SerializedBookingWithDetails = Omit<
  RawBookingWithDetails,
  "service"
> & {
  service: Omit<OriginalServiceType, "price"> & {
    price: string
    barbershop: OriginalServiceType["barbershop"]
  }
}

export const makeBookingSerializable = (
  booking: RawBookingWithDetails,
): SerializedBookingWithDetails => {
  const { price: decimalPrice, ...otherServiceProperties } = booking.service

  const serializedService = {
    ...otherServiceProperties,
    price: Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(decimalPrice)),
  }
  return {
    ...booking,
    service: serializedService,
  }
}

// --- NEW Types and Helper for Service Serialization ---

/**
 * Represents the raw service data structure directly from Prisma,
 * where `price` is Prisma.Decimal.
 */
export type RawService = BarbershopService // This is Prisma.BarbershopService in your case

/**
 * Represents the service data structure after `price` has been serialized
 * from Prisma.Decimal to a string (pre-formatted currency string).
 * This type is safe to pass as props to Client Components.
 */
export type SerializedService = Omit<RawService, "price"> & {
  /** The service price, pre-formatted as a currency string (e.g., "R$ 50,00"). */
  price: string
}

/**
 * Converts a raw service object (with Prisma.Decimal price) into a serializable service object
 * where the price is formatted as a currency string.
 *
 * @param {RawService} service - The raw service object fetched from Prisma.
 * @returns {SerializedService} A new service object with the `price`
 * formatted as a string (e.g., "R$ 120,50").
 */
export const makeServiceSerializable = (
  service: RawService,
): SerializedService => {
  return {
    ...service, // Spread all properties of the original service
    // Convert the Decimal price to a number, then format it as a BRL currency string
    price: Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(service.price)),
  }
}
