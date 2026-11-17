import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// /careers/* shell. `drawer` is the @drawer parallel slot: it shows a role or the
// talent-network form over the list when navigated to from inside the app, and nothing otherwise.
export default function CareersLayout({ children, drawer }) {
  return (
    <>
      {/* The drawer marks this wrapper inert while open. */}
      <div id="careers-main">
        <Navbar active="careers" variant="careers" brandHref="/" />
        {children}
        <Footer />
      </div>
      {drawer}
    </>
  );
}
