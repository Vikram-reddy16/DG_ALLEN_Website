// "DG-ALLEN" text logo. `as` sets the element (span in the navbar, div in the footer).
export default function Wordmark({ as: Tag = "span" }) {
  return (
    <Tag className="wm">
      DG<b>-</b>ALLEN
    </Tag>
  );
}
