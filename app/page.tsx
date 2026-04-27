import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomOrderBand from '@/components/home/CustomOrderBand';
import GalleryTeaser from '@/components/home/GalleryTeaser';
import VeteranStory from '@/components/home/VeteranStory';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <CustomOrderBand />
      <GalleryTeaser />
      <VeteranStory />
    </>
  );
}
