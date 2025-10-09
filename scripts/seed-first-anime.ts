import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFirstAnime() {
  try {
    console.log('🌱 Seeding first anime...');

    // Create the first anime
    const anime = await prisma.anime.create({
      data: {
        title: 'My Status as an Assassin Obviously Exceeds the Hero\'s',
        description: 'A premium anime streaming experience featuring the latest episodes.',
        bunnyId: '156f78b7-7f67-4749-bbb1-63167ff9fac1', // Your collection ID
        featured: true,
      },
    });

    console.log('✅ Created anime:', anime.title);

    // Create the first episode
    const episode = await prisma.episode.create({
      data: {
        title: 'Episode 1',
        episodeNumber: 1,
        bunnyVideoId: 'e477f879-82c8-4e70-af77-512785ecc487', // Your video ID
        playbackUrl: 'https://iframe.mediadelivery.net/play/506159/e477f879-82c8-4e70-af77-512785ecc487',
        thumbnail: 'https://vz-a01fffb9-e7a.b-cdn.net/e477f879-82c8-4e70-af77-512785ecc487/thumbnail.jpg',
        animeId: anime.id,
      },
    });

    console.log('✅ Created episode:', episode.title);
    console.log('🎉 First anime seeded successfully!');
    console.log(`📺 Anime ID: ${anime.id}`);
    console.log(`🎬 Episode ID: ${episode.id}`);

  } catch (error) {
    console.error('❌ Error seeding anime:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFirstAnime();




