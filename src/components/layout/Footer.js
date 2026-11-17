import Wordmark from "@/components/ui/Wordmark";
import SmartLink from "@/components/ui/SmartLink";
import Icon from "@/components/ui/Icon";
import { ADDRESS_LINES, ADDRESS_MAP_URL, BRAND, FOOTER_COLUMNS } from "@/data/content";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="top">
          <div>
            <Wordmark as="div" />
            <p className="d">{BRAND.tagline}</p>
            <address className="addr">
              <Icon name="pin" strokeWidth={1.8} />
              <a href={ADDRESS_MAP_URL} target="_blank" rel="noopener noreferrer">
                {ADDRESS_LINES.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </a>
            </address>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <SmartLink href={l.href}>{l.label}</SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bot">
          <span>© 2026 {BRAND.name}. All rights reserved.</span>
          <span>Privacy · Terms</span>
        </div>
      </div>
    </footer>
  );
}
