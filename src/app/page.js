import Footer from "@/components/Footer";
import HeroSection from "@/components/Hero";
import HowItWorks from "@/components/How";
import LatestFeatures from "@/components/LatestFeatures";
import Statistics from "@/components/Statistics";
import TopFreelancers from "@/components/TopFreelancer";

const HomePage = () => {
  return (
    <>
   <HeroSection />
   <LatestFeatures />
   <TopFreelancers />
   <HowItWorks/>
   <Statistics />
   <Footer/>
   </>
  )
}

export default HomePage;