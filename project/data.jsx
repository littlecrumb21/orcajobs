// Mock data for Orca Jobs prototype

const JOBS = [
  {
    id:"j-001", title:"Marine Engineer", company:"Wight Shipyard Co.", logo:"WS",
    location:"East Cowes", type:"Full-time", remote:"On-site",
    salary:"£42,000 – £52,000", salaryNum:47000,
    posted:"2 days ago", featured:true, premium:true,
    category:"Marine & Boatbuilding",
    summary:"Join the team building world-class fast ferries and patrol vessels on the Medina.",
    skills:["AutoCAD","Welding","Hydraulics","ISO 9001"],
    description:`Wight Shipyard Co. designs and builds the fastest aluminium passenger ferries in the world. We're looking for a marine engineer to join our production team in East Cowes.\n\nYou will work alongside naval architects to interpret design drawings, supervise hull assembly, and coordinate sea trials. Experience in commercial vessel construction is preferred, but we'll train the right candidate.`,
    responsibilities:[
      "Interpret naval architecture drawings into shop-floor instructions",
      "Supervise hull and superstructure assembly",
      "Lead pre-delivery sea trials in the Solent",
      "Liaise with classification societies (Lloyd's, MCA)"
    ],
    benefits:["28 days holiday + bank","Pension 6% match","Private healthcare","Ferry season ticket"]
  },
  {
    id:"j-002", title:"Front-of-House Manager", company:"The Hut, Colwell Bay", logo:"TH",
    location:"Colwell Bay", type:"Full-time", remote:"On-site",
    salary:"£32,000 + tronc", salaryNum:36000,
    posted:"4 days ago", featured:true, premium:false,
    category:"Hospitality & Tourism",
    summary:"Lead the front-of-house team at one of the island's most loved beachside restaurants.",
    skills:["Service","Rota planning","Wine knowledge","Leadership"],
    description:"Run service across 110 covers with a tight, sun-soaked team. April through October is full-throttle; winter is gentler.",
    responsibilities:["Lead daily service","Recruit and train seasonal staff","Manage covers and reservations"],
    benefits:["Tronc share","Staff meals","Accommodation available"]
  },
  {
    id:"j-003", title:"Senior Staff Nurse — Acute Ward", company:"Isle of Wight NHS Trust", logo:"NHS",
    location:"Newport", type:"Full-time", remote:"On-site",
    salary:"Band 6 — £37,338 – £44,962", salaryNum:41000,
    posted:"1 day ago", featured:false, premium:true,
    category:"Healthcare",
    summary:"Band 6 role on St Mary's acute medical unit. Relocation support available.",
    skills:["Acute care","Mentoring","Triage","NMC registered"],
    description:"St Mary's is the island's only district general hospital. Be part of a tight, supportive team treating the community you live in.",
    responsibilities:["Lead a bay during shifts","Mentor junior staff","Liaise with consultants on rounds"],
    benefits:["NHS pension","27–33 days holiday","Relocation package up to £8k"]
  },
  {
    id:"j-004", title:"Junior Web Developer", company:"PMW Communications", logo:"PM",
    location:"Newport (hybrid)", type:"Full-time", remote:"Hybrid",
    salary:"£26,000 – £30,000", salaryNum:28000,
    posted:"5 days ago", featured:false, premium:false,
    category:"Technology & Creative",
    summary:"Build websites for charities, sailing brands, and island institutions.",
    skills:["HTML/CSS","JavaScript","WordPress","Figma"],
    description:"Small, friendly agency. You'd be the third developer on the team.",
    responsibilities:["Build sites in WordPress and headless CMS","Pair with designers","Maintain client retainers"],
    benefits:["Hybrid 2/3","Training budget £1k","Cycle to work"]
  },
  {
    id:"j-005", title:"Holiday Park Receptionist", company:"Whitecliff Bay Holiday Park", logo:"WB",
    location:"Bembridge", type:"Seasonal", remote:"On-site",
    salary:"£12.50/hr", salaryNum:24000,
    posted:"6 hours ago", featured:false, premium:false,
    category:"Hospitality & Tourism",
    summary:"April–October. Friendly faces, busy summers, sea views from the desk.",
    skills:["Customer service","Cash handling","Bookings"],
    description:"Front-line reception for a 600-pitch holiday park.",
    responsibilities:["Check guests in","Handle bookings","Answer the phone"],
    benefits:["Subsidised accommodation","Free park access","Discounted ferries"]
  },
  {
    id:"j-006", title:"Vineyard Assistant", company:"Adgestone Vineyard", logo:"AV",
    location:"Sandown", type:"Part-time", remote:"On-site",
    salary:"£11.80/hr", salaryNum:18000,
    posted:"1 week ago", featured:false, premium:false,
    category:"Agriculture & Land",
    summary:"Pruning, harvest, cellar door. England's oldest commercial vineyard.",
    skills:["Outdoor work","Customer service","Driving licence"],
    description:"Year-round work with seasonal peaks. Tastings included.",
    responsibilities:["Vineyard maintenance","Help with bottling and labelling","Cellar door service"],
    benefits:["Wine allowance","Flexible hours","Beautiful setting"]
  },
  {
    id:"j-007", title:"Primary School Teacher (KS2)", company:"Solent Primary Academy", logo:"SP",
    location:"Ryde", type:"Full-time", remote:"On-site",
    salary:"MPS — £30,000 – £41,333", salaryNum:35000,
    posted:"3 days ago", featured:true, premium:false,
    category:"Education",
    summary:"Year 5 class teacher from September. Mentoring available for ECTs.",
    skills:["QTS","KS2 curriculum","SEN awareness"],
    description:"Two-form entry primary in central Ryde. Strong leadership team and supportive parents.",
    responsibilities:["Plan and teach Year 5","Lead a curriculum area","Contribute to extra-curricular life"],
    benefits:["TPS pension","Free CPD","Cycle to work"]
  },
  {
    id:"j-008", title:"Customer Service Advisor", company:"Wightlink Ferries", logo:"WL",
    location:"Fishbourne", type:"Full-time", remote:"On-site",
    salary:"£24,500 + shift premium", salaryNum:26500,
    posted:"2 weeks ago", featured:false, premium:false,
    category:"Transport & Logistics",
    summary:"Help passengers cross the Solent. Shifts including weekends.",
    skills:["Customer service","Calm under pressure","Microsoft Office"],
    description:"Front-line role at the busiest ferry terminal on the island.",
    responsibilities:["Greet and assist passengers","Handle bookings","Resolve disruption queries"],
    benefits:["Free travel for family","Pension 5%","26 days holiday"]
  },
  {
    id:"j-009", title:"Carer (live-in available)", company:"Bluebird Care IOW", logo:"BC",
    location:"Across the island", type:"Full-time", remote:"On-site",
    salary:"£12.20 – £14.50/hr", salaryNum:25000,
    posted:"3 days ago", featured:false, premium:false,
    category:"Healthcare",
    summary:"Visiting and live-in care. Full training, mileage paid, sponsorship available.",
    skills:["Empathy","Driving licence","Care Cert (training given)"],
    description:"Help island residents stay independent in their own homes.",
    responsibilities:["Personal care visits","Light housework","Companionship"],
    benefits:["Mileage 45p/mile","Paid training","Sponsorship for the right candidate"]
  }
];

