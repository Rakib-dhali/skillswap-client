import Footer from "@/components/Footer";
import HeroSection from "@/components/Hero";
import LatestFeatures from "@/components/LatestFeatures";
import Statistics from "@/components/Statistics";
import TopFreelancers from "@/components/TopFreelancer";

const HomePage = () => {
  return (
    <>
   <HeroSection />
   <LatestFeatures />
   <TopFreelancers />
   <Statistics />
   <Footer/>
   </>
  )
}

export default HomePage;