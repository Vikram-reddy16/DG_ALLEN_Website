import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Industries from "@/components/sections/Industries";
import Stats from "@/components/sections/Stats";
import Audiences from "@/components/sections/Audiences";
import FinalCta from "@/components/sections/FinalCta";
import PageEffects from "@/components/interactive/PageEffects";
import { BRAND } from "@/data/content";

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: BRAND.name,
  description: BRAND.tagline,
  telephone: "+1-704-237-0976",
  email: BRAND.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: BRAND.address.street,
    addressLocality: BRAND.address.city,
    addressRegion: BRAND.address.region,
    postalCode: BRAND.address.postalCode,
    addressCountry: "US",
  },
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }} />
      <Navbar />
      <Hero />
      <Services />
      <Process />
      <Industries />
      <Stats />
      <Audiences />
      <FinalCta />
      <Footer />
      <PageEffects />
    </>
  );
}
