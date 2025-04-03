import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding projects...`);
  
  // First, make sure we have a default organization
  let organization = await prisma.organization.findFirst();
  
  if (!organization) {
    console.log('Creating default organization...');
    organization = await prisma.organization.create({
      data: {
        name: 'MiEng Engineering Solutions',
        description: 'Leading provider of engineering solutions',
      },
    });
  }
  
  // Create mock projects
  const projects = [
    {
      name: "Bridge Construction Project",
      description: "Design and supervision of a 100m bridge construction",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-12-31"),
      status: "ACTIVE", // Maps to "In Progress" in the UI
      discipline: "Civil Engineering",
      role: "Project Engineer",
      organizationId: organization.id,
    },
    {
      name: "Industrial Plant Upgrade",
      description: "Mechanical systems upgrade for improved efficiency",
      startDate: new Date("2023-06-01"),
      endDate: new Date("2024-03-31"),
      status: "ACTIVE", // Maps to "In Progress" in the UI
      discipline: "Mechanical Engineering",
      role: "Lead Engineer",
      organizationId: organization.id,
    },
    {
      name: "Power Grid Optimization",
      description: "Smart grid implementation for better power distribution",
      startDate: new Date("2023-03-15"),
      endDate: new Date("2023-09-30"),
      status: "COMPLETED",
      discipline: "Electrical Engineering",
      role: "Senior Engineer",
      organizationId: organization.id,
    },
    {
      name: "Building Safety Assessment",
      description: "Comprehensive safety assessment of commercial structures",
      startDate: new Date("2024-01-10"),
      endDate: new Date("2024-05-30"),
      status: "PENDING_REVIEW", // Added this to enum
      discipline: "Structural Engineering",
      role: "Safety Engineer",
      organizationId: organization.id,
    }
  ];
  
  // Clear existing projects
  console.log('Clearing existing projects...');
  await prisma.project.deleteMany();
  
  // Create new projects
  console.log('Creating new projects...');
  for (const project of projects) {
    await prisma.project.create({
      data: {
        name: project.name,
        description: project.description,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status as any, // Use type assertion to bypass type checking
        discipline: project.discipline,
        role: project.role,
        organizationId: project.organizationId,
      }
    });
  }
  
  console.log(`Seeded ${projects.length} projects successfully`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  }); 