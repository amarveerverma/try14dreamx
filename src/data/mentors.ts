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
    id: "m01",
    slug: "vikram-singh",
    name: "Vikram Singh",
    role: "Senior AI Engineer",
    company: "Google",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    tier: "Senior (3–7 yrs)",
    experienceYears: 7,
    location: "Bengaluru, India",
    rating: 4.96,
    reviewCount: 84,
    bio: "Ex-Amazon, currently leading generative AI infrastructure at Google. Specializes in deep system design, large-scale distributed inference, and technical interview simulations.",
    approvedServices: ["S06 Technical Mock", "S01 Resume Review", "S07 Career Consultation"],
    skills: ["System Design", "Distributed Systems", "Python/Go", "LLM Inference", "DSA"],
    verifiedCompany: true,
    activeAvailability: "Tomorrow at 7:00 PM IST",
  },
  {
    id: "m02",
    slug: "ananya-sharma",
    name: "Ananya Sharma",
    role: "Staff Software Engineer",
    company: "Swiggy",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80",
    tier: "Executive (8+ yrs)",
    experienceYears: 9,
    location: "Bengaluru, India",
    rating: 4.98,
    reviewCount: 112,
    bio: "Core logistics engine architect at Swiggy. Interviewed 200+ engineering candidates across India tech startups. Expert in high-concurrency event-driven architectures and STAR behavioral rounds.",
    approvedServices: ["S06 Technical Mock", "S05 Behavioral Mock", "S08 Salary Negotiation"],
    skills: ["High-Concurrency Java", "Kafka", "Microservices", "System Design", "Leadership"],
    verifiedCompany: true,
    activeAvailability: "Wednesday at 6:30 PM IST",
  },
  {
    id: "m03",
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
    id: "m04",
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
];

