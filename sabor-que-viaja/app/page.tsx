import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeOffer from "@/components/WhatWeOffer";
import Products from "@/components/Products";
import HowItWorks from "@/components/HowItWorks";
import Plans from "@/components/Plans";
import Benefits from "@/components/Benefits";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <WhatWeOffer />
      <Products />
      <HowItWorks />
      <Plans />
      <Benefits />
      <CtaFinal />
      <Footer />
    </main>
  );
}
