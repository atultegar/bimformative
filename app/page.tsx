import AboutSection from "./components/AboutSection";
import FooterCTA from "./components/FooterCTA";
import { Hero } from "./components/Hero";
import LatestBlogs from "./components/LatestBlogs";
import NewsletterSignup from "./components/NewsletterSignup";
import ResourceHighlights from "./components/ResourceHighlights";
import Roadmap from "./components/Roadmap";
import { SectionTwo } from "./components/SectionTwo";

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
