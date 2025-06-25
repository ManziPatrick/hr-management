import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Candidate from '../models/Candidate.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const users = [
  {
    name: 'Alice Johnson',
    email: 'alice.hr@example.com',
    password: bcrypt.hashSync('Password123', 10),
    role: 'HR',
    isVerified: true
  },
  {
    name: 'Bob Smith',
    email: 'bob.hr@example.com',
    password: bcrypt.hashSync('Password123', 10),
    role: 'HR',
    isVerified: true
  },
  {
    name: 'Carol Davis',
    email: 'carol.hr@example.com',
    password: bcrypt.hashSync('Password123', 10),
    role: 'HR',
    isVerified: true
  },
  {
    name: 'David Wilson',
    email: 'david.admin@example.com',
    password: bcrypt.hashSync('Password123', 10),
    role: 'Admin',
    isVerified: true
  }
];

const jobs = [
  {
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    status: 'Active',
    applications: 45,
    postedDate: new Date('2024-01-15'),
    description: 'We are looking for a Senior React Developer to join our engineering team. You will be responsible for building and maintaining high-quality web applications using React and modern JavaScript frameworks.',
    requirements: ['5+ years of React experience', 'Strong JavaScript/TypeScript skills', 'Experience with Redux or similar state management', 'Knowledge of modern CSS and responsive design'],
    responsibilities: ['Develop and maintain React applications', 'Collaborate with backend developers', 'Write clean, maintainable code', 'Participate in code reviews'],
    benefits: ['Competitive salary', 'Health insurance', '401k matching', 'Flexible work hours', 'Remote work options'],
    salary: { min: 120000, max: 150000, currency: 'USD', period: 'yearly' },
    experience: { min: 5, max: 7, unit: 'years' },
    education: 'Bachelor',
    skills: ['React', 'Redux', 'JavaScript', 'TypeScript', 'CSS3', 'HTML5'],
    remote: true,
    travel: 'Occasional',
    contractDuration: '',
    applicationDeadline: new Date('2024-03-01'),
    hiringManager: { name: 'Alice Johnson', email: 'alice.hr@example.com' },
    tags: ['frontend', 'react', 'senior'],
    isUrgent: false,
    internalNotes: 'High priority position for Q1 hiring'
  },
  {
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY',
    type: 'Full-time',
    status: 'Active',
    applications: 28,
    postedDate: new Date('2024-01-10'),
    description: 'Join our product team as a Product Manager where you will drive product strategy, roadmap development, and cross-functional collaboration to deliver exceptional user experiences.',
    requirements: ['3+ years of product management experience', 'Strong analytical and problem-solving skills', 'Experience with Agile methodologies', 'Excellent communication skills'],
    responsibilities: ['Define product roadmap and strategy', 'Coordinate with engineering and design teams', 'Analyze user feedback and market trends', 'Drive product launches'],
    benefits: ['Competitive salary', 'Health insurance', 'Stock options', 'Professional development'],
    salary: { min: 100000, max: 130000, currency: 'USD', period: 'yearly' },
    experience: { min: 3, max: 5, unit: 'years' },
    education: 'Bachelor',
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'User Research'],
    remote: false,
    travel: 'Frequent',
    contractDuration: '',
    applicationDeadline: new Date('2024-03-10'),
    hiringManager: { name: 'Bob Smith', email: 'bob.hr@example.com' },
    tags: ['product', 'management'],
    isUrgent: true,
    internalNotes: 'Urgent hire for new product launch'
  },
  {
    title: 'UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    status: 'Active',
    applications: 67,
    postedDate: new Date('2024-01-20'),
    description: 'We are seeking a talented UX Designer to create intuitive and engaging user experiences for our digital products.',
    requirements: ['4+ years of UX design experience', 'Portfolio demonstrating user-centered design', 'Proficiency in design tools (Figma, Sketch)', 'Understanding of user research methods'],
    responsibilities: ['Create user-centered design solutions', 'Conduct user research and usability testing', 'Collaborate with product and engineering teams', 'Create wireframes and prototypes'],
    benefits: ['Competitive salary', 'Health insurance', 'Flexible work hours', 'Remote work'],
    salary: { min: 80000, max: 110000, currency: 'USD', period: 'yearly' },
    experience: { min: 4, max: 6, unit: 'years' },
    education: 'Bachelor',
    skills: ['UX Design', 'UI Design', 'Figma', 'User Research', 'Prototyping'],
    remote: true,
    travel: 'None',
    contractDuration: '',
    applicationDeadline: new Date('2024-03-15'),
    hiringManager: { name: 'Carol Davis', email: 'carol.hr@example.com' },
    tags: ['design', 'ux', 'remote'],
    isUrgent: false,
    internalNotes: 'Design team expansion'
  },
  {
    title: 'Data Analyst',
    department: 'Analytics',
    location: 'Chicago, IL',
    type: 'Full-time',
    status: 'Active',
    applications: 89,
    postedDate: new Date('2024-01-05'),
    description: 'Join our analytics team to help drive data-informed decisions across the organization.',
    requirements: ['2+ years of data analysis experience', 'Proficiency in SQL and Python', 'Experience with data visualization tools', 'Strong analytical thinking'],
    responsibilities: ['Analyze large datasets to extract insights', 'Create reports and dashboards', 'Collaborate with stakeholders', 'Present findings to leadership'],
    benefits: ['Competitive salary', 'Health insurance', '401k', 'Professional development'],
    salary: { min: 70000, max: 95000, currency: 'USD', period: 'yearly' },
    experience: { min: 2, max: 4, unit: 'years' },
    education: 'Bachelor',
    skills: ['SQL', 'Python', 'Tableau', 'Excel', 'Statistics'],
    remote: false,
    travel: 'Occasional',
    contractDuration: '',
    applicationDeadline: new Date('2024-02-28'),
    hiringManager: { name: 'David Wilson', email: 'david.admin@example.com' },
    tags: ['analytics', 'data', 'sql'],
    isUrgent: false,
    internalNotes: 'Analytics team growth'
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Austin, TX',
    type: 'Full-time',
    status: 'Active',
    applications: 34,
    postedDate: new Date('2024-01-25'),
    description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure and deployment pipelines.',
    requirements: ['3+ years of DevOps experience', 'Experience with AWS or Azure', 'Knowledge of Docker and Kubernetes', 'Experience with CI/CD pipelines'],
    responsibilities: ['Manage cloud infrastructure', 'Automate deployment processes', 'Monitor system performance', 'Ensure security best practices'],
    benefits: ['Competitive salary', 'Health insurance', '401k', 'Remote work options'],
    salary: { min: 90000, max: 120000, currency: 'USD', period: 'yearly' },
    experience: { min: 3, max: 5, unit: 'years' },
    education: 'Bachelor',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    remote: true,
    travel: 'None',
    contractDuration: '',
    applicationDeadline: new Date('2024-03-20'),
    hiringManager: { name: 'Alice Johnson', email: 'alice.hr@example.com' },
    tags: ['devops', 'cloud', 'automation'],
    isUrgent: true,
    internalNotes: 'Critical infrastructure role'
  }
];

