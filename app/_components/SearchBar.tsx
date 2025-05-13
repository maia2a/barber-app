"use client"

import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface SearchBarProps {
  placeholder?: string
}

export default function SearchBar({
  placeholder = "Faça sua busca...",
}: SearchBarProps) {
  return (
    <div className="mt-6 flex items-center gap-2">
      <Input placeholder={placeholder} className="w-full" />
      <Button>
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
