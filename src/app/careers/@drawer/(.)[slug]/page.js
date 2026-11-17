import { notFound } from "next/navigation";
import Drawer from "@/components/careers/Drawer";
import JobPanel from "@/components/careers/JobPanel";
import { getJobBySlug, getJobs, getSimilarJobs } from "@/lib/jobs";

// Intercepts /careers/[slug] during in-app navigation and shows it in the side drawer,
// keeping the list, filters and scroll position underneath.

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export default async function JobDrawer({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const similar = await getSimilarJobs(slug);
  return (
    <Drawer label={job.title}>
      <JobPanel job={job} similar={similar} variant="drawer" />
    </Drawer>
  );
}
