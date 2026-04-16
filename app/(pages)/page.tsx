import { Features } from "../components/Features";
import FooterCTA from "../components/FooterCTA";
import { Hero } from "../components/Hero";
import { BuiltForWorkflows } from "../components/home/BuiltForWorkflows";
import { HowItWorks } from "../components/home/HowItWorks";
import { SectionWrapper } from "../components/home/SectionWrapper";
import { UseCases } from "../components/home/UseCases";

export default function Home() {
  return (
    <div className="mx-auto">
      <Hero />

      <SectionWrapper>
        <Features />
      </SectionWrapper>
      
      <SectionWrapper>
        <HowItWorks />
      </SectionWrapper>
      
      <SectionWrapper highlight>
        <BuiltForWorkflows />
      </SectionWrapper>
      
      <SectionWrapper>
        <UseCases />
      </SectionWrapper>
      
      <SectionWrapper>
        <FooterCTA />
      </SectionWrapper>      
    </div>
  );
}
