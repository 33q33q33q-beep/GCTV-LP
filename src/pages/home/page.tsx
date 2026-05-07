import AboutSection from './components/AboutSection';
import GachinekoIntroSection from './components/GachinekoIntroSection';
import HeroSection from './components/HeroSection';
import HomeJumpMenu from './components/HomeJumpMenu';
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
      <HomeJumpMenu />
      <main className="bg-white min-h-screen">
        <HeroSection />
        <NewsSection />
        <AboutSection />
        <ContentsSection />
        <ScheduleSection />
        <SocialBlogSection />
        <CommunitySection />
        <GachinekoIntroSection />
        <TravelMapSection />
      </main>
      <Footer />
    </>
  );
}
