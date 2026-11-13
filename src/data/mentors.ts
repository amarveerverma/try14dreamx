export interface Mentor {
  id: string;
  slug: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  tier: "Peer (1–3 yrs)" | "Senior (3–7 yrs)" | "Executive (8+ yrs)";
  experienceYears: number;
  location: string;
  rating: number;
  reviewCount: number;
  bio: string;
  approvedServices: string[];
  skills: string[];
  verifiedCompany: boolean;
  activeAvailability: string;
}

export const MENTORS: Mentor[] = [
  {
    id: "d1111111-1111-4111-8111-111111111101",
    slug: "rajesh-kannan",
    name: "Rajesh Kannan",
    role: "Staff Software Engineer",
    company: "Tier-1 Product Tech (Ex-Amazon)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    tier: "Executive (8+ yrs)",
    experienceYears: 9,
    location: "Bangalore, India (IST)",
    rating: 4.96,
    reviewCount: 118,
    bio: "I specialize in de-risking career transitions for Indian software engineers coming from non-pedigree Tier-2 & Tier-3 engineering institutions aiming for SDE-2 and SDE-3 roles at top product ecosystems. Interviews at modern GCCs and high-scale product startups in India have shifted completely from generic Leetcode memorization to distributed systems fault tolerance, high-concurrency event pipelines, and structured trade-off communication.",
    approvedServices: ["S06 Technical Mock", "S01 Resume Review", "S08 Salary Negotiation", "S10 Algorithmic Coding Prep"],
    skills: ["Distributed Systems", "High-Concurrency Go & Java", "Kafka & CDC", "Low-Level Design", "Leadership Principles"],
    verifiedCompany: true,
    activeAvailability: "Tomorrow Thu at 7:00 PM IST",
  },
  {
    id: "d2222222-2222-4222-8222-222222222202",
    slug: "neha-kapoor",
    name: "Dr. Neha Kapoor",
    role: "Lead Machine Learning Engineer & AI Systems Architect",
    company: "Enterprise AI Platform (Ex-Microsoft IDC)",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    tier: "Executive (8+ yrs)",
    experienceYears: 8,
    location: "Hyderabad, India (IST)",
    rating: 4.98,
    reviewCount: 142,
    bio: "Having built large-scale real-time recommendation infra and enterprise retrieval engines, my mission is bridging the gap for Indian engineers. We deconstruct real ML systems design: Triton inference servers, RAG evals, embedding drift detection, and Kubeflow orchestration so you can command senior packages with authentic proof of work.",
    approvedServices: ["S06 AI/ML System Mock", "S04 Codebase & Architecture", "S09 AI Transition Roadmap", "S01 Resume Review"],
    skills: ["LLM Fine-Tuning & RAG", "Triton / vLLM Serving", "Vector Search (Milvus/FAISS)", "MLOps & Feature Stores", "Model Quantization"],
    verifiedCompany: true,
    activeAvailability: "Today at 7:30 PM IST",
  },
  {
    id: "d3333333-3333-4333-8333-333333333303",
    slug: "rohan-deshmukh",
    name: "Rohan Deshmukh",
    role: "Lead Product Manager",
    company: "Razorpay",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    tier: "Senior (3–7 yrs)",
    experienceYears: 6,
    location: "Mumbai / Bengaluru",
    rating: 4.91,
    reviewCount: 65,
    bio: "Led merchant payments checkout at Razorpay. Helps engineers transition to Product and Senior PMs crack Tier-1 product execution and product sense interviews.",
    approvedServices: ["S05 Behavioral Mock", "S01 Resume Review", "S07 Career Consultation"],
    skills: ["Product Sense", "Execution Metrics", "FinTech", "Offer Negotiation"],
    verifiedCompany: true,
    activeAvailability: "Today at 9:00 PM IST",
  },
  {
    id: "d4444444-4444-4444-8444-444444444404",
    slug: "priya-nair",
    name: "Priya Nair",
    role: "Senior Backend Architect",
    company: "Microsoft",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80",
    tier: "Executive (8+ yrs)",
    experienceYears: 10,
    location: "Hyderabad, India",
    rating: 4.95,
    reviewCount: 98,
    bio: "Azure cloud scaling lead at Microsoft IDC. Passionate about helping Tier-2/Tier-3 engineers transition into global tech enterprises with rigorous technical foundations.",
    approvedServices: ["S06 Technical Mock", "S02 ATS Optimization", "S09 Career Roadmap"],
    skills: ["Cloud Architecture", "C# / Go", "Distributed Databases", "ATS Auditing"],
    verifiedCompany: true,
    activeAvailability: "Thursday at 8:00 PM IST",
  },
  {
    id: "d5555555-5555-4555-8555-555555555505",
    slug: "arishta-sengupta",
    name: "Arishta Sengupta",
    role: "Principal Systems Engineer",
    company: "Flipkart & Walmart Global Tech",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtsqmUDtUVzdwwOVPvNgO1WkeHSotbE_RxXAnXNPRze4WXpgXvlQq1mzaQVNUqaYIyQOoBdXzx7QTeDv9YMrPnnS_H99YBFBOPJmlZJE4rdw0Rv6TRi0z18mRyCSAYTR_D6-tAYFUpKRKEDqSQ5-BB_tVLtVZ4dPWye6kvO_XsATE9mgUR44diHpe_YSUf0qNG0_j8hqjHCVuLA8PGbe5ZU4cxqlFNCrm5-OsJk2tW",
    tier: "Executive (8+ yrs)",
    experienceYears: 11,
    location: "Bengaluru, India (IST)",
    rating: 4.97,
    reviewCount: 160,
    bio: "High-scale e-commerce logistics lead. Extensive background coaching mid-level engineers into Staff and Principal IC levels.",
    approvedServices: ["S06 Technical Mock", "S01 Resume Review", "S04 Architecture Teardown"],
    skills: ["High-Throughput Systems", "Event Sourcing", "Microservices", "Scalability"],
    verifiedCompany: true,
    activeAvailability: "Friday at 7:00 PM IST",
  },
];
