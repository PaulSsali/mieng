import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding the database...`);
  
  // Clean up existing data (in reverse order of dependencies)
  await prisma.reportFeedback.deleteMany();
  await prisma.reportHistory.deleteMany();
  await prisma.report.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.project.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();
  await prisma.aIPromptTemplate.deleteMany();
  await prisma.vectorEmbedding.deleteMany();
  
  console.log('Database cleaned successfully');
  
  // Create sample users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mieng.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@mieng.com',
      name: 'Manager User',
      role: 'MANAGER',
    },
  });
  
  const engineerUser1 = await prisma.user.create({
    data: {
      email: 'engineer1@mieng.com',
      name: 'Engineer One',
      role: 'ENGINEER',
    },
  });
  
  const engineerUser2 = await prisma.user.create({
    data: {
      email: 'engineer2@mieng.com',
      name: 'Engineer Two',
      role: 'ENGINEER',
    },
  });
  
  console.log('Sample users created successfully');
  
  // Create sample organization
  const organization = await prisma.organization.create({
    data: {
      name: 'MiEng Engineering Solutions',
      description: 'Leading provider of engineering solutions',
      users: {
        connect: [
          { id: adminUser.id },
          { id: managerUser.id },
          { id: engineerUser1.id },
          { id: engineerUser2.id },
        ],
      },
    },
  });
  
  console.log('Sample organization created successfully');
  
  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Urban Bridge Retrofit',
      description: 'Structural retrofit of existing bridge to comply with new seismic standards',
      startDate: new Date('2023-01-15'),
      status: 'ACTIVE',
      organizationId: organization.id,
      userId: engineerUser1.id,
    },
  });
  
  const project2 = await prisma.project.create({
    data: {
      name: 'Solar Energy Plant Development',
      description: 'Design and implementation of a 50MW solar energy plant',
      startDate: new Date('2023-03-05'),
      status: 'PLANNING',
      organizationId: organization.id,
      userId: engineerUser2.id,
    },
  });
  
  const project3 = await prisma.project.create({
    data: {
      name: 'Sustainable Office Building',
      description: 'Design of a zero-carbon office building with innovative energy systems',
      startDate: new Date('2022-10-10'),
      endDate: new Date('2023-09-30'),
      status: 'COMPLETED',
      organizationId: organization.id,
      userId: engineerUser1.id,
    },
  });
  
  console.log('Sample projects created successfully');
  
  // Create sample tags
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: 'Structural' } }),
    prisma.tag.create({ data: { name: 'Electrical' } }),
    prisma.tag.create({ data: { name: 'Mechanical' } }),
    prisma.tag.create({ data: { name: 'Civil' } }),
    prisma.tag.create({ data: { name: 'Environmental' } }),
    prisma.tag.create({ data: { name: 'Architecture' } }),
  ]);
  
  console.log('Sample tags created successfully');
  
  // Create sample reports
  const report1 = await prisma.report.create({
    data: {
      title: 'Bridge Retrofit - Initial Assessment',
      content: `# Initial Structural Assessment of Urban Bridge Retrofit
      
## Executive Summary
This report presents the initial structural assessment of the urban bridge retrofit project. The existing structure shows signs of deterioration and does not meet current seismic standards. Our preliminary analysis indicates that a comprehensive retrofit strategy will be required.

## Inspection Findings
- Concrete spalling observed at multiple support columns
- Reinforcement corrosion detected in 30% of inspected areas
- Expansion joints show significant degradation
- Foundation settlement of 2-3cm measured on the south abutment

## Recommended Actions
1. Conduct detailed material testing
2. Perform full seismic analysis
3. Develop retrofit design options with cost estimates
4. Prepare implementation schedule

## Conclusion
The bridge is safe for current traffic loads but requires retrofit work within the next 12 months to meet safety standards and extend its service life.`,
      status: 'APPROVED',
      authorId: engineerUser1.id,
      projectId: project1.id,
      tags: {
        connect: [
          { id: tags[0].id }, // Structural
          { id: tags[3].id }, // Civil
        ],
      },
    },
  });
  
  // Create report history entry for report1
  await prisma.reportHistory.create({
    data: {
      content: `# Draft Assessment of Bridge
