"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"

import { z } from "zod"

import { SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"

const formSchema = z.object({
  search: z.string().trim().min(1, {
    message: "Digite algo para buscar",
  }),
})

const SearchBar = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const router = useRouter()
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?search=${data.search}`)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Faça sua busca..."
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <SearchIcon />
        </Button>
      </form>
    </Form>
  )
}

export default SearchBar
