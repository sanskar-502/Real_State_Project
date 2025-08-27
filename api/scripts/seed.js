import prisma from '../lib/prisma.js';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Create test user if not exists
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        username: 'testuser',
        password: await bcrypt.hash('password123', 10),
      },
    });

    console.log('Created test user:', testUser);

    // Create test posts
    const testPosts = [
      {
        title: "Luxury 4BHK at UB City",
        price: 35000000,
        images: ["https://res.cloudinary.com/lamadev/image/upload/v1756304196/posts/cxwtvwmxjp5wmm2eoqmc.webp"],
        address: "1, Vittal Mallya Rd, Bangalore",
        city: "Bengaluru",
        bedroom: 4,
        bathroom: 3,
        latitude: "12.9716",
        longitude: "77.5946",
        type: "buy",
        property: "apartment",
        userId: testUser.id,
        postDetail: {
          create: {
            desc: "Luxurious 4BHK apartment in the heart of Bangalore",
            utilities: "All included",
            pet: "Allowed",
            size: 2500,
            school: 5,
            bus: 4,
            restaurant: 5
          }
        }
      },
      {
        title: "Modern 3BHK in Indiranagar",
        price: 25000000,
        images: ["https://res.cloudinary.com/lamadev/image/upload/v1756304196/posts/cxwtvwmxjp5wmm2eoqmc.webp"],
        address: "100 ft Road, Indiranagar, Bangalore",
        city: "Bengaluru",
        bedroom: 3,
        bathroom: 2,
        latitude: "12.9784",
        longitude: "77.6408",
        type: "buy",
        property: "apartment",
        userId: testUser.id,
        postDetail: {
          create: {
            desc: "Modern 3BHK apartment in vibrant Indiranagar",
            utilities: "All included",
            pet: "Allowed",
            size: 1800,
            school: 4,
            bus: 5,
            restaurant: 5
          }
        }
      }
    ];

    for (const postData of testPosts) {
      const post = await prisma.post.create({
        data: postData,
        include: {
          postDetail: true
        }
      });
      console.log('Created test post:', post.title);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
