import MobileNavbar from "@/components/MobileNavbar";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const loggedIn = {firstName: 'Jahad', lastName:'Tariq'}

  return (
    <main className="flex h-screen w-full">
        {/* For large devices we use sidebar */}
        <Sidebar user={loggedIn}/>

        {/* for mobile devices we use navbar */}
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image
              src="/icons/logo.svg"
              width={30}
              height={30}
              alt="logo"
            />
            <div>
              <MobileNavbar user={loggedIn}/>
            </div>
          </div>
        {children}
        </div>

    </main>
  );
}
