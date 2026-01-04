import { PrismaClient, Prisma } from "../app/generated/prisma/client"; // Use standard import unless your generated path is strictly different
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
});

// 1. Define the data structure based on your new Schema
const coursesData = [
  {
    title: "JavaScript Basics",
    slug: "js-basics",
    description: "Start your journey with JavaScript.",
    imageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=800&q=80",
    tags: ["javascript", "coding", "beginners"], // PostgreSQL Array
    isPublished: true,
    lessons: [
      {
        title: "Variables & Data Types",
        slug: "variables",
        sequenceNo: 1,
        // We store the MDX string here. 
        // Notice I added <Button> as text. It will become a real button on the frontend.
        content: `
# Variables in JavaScript

Variables are containers for storing data values.

In this example, x, y, and z, are variables, declared with the \`let\` keyword:

\`\`\`javascript
let x = 5;
let y = 6;
let z = x + y;
\`\`\`

### Interactive Element
Here is a Shadcn button (this text is stored in DB, rendered by React):

<Button>Click Me</Button>
        `
      },
      {
        title: "Functions",
        slug: "functions",
        sequenceNo: 2,
        content: `
# Functions

A JavaScript function is a block of code designed to perform a particular task.

\`\`\`javascript
function myFunction(p1, p2) {
  return p1 * p2;
}
\`\`\`

<Button variant="destructive">Delete this function</Button>
        `
      }
    ]
  },
  {
    title: "Next.js Mastery",
    slug: "nextjs-mastery",
    description: "Master the App Router and Server Components.",
    imageUrl: "https://images.unsplash.com/photo-1649180556628-9ba704115795?auto=format&fit=crop&w=800&q=80",
    tags: ["nextjs", "react", "advanced"],
    isPublished: false, // Draft course
    lessons: [
      {
        title: "Route Handlers",
        slug: "route-handlers",
        sequenceNo: 1,
        content: "# Route Handlers\n\nRoute Handlers allow you to create custom request handlers for a given route using the Web Request and Response APIs."
      }
    ]
  }
];

export async function main() {
  console.log(`🌱 Starting seed...`);

  // Optional: Clean up old data to avoid "Unique constraint" errors if you run seed twice
  // await prisma.lesson.deleteMany(); 
  // await prisma.course.deleteMany();

  for (const course of coursesData) {
    const { lessons, ...courseDetails } = course;

    // We use upsert so if the course exists, it just updates it (idempotent)
    const result = await prisma.course.upsert({
      where: { slug: course.slug },
      update: {}, // No updates if exists
      create: {
        ...courseDetails,
        lessons: {
          create: lessons
        }
      }
    });

    console.log(`Created course: ${result.title} with ${lessons.length} lessons`);
  }
  
  console.log(`✅ Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });