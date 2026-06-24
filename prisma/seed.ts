// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TEMPLATES = [
  {
    name: "Viral TikTok",
    slug: "viral-tiktok",
    description: "Fast-paced, trend-driven style untuk konten viral TikTok",
    category: "social",
    style: "VIRAL_TIKTOK" as const,
    thumbnail: "/templates/viral-tiktok.jpg",
    config: {
      style: "VIRAL_TIKTOK",
      musicMood: "viral_tiktok",
      colorPalette: ["#FF0050", "#00F2EA", "#000000"],
      fontPairing: ["Montserrat Bold", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "CTA"],
      defaultDuration: 15,
      transitions: ["cut", "zoom", "shake"],
    },
    isPremium: false,
    sortOrder: 1,
  },
  {
    name: "Luxury Brand",
    slug: "luxury-brand",
    description: "Elegant, slow-motion, premium feel untuk produk mewah",
    category: "branding",
    style: "LUXURY" as const,
    thumbnail: "/templates/luxury-brand.jpg",
    config: {
      style: "LUXURY",
      musicMood: "luxury",
      colorPalette: ["#000000", "#D4AF37", "#FFFFFF"],
      fontPairing: ["Playfair Display", "Lato"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "SOCIAL_PROOF", "CTA"],
      defaultDuration: 25,
      transitions: ["fade", "slide"],
    },
    isPremium: true,
    sortOrder: 2,
  },
  {
    name: "Ecommerce Conversion",
    slug: "ecommerce-conversion",
    description: "Direct response style fokus konversi penjualan",
    category: "ecommerce",
    style: "DIRECT_RESPONSE" as const,
    thumbnail: "/templates/ecommerce-conversion.jpg",
    config: {
      style: "DIRECT_RESPONSE",
      musicMood: "energetic",
      colorPalette: ["#FF6B00", "#FFFFFF", "#1A1A1A"],
      fontPairing: ["Poppins Bold", "Inter"],
      sceneOrder: ["OPENING", "BENEFITS", "SOCIAL_PROOF", "CTA"],
      defaultDuration: 20,
      transitions: ["cut", "zoom"],
    },
    isPremium: false,
    sortOrder: 3,
  },
  {
    name: "Storytelling",
    slug: "storytelling",
    description: "Narrative emosional yang membangun koneksi dengan audiens",
    category: "branding",
    style: "EMOTIONAL" as const,
    thumbnail: "/templates/storytelling.jpg",
    config: {
      style: "EMOTIONAL",
      musicMood: "emotional",
      colorPalette: ["#4A5568", "#ED8936", "#F7FAFC"],
      fontPairing: ["Merriweather", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "SOCIAL_PROOF", "CTA"],
      defaultDuration: 30,
      transitions: ["fade", "dissolve"],
    },
    isPremium: true,
    sortOrder: 4,
  },
  {
    name: "Product Launch",
    slug: "product-launch",
    description: "Dramatic reveal style untuk peluncuran produk baru",
    category: "product",
    style: "CINEMATIC" as const,
    thumbnail: "/templates/product-launch.jpg",
    config: {
      style: "CINEMATIC",
      musicMood: "modern",
      colorPalette: ["#0F172A", "#3B82F6", "#FFFFFF"],
      fontPairing: ["Space Grotesk", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "CTA"],
      defaultDuration: 20,
      transitions: ["zoom", "slide"],
    },
    isPremium: true,
    sortOrder: 5,
  },
  {
    name: "Fashion Product",
    slug: "fashion-product",
    description: "Stylish, dynamic angles untuk produk fashion",
    category: "product",
    style: "PREMIUM" as const,
    thumbnail: "/templates/fashion-product.jpg",
    config: {
      style: "PREMIUM",
      musicMood: "modern",
      colorPalette: ["#1A1A1A", "#F5F5F5", "#C9A876"],
      fontPairing: ["Helvetica Neue", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "CTA"],
      defaultDuration: 18,
      transitions: ["cut", "slide"],
    },
    isPremium: false,
    sortOrder: 6,
  },
  {
    name: "Beauty Product",
    slug: "beauty-product",
    description: "Soft lighting, close-up detail untuk produk kecantikan",
    category: "product",
    style: "MINIMALIST" as const,
    thumbnail: "/templates/beauty-product.jpg",
    config: {
      style: "MINIMALIST",
      musicMood: "emotional",
      colorPalette: ["#FFE8E8", "#FFFFFF", "#D4A5A5"],
      fontPairing: ["Cormorant Garamond", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "SOCIAL_PROOF", "CTA"],
      defaultDuration: 22,
      transitions: ["fade", "zoom"],
    },
    isPremium: false,
    sortOrder: 7,
  },
  {
    name: "Food Product",
    slug: "food-product",
    description: "Appetizing close-up shots untuk produk makanan & minuman",
    category: "product",
    style: "MODERN" as const,
    thumbnail: "/templates/food-product.jpg",
    config: {
      style: "MODERN",
      musicMood: "energetic",
      colorPalette: ["#FF4757", "#FFA502", "#FFFFFF"],
      fontPairing: ["Poppins", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "CTA"],
      defaultDuration: 15,
      transitions: ["cut", "zoom"],
    },
    isPremium: false,
    sortOrder: 8,
  },
  {
    name: "Electronics Product",
    slug: "electronics-product",
    description: "Tech-forward, sleek presentation untuk gadget & elektronik",
    category: "product",
    style: "MODERN" as const,
    thumbnail: "/templates/electronics-product.jpg",
    config: {
      style: "MODERN",
      musicMood: "corporate",
      colorPalette: ["#0EA5E9", "#0F172A", "#FFFFFF"],
      fontPairing: ["Space Grotesk", "Inter"],
      sceneOrder: ["OPENING", "PRODUCT_SHOWCASE", "BENEFITS", "SOCIAL_PROOF", "CTA"],
      defaultDuration: 20,
      transitions: ["zoom", "slide"],
    },
    isPremium: false,
    sortOrder: 9,
  },
];

async function main() {
  console.log("Seeding templates...");

  for (const template of TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      create: template,
      update: template,
    });
    console.log(`  ✓ ${template.name}`);
  }

  console.log(`Seeded ${TEMPLATES.length} templates.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
