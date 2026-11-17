import SmartLink from "@/components/ui/SmartLink";

// Link styled as a button. variant: "red" | "ghost"; size "lg" for large, "sm" for compact (nav);
// magnetic adds the cursor-follow effect.
export default function Button({ href, variant = "red", size, magnetic = false, className, children, ...rest }) {
  const cls = [
    "btn",
    `btn-${variant}`,
    size === "lg" && "btn-lg",
    size === "sm" && "btn-sm",
    magnetic && "magnetic",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <SmartLink className={cls} href={href} {...rest}>
      {children}
    </SmartLink>
  );
}
