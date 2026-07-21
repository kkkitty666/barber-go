import { CartProvider } from "@/context/CartContext";
import { Footer } from "./Footer";
import { FloatingBookButton } from "./FloatingBookButton";
import { Header } from "./Header";
import { MobileCta } from "./MobileCta";
import "./CartPages.css";

export function SiteShell({
  children,
  mainClassName = "header-offset",
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <CartProvider>
      <Header />
      <FloatingBookButton />
      <main className={`mobile-main ${mainClassName}`.trim()}>{children}</main>
      <Footer />
      <MobileCta />
    </CartProvider>
  );
}
