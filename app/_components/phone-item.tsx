"use client"
import { SmartphoneIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui/button"

interface PhoneProps {
  phone: string
}

export const PhoneItem = ({ phone }: PhoneProps) => {
  const handleCopyPhoneClick = async (phoneNumber: string) => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      toast.success("Número copiado para a área de transferência! 👍")
    } catch (error) {
      console.error("Error copying phone number:", error);
      toast.error("Falha ao copiar o número. 😔")
    }
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
