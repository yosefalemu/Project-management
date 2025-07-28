"use client";

import UserProfileInfo from "@/features/auth/components/profile";
import RightSidebar from "@/components/sidebars/right-sidebar";
import Sidebar from "@/components/sidebars/sidebar";
import { cn } from "@/lib/utils";
import { fontProfile } from "@/states/font/font-state";
import { userProfileViewStore } from "@/states/user-profile";
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Nunito,
  Source_Sans_3,
  Raleway,
  Ubuntu,
  Merriweather,
  Oswald,
  Playfair_Display,
  PT_Sans,
  Noto_Sans,
} from "next/font/google";

// Define font loaders at module scope
const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const openSans = Open_Sans({ subsets: ["latin"] });
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
const nunito = Nunito({ subsets: ["latin"] });
const sourceSansPro = Source_Sans_3({ subsets: ["latin"] });
const raleway = Raleway({ subsets: ["latin"] });
const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "700"] });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});
const oswald = Oswald({ subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ subsets: ["latin"] });
const ptSans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });
const notoSans = Noto_Sans({ subsets: ["latin"] });

// Map font names to font instances
const fonts: Record<string, { className: string }> = {
  Inter: inter,
  Roboto: roboto,
  "Open Sans": openSans,
  Lato: lato,
  Montserrat: montserrat,
  Poppins: poppins,
  Nunito: nunito,
  "Source Sans Pro": sourceSansPro,
  Raleway: raleway,
  Ubuntu: ubuntu,
  Merriweather: merriweather,
  Oswald: oswald,
  "Playfair Display": playfairDisplay,
  "PT Sans": ptSans,
  "Noto Sans": notoSans,
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isOpen } = userProfileViewStore();
  const { font } = fontProfile();
  const selectedFont = fonts[font] || fonts["Inter"];

  return (
    <div
      className={cn(
        "h-screen w-full p-0.5 flex flex-col bg-red-900 text-primary relative",
        selectedFont.className
      )}
    >
      <div className="h-8 text-center">Top</div>
      <div className="flex flex-1 p-1 gap-x-2">
        <div className="">
          <RightSidebar />
        </div>
        <div className="flex flex-1 gap-x-2 bg-primary-foreground border rounded-lg">
          <div className="border-r py-4 px-2">
            <Sidebar />
          </div>
          <main className="flex flex-col flex-1">{children}</main>
          {isOpen && <UserProfileInfo />}
        </div>
      </div>
    </div>
  );
}
