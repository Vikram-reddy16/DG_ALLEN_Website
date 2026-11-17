import Link from "next/link";

// Internal page paths ("/careers") use next/link for client-side navigation.
// Hash links ("#services", "/#services") and external URLs stay plain anchors so in-page
// scrolling on the home page keeps working exactly as before.
export default function SmartLink({ href, children, ...rest }) {
  const internalPath = href.startsWith("/") && !href.includes("#");
  if (internalPath) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
