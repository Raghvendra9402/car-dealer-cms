import { Header } from "@/components/inventory/inventory-header";
import { Footer } from "@/components/shared/footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <main className="flex-1 ">{children}</main>
      <Footer />
    </div>
  );
}
