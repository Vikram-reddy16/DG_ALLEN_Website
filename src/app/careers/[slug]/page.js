import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/ui/Icon";
import JobPanel, { SimilarList } from "@/components/careers/JobPanel";
import TrustCard from "@/components/careers/TrustCard";
import { getJobBySlug, getJobs, getSimilarJobs } from "@/lib/jobs";
import { locationLabel } from "@/lib/job-format";

// Full job page — what shared links, refreshes and search engines get.
// Clicking a card inside /careers opens the same content in the drawer instead (see @drawer).

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Role not found | DG-ALLEN Careers" };
  return {
    title: `${job.title} — ${locationLabel(job)} | DG-ALLEN Careers`,
    description: job.summary,
  };
}

// schema.org JobPosting so roles can appear in Google for Jobs.
function jobPostingLd(job) {
  const validThrough = new Date(`${job.postedAt}T00:00:00Z`);
  validThrough.setUTCDate(validThrough.getUTCDate() + 60);
  const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: `<p>${job.summary}</p><h3>What you’ll do</h3>${list(job.responsibilities)}<h3>What you’ll need</h3>${list(job.requirements)}`,
    identifier: { "@type": "PropertyValue", name: "DG-ALLEN", value: job.id },
    datePosted: job.postedAt,
    validThrough: validThrough.toISOString().slice(0, 10),
    employmentType: job.engagement.includes("Full-time") ? "FULL_TIME" : "CONTRACTOR",
    hiringOrganization: { "@type": "Organization", name: "DG-ALLEN" },
    ...(job.city
      ? {
          jobLocation: {
            "@type": "Place",
            address: { "@type": "PostalAddress", addressLocality: job.city, addressRegion: job.region, addressCountry: "US" },
          },
        }
      : { jobLocationType: "TELECOMMUTE", applicantLocationRequirements: { "@type": "Country", name: "USA" } }),
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: { "@type": "QuantitativeValue", minValue: job.pay.min, maxValue: job.pay.max, unitText: job.pay.unit === "yr" ? "YEAR" : "HOUR" },
    },
    skills: job.skills.join(", "),
  };
}

export default async function JobPage({ params }) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const similar = await getSimilarJobs(slug);

  return (
    <div className="shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd(job)).replace(/</g, "\\u003c") }}
      />
      <nav className="cr-crumbs" aria-label="Breadcrumb">
        <Link href="/careers">
          <Icon name="arrowLeft" strokeWidth={2} /> All open roles
        </Link>
      </nav>
      <div className="cr-jobpage">
        <main>
          <JobPanel job={job} similar={similar} variant="page" />
        </main>
        <aside className="cr-jobpage-aside">
          <TrustCard />
          {similar.length > 0 && (
            <div className="cr-aside-card">
              <h2>Similar roles</h2>
              <SimilarList jobs={similar} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