This is the initial draft of the bridge assessment report. Further details to be added after the full inspection is completed.`,
      reportId: report1.id,
    },
  });
  
  // Create feedback for report1
  await prisma.reportFeedback.create({
    data: {
      content: `The report provides a good overview of the current state of the bridge. I would recommend including more quantitative data from the inspections and potential cost ranges for the retrofit options.`,
      userId: managerUser.id,
      reportId: report1.id,
    },
  });
  
  const report2 = await prisma.report.create({
    data: {
      title: 'Solar Plant - Environmental Impact Study',
      content: `# Environmental Impact Assessment - Solar Energy Plant
      
## Executive Summary
This report evaluates the potential environmental impacts of the proposed 50MW solar energy plant. Overall, the project has a positive environmental profile with minimal negative impacts when compared to conventional energy generation.

## Key Findings
- Land use impact is moderate, requiring 200 acres of previously agricultural land
- No endangered species identified within the project boundaries
- Water requirements are minimal, limited to panel cleaning and facility maintenance
- Visual impact assessments show moderate visibility from nearby residential areas

## Mitigation Strategies
1. Implementation of native vegetation buffers around the perimeter
2. Wildlife-friendly fencing to allow small animal movement
3. Rainwater harvesting system for panel cleaning operations
4. Dust control measures during construction

## Long-term Monitoring
The report recommends quarterly monitoring of:
- Bird migration patterns and potential collisions
- Water quality in adjacent streams
- Soil erosion and vegetation establishment

## Conclusion
With the proposed mitigation measures, the solar plant development will have acceptable environmental impacts while providing significant benefits in terms of clean energy generation.`,
      status: 'DRAFT',
      aiGenerated: true,
      authorId: engineerUser2.id,
      projectId: project2.id,
      tags: {
        connect: [
          { id: tags[1].id }, // Electrical
          { id: tags[4].id }, // Environmental
        ],
      },
    },
  });
  
  const report3 = await prisma.report.create({
    data: {
      title: 'Sustainable Building - Final Design Report',
      content: `# Sustainable Office Building - Final Design Report
      
## Executive Summary
This final design report outlines the integrated sustainable systems for the zero-carbon office building. The design achieves LEED Platinum certification and net-zero energy performance through innovative technologies and careful integration of architectural and engineering elements.

## Building Envelope
- High-performance triple-glazed facade with dynamic solar control
- R-40 insulation in opaque wall assemblies
- Green roof covering 60% of roof area
- Strategic daylighting design reducing lighting energy by 40%

## Energy Systems
- 300kW rooftop photovoltaic array
- Ground-source heat pump system for heating and cooling
- Energy recovery ventilation throughout
- Advanced building automation system with AI optimization
- Predicted Energy Use Intensity (EUI): 15 kBtu/sf/year

## Water Systems
- Rainwater harvesting for toilet flushing and irrigation
- Graywater treatment and reuse
- Low-flow fixtures reducing water consumption by 45%
- Drought-resistant landscaping

## Materials and Resources
- 30% recycled content in structural materials
- 70% regionally sourced materials
- Extensive use of mass timber to reduce embodied carbon
- Zero VOC finishes throughout

## Performance Verification
Commissioning plan includes 12 months of performance monitoring and tuning to ensure design targets are met in operation.`,
      status: 'PUBLISHED',
      authorId: engineerUser1.id,
      projectId: project3.id,
      tags: {
        connect: [
          { id: tags[2].id }, // Mechanical
          { id: tags[4].id }, // Environmental
          { id: tags[5].id }, // Architecture
        ],
      },
    },
  });
  
  console.log('Sample reports created successfully');
  
  // Create AI Prompt Templates
  await prisma.aIPromptTemplate.create({
    data: {
      name: 'Engineering Report Template',
      template: `Generate a professional engineering report based on the following information:
      
PROJECT CONTEXT:
{projectContext}

ENGINEERING DETAILS:
{engineeringDetails}

REPORT TYPE:
{reportType}

Format the report professionally with appropriate sections, including an executive summary, technical details, findings, and recommendations.`,
      purpose: 'Generate new engineering reports',
    },
  });
  
  await prisma.aIPromptTemplate.create({
    data: {
      name: 'Report Feedback Template',
      template: `Review this engineering report and provide detailed, constructive feedback. Focus on:
      
1. Technical accuracy
2. Completeness of information
3. Clarity and organization
4. Recommendations for improvement

REPORT CONTENT:
{reportContent}`,
      purpose: 'Generate feedback on engineering reports',
    },
  });
  
  console.log('Sample AI Prompt Templates created successfully');
  
  console.log(`Seeding completed successfully!`);
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