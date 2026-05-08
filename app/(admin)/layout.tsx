import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminAuth } from "@/lib/auth-utlis";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAuth();

  return (
    <div className="flex h-full w-full">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="admin-scrollbar flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
