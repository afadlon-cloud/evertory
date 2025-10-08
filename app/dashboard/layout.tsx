'use client';

// Temporarily disabled auth for deployment
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily skip auth check for deployment
  return (
    <div className="min-h-screen bg-neutral-50">
      <DashboardNav />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
}