const CATEGORIES = [
  { id:"hosp",     name:"Hospitality & Tourism",   count: 84, icon:"☕" },
  { id:"marine",   name:"Marine & Boatbuilding",   count: 23, icon:"⚓" },
  { id:"health",   name:"Healthcare",              count: 67, icon:"✚" },
  { id:"tech",     name:"Technology & Creative",   count: 19, icon:"⌘" },
  { id:"educ",     name:"Education",               count: 31, icon:"✎" },
  { id:"trans",    name:"Transport & Logistics",   count: 18, icon:"⇄" },
  { id:"trade",    name:"Trades & Construction",   count: 42, icon:"⚒" },
  { id:"retail",   name:"Retail & Customer",       count: 56, icon:"○" },
  { id:"land",     name:"Agriculture & Land",      count: 12, icon:"❦" },
  { id:"public",   name:"Public Sector",           count: 28, icon:"⬢" },
];

const TOWNS = ["Newport","Cowes","Ryde","Sandown","Shanklin","Ventnor","Yarmouth","Bembridge","Freshwater","Brading","East Cowes","Across the island"];

const APPLICANT = {
  firstName:"Imogen", lastName:"Hartley",
  email:"imogen.hartley@example.com",
  phone:"+44 7700 900812",
  location:"Ryde, PO33",
  rightToWork:"UK Citizen",
  availability:"2 weeks notice",
  workPattern:["Full-time","Hybrid"],
  expectedSalary:32000,
  headline:"Hospitality manager — 6 yrs front-of-house, ready for the next step",
  bio:"Born and raised in Bembridge. Six years running busy island restaurants, now looking for a year-round leadership role. Comfortable with rotas, recruitment, supplier relationships and leading through busy summers.",
  skills:["Service leadership","Rota planning","Stock control","Wine (WSET 2)","Recruitment","Health & safety"],
  history:[
    { role:"Assistant Manager", company:"The Hut, Colwell Bay", from:"Mar 2023", to:"Present", desc:"Lead a 14-person FOH team across 110 covers." },
    { role:"Supervisor",        company:"Quay Arts Café",        from:"Jun 2021", to:"Feb 2023", desc:"Ran weekend service and event catering." },
    { role:"Bartender",          company:"The George Hotel, Yarmouth", from:"Jul 2019", to:"Jun 2021", desc:"Hotel bar, weddings and residents." },
  ],
  cv: { name:"imogen-hartley-cv.pdf", size:"248 KB", uploaded:"5 days ago" },
  videoIntro: { duration:"00:42", uploaded:"3 days ago" },
  consent:{ marketing:false, employerContact:true, analytics:true }
};

