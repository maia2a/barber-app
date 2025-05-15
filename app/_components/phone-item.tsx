"use client"
import { SmartphoneIcon } from "lucide-react"
import { Button } from "./ui/button"

interface PhoneProps {
  phone: string
}

export const PhoneItem = ({ phone }: PhoneProps) => {
  const handleCopyPhoneClick = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      alert("Número copiado para a área de transferência")
    })
  }
  return (
    <div className="flex justify-between" key={phone}>
      {/* Left */}
      <div className="flex items-center gap-2">
        <SmartphoneIcon className="text-primary" size={18} />
        <p className="text-sm">{phone}</p>
      </div>
      {/* Right */}
      <Button
        variant={"outline"}
        size={"sm"}
        onClick={() => handleCopyPhoneClick(phone)}
      >
        Copiar
      </Button>
    </div>
  )
}
