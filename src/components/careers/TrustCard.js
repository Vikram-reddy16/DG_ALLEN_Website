import Icon from "@/components/ui/Icon";
import { BRAND } from "@/data/content";

// Candidate reassurance shown beside full job and talent-network pages.
export default function TrustCard() {
  return (
    <div className="cr-aside-card">
      <h2>Why apply with DG-ALLEN</h2>
      <ul className="cr-trust-list">
        <li>
          <Icon name="shieldCheck" strokeWidth={1.8} />
          <span>
            <b>No fees, ever.</b> We never charge candidates for placement.
          </span>
        </li>
        <li>
          <Icon name="clock" strokeWidth={1.8} />
          <span>
            <b>Fast replies.</b> A recruiter responds within 2 business days.
          </span>
        </li>
        <li>
          <Icon name="userCheck" strokeWidth={1.8} />
          <span>
            <b>Your consent first.</b> We never submit your résumé to a client without asking.
          </span>
        </li>
      </ul>
      <div className="cr-trust-contact">
        <a href={BRAND.phoneHref}>
          <Icon name="phone" strokeWidth={1.8} />
          {BRAND.phone}
        </a>
        <a href={`mailto:${BRAND.email}`}>
          <Icon name="mail" strokeWidth={1.8} />
          {BRAND.email}
        </a>
      </div>
    </div>
  );
}
