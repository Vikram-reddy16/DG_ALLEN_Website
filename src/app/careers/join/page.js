import Link from "next/link";
import Icon from "@/components/ui/Icon";
import JobPanel from "@/components/careers/JobPanel";
import TrustCard from "@/components/careers/TrustCard";

export const metadata = {
  title: "Join the talent network | DG-ALLEN Careers",
  description: "Send your résumé once and DG-ALLEN recruiters will match you to US IT roles as they open — W2, C2C, 1099 or full-time.",
};

// Full-page talent-network sign-up (direct visits / refresh). In-app links open it in the drawer.
export default function JoinPage() {
  return (
    <div className="shell">
      <nav className="cr-crumbs" aria-label="Breadcrumb">
        <Link href="/careers">
          <Icon name="arrowLeft" strokeWidth={2} /> All open roles
        </Link>
      </nav>
      <div className="cr-jobpage">
        <main>
          <JobPanel variant="page" />
        </main>
        <aside className="cr-jobpage-aside">
          <TrustCard />
        </aside>
      </div>
    </div>
  );
}
