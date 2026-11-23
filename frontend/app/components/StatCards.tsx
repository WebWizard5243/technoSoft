"use client";

import React from "react";
import { customerData } from "./Table";

interface StatCardsProps {
  leads: customerData[];
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function StatCards({
  leads,
  selectedStatus,
  onSelectStatus,
}: StatCardsProps) {
  const totalCount = leads.length;
  const newCount = leads.filter(
    (l) => l.status?.toLowerCase() === "new"
  ).length;
  const contactedCount = leads.filter(
    (l) => l.status?.toLowerCase() === "contacted"
  ).length;
  const qualifiedCount = leads.filter(
    (l) => l.status?.toLowerCase() === "qualified"
  ).length;
  const lostCount = leads.filter(
    (l) => l.status?.toLowerCase() === "lost"
  ).length;

  const stats = [
    {
      id: "all",
      label: "Total Leads",
      count: totalCount,
    },
    {
      id: "new",
      label: "New Leads",
      count: newCount,
    },
    {
      id: "contacted",
      label: "Contacted",
      count: contactedCount,
    },
    {
      id: "qualified",
      label: "Qualified",
      count: qualifiedCount,
    },
    {
      id: "lost",
      label: "Lost",
      count: lostCount,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {stats.map((stat) => {
        const isSelected = selectedStatus === stat.id;
        return (
          <button
            key={stat.id}
            type="button"
            onClick={() => onSelectStatus(stat.id)}
            className={`text-left bg-white rounded-2xl p-5 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03)] cursor-pointer hover:shadow-sm ${
              isSelected
                ? "border-2 border-orange-400 ring-2 ring-orange-100"
                : "border border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <div className="text-xs sm:text-sm font-medium text-slate-500">
              {stat.label}
            </div>
            <div
              className={`text-2xl sm:text-3xl font-bold mt-2 tracking-tight ${
                isSelected ? "text-orange-500" : "text-slate-900"
              }`}
            >
              {stat.count}
            </div>
          </button>
        );
      })}
    </div>
  );
}
