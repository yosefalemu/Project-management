interface DashboardLayoutProps {
  children: React.ReactNode;
}
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div>
      DASHBOARD LAYOUT
      <div>{children}</div>
    </div>
  );
}
