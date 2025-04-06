import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean database
  await prisma.project.deleteMany();
  await prisma.referee.deleteMany();
  
  console.log('Seeding database...');
  
  // Create sample projects
  const projects = [
    {
      name: 'Bridge Construction Project',
      description: 'Design and supervision of a 100m bridge construction',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      status: 'In Progress',
      discipline: 'Civil Engineering',
      role: 'Project Engineer',
      company: 'Engineering Corp',
      userId: 'default-user-id'
    },
    {
      name: 'Industrial Plant Upgrade',
      description: 'Mechanical systems upgrade for improved efficiency',
      startDate: new Date('2023-06-01'),
      endDate: new Date('2024-03-31'),
      status: 'In Progress',
      discipline: 'Mechanical Engineering',
      role: 'Lead Engineer',
      company: 'Manufacturing Co',
      userId: 'default-user-id'
    },
    {
      name: 'Power Grid Optimization',
      description: 'Smart grid implementation for better power distribution',
      startDate: new Date('2023-03-15'),
      endDate: new Date('2023-09-30'),
      status: 'Completed',
      discipline: 'Electrical Engineering',
      role: 'Senior Engineer',
      company: 'Power Solutions Inc',
      userId: 'default-user-id'
    },
    {
      name: 'Building Safety Assessment',
      description: 'Comprehensive safety assessment of commercial structures',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-05-30'),
      status: 'Pending Review',
      discipline: 'Structural Engineering',
      role: 'Safety Engineer',
      company: 'Engineering Corp',
      userId: 'default-user-id'
    },
    {
      name: 'Environmental Impact Assessment',
      description: 'EIA for a proposed development project',
      startDate: new Date('2023-08-15'),
      endDate: new Date('2023-11-30'),
      status: 'Completed',
      discipline: 'Environmental Engineering',
      role: 'Environmental Engineer',
      company: 'Eco Consultants',
      userId: 'default-user-id'
    }
  ];
  
  for (const project of projects) {
    await prisma.project.create({
      data: project
    });
    console.log(`Created project: ${project.name}`);
  }

  // Create sample referees
  const referees = [
    {
      name: 'Dr. Sarah Johnson',
      title: 'Chief Engineer',
      company: 'Engineering Corp',
      email: 'sarah.johnson@engineeringcorp.com',
      phone: '+27 82 555 1234',
      userId: 'default-user-id'
    },
    {
      name: 'Prof. Michael Chen',
      title: 'Technical Director',
      company: 'Power Solutions Inc',
      email: 'michael.chen@powersolutions.com',
      phone: '+27 83 555 5678',
      userId: 'default-user-id'
    },
    {
      name: 'Eng. Rebecca Ndlovu',
      title: 'Senior Project Manager',
      company: 'Eco Consultants',
      email: 'rebecca.ndlovu@ecoconsultants.com',
      phone: '+27 84 555 9012',
      userId: 'default-user-id'
    }
  ];

  for (const referee of referees) {
    await prisma.referee.create({
      data: referee
    });
    console.log(`Created referee: ${referee.name}`);
  }
  
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 