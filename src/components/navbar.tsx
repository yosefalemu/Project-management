import UserButton from "@/features/components/user-button";

export default function Navbar() {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div>Nav bar</div>
      <UserButton />
    </nav>
  );
}
