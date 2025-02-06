import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

const prisma = new PrismaClient();

const generateForeignerId = () => {
  const letters = "FGST";
  const firstLetter = letters[Math.floor(Math.random() * letters.length)];
  const numbers = Math.floor(Math.random() * 9000000) + 1000000;
  const lastLetter = "XNFM"[Math.floor(Math.random() * 4)];
  return `${firstLetter}${numbers}${lastLetter}`;
};

const sampleNames = [
  "Tan Wei Ming",
  "Muhammad Ismail",
  "Rajesh Kumar",
  "Liu Mei Ling",
  "Siti Nurhaliza",
  "Zhang Wei",
  "Priya Sharma",
  "Abdullah Rahman",
  "Wong Mei Fen",
  "Suresh Patel",
];

const statuses = ["For Review", "Submitted", "Pending"];
const examTypes = ["FME", "MDW", "FMW", "PR"];

async function main() {
  // First, create some submissions
  for (let i = 0; i < 50; i++) {
    const examType = examTypes[Math.floor(Math.random() * examTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const foreignerId = generateForeignerId();
    
    // Create a submission first
    const submission = await prisma.submission.create({
      data: {
        userId: "user123", // Replace with actual user ID in production
        examType,
        formData: {
          helperDetails: {
            name,
            fin: foreignerId,
            visitDate: new Date().toISOString(),
          },
        },
        status: "completed",
        submissionId: `${examType}${Date.now()}${i}`,
        // Create the associated record at the same time
        record: {
          create: {
            foreignerId,
            name,
            agency: "MOM",
            type: "Medical Examination",
            status,
            pending: `${Math.floor(Math.random() * 3) + 1}/3`,
          },
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
