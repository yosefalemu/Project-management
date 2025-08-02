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

// Define font instances
export const inter = Inter({ subsets: ["latin"] });
export const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
export const openSans = Open_Sans({ subsets: ["latin"] });
export const lato = Lato({ subsets: ["latin"], weight: ["400", "700"] });
export const montserrat = Montserrat({ subsets: ["latin"] });
export const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });
export const nunito = Nunito({ subsets: ["latin"] });
export const sourceSansPro = Source_Sans_3({ subsets: ["latin"] });
export const raleway = Raleway({ subsets: ["latin"] });
export const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["400", "700"] });
export const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700"],
});
export const oswald = Oswald({ subsets: ["latin"] });
export const playfairDisplay = Playfair_Display({ subsets: ["latin"] });
export const ptSans = PT_Sans({ subsets: ["latin"], weight: ["400", "700"] });
export const notoSans = Noto_Sans({ subsets: ["latin"] });

// Map font names to font instances
export const fonts: Record<string, { className: string }> = {
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
