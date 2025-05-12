"use client"
import { SearchIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({
  placeholder = "Faça sua busca...",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    onSearch(query)
    setQuery("")
  }

  return (
    <div className="mt-6 flex items-center gap-2">
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      <Button onClick={handleSearch}>
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
