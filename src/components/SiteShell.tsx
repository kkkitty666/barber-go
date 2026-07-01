import { CartProvider } from "@/context/CartContext";
import { Footer } from "./Footer";
import { FloatingBookButton } from "./FloatingBookButton";
import { Header } from "./Header";
import { MobileCta } from "./MobileCta";
import "./CartPages.css";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <FloatingBookButton />
      <main className="header-offset">{children}</main>
      <Footer />
      <MobileCta />
    </CartProvider>
  );
}
