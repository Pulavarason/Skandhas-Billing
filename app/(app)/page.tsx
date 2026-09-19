"use client";

import { BarChart3, CalendarDays, IndianRupee, Receipt, ScrollText } from "lucide-react";
import { useData } from "@/context/DataContext";
import StatCard from "@/components/StatCard";
import EmptyState from "@/components/EmptyState";
import { formatCurrency, formatDateDisplay, todayIso } from "@/lib/format";

function dateForOffset(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const { data, isReady } = useData();

  if (!isReady) {
    return <div className="text-sm text-[rgb(var(--text-muted))]">Loading&hellip;</div>;
  }

  const today = todayIso();
  const currentMonth = today.slice(0, 7);
  const currentYear = today.slice(0, 4);
  const billsToday = data.bills.filter((bill) => bill.date === today);
  const todaysSales = billsToday.reduce((sum, bill) => sum + bill.grandTotal, 0);
  const monthlySales = data.bills
    .filter((bill) => bill.date.startsWith(currentMonth))
    .reduce((sum, bill) => sum + bill.grandTotal, 0);
  const yearlySales = data.bills
    .filter((bill) => bill.date.startsWith(currentYear))
    .reduce((sum, bill) => sum + bill.grandTotal, 0);

  // Every bill is already stored in the local database, so this history remains
  // available after the day, month, or year changes.
  const dailySales = Array.from({ length: 7 }, (_, index) => {
    const date = dateForOffset(index - 6);
    const total = data.bills
      .filter((bill) => bill.date === date)
      .reduce((sum, bill) => sum + bill.grandTotal, 0);
    return { date, total };
  });

  const recentBills = [...data.bills]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Today's Sales" value={formatCurrency(todaysSales)} icon={IndianRupee} />
        <StatCard label="This Month" value={formatCurrency(monthlySales)} icon={CalendarDays} />
        <StatCard label="This Year" value={formatCurrency(yearlySales)} icon={BarChart3} />
        <StatCard label="Total Bills" value={String(data.bills.length)} icon={ScrollText} hint={`${billsToday.length} today`} />
      </div>

      <section className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5 shadow-soft">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[rgb(var(--text))]">Daily Sales</h2>
            <p className="mt-1 text-xs text-[rgb(var(--text-muted))]">Saved sales for the last 7 days</p>
          </div>
          <IndianRupee className="h-5 w-5 text-spice-600 dark:text-spice-400" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {dailySales.map((entry) => (
            <div key={entry.date} className="rounded-xl bg-[rgb(var(--border))]/30 p-3">
              <p className="text-xs text-[rgb(var(--text-muted))]">{formatDateDisplay(entry.date).slice(0, 6)}</p>
              <p className="mt-1 truncate text-sm font-semibold text-[rgb(var(--text))]">{formatCurrency(entry.total)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-[rgb(var(--text))]">Recent Bills</h2>
        {recentBills.length === 0 ? (
          <EmptyState icon={Receipt} title="No bills yet" description="Bills you save will appear here." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] shadow-soft">
            <ul className="divide-y divide-[rgb(var(--border))]">
              {recentBills.map((bill) => (
                <li key={bill.id} className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[rgb(var(--text))]">Bill #{bill.billNumber}</p>
                    <p className="text-xs text-[rgb(var(--text-muted))]">
                      {formatDateDisplay(bill.date)}{bill.customerName ? ` \u00B7 ${bill.customerName}` : ""}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-[rgb(var(--text))]">{formatCurrency(bill.grandTotal)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}