export const dynamic = 'force-dynamic';

import Hero from '@/components/home/Hero';
import StatsBar from '@/components/home/StatsBar';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomOrderBand from '@/components/home/CustomOrderBand';
import ProcessSteps from '@/components/home/ProcessSteps';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import VeteranStory from '@/components/home/VeteranStory';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <FeaturedProducts />
      <CustomOrderBand />
      <ProcessSteps />
      <GalleryTeaser />
      <VeteranStory />
    </>
  );
}
