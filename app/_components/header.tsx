import Image from "next/image"
import Link from "next/link"

import { SidebarSheets } from "./sidebar-sheets"
import { Card, CardContent } from "./ui/card"

const Header = () => {
  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Link href="/">
          <Image alt="FSW Barber" src="/Logo.png" height={18} width={120} />
        </Link>

        <SidebarSheets />
      </CardContent>
    </Card>
  )
}

export default Header
