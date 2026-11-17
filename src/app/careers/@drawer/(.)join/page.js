import Drawer from "@/components/careers/Drawer";
import JobPanel from "@/components/careers/JobPanel";

// Intercepts /careers/join during in-app navigation and shows the talent-network form in the drawer.
export default function JoinDrawer() {
  return (
    <Drawer label="Join our talent network">
      <JobPanel variant="drawer" />
    </Drawer>
  );
}