const EMPLOYER = {
  company:"Wight Shipyard Co.",
  contact:"Daniel Marsh",
  email:"d.marsh@wightshipyard.co.uk",
  phone:"+44 1983 200000",
  address:"Medina Road, East Cowes, PO32 6RA",
  website:"wightshipyard.co.uk",
  size:"50–250 employees",
  industry:"Marine & Boatbuilding"
};

const PRICING = [
  {
    id:"basic",     name:"Basic",     price:49,  duration:"30 days",
    blurb:"Standard listing in search results.",
    features:["30-day live listing","Standard placement","Apply via email or link","Up to 3 photos"],
    cta:"Choose Basic"
  },
  {
    id:"featured", name:"Featured", price:99,  duration:"30 days", best:true,
    blurb:"Stand out with featured placement and a brand banner.",
    features:["Everything in Basic","Featured tag in search","Top of category page","Logo + brand colour","Email blast inclusion","Apply via on-site form"],
    cta:"Choose Featured"
  },
  {
    id:"premium",   name:"Premium",   price:179, duration:"30 days",
    blurb:"Maximum exposure across the island.",
    features:["Everything in Featured","Homepage rotation","Boosted again on day 14","Social post (Insta + FB)","Application screening questions","Dedicated account contact"],
    cta:"Choose Premium"
  }
];

const APPLICATIONS = [
  { id:"a-1", job:"Front-of-House Manager", applicant:"Imogen Hartley",   stage:"Shortlisted", applied:"3 days ago", match:92 },
  { id:"a-2", job:"Front-of-House Manager", applicant:"Connor Reilly",     stage:"In review",   applied:"3 days ago", match:74 },
  { id:"a-3", job:"Front-of-House Manager", applicant:"Priya Iyer",         stage:"In review",   applied:"4 days ago", match:81 },
  { id:"a-4", job:"Marine Engineer",         applicant:"Alex Whittaker",     stage:"Interview",   applied:"1 week ago", match:88 },
  { id:"a-5", job:"Marine Engineer",         applicant:"Tomasz Krol",        stage:"Shortlisted", applied:"5 days ago", match:90 },
  { id:"a-6", job:"Marine Engineer",         applicant:"Jess Ngata",         stage:"Rejected",    applied:"1 week ago", match:62 },
];

const ADMIN_FLAGS = [
  { id:"f-1", type:"Job listing", subject:"Hostess wanted, must be young female", reporter:"3 reports", reason:"Discriminatory wording", posted:"2 hours ago", status:"Open" },
  { id:"f-2", type:"Job listing", subject:"Cleaner — cash in hand",                 reporter:"1 report",  reason:"No PAYE / tax compliance",  posted:"5 hours ago", status:"Open" },
  { id:"f-3", type:"Employer",    subject:"Quick Quid Couriers Ltd",                reporter:"Auto-flag", reason:"New account, 12 listings",  posted:"1 day ago",   status:"Reviewing" },
  { id:"f-4", type:"Job listing", subject:"Web designer — unpaid trial week",       reporter:"5 reports", reason:"Unpaid work",               posted:"1 day ago",   status:"Open" },
  { id:"f-5", type:"Applicant",   subject:"Profile flagged as fraudulent",          reporter:"Auto-flag", reason:"Duplicate identity match",  posted:"2 days ago",  status:"Resolved" },
];

const ADMIN_STATS = [
  { label:"Live jobs",          value:"684",  delta:"+12 this week" },
  { label:"Applications (7d)",   value:"2,341", delta:"+18%" },
  { label:"New employers (7d)",  value:"23",   delta:"+5"   },
  { label:"Pending moderation",  value:"7",    delta:"3 urgent" }
];

Object.assign(window, { JOBS, CATEGORIES, TOWNS, APPLICANT, EMPLOYER, PRICING, APPLICATIONS, ADMIN_FLAGS, ADMIN_STATS });
