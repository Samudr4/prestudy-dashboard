
"use client";

import * as React from "react";
import { mockTopStatCards } from "@/data/mock-data";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ReportCard } from "@/components/dashboard/report-card";
import { UserActivityCard } from "@/components/dashboard/user-activity-card";
import { LeaderboardCard } from "@/components/dashboard/leaderboard-card";
import { TransactionsCard } from "@/components/dashboard/transactions-card";
import { usePageTitle } from '@/contexts/PageTitleContext';

export default function DashboardPage() {
  const { setPageTitle } = usePageTitle();

  React.useEffect(() => {
    setPageTitle("Dashboard");
  }, [setPageTitle]);

  return (
    <main className="flex-1 space-y-6 p-4 md:p-6 lg:p-8">
      {/* Top Summary Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTopStatCards.map((stat) => (
          <SummaryCard key={stat.title} data={stat} />
        ))}
      </section>

      {/* Main Dashboard Area: Report on Left, User Activity & Leaderboard on Right */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Report Card */}
        <div className="lg:col-span-2">
          <ReportCard />
        </div>

        {/* Right Column: User Activity and Leaderboard */}
        <div className="space-y-6">
          <UserActivityCard />
          <LeaderboardCard />
        </div>
      </section>
      
      {/* Transactions Table - takes full width of the main content area or adjusted as needed */}
      <section>
        <TransactionsCard />
      </section>
    </main>
  );
}
