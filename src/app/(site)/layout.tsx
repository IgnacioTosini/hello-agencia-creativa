import { Footer } from "@/components/sections/footer/Footer";
import { Navbar } from "@/components/sections/navbar/Navbar";
import { NavigationTransitions } from "@/components/sections/navigation-transitions/NavigationTransitions";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <NavigationTransitions />
    </>
  );
}
