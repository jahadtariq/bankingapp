// since the usePathname hook is client side fucntion we have to declare our component as client side

'use client';

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({user}:SiderbarProps) => {

    // get path name to see which page is active at the moment so we can apply relative css the usePathname function in next/navigation return the path which user is currently in for example for https://project/ it return '/' and for https://project/settings it returns 'setting'

    const pathName = usePathname();

  return (
    <section className="sidebar">
        <nav className="flex flex-col gap-4">
            
            {/* The index link with logo and project name */}
            <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
                <Image
                    src="/icons/logo.svg"
                    width={34}
                    height={34}
                    alt="logo"
                    className="size-[24px] max-xl:size-14"
                />
                <h1 className="sidebar-logo">Jahad</h1>
            </Link>

            {/* The links to all other pages saved in a object in constants */}
            {sidebarLinks.map((item)=>{

                // creating a variable to check if the specific path is active or not 
                // the working is as follows it checks if the pathName accessed above from next function is same as the link name or start with that link name (in case of nested pages) for example if the user is currently in https://project/settings or https://project/settings/profile the isActive tru or false if we are in that link

                const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`)

                return (
                    <Link
                        href={item.route}
                        key={item.label}
                        // cn is a utility function imported from [libs]/utils.ts the cn function combines the classname's
                        // how cn works: the first string of classname's is applied to all and then we can add some styles based on conditions 
                        // an example to use:
                        // cn('default classname applied to all' , { 'classname':condition })
                        className={cn('sidebar-link', {'bg-bank-gradient':isActive})}
                    >
                        <div className="relative size-6">
                            <Image
                                src={item.imgURL}
                                alt={item.label}
                                fill
                                // we can also use cn function without default classname's 
                                // syntax to do so:
                                // cn({'classname':condition})
                                className={cn({
                                    'brightness-[3] invert-0':isActive
                                })}
                            />
                        </div>
                        <p className={cn('sidebar-label', {'!text-white':isActive})}>{item.label}</p>
                    </Link>
                )
            })}

            {/* User */}
        </nav>
        {/* Footer */}
    </section>
  )
}

export default Sidebar;