const candidates = [
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+15551234567',
    currentPosition: 'Senior React Developer',
    currentCompany: 'TechCorp',
    yearsOfExperience: 5,
    status: 'Interview Scheduled',
    expectedSalary: 130000,
    currentSalary: 120000,
    skills: ['React', 'Redux', 'TypeScript', 'Node.js', 'JavaScript', 'CSS3', 'HTML5'],
    certifications: [
      { name: 'AWS Certified Developer', issuer: 'Amazon', dateIssued: '2023-01-15', expiryDate: '2026-01-15' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Intermediate' }
    ],
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      address: '123 Tech Street',
      zipCode: '94105'
    },
    availableStartDate: new Date('2024-03-01'),
    noticePeriod: '2 weeks',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    portfolioUrl: 'https://sarahjohnson.dev',
    githubUrl: 'https://github.com/sarahjohnson',
    score: 85,
    workHistory: [
      {
        position: 'Senior Frontend Developer',
        company: 'TechCorp',
        startDate: '2021-01-01',
        endDate: null,
        description: 'Lead React development for e-commerce platform',
        responsibilities: ['Developed React applications', 'Mentored junior developers', 'Implemented Redux state management'],
        isCurrent: true
      },
      {
        position: 'Frontend Developer',
        company: 'StartupXYZ',
        startDate: '2019-01-01',
        endDate: '2020-12-31',
        description: 'Built responsive web applications using React',
        responsibilities: ['Created reusable components', 'Optimized performance', 'Collaborated with design team'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'BSc Computer Science',
        institution: 'UCLA',
        startDate: '2014-09-01',
        endDate: '2018-06-01',
        gpa: 3.8,
        fieldOfStudy: 'Computer Science'
      }
    ],
    evaluations: [
      {
        evaluator: 'Alice Johnson',
        score: 85,
        comments: 'Strong technical skills, excellent problem-solving abilities',
        criteria: [
          { name: 'Technical Skills', score: 90, weight: 0.4 },
          { name: 'Communication', score: 80, weight: 0.2 },
          { name: 'Cultural Fit', score: 85, weight: 0.2 },
          { name: 'Experience', score: 85, weight: 0.2 }
        ],
        evaluatedAt: new Date('2024-01-15')
      }
    ],
    events: [
      {
        type: 'Interview',
        title: 'Technical Interview',
        description: 'Technical assessment and coding challenge',
        scheduledAt: new Date('2024-02-01T10:00:00Z'),
        duration: 60,
        location: 'Virtual',
        attendees: ['Alice Johnson', 'Bob Smith'],
        status: 'Scheduled'
      }
    ],
    notes: [
      {
        content: 'Strong technical skills, good cultural fit. Excellent portfolio.',
        createdAt: new Date('2024-01-10'),
        createdBy: 'Alice Johnson'
      }
    ],
    appliedDate: new Date('2024-01-05'),
    source: 'LinkedIn',
    jobTitle: 'Senior React Developer',
    department: 'Engineering',
    willingToRelocate: false,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'Alice Johnson',
    tags: ['frontend', 'react', 'senior', 'technical'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-05')
  },
  {
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+15559876543',
    currentPosition: 'Senior Product Manager',
    currentCompany: 'BizInc',
    yearsOfExperience: 7,
    status: 'Under Review',
    expectedSalary: 120000,
    currentSalary: 110000,
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'User Research', 'A/B Testing', 'JIRA'],
    certifications: [
      { name: 'Certified Scrum Master', issuer: 'Scrum Alliance', dateIssued: '2022-03-01', expiryDate: '2024-03-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Mandarin', proficiency: 'Advanced' }
    ],
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA',
      address: '456 Business Ave',
      zipCode: '10001'
    },
    availableStartDate: new Date('2024-03-15'),
    noticePeriod: '3 weeks',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    portfolioUrl: 'https://michaelchen.product',
    score: 78,
    workHistory: [
      {
        position: 'Senior Product Manager',
        company: 'BizInc',
        startDate: '2020-01-01',
        endDate: null,
        description: 'Led product strategy for B2B SaaS platform',
        responsibilities: ['Product roadmap development', 'Cross-functional team leadership', 'User research and analytics'],
        isCurrent: true
      },
      {
        position: 'Product Manager',
        company: 'TechStartup',
        startDate: '2017-01-01',
        endDate: '2019-12-31',
        description: 'Managed mobile app product lifecycle',
        responsibilities: ['Feature prioritization', 'User experience design', 'Market analysis'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'MBA',
        institution: 'NYU Stern',
        startDate: '2015-09-01',
        endDate: '2017-05-01',
        gpa: 3.7,
        fieldOfStudy: 'Business Administration'
      },
      {
        degree: 'BS Computer Science',
        institution: 'MIT',
        startDate: '2011-09-01',
        endDate: '2015-05-01',
        gpa: 3.9,
        fieldOfStudy: 'Computer Science'
      }
    ],
    evaluations: [
      {
        evaluator: 'Bob Smith',
        score: 78,
        comments: 'Experienced PM with strong track record, needs technical assessment',
        criteria: [
          { name: 'Product Strategy', score: 85, weight: 0.3 },
          { name: 'Leadership', score: 80, weight: 0.2 },
          { name: 'Technical Understanding', score: 70, weight: 0.2 },
          { name: 'Communication', score: 75, weight: 0.3 }
        ],
        evaluatedAt: new Date('2024-01-12')
      }
    ],
    notes: [
      {
        content: 'Experienced PM with strong track record. Good cultural fit.',
        createdAt: new Date('2024-01-08'),
        createdBy: 'Bob Smith'
      }
    ],
    appliedDate: new Date('2024-01-08'),
    source: 'Indeed',
    jobTitle: 'Product Manager',
    department: 'Product',
    willingToRelocate: true,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'Bob Smith',
    tags: ['product', 'management', 'senior', 'saas'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-08')
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+15554567890',
    currentPosition: 'UX Designer',
    currentCompany: 'DesignStudio',
    yearsOfExperience: 4,
    status: 'Offer Extended',
    expectedSalary: 95000,
    currentSalary: 85000,
    skills: ['UX Design', 'UI Design', 'Figma', 'Sketch', 'User Research', 'Prototyping', 'Design Systems'],
    certifications: [
      { name: 'Google UX Design Certificate', issuer: 'Google', dateIssued: '2022-06-01', expiryDate: '2025-06-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Native' }
    ],
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      address: '789 Design Lane',
      zipCode: '73301'
    },
    availableStartDate: new Date('2024-04-01'),
    noticePeriod: '1 month',
    linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
    portfolioUrl: 'https://emilyrodriguez.design',
    score: 92,
    workHistory: [
      {
        position: 'UX Designer',
        company: 'DesignStudio',
        startDate: '2020-01-01',
        endDate: null,
        description: 'Designed user experiences for mobile apps and web platforms',
        responsibilities: ['User research and testing', 'Wireframing and prototyping', 'Design system development'],
        isCurrent: true
      },
      {
        position: 'Junior Designer',
        company: 'CreativeAgency',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        description: 'Assisted with UI/UX design projects',
        responsibilities: ['Visual design', 'User interface design', 'Client presentations'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'BFA Design',
        institution: 'Parsons School of Design',
        startDate: '2015-09-01',
        endDate: '2019-05-01',
        gpa: 3.8,
        fieldOfStudy: 'Design and Technology'
      }
    ],
    evaluations: [
      {
        evaluator: 'Carol Davis',
        score: 92,
        comments: 'Excellent portfolio, great communication skills, perfect cultural fit',
        criteria: [
          { name: 'Design Skills', score: 95, weight: 0.4 },
          { name: 'Communication', score: 90, weight: 0.2 },
          { name: 'Portfolio Quality', score: 95, weight: 0.2 },
          { name: 'Cultural Fit', score: 90, weight: 0.2 }
        ],
        evaluatedAt: new Date('2024-01-20')
      }
    ],
    events: [
      {
        type: 'Interview',
        title: 'Design Portfolio Review',
        description: 'Portfolio presentation and design challenge',
        scheduledAt: new Date('2024-01-25T14:00:00Z'),
        duration: 90,
        location: 'Office',
        attendees: ['Carol Davis', 'Design Team'],
        status: 'Completed'
      }
    ],
    notes: [
      {
        content: 'Excellent portfolio, great communication skills. Perfect fit for our design team.',
        createdAt: new Date('2024-01-20'),
        createdBy: 'Carol Davis'
      }
    ],
    appliedDate: new Date('2024-01-15'),
    source: 'Company Website',
    jobTitle: 'UX Designer',
    department: 'Design',
    willingToRelocate: false,
    requiresVisa: false,
    backgroundCheckStatus: 'In Progress',
    createdBy: 'Carol Davis',
    tags: ['design', 'ux', 'portfolio', 'mobile'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-15')
  },
  {
    name: 'David Park',
    email: 'david.park@email.com',
    phone: '+15553210987',
    currentPosition: 'Data Analyst',
    currentCompany: 'DataCorp',
    yearsOfExperience: 3,
    status: 'New Application',
    expectedSalary: 85000,
    currentSalary: 75000,
    skills: ['SQL', 'Python', 'R', 'Tableau', 'Power BI', 'Excel', 'Statistics', 'Machine Learning'],
    certifications: [
      { name: 'Google Data Analytics Certificate', issuer: 'Google', dateIssued: '2023-03-01', expiryDate: '2026-03-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Korean', proficiency: 'Advanced' }
    ],
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      address: '321 Data Street',
      zipCode: '98101'
    },
    availableStartDate: new Date('2024-03-01'),
    noticePeriod: '2 weeks',
    linkedinUrl: 'https://linkedin.com/in/davidpark',
    githubUrl: 'https://github.com/davidpark',
    score: 72,
    workHistory: [
      {
        position: 'Data Analyst',
        company: 'DataCorp',
        startDate: '2021-01-01',
        endDate: null,
        description: 'Analyzed customer data for marketing campaigns and business insights',
        responsibilities: ['Data cleaning and preprocessing', 'Statistical analysis', 'Dashboard creation'],
        isCurrent: true
      },
      {
        position: 'Junior Analyst',
        company: 'AnalyticsStartup',
        startDate: '2020-01-01',
        endDate: '2020-12-31',
        description: 'Assisted with data analysis projects',
        responsibilities: ['Data entry and validation', 'Basic reporting', 'Excel automation'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'BS Statistics',
        institution: 'University of Washington',
        startDate: '2016-09-01',
        endDate: '2020-05-01',
        gpa: 3.6,
        fieldOfStudy: 'Statistics'
      }
    ],
    evaluations: [
      {
        evaluator: 'David Wilson',
        score: 72,
        comments: 'Strong analytical skills, needs technical assessment',
        criteria: [
          { name: 'Technical Skills', score: 75, weight: 0.4 },
          { name: 'Analytical Thinking', score: 80, weight: 0.3 },
          { name: 'Communication', score: 65, weight: 0.2 },
          { name: 'Experience', score: 70, weight: 0.1 }
        ],
        evaluatedAt: new Date('2024-01-18')
      }
    ],
    notes: [
      {
        content: 'Strong analytical skills, needs technical assessment. Good potential.',
        createdAt: new Date('2024-01-18'),
        createdBy: 'David Wilson'
      }
    ],
    appliedDate: new Date('2024-01-18'),
    source: 'Referral',
    jobTitle: 'Data Analyst',
    department: 'Analytics',
    willingToRelocate: true,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'David Wilson',
    tags: ['analytics', 'junior', 'mathematics', 'potential'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-18')
  },
  {
    name: 'Jessica Kim',
    email: 'jessica.kim@email.com',
    phone: '+15556789012',
    currentPosition: 'DevOps Engineer',
    currentCompany: 'CloudTech',
    yearsOfExperience: 4,
    status: 'Interview Scheduled',
    expectedSalary: 110000,
    currentSalary: 100000,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'Linux', 'Python', 'Bash'],
    certifications: [
      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon', dateIssued: '2023-01-01', expiryDate: '2026-01-01' },
      { name: 'Certified Kubernetes Administrator', issuer: 'CNCF', dateIssued: '2022-06-01', expiryDate: '2025-06-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Korean', proficiency: 'Native' }
    ],
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      address: '654 Cloud Drive',
      zipCode: '73301'
    },
    availableStartDate: new Date('2024-03-01'),
    noticePeriod: '2 weeks',
    linkedinUrl: 'https://linkedin.com/in/jessicakim',
    githubUrl: 'https://github.com/jessicakim',
    score: 88,
    workHistory: [
      {
        position: 'DevOps Engineer',
        company: 'CloudTech',
        startDate: '2020-01-01',
        endDate: null,
        description: 'Managed cloud infrastructure for startup environment',
        responsibilities: ['CI/CD pipeline management', 'Infrastructure automation', 'Monitoring and alerting'],
        isCurrent: true
      },
      {
        position: 'System Administrator',
        company: 'TechCompany',
        startDate: '2019-01-01',
        endDate: '2019-12-31',
        description: 'Managed on-premise infrastructure',
        responsibilities: ['Server maintenance', 'Backup management', 'Security updates'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'BS Computer Engineering',
        institution: 'University of Texas at Austin',
        startDate: '2015-09-01',
        endDate: '2019-05-01',
        gpa: 3.7,
        fieldOfStudy: 'Computer Engineering'
      }
    ],
    evaluations: [
      {
        evaluator: 'Alice Johnson',
        score: 88,
        comments: 'Strong technical background, good fit for team',
        criteria: [
          { name: 'Technical Skills', score: 90, weight: 0.4 },
          { name: 'Infrastructure Knowledge', score: 85, weight: 0.3 },
          { name: 'Problem Solving', score: 90, weight: 0.2 },
          { name: 'Communication', score: 85, weight: 0.1 }
        ],
        evaluatedAt: new Date('2024-01-22')
      }
    ],
    events: [
      {
        type: 'Interview',
        title: 'Technical Interview',
        description: 'DevOps technical assessment and infrastructure discussion',
        scheduledAt: new Date('2024-02-05T10:00:00Z'),
        duration: 90,
        location: 'Virtual',
        attendees: ['Alice Johnson', 'DevOps Team'],
        status: 'Scheduled'
      }
    ],
    notes: [
      {
        content: 'Strong technical background, good fit for team. Excellent certifications.',
        createdAt: new Date('2024-01-22'),
        createdBy: 'Alice Johnson'
      }
    ],
    appliedDate: new Date('2024-01-20'),
    source: 'LinkedIn',
    jobTitle: 'DevOps Engineer',
    department: 'Engineering',
    willingToRelocate: false,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'Alice Johnson',
    tags: ['devops', 'cloud', 'aws', 'kubernetes'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-20')
  },
  {
    name: 'Alex Thompson',
    email: 'alex.thompson@email.com',
    phone: '+15557890123',
    currentPosition: 'Lead Developer',
    currentCompany: 'StartupXYZ',
    yearsOfExperience: 6,
    status: 'Under Review',
    expectedSalary: 140000,
    currentSalary: 130000,
    skills: ['React', 'Vue.js', 'Node.js', 'MongoDB', 'PostgreSQL', 'TypeScript', 'Leadership'],
    certifications: [
      { name: 'MongoDB Certified Developer', issuer: 'MongoDB', dateIssued: '2022-01-01', expiryDate: '2025-01-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' }
    ],
    location: {
      city: 'Remote',
      state: '',
      country: 'USA',
      address: 'Remote Worker',
      zipCode: ''
    },
    availableStartDate: new Date('2024-06-01'),
    noticePeriod: '3 months',
    linkedinUrl: 'https://linkedin.com/in/alexthompson',
    githubUrl: 'https://github.com/alexthompson',
    score: 82,
    workHistory: [
      {
        position: 'Lead Developer',
        company: 'StartupXYZ',
        startDate: '2018-01-01',
        endDate: null,
        description: 'Led development team for fintech application',
        responsibilities: ['Team leadership', 'Technical architecture', 'Code review'],
        isCurrent: true
      },
      {
        position: 'Senior Developer',
        company: 'TechCorp',
        startDate: '2017-01-01',
        endDate: '2017-12-31',
        description: 'Full-stack development for web applications',
        responsibilities: ['Frontend and backend development', 'Database design', 'API development'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'BS Software Engineering',
        institution: 'MIT',
        startDate: '2013-09-01',
        endDate: '2017-05-01',
        gpa: 3.8,
        fieldOfStudy: 'Software Engineering'
      }
    ],
    evaluations: [
      {
        evaluator: 'Bob Smith',
        score: 82,
        comments: 'Senior developer with leadership experience',
        criteria: [
          { name: 'Technical Skills', score: 85, weight: 0.3 },
          { name: 'Leadership', score: 80, weight: 0.3 },
          { name: 'Experience', score: 85, weight: 0.2 },
          { name: 'Communication', score: 80, weight: 0.2 }
        ],
        evaluatedAt: new Date('2024-01-25')
      }
    ],
    notes: [
      {
        content: 'Senior developer with leadership experience. Good technical skills.',
        createdAt: new Date('2024-01-25'),
        createdBy: 'Bob Smith'
      }
    ],
    appliedDate: new Date('2024-01-23'),
    source: 'Indeed',
    jobTitle: 'Senior React Developer',
    department: 'Engineering',
    willingToRelocate: true,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'Bob Smith',
    tags: ['frontend', 'leadership', 'senior', 'fullstack'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-23')
  },
  {
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+15558901234',
    currentPosition: 'Product Manager',
    currentCompany: 'ProductCo',
    yearsOfExperience: 5,
    status: 'New Application',
    expectedSalary: 125000,
    currentSalary: 115000,
    skills: ['Product Strategy', 'Agile', 'Scrum', 'User Research', 'Analytics', 'A/B Testing', 'Roadmap Planning'],
    certifications: [
      { name: 'Certified Product Manager', issuer: 'AIPMM', dateIssued: '2022-06-01', expiryDate: '2025-06-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Native' }
    ],
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      address: '987 Product Way',
      zipCode: '94105'
    },
    availableStartDate: new Date('2024-04-01'),
    noticePeriod: '1 month',
    linkedinUrl: 'https://linkedin.com/in/mariagarcia',
    portfolioUrl: 'https://mariagarcia.product',
    score: 75,
    workHistory: [
      {
        position: 'Product Manager',
        company: 'ProductCo',
        startDate: '2019-01-01',
        endDate: null,
        description: 'Managed product lifecycle for mobile app',
        responsibilities: ['Product roadmap development', 'User research', 'Cross-functional coordination'],
        isCurrent: true
      },
      {
        position: 'Associate Product Manager',
        company: 'MobileApp',
        startDate: '2018-01-01',
        endDate: '2018-12-31',
        description: 'Assisted with product management tasks',
        responsibilities: ['Feature specification', 'User testing coordination', 'Analytics reporting'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'MBA',
        institution: 'Stanford Graduate School of Business',
        startDate: '2016-09-01',
        endDate: '2018-05-01',
        gpa: 3.7,
        fieldOfStudy: 'Business Administration'
      },
      {
        degree: 'BS Computer Science',
        institution: 'UC Berkeley',
        startDate: '2012-09-01',
        endDate: '2016-05-01',
        gpa: 3.6,
        fieldOfStudy: 'Computer Science'
      }
    ],
    evaluations: [
      {
        evaluator: 'Alice Johnson',
        score: 75,
        comments: 'Strong product background, needs interview',
        criteria: [
          { name: 'Product Strategy', score: 80, weight: 0.3 },
          { name: 'Technical Understanding', score: 70, weight: 0.2 },
          { name: 'Communication', score: 75, weight: 0.2 },
          { name: 'Experience', score: 75, weight: 0.3 }
        ],
        evaluatedAt: new Date('2024-01-28')
      }
    ],
    notes: [
      {
        content: 'Strong product background, needs interview. Good educational background.',
        createdAt: new Date('2024-01-28'),
        createdBy: 'Alice Johnson'
      }
    ],
    appliedDate: new Date('2024-01-26'),
    source: 'Company Website',
    jobTitle: 'Product Manager',
    department: 'Product',
    willingToRelocate: false,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'Alice Johnson',
    tags: ['product', 'mobile', 'strategy', 'stanford'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-26')
  },
  {
    name: 'Ryan Wilson',
    email: 'ryan.wilson@email.com',
    phone: '+15559012345',
    currentPosition: 'Junior Analyst',
    currentCompany: 'AnalyticsInc',
    yearsOfExperience: 2,
    status: 'Interview Scheduled',
    expectedSalary: 75000,
    currentSalary: 65000,
    skills: ['SQL', 'R', 'Power BI', 'Excel', 'Python', 'Statistics', 'Data Visualization'],
    certifications: [
      { name: 'Microsoft Power BI Data Analyst', issuer: 'Microsoft', dateIssued: '2023-08-01', expiryDate: '2026-08-01' }
    ],
    languages: [
      { language: 'English', proficiency: 'Native' }
    ],
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      address: '456 Analytics Blvd',
      zipCode: '60601'
    },
    availableStartDate: new Date('2024-03-01'),
    noticePeriod: '2 weeks',
    linkedinUrl: 'https://linkedin.com/in/ryanwilson',
    githubUrl: 'https://github.com/ryanwilson',
    score: 68,
    workHistory: [
      {
        position: 'Junior Analyst',
        company: 'AnalyticsInc',
        startDate: '2022-01-01',
        endDate: null,
        description: 'Performed data analysis for retail clients',
        responsibilities: ['Data cleaning and analysis', 'Report generation', 'Dashboard creation'],
        isCurrent: true
      },
      {
        position: 'Data Intern',
        company: 'RetailCorp',
        startDate: '2021-06-01',
        endDate: '2021-12-31',
        description: 'Internship in data analysis',
        responsibilities: ['Data entry', 'Basic reporting', 'Excel automation'],
        isCurrent: false
      }
    ],
    education: [
      {
        degree: 'BS Mathematics',
        institution: 'University of Chicago',
        startDate: '2017-09-01',
        endDate: '2021-05-01',
        gpa: 3.5,
        fieldOfStudy: 'Mathematics'
      }
    ],
    evaluations: [
      {
        evaluator: 'David Wilson',
        score: 68,
        comments: 'Junior analyst with potential, good cultural fit',
        criteria: [
          { name: 'Technical Skills', score: 70, weight: 0.4 },
          { name: 'Analytical Thinking', score: 75, weight: 0.3 },
          { name: 'Communication', score: 65, weight: 0.2 },
          { name: 'Potential', score: 70, weight: 0.1 }
        ],
        evaluatedAt: new Date('2024-01-30')
      }
    ],
    events: [
      {
        type: 'Interview',
        title: 'Technical Assessment',
        description: 'Data analysis and SQL assessment',
        scheduledAt: new Date('2024-02-10T14:00:00Z'),
        duration: 60,
        location: 'Office',
        attendees: ['David Wilson'],
        status: 'Scheduled'
      }
    ],
    notes: [
      {
        content: 'Junior analyst with potential, good cultural fit. Needs technical assessment.',
        createdAt: new Date('2024-01-30'),
        createdBy: 'David Wilson'
      }
    ],
    appliedDate: new Date('2024-01-28'),
    source: 'Referral',
    jobTitle: 'Data Analyst',
    department: 'Analytics',
    willingToRelocate: true,
    requiresVisa: false,
    backgroundCheckStatus: 'Not Started',
    createdBy: 'David Wilson',
    tags: ['analytics', 'junior', 'mathematics', 'potential'],
    consentToDataProcessing: true,
    consentDate: new Date('2024-01-28')
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB...');
    
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Candidate.deleteMany();
    console.log('Cleared existing data...');
    
    // Insert new data
    await User.insertMany(users);
    await Job.insertMany(jobs);
    await Candidate.insertMany(candidates);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${jobs.length} jobs`);
    console.log(`Created ${candidates.length} candidates`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed(); 