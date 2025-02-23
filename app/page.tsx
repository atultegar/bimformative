import AboutSection from "./components/AboutSection";
import FooterCTA from "./components/FooterCTA";
import { Hero } from "./components/Hero";
import Hero2 from "./components/Hero-2";
import LatestBlogs from "./components/LatestBlogs";
import MeetTheDeveloper from "./components/MeetTheDeveloper";
import NewsletterSignup from "./components/NewsletterSignup";
import ResourceHighlights from "./components/ResourceHighlights";
import Roadmap from "./components/Roadmap";
import { SectionTwo } from "./components/SectionTwo";
import Testimonial from "./components/Testimonial";

export default function Home() {
  return (
    <div className="mx-auto">
      <Hero />
      <SectionTwo />      
      <AboutSection />
      {/* <MeetTheDeveloper /> */}
      <ResourceHighlights />
      <LatestBlogs />
      <NewsletterSignup />
      {/* <Testimonial /> */}
      <Roadmap />
      <FooterCTA />
    </div>

  );
}
