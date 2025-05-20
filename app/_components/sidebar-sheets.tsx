"use client"

import {
  Calendar,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { quickSearchOptions } from "../_constants/search"
import SignInDialog from "./sign-in-dialog"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export const SidebarSheets = () => {
  const { data } = useSession()
  const handleLogOutClick = () => signOut()
  return (
    <Sheet>
      {/*Trigger para abrir o menu lateral */}
      <SheetTrigger asChild>
        <Button variant={"secondary"} size={"icon"}>
          <MenuIcon />
        </Button>
      </SheetTrigger>

      {/* Conteudo do menu lateral */}
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>

        {/* Seção de perfil ou login */}
        <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
          {data?.user ? (
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={data?.user?.image ?? ""} />
              </Avatar>

              <div>
                <p className="font-bold">{data?.user?.name}</p>
                <p className="text-xs">{data?.user?.email}</p>
              </div>
            </div>
          ) : (
            <>
              <h2>Olá, faça seu login</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size={"icon"}>
                    <LogInIcon />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%]">
                  <SignInDialog />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        {/* Seção de navegação */}
        <div className="flex flex-col gap-2 border-b border-solid py-5">
          <SheetClose asChild>
            <Button className="justify-start gap-2" variant={"ghost"} asChild>
              <Link href={"/"}>
                <HomeIcon size={18} />
                Inicio
              </Link>
            </Button>
          </SheetClose>
          <Button className="justify-start gap-2" variant={"ghost"}>
            <Calendar size={18} />
            Agendamentos
          </Button>
        </div>

        {/* Seção de busca rápida pelo serviço */}
        <div className="flex flex-col gap-2 py-5">
          {quickSearchOptions.map((option) => (
            <SheetClose key={option.title} asChild>
              <Button className="justify-start gap-2" variant={"ghost"} asChild>
                <Link href={`/barbershops?service=${option.title}`}>
                  <Image
                    alt={option.title}
                    src={option.imageUrl}
                    height={18}
                    width={18}
                  />
                  {option.title}
                </Link>
              </Button>
            </SheetClose>
          ))}
        </div>

        {/* Seção de logout */}
        {data?.user && (
          <div className="flex flex-col gap-2 py-5">
            <Button
              className="justify-start gap-2"
              variant={"ghost"}
              onClick={handleLogOutClick}
            >
              <LogOutIcon size={18} />
              Sair da conta
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
