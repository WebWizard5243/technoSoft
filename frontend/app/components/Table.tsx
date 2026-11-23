"use client";

import React from "react";

export type customerData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
};

const fakeLeads: customerData[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    company: "TechNova",
    source: "Website",
    status: "New",
  },
  {
    id: 2,
    name: "Priya Das",
    email: "priya@example.com",
    phone: "9123456780",
    company: "Globex",
    source: "Referral",
    status: "Contacted",
  },
  {
    id: 3,
    name: "Krish Kapoor",
    email: "krish@example.com",
    phone: "7653987568",
    company: "Nexus Ltd",
    source: "WhatsApp",
    status: "New",
  },
  {
    id: 4,
    name: "Sneha Iyer",
    email: "sneha@example.com",
    phone: "9988776655",
    company: "Zenith Corp",
    source: "Instagram",
    status: "In Progress",
  },
  {
    id: 5,
    name: "Amit Verma",
    email: "amit@example.com",
    phone: "9123456780",
    company: "Apex Systems",
    source: "Phone Call",
    status: "Lost",
  },
];

const getStatusDotColor = (status: string) => {
  const s = status.toLowerCase().trim();
  switch (s) {
    case "new":
    case "new lead":
      return "bg-blue-500";
    case "contacted":
      return "bg-purple-600";
    case "in progress":
    case "requirement collected":
      return "bg-amber-500";
    case "property suggested":
      return "bg-orange-500";
    case "visit scheduled":
    case "visited":
      return "bg-teal-600";
    case "booked":
    case "won":
      return "bg-emerald-600";
    case "lost":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
};

interface TableProps {
  leads: customerData[];
  onEdit?: (lead: customerData) => void;
  onDelete?: (id: number) => void;
}

export default function Table({
  leads,
  onEdit,
  onDelete,
}: TableProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Card Header */}
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-base font-semibold text-slate-900 tracking-tight">
          Recent Leads
        </h2>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 text-sm">
              <th className="pb-3.5 px-6 font-medium">Name</th>
              <th className="pb-3.5 px-6 font-medium">Email</th>
              <th className="pb-3.5 px-6 font-medium">Phone</th>
              <th className="pb-3.5 px-6 font-medium">Company</th>
              <th className="pb-3.5 px-6 font-medium">Source</th>
              <th className="pb-3.5 px-6 font-medium">Status</th>
              <th className="pb-3.5 px-6 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads?.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                {/* Name */}
                <td className="py-4 px-6 font-semibold text-slate-900 whitespace-nowrap">
                  {lead.name}
                </td>

                {/* Email */}
                <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                  {lead.email}
                </td>

                {/* Phone */}
                <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                  {lead.phone}
                </td>

                {/* Company */}
                <td className="py-4 px-6 text-slate-600 whitespace-nowrap">
                  {lead.company}
                </td>

                {/* Source Pill */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                    {lead.source}
                  </span>
                </td>

                {/* Status with colored dot */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${getStatusDotColor(
                        lead.status
                      )}`}
                    />
                    <span className="text-slate-800 font-medium">
                      {lead.status}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => onEdit?.(lead)}
                    className="text-blue-600 hover:text-blue-800 font-medium mr-4 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(lead.id)}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
