const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';

function c(path: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/v1/tnds/${path}`;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

export const galleryImages: GalleryImage[] = [
  { id: '1', url: c('gallery-1.jpg'), alt: 'Custom engraved cutting board' },
  { id: '2', url: c('gallery-2.jpg'), alt: 'Laser engraved business cards' },
  { id: '3', url: c('gallery-3.jpg'), alt: 'Granite cutting board engraving' },
  { id: '4', url: c('gallery-4.jpg'), alt: 'Personalized wood gift' },
  { id: '5', url: c('gallery-5.jpg'), alt: 'Custom acrylic engraving' },
  { id: '6', url: c('gallery-6.jpg'), alt: 'Engraved business card set' },
];
