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
This report presents the findings of the initial structural assessment conducted for the Urban Bridge Retrofit project. The assessment was aimed at evaluating the current condition of the bridge structure and identifying the necessary retrofit measures to comply with new seismic standards.

## Introduction
The Urban Bridge was constructed in 1985 and has been serving as a vital transportation link. However, recent updates to seismic design codes require that the bridge be retrofitted to ensure its continued safe operation.

## Methodology
The assessment involved a comprehensive visual inspection, non-destructive testing, and structural analysis using finite element modeling. The evaluation criteria were based on the latest seismic design standards.

## Findings
1. The concrete piers show signs of moderate deterioration, primarily due to carbonation and chloride-induced corrosion.
2. The expansion joints require replacement due to deterioration of the elastomeric components.
3. The structural analysis revealed that the bridge would experience excessive lateral movement during a seismic event of the design magnitude.

## Recommendations
1. Implement carbon fiber reinforcement for the concrete piers to enhance their seismic resistance.
2. Replace all expansion joints with modern, seismically designed components.
3. Install isolation bearings to reduce the transmission of seismic forces to the superstructure.

## Next Steps
A detailed design of the retrofit measures will be developed based on these recommendations. Construction is expected to commence in the next quarter, subject to approval.`,
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
  
  const report2 = await prisma.report.create({
    data: {
      title: 'Solar Plant - Preliminary Design',
      content: `# Preliminary Design Report: 50MW Solar Energy Plant

## Executive Summary
This report outlines the preliminary design for the proposed 50MW solar energy plant. The design focuses on maximizing energy production while minimizing environmental impact.

## Site Analysis
The selected site covers an area of approximately 200 hectares and receives an average of 6.2 kWh/m²/day of solar radiation. The topography is generally flat, with good accessibility and proximity to existing transmission infrastructure.

## Design Approach
The plant will utilize photovoltaic (PV) technology with single-axis tracking systems to optimize energy capture throughout the day. The design incorporates:

1. 185,000 high-efficiency PV modules
2. 25 central inverter stations
3. Medium-voltage collection system
4. Substation for grid connection

## Preliminary Performance Estimates
Based on our simulations, the plant is expected to generate approximately 110 GWh annually, with a performance ratio of 0.82.

## Environmental Considerations
The design minimizes environmental impact through:
1. Preservation of natural drainage patterns
2. Minimal grading requirements
3. Use of pile-driven foundations to reduce soil disturbance
4. Integration of natural vegetation for dust control

## Next Steps
The preliminary design will be refined based on stakeholder feedback, detailed geotechnical investigations, and further optimization of the electrical systems.`,
      status: 'DRAFT',
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

  // Add report history for the first report
  await prisma.reportHistory.create({
    data: {
      content: `# Initial Assessment Draft

This is an earlier version of the report with less detailed findings.

## Executive Summary
Draft assessment of bridge retrofit requirements.

## Findings
1. Concrete deterioration observed
2. Expansion joints need replacement
3. Seismic performance inadequate`,
      reportId: report1.id,
    },
  });

  // Add feedback to reports
  await prisma.reportFeedback.create({
    data: {
      content: 'The seismic analysis section could benefit from more detailed calculations. Otherwise, excellent work!',
      userId: managerUser.id,
      reportId: report1.id,
    },
  });

  await prisma.reportFeedback.create({
    data: {
      content: 'Please add more details about the environmental mitigation measures in the final design.',
      userId: adminUser.id,
      reportId: report2.id,
    },
  });
  
  console.log('Sample reports, history, and feedback created successfully');

  // Create sample AI prompt templates
  await prisma.aIPromptTemplate.create({
    data: {
      name: 'Engineering Report Generator',
      template: `Generate a comprehensive engineering report based on the following project details:
Project: {{project_name}}
Type: {{project_type}}
Scope: {{project_scope}}

The report should include:
1. Executive Summary
2. Introduction and Background
3. Methodology
4. Findings and Analysis
5. Recommendations
6. Conclusion

Use formal engineering terminology appropriate for {{discipline}} engineering.`,
      purpose: 'Generate structured engineering reports from project data',
    },
  });

  await prisma.aIPromptTemplate.create({
    data: {
      name: 'Technical Review Feedback',
      template: `Review the following engineering report segment and provide constructive feedback:
{{report_content}}

Focus on:
1. Technical accuracy
2. Clarity and organization
3. Compliance with engineering standards
4. Areas for improvement
5. Strengths of the report`,
      purpose: 'Generate peer review feedback for engineering reports',
    },
  });

  console.log('Sample AI prompt templates created successfully');

  // Create sample referees
  const referee1 = await prisma.referee.create({
    data: {
      name: 'Dr. Sarah Johnson',
      title: 'Chief Engineer',
      company: 'TransCorp Engineering',
      email: 'sarah.johnson@transcorp.com',
      phone: '+27 82 555 1234',
      userId: engineerUser1.id,
    },
  });

  const referee2 = await prisma.referee.create({
    data: {
      name: 'Prof. Michael Chen',
      title: 'Technical Director',
      company: 'Renewable Solutions Ltd',
      email: 'michael.chen@renewsolutions.com',
      phone: '+27 83 555 5678',
      userId: engineerUser2.id,
    },
  });

  console.log('Sample referees created successfully');

  console.log(`Seeding completed successfully!`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 