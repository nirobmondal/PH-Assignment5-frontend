import PublicNavbar from "@/components/shared/PublicNavbar";
import PublicFooter from "@/components/shared/PublicFooter";

const CommonLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicNavbar />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
};

export default CommonLayout;
