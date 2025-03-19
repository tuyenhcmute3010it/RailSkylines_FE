import Link from "next/link";
import { Menu, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DarkModeToggle from "@/components/dark-mode-toggle";
import NavItems from "@/app/(public)/nav-items";
import { SwitchLanguage } from "@/components/switch-language";
import Image from "next/image";

export default function Layout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col relative ">
      <header className="sticky z-20 top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 bg-[var(--navbg)]">
        <nav className="hidden h-[60px] flex-col gap-5 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-5 w-full">
          <div className="flex items-center gap-5 w-full justify-evenly ">
            <Link
              href="/"
              className="flex items-center gap-3 text-lg font-semibold md:text-base"
            >
              <Image
                src="/logo.png"
                width={50}
                height={50}
                quality={100}
                alt="Banner"
                className="w-[50px] h-[50px] object-cover"
              />
              <span className="sr-only">RailSkyLines</span>
            </Link>
            <NavItems className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0 text-lg " />
          </div>
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">RailSkyLines</span>
              </Link>

              <NavItems className="text-muted-foreground transition-colors hover:text-foreground " />
            </nav>
          </SheetContent>
        </Sheet>
        {/* <div className="ml-auto flex items-center gap-4">
          <SwitchLanguage />
          <DarkModeToggle />
        </div> */}
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
        {modal}
      </main>
    </div>
  );
}
