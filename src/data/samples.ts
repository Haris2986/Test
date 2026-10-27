/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SampleItem {
  id: string;
  title: string;
  role: string;
  resume: string;
  jobDescription: string;
}

export const SAMPLE_DATA: SampleItem[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer -> Staff / Cloud Platform Engineer',
    role: 'Software Engineering',
    resume: `Alex Chen
San Francisco, CA | (555) 234-5678 | alex.chen@email.com | linkedin.com/in/alexchen-dev | github.com/alexchen

PROFESSIONAL SUMMARY
Experienced Software Engineer with 5+ years specializing in JavaScript, React, and REST API development. Proven record of building clean user interfaces and collaborating with product designers to deliver reliable web apps. Seeking to expand into high-scale cloud platforms.

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, HTML5, CSS3, Python
- Frontend: React, Redux, Tailwind CSS, Webpack
- Backend: Node.js, Express, PostgreSQL, MongoDB
- Tools: Git, GitHub, VS Code, Postman, Jest

WORK EXPERIENCE
Software Engineer | NexaTech Solutions | 2022 - Present
- Built and maintained customer-facing web dashboard used by 15,000 monthly active users.
- Migrated legacy jQuery codebase to React 18, improving page load speed by 35%.
- Collaborated with 4 cross-functional team members in 2-week agile sprints.
- Implemented automated Jest unit testing, reaching 80% test coverage for critical payment flows.

Junior Web Developer | CloudBridge Systems | 2020 - 2022
- Developed responsive landing pages and user profile portals using React and Node.js.
- Assisted backend team in designing relational database schemas in PostgreSQL.
- Fixed 50+ critical frontend bugs reported in Jira tickets.

EDUCATION
Bachelor of Science in Computer Science
University of California, Davis | 2016 - 2020`,

    jobDescription: `Job Title: Senior / Staff Cloud Platform Engineer
Location: Remote (US) / San Francisco, CA
Company: Vantage Cloud Systems

About the Role:
We are seeking a high-performing Senior Cloud Platform Engineer to architect and scale our next-generation distributed microservices. You will spearhead our migration to Kubernetes, implement robust CI/CD pipelines, and drive reliability across multi-region AWS infrastructure.

Key Responsibilities:
- Architect, build, and optimize scalable microservices handling 100M+ daily events using Node.js, Go, or TypeScript.
- Spearhead container orchestration using Kubernetes (EKS) and Docker across AWS cloud infrastructure.
- Design automated CI/CD deployment pipelines using GitHub Actions, Terraform (Infrastructure as Code), and ArgoCD.
- Implement comprehensive observability, monitoring, and telemetry using Prometheus, Grafana, and Datadog.
- Drive high availability, disaster recovery, zero-downtime deployments, and distributed systems resilience.
- Partner with security teams on IAM, SOC2 compliance, secrets management, and automated vulnerability scanning.
- Mentor junior engineers and champion test-driven development (TDD) and architectural RFCs.

Qualifications & Skills:
- 5+ years of software engineering experience with deep distributed systems knowledge.
- Hands-on expertise with AWS (EC2, S3, RDS, Lambda, VPC) and Terraform.
- Proficiency in Kubernetes, Docker, container networking, and service mesh.
- Deep experience building microservices, REST APIs, and gRPC endpoints.
- Strong knowledge of CI/CD automation, PostgreSQL performance tuning, and Redis caching.
- Excellent communication, cross-functional collaboration, and technical leadership skills.
- Nice to have: AWS Solutions Architect certification or CKA (Certified Kubernetes Administrator).`
  },
  {
    id: 'product-manager',
    title: 'Product Manager -> Senior / Principal AI Product Manager',
    role: 'Product Management',
    resume: `Sarah Jenkins
Austin, TX | (555) 876-5432 | sarah.jenkins@email.com | linkedin.com/in/sarahjenkins-pm

SUMMARY
Results-driven Product Manager with 4+ years of experience leading cross-functional teams to build B2B SaaS features. Skilled in user research, sprint planning, and backlog grooming.

CORE SKILLS
- Product Strategy, User Story Mapping, Agile / Scrum Methodology
- Wireframing, Figma, Jira, Confluence, Trello
- Google Analytics, SQL, Mixpanel, A/B Testing
- Customer Interviews, Stakeholder Communication

EXPERIENCE
Product Manager | PeakMetrics SaaS | 2021 - Present
- Managed product lifecycle for core analytics dashboard, increasing user retention by 18%.
- Conducted 40+ customer discovery interviews to inform quarterly product roadmap.
- Led daily standups and sprint planning for a team of 6 engineers and 1 designer.
- Analyzed feature adoption data with Mixpanel to optimize user onboarding.

Associate Product Manager | VenturePulse | 2019 - 2021
- Defined requirements and acceptance criteria for mobile notification overhaul.
- Coordinated with customer support to triage bug reports and feature requests.

EDUCATION
B.A. in Business Administration & Marketing
University of Texas at Austin | 2015 - 2019`,

    jobDescription: `Job Title: Senior AI Product Manager (Enterprise SaaS)
Company: CogniSphere Labs
Location: Austin, TX / Hybrid

Role Overview:
CogniSphere is looking for an exceptional Senior AI Product Manager to lead the strategy, discovery, and execution of our enterprise Generative AI and LLM workflow automation products.

What You'll Do:
- Formulate product vision, multi-quarter strategic roadmap, and GTM (Go-to-Market) strategy for our AI copilot and autonomous agent platform.
- Define quantitative success metrics (OKRs, ARR expansion, DAU/MAU, feature adoption, latency, inference cost efficiency).
- Drive cross-functional alignment across Engineering, Data Science, UX Research, Sales Enablement, and Legal/Compliance.
- Conduct rigorous market competitive analysis, customer discovery with Fortune 500 enterprise buyers, and user journey mapping.
- Lead iterative experimentation, prompt engineering evaluations, and hypothesis-driven A/B testing frameworks.
- Prioritize complex engineering backlogs using RICE scoring and manage trade-offs between speed-to-market and enterprise security.

Requirements:
- 4+ years of product management experience shipping AI/ML or high-growth B2B enterprise software.
- Familiarity with Large Language Models (LLMs), RAG (Retrieval-Augmented Generation), vector databases, and API ecosystems.
- Proven track record driving measurable business impact (revenue growth, customer churn reduction, Net Promoter Score NPS).
- Strong data fluency: SQL, quantitative experimentation, funnel analytics, and executive presentation skills.
- High ownership, exceptional stakeholder management, and ability to thrive in rapid 0-to-1 environments.`
  },
  {
    id: 'data-scientist',
    title: 'Data Analyst -> Senior Data Scientist & ML Engineer',
    role: 'Data Science & Analytics',
    resume: `Marcus Vance
Seattle, WA | (555) 345-9876 | marcus.vance@email.com | github.com/marcusvance-ds

PROFESSIONAL SUMMARY
Analytical Data Specialist with strong background in exploratory data analysis, statistical reporting, and dashboard visualization. Adept at transforming business requirements into actionable executive reports.

TECHNICAL SKILLS
- Languages: Python, SQL, R
- Analytics & Viz: Tableau, Excel, Power BI, Pandas, NumPy
- Database: MySQL, PostgreSQL, Snowflake
- Modeling: Linear Regression, Logistic Regression, Decision Trees

WORK EXPERIENCE
Data Analyst | Meridian Retail Analytics | 2022 - Present
- Created 15+ automated Tableau dashboards tracking weekly e-commerce sales KPIs across 4 regions.
- Wrote complex SQL queries and ETL scripts to consolidate customer purchase data from Snowflake.
- Performed statistical cohort analysis identifying 12% customer churn trend in checkout funnel.

Junior Data Analyst | Apex Insights | 2020 - 2022
- Maintained scheduled reporting pipelines and cleaned raw transactional data.
- Built exploratory predictive models in Python (scikit-learn) for inventory restocking forecasts.

EDUCATION
B.S. in Applied Mathematics & Statistics
University of Washington | 2016 - 2020`,

    jobDescription: `Job Title: Senior Data Scientist & Machine Learning Engineer
Company: DeepPath Intelligence
Location: Seattle, WA / Remote

Position Overview:
We are hiring a Senior Data Scientist to design, train, and deploy production-grade machine learning pipelines, deep learning models, and predictive recommendation systems.

Core Responsibilities:
- Design end-to-end Machine Learning pipelines from feature engineering and ETL ingestion to model serving and monitoring.
- Develop predictive models, classification algorithms, NLP systems, and recommendation engines using PyTorch, TensorFlow, and Scikit-Learn.
- Deploy scalable models into production using Docker, FastAPI, MLflow, and cloud services (AWS SageMaker / GCP Vertex AI).
- Implement continuous model monitoring for data drift, concept drift, precision, recall, and ROC-AUC performance metrics.
- Collaborate with MLOps and Data Engineering teams to scale Spark distributed data processing and real-time Kafka event streaming.
- Translate ambiguous business questions into rigorous statistical hypotheses and A/B test experiments.

Required Qualifications:
- 4+ years practical experience applying Machine Learning, Deep Learning, and Predictive Analytics in production environments.
- High proficiency in Python, PyTorch/TensorFlow, SQL, Docker, and MLflow.
- Experience with cloud infrastructure (AWS SageMaker, S3, EC2) and distributed computing (Apache Spark, Databricks).
- Deep expertise in statistical modeling, feature selection, hyperparameter tuning, and cross-validation.
- Strong communication skills to present machine learning insights to technical and non-technical stakeholders.`
  }
];
