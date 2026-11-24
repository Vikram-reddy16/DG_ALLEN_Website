import { Suspense } from "react";
import { notFound } from "next/navigation";
import Drawer from "@/components/careers/Drawer";
import JobPanel from "@/components/careers/JobPanel";
import { getJobBySlug, getJobs, getSimilarJobs } from "@/lib/jobs";

// Intercepts /careers/[slug] during in-app navigation and shows it in the side drawer,
// keeping the list, filters and scroll position underneath.
//
// The drawer itself is URL-independent, so it opens instantly from the shared App Shell.
// Only the job details depend on `params`, so they stream in behind <Suspense>
// (required by Partial Prefetching — see "instant-shell-url-data" in the Next docs).

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export default function JobDrawer({ params }) {
  return (
    <Drawer label="Job details">
      <Suspense fallback={<JobPanelSkeleton />}>
        <JobDrawerContent params={params} />
      </Suspense>
    </Drawer>
  );
}

async function JobDrawerContent({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const similar = await getSimilarJobs(slug);
  return <JobPanel job={job} similar={similar} variant="drawer" />;
}

function JobPanelSkeleton() {
  return (
    <div className="cr-skel" aria-busy="true" aria-label="Loading role">
      <span className="cr-skel-bar w30" />
      <span className="cr-skel-bar h28 w80" />
      <span className="cr-skel-bar w50" />
      <span className="cr-skel-bar h44 w40" />
      <span className="cr-skel-bar w100" />
      <span className="cr-skel-bar w90" />
      <span className="cr-skel-bar w70" />
    </div>
  );
}
