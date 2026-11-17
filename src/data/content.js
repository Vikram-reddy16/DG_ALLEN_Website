// All site copy and lists live here so sections stay purely presentational.

export const BRAND = {
  name: "DG-ALLEN",
  tagline:
    "US IT staffing & recruitment — connecting skilled consultants with the companies and vendors who need them.",
  address: {
    street: "220 N Main St Suite 500",
    city: "Greenville",
    region: "SC",
    postalCode: "29601",
    country: "United States",
  },
};

export const ADDRESS_LINES = [
  BRAND.address.street,
  `${BRAND.address.city}, ${BRAND.address.region} ${BRAND.address.postalCode}`,
  BRAND.address.country,
];

export const ADDRESS_MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS_LINES.join(", ")
)}`;

// "/#…" links work on the home page (same-page scroll) and from other pages.
export const NAV_LINKS = [
  { key: "services", href: "/#services", label: "Services" },
  { key: "process", href: "/#process", label: "How it works" },
  { key: "industries", href: "/#industries", label: "Industries" },
  { key: "about", href: "/#about", label: "About" },
  { key: "careers", href: "/careers", label: "Careers" },
];

export const HERO = {
  words: ["The", "right", "IT", "match,", "made", "faster."],
  roles: [
    "AI & GenAI Engineers",
    "Cloud Architects",
    "Data Engineers",
    "DevOps & SRE Teams",
    "Machine Learning Engineers",
    "Cybersecurity Experts",
    "Full Stack Developers",
    "Salesforce Experts",
    "QA Automation Engineers",
  ],
  terms: ["W2", "C2C", "1099"],
};

// [label, highlighted]
export const SKILLS = [
  ["AWS", true], ["React", false], ["Kubernetes", true], ["Python", false], ["DevOps", true],
  ["Java", false], ["Node.js", false], ["Azure", false], ["Machine Learning", true],
  ["TypeScript", false], ["Golang", false], ["Data Engineering", true], ["Salesforce", false],
  [".NET", false], ["Angular", false], ["Terraform", false], ["Cybersecurity", true],
  ["SAP", false], ["GCP", false], ["Snowflake", true], ["SQL", false], ["Spark", false],
  ["ServiceNow", false], ["Scala", false],
];

export const SERVICES = [
  { icon: "briefcase", title: "Contract Staffing", body: "W2, C2C and contract-to-hire consultants, vetted and deployed in weeks." },
  { icon: "userCheck", title: "Direct Placement", body: "Permanent hires matched to your stack and culture, backed by deep screening." },
  { icon: "network", title: "Bench Sales & Vendors", body: "We market available consultants to prime vendors and partners across the U.S." },
  { icon: "shieldCheck", title: "Payrolling & Compliance", body: "Onboarding, payroll and compliance for your contractors — fully managed." },
  { icon: "code", title: "Technical Screening", body: "Role-specific vetting and interview coordination before you ever meet a candidate." },
  { icon: "cycle", title: "RPO", body: "Recruitment process outsourcing that plugs into your team and sources around the clock." },
];

export const STEPS = [
  { title: "Share the need", body: "Send a role and spec, or submit your resume to join the network." },
  { title: "Match & screen", body: "A shortlist of vetted consultants, measured against your exact requirements." },
  { title: "Interview", body: "We coordinate interviews and feedback within days, keeping everyone moving." },
  { title: "Placed & onboarded", body: "Offer, onboarding, payroll and compliance — all handled by us." },
];

export const INDUSTRIES = [
  { icon: "monitor", name: "Technology" },
  { icon: "pulse", name: "Healthcare" },
  { icon: "bank", name: "Finance" },
  { icon: "capitol", name: "Federal" },
  { icon: "bag", name: "Retail" },
  { icon: "rocket", name: "Startups" },
];

export const STATS = [
  { to: 1000, suffix: "+", label: "Consultants in network" },
  { to: 100, suffix: "+", label: "Placements made" },
  { to: 100, suffix: "%", label: "Client satisfaction" },
  { to: 15, suffix: "+", label: "Industries served" },
];

export const AUDIENCES = [
  {
    tag: "// candidates",
    title: "For job seekers",
    body: "Browse open IT roles, submit your resume once, and get interviewed within days — matched to roles that fit your skills and visa status.",
    cta: { label: "Browse open roles", href: "/careers", variant: "ghost" },
  },
  {
    tag: "// employers & vendors",
    title: "For hiring teams",
    body: "Get vetted consultants matched to your roles, fast — on W2, C2C or 1099 terms. One partner from screening to onboarding.",
    cta: { label: "Request talent", href: "/careers", variant: "red" },
    accent: true,
  },
];

export const FOOTER_COLUMNS = [
  {
    heading: "Services",
    links: ["Contract Staffing", "Direct Placement", "Bench Sales", "Payrolling", "RPO"].map((label) => ({
      label,
      href: "/#services",
    })),
  },
  {
    heading: "Industries",
    links: ["Technology", "Healthcare", "Finance", "Federal", "Retail"].map((label) => ({
      label,
      href: "/#industries",
    })),
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/#about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/#contact" },
      { label: "Submit resume", href: "/careers/join" },
    ],
  },
];
