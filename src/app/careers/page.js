import CareersBoard from "@/components/careers/CareersBoard";
import { getJobs } from "@/lib/jobs";

export const metadata = {
  title: "Careers — Open IT roles | DG-ALLEN",
  description:
    "Open IT roles at DG-ALLEN — contract and full-time across the US on W2, C2C or 1099. Filter by role, experience, work authorization and location, and apply in minutes.",
};

export default async function CareersPage() {
  const jobs = await getJobs();
  return <CareersBoard jobs={jobs} />;
}
