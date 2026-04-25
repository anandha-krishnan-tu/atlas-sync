import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    for (let i = 1; i <= 100; i++) {
        await prisma.item.create({
            data: {
                title: `Set1 Item ${i}`,
                description: `Description for item ${i}`,
                datasetType: "set1"
            }
        })
    }

    for (let i = 1; i <= 50; i++) {
        await prisma.item.create({
            data: {
                title: `Set2 Item ${i}`,
                description: `Description for item ${i}`,
                datasetType: "set2"
            }
        })
    }

    console.log("Seed Completed");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });