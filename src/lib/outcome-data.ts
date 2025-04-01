// ECSA Outcomes Data
// Source: Engineering Council of South Africa (ECSA) Professional Registration Requirements

export interface Outcome {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  keywords: string[];
  recommendedActions: string[];
  examples?: {
    title: string;
    description: string;
  }[];
  resources?: {
    title: string;
    link: string;
    type: "download" | "external";
  }[];
}

export const outcomeData: Outcome[] = [
  {
    id: 1,
    title: "Problem Solving",
    shortDescription: "Define, investigate and analyze complex engineering problems",
    description: "This outcome focuses on your ability to define, investigate, and analyze complex engineering problems. You should demonstrate how you identified root causes, formulated solutions, and applied engineering knowledge to solve practical problems.",
    keywords: ["problem definition", "analysis", "investigation", "root cause analysis", "creative solutions", "analytical skills"],
    recommendedActions: [
      "Document specific problems you encountered in your engineering work",
      "Explain the methodology you used to analyze and investigate the problem",
      "Describe how you formulated and evaluated potential solutions",
      "Include examples of engineering principles and reasoning you applied",
      "Explain the criteria used to select the final solution"
    ],
    examples: [
      {
        title: "Structural Problem Analysis",
        description: "I was tasked with identifying the cause of unexpected vibrations in a highway bridge structure. I conducted modal analysis, reviewed construction documentation, and performed on-site measurements to identify resonance issues caused by traffic patterns."
      },
      {
        title: "Water Treatment Capacity Issue",
        description: "When faced with inadequate throughput in a water treatment plant, I analyzed flow rates, identified bottlenecks in filtration systems, and modeled potential system modifications to increase capacity while maintaining water quality standards."
      }
    ],
    resources: [
      {
        title: "ECSA Problem Solving Guidelines",
        link: "https://www.ecsa.co.za/register/SitePages/Professional.aspx",
        type: "external"
      },
      {
        title: "Technical Problem Analysis Template",
        link: "/resources/problem-analysis-template.pdf",
        type: "download"
      }
    ]
  },
  {
    id: 2,
    title: "Application of Scientific and Engineering Knowledge",
    shortDescription: "Apply knowledge of mathematics, natural sciences, and engineering fundamentals",
    description: "This outcome requires demonstration of your ability to apply knowledge of mathematics, natural sciences, and engineering sciences to solve complex engineering problems. You should show how you incorporated fundamental principles in your engineering practice.",
    keywords: ["scientific principles", "engineering sciences", "mathematics", "applied knowledge", "fundamentals", "engineering theory"],
    recommendedActions: [
      "Identify specific scientific principles and engineering theories you've applied",
      "Show calculations, analyses, or models you've created using mathematical techniques",
      "Explain how you integrated multiple areas of knowledge (e.g., thermodynamics, materials science)",
      "Demonstrate your understanding of the underlying scientific principles in your work",
      "Include examples of how you used engineering sciences to predict behavior or performance"
    ]
  },
  {
    id: 3,
    title: "Engineering Design",
    shortDescription: "Perform creative, procedural, and non-procedural design of components, systems, or processes",
    description: "This outcome focuses on your ability to perform creative, procedural, and non-procedural design of engineering components, systems, works, products, or processes. You should demonstrate a methodical approach to design that considers constraints and stakeholder requirements.",
    keywords: ["design methodology", "design criteria", "constraints", "specifications", "creative solutions", "design validation"],
    recommendedActions: [
      "Document your design process, from requirements gathering to final design",
      "Explain how you interpreted client needs and translated them into engineering specifications",
      "Describe various design alternatives you considered and your evaluation methodology",
      "Show how you balanced competing requirements (cost, performance, safety, etc.)",
      "Include examples of creative solutions to design challenges"
    ]
  },
  {
    id: 4,
    title: "Investigation, Research, and Knowledge Creation",
    shortDescription: "Design and conduct investigations and experiments",
    description: "This outcome relates to your ability to design and conduct investigations and experiments to solve engineering problems. You should demonstrate how you research, collect data, analyze findings, and draw conclusions to enhance engineering knowledge.",
    keywords: ["research methodology", "experimental design", "data analysis", "hypothesis testing", "literature review", "knowledge creation"],
    recommendedActions: [
      "Describe research methodologies you've used to investigate engineering problems",
      "Explain how you designed experiments or tests to gather necessary data",
      "Document your data collection methods and analysis techniques",
      "Show how you interpreted results and drew meaningful conclusions",
      "Demonstrate how your investigations contributed to engineering knowledge or practice"
    ]
  },
  {
    id: 5,
    title: "Engineering Methods, Skills, and Tools",
    shortDescription: "Use appropriate techniques, resources, and modern engineering tools",
    description: "This outcome focuses on your ability to use appropriate engineering methods, skills, and tools, including information technology, to solve complex engineering problems. You should demonstrate competence with relevant methodologies and technologies in your field.",
    keywords: ["engineering tools", "software applications", "technical methods", "modeling", "simulation", "specialized equipment"],
    recommendedActions: [
      "Document specific engineering tools and software you've used in your work",
      "Explain your selection criteria for choosing appropriate methodologies",
      "Demonstrate how you've stayed current with emerging tools and techniques",
      "Describe how you've applied specialized engineering methods to solve problems",
      "Show examples of how tools enhanced your engineering effectiveness"
    ]
  },
  {
    id: 6,
    title: "Professional and Technical Communication",
    shortDescription: "Communicate effectively with engineering audiences and the broader community",
    description: "This outcome relates to your ability to communicate effectively, both orally and in writing, with engineering audiences and the broader community. You should demonstrate clear, structured communication adapted to different audiences and purposes.",
    keywords: ["technical writing", "presentations", "audience adaptation", "visual communication", "documentation", "reports"],
    recommendedActions: [
      "Provide examples of technical reports, presentations, or documents you've prepared",
      "Explain how you adapted your communication style for different stakeholders",
      "Describe instances where you needed to explain complex technical concepts to non-engineers",
      "Document your experience with formal engineering documentation",
      "Show how effective communication contributed to project success"
    ]
  },
  {
    id: 7,
    title: "Sustainability and Impact of Engineering Activity",
    shortDescription: "Understand and evaluate the impact of engineering activities on society and the environment",
    description: "This outcome focuses on your understanding and evaluation of the impact of engineering activities on society and the environment. You should demonstrate awareness of sustainability principles and responsible engineering practice.",
    keywords: ["sustainability", "environmental impact", "social responsibility", "risk assessment", "life cycle analysis", "ethical considerations"],
    recommendedActions: [
      "Document how you've considered environmental impacts in your engineering decisions",
      "Explain your approach to sustainable design and resource efficiency",
      "Describe instances where you identified and mitigated potential negative impacts",
      "Show how you've balanced technical, social, and environmental considerations",
      "Demonstrate your understanding of the broader consequences of engineering activities"
    ]
  },
  {
    id: 8,
    title: "Individual, Team and Multidisciplinary Working",
    shortDescription: "Work effectively as an individual, in teams and in multidisciplinary environments",
    description: "This outcome relates to your ability to work effectively as an individual, in teams, and in multidisciplinary environments. You should demonstrate leadership, teamwork, and collaboration skills across different disciplines and contexts.",
    keywords: ["teamwork", "leadership", "collaboration", "multidisciplinary", "project management", "coordination"],
    recommendedActions: [
      "Describe your role in team projects and how you contributed to team success",
      "Explain how you've collaborated with professionals from other disciplines",
      "Document instances where you led teams or managed group work",
      "Show how you've resolved conflicts or challenges in team environments",
      "Demonstrate your ability to integrate insights from multiple disciplines"
    ]
  },
  {
    id: 9,
    title: "Independent Learning Ability",
    shortDescription: "Engage in independent learning through well-developed learning skills",
    description: "This outcome focuses on your ability to engage in independent learning through well-developed learning skills. You should demonstrate how you stay current with developments in your field and continuously develop your professional knowledge.",
    keywords: ["lifelong learning", "self-development", "continuing education", "knowledge acquisition", "professional development", "adaptation"],
    recommendedActions: [
      "Document specific steps you've taken to expand your knowledge beyond formal education",
      "Explain how you stay current with developments in your engineering field",
      "Describe instances where you needed to learn new skills or technologies for a project",
      "Show evidence of continuous professional development activities",
      "Demonstrate how self-directed learning has enhanced your engineering practice"
    ]
  },
  {
    id: 10,
    title: "Engineering Professionalism",
    shortDescription: "Comprehend and apply ethical principles and commit to professional ethics",
    description: "This outcome relates to your understanding and application of ethical principles and commitment to professional ethics, responsibilities, and norms of engineering practice. You should demonstrate ethical decision-making and professional conduct.",
    keywords: ["professional ethics", "code of conduct", "integrity", "responsible practice", "ethical dilemmas", "professional judgment"],
    recommendedActions: [
      "Document your understanding of the ECSA Code of Conduct and ethical guidelines",
      "Explain instances where you faced ethical considerations in your work",
      "Describe how you've upheld professional standards in challenging situations",
      "Show how you've balanced technical decisions with ethical implications",
      "Demonstrate your commitment to the public interest in your engineering practice"
    ]
  },
  {
    id: 11,
    title: "Engineering Management",
    shortDescription: "Demonstrate knowledge and understanding of engineering management principles",
    description: "This outcome focuses on your knowledge and understanding of engineering management principles and economic decision-making. You should demonstrate competence in project, asset, and risk management, as well as awareness of economic factors in engineering practice.",
    keywords: ["project management", "risk management", "economic decision-making", "resource allocation", "planning", "implementation"],
    recommendedActions: [
      "Document examples of project management responsibilities you've undertaken",
      "Explain your approach to risk identification and mitigation in engineering projects",
      "Describe how you've considered economic factors in engineering decisions",
      "Show evidence of effective resource planning and management",
      "Demonstrate your understanding of the business context of engineering activities"
    ]
  }
]; 