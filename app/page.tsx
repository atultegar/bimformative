import AboutSection from "./components/AboutSection";
import FooterCTA from "./components/FooterCTA";
import { Hero } from "./components/Hero";
import Hero2 from "./components/Hero-2";
import LatestBlogs from "./components/LatestBlogs";
import NewsletterSignup from "./components/NewsletterSignup";
import ResourceHighlights from "./components/ResourceHighlights";
import { SectionTwo } from "./components/SectionTwo";
import Testimonial from "./components/Testimonial";

export default function Home() {
  return (
    <div className="mx-auto">
      <Hero />
      <AboutSection />
      <SectionTwo />
      <ResourceHighlights />
      <LatestBlogs />
      <NewsletterSignup />
      {/* <Testimonial /> */}
      <FooterCTA />
    </div>

  );
}
