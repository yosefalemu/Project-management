import UserButton from "@/features/components/user-button";
import MobileSidebar from "./mobile-sidebar";

export default function Navbar() {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">Nav bar</div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
}
