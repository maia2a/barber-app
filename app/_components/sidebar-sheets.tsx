"use client"

import {
  Calendar,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { quickSearchOptions } from "../_constants/search"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
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
  const handleLoginWithGoogle = () => signIn("google")
  const handleLogOutClick = () => signOut()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-between border-b border-solid px-4 py-6">
          {data?.user ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={data?.user?.image ?? ""}
                  height={18}
                  width={18}
                  className="object-cover"
                />
              </Avatar>

              <div>
                <p className="font-bold">{data?.user?.name}</p>
                <p className="text-xs">{data?.user?.email}</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-100">
                  Bem-vindo
                </h2>
                <p className="text-sm text-gray-400">Faça seu login</p>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size={"icon"} variant={"secondary"}>
                    <LogInIcon size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[90%] max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Faça seu login na plataforma</DialogTitle>
                    <DialogDescription>
                      Conecte-se usando sua conta Google
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    variant={"outline"}
                    className="mt-4 w-full gap-2 font-medium"
                    onClick={handleLoginWithGoogle}
                  >
                    <Image
                      src={"/google.svg"}
                      width={20}
                      height={20}
                      alt="Google Icon"
                    />
                    Google
                  </Button>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 border-b border-solid p-5 py-5">
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

        <div className="flex flex-col gap-4 border-b border-solid p-5 py-5">
          {quickSearchOptions.map((option) => (
            <Button
              key={option.title}
              className="justify-start gap-2"
              variant={"ghost"}
            >
              <Image
                alt={option.title}
                src={option.imageUrl}
                height={18}
                width={18}
              />
              {option.title}
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-b border-solid p-5 py-5">
          <Button
            className="justify-start gap-2"
            variant={"ghost"}
            onClick={handleLogOutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
