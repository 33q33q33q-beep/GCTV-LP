import AboutSection from './components/AboutSection';
import GachinekoIntroSection from './components/GachinekoIntroSection';
import HeroSection from './components/HeroSection';
import NewsSection from './components/NewsSection';
import ContentsSection from './components/ContentsSection';
import SocialBlogSection from './components/SocialBlogSection';
import TravelMapSection from './components/TravelMapSection';
import ScheduleSection from './components/ScheduleSection';
import CommunitySection from './components/CommunitySection';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <main className="bg-white min-h-screen">
        <HeroSection />
        <GachinekoIntroSection />
        <NewsSection />
        <AboutSection />
        <ContentsSection />
        <ScheduleSection />
        <SocialBlogSection />
        <CommunitySection />
        <TravelMapSection />
      </main>
      <Footer />
    </>
  );
}
