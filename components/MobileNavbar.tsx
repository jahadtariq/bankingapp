
// for mobile nav, shadcn-ui component sheet is used 
// this component is a button when clicked on it open a complete new sidebar

'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from "next/image";

import Link from "next/link";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const MobileNavbar = ({user}:MobileNavProps) => {

  const pathName = usePathname();

  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
           <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
           />
        </SheetTrigger>
        <SheetContent side="left" className="bg-white border-none">
            {/* The index link with logo and project name */}
            <Link href="/" className="cursor-pointer flex items-center gap-1 px-4">
                  <Image
                      src="/icons/logo.svg"
                      width={34}
                      height={34}
                      alt="logo"
                  />
                  <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">Jahad</h1>
              </Link>

              {/* The links to all other pages saved in a object in constants */}
              <div className="mobilenav-sheet">
                <SheetClose asChild>
                  <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                  {sidebarLinks.map((item)=>{
                    // creating a variable to check if the specific path is active or not 
                    // the working is as follows it checks if the pathName accessed above from next function is same as the link name or start with that link name (in case of nested pages) for example if the user is currently in https://project/settings or https://project/settings/profile the isActive tru or false if we are in that link

                    const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)

                    return (
                      <SheetClose asChild key={item.route}>
                        <Link
                            href={item.route}
                            key={item.label}
                            // cn is a utility function imported from [libs]/utils.ts the cn function combines the classname's
                            // how cn works: the first string of classname's is applied to all and then we can add some styles based on conditions 
                            // an example to use:
                            // cn('default classname applied to all' , { 'classname':condition })
                            className={cn('mobilenav-sheet_close w-full', {'bg-bank-gradient':isActive})}
                        >
                          <Image
                            src={item.imgURL}
                            alt={item.label}
                            width={20}
                            height={20}
                            // we can also use cn function without default classname's 
                            // syntax to do so:
                            // cn({'classname':condition})
                            className={cn({
                              'brightness-[3] invert-0':isActive
                            })}
                            />
                            <p className={cn('text-16 font-semibold text-black-2', {'!text-white':isActive})}>{item.label}</p>
                        </Link>
                      </SheetClose>
                    )
                    })}
                    {/* USER */}
                  </nav>
                  {/* Footer */}
                </SheetClose>
              </div>
        </SheetContent>
      </Sheet>

    </section>
  ) 
}

export default MobileNavbar;