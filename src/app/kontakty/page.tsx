import type { Metadata } from "next";
import { Booking } from "@/components/Booking";
import { Contact } from "@/components/Contact";
import { SiteShell } from "@/components/SiteShell";
import { pageSeo } from "@/config/site";

export const metadata: Metadata = {
  title: pageSeo.kontakty.title,
  description: pageSeo.kontakty.description,
};

export default function ContactsPage() {
  return (
    <SiteShell>
      <Contact />
      <Booking />
    </SiteShell>
  );
}
