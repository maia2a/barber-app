"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"

import { z } from "zod"

import { SearchIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form"

// Definição do schema de validação do Zod
const formSchema = z.object({
  title: z.string().trim().min(1, {
    message: "Digite algo para buscar",
  }),
})

//Tipagem dos dados do formulário
type FormData = z.infer<typeof formSchema>

export default function SearchBar() {
  const router = useRouter()

  // Inicializa o formulário com o hook useForm
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  // Função chamada quando o formulário é enviado
  function onSubmit(data: FormData) {
    router.push(`/barbershops?title=${encodeURIComponent(data.title)}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="title"
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
        <Button type="submit" variant="secondary">
          <SearchIcon size={20} />
        </Button>
      </form>
    </Form>
  )
}
