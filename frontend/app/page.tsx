"use client";

import React, { useEffect, useState } from "react";
import Table, { customerData } from "./components/Table";
import EditLeadModal from "./components/EditLeadModal";
import AddLeadModal from "./components/AddLeadModal";
import StatCards from "./components/StatCards";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001";

export default function Home() {
  const [leads, setLeads] = useState<customerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<customerData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    let ignore = false;

    async function loadLeads() {
      try {
        const response = await fetch(`${API_URL}/getLeads`);
        if (!response.ok) throw new Error("failed to fetch leads");

        const data = await response.json();
        if (!ignore) {
          setLeads(data);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setError("could not load leads from backend");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadLeads();

    return () => {
      ignore = true;
    };
  }, []);

  const handleEdit = (selectedLead: customerData) => {
    setEditingLead(selectedLead);
  };

  const handleSaveLead = async (updatedLead: customerData) => {
    try {
      const res = await fetch(`${API_URL}/leads/${updatedLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedLead),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Error updating the lead");
      }

      const savedLead: customerData = await res.json();

      setLeads((prevLeads) =>
        prevLeads.map((l) => (l.id === savedLead.id ? savedLead : l))
      );
      setEditingLead(null);
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("Failed to update lead. Please try again.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/deleteLeads/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLeads((prevLeads) => prevLeads.filter((l) => l.id !== id));
      } else {
        throw new Error("failed to delete lead");
      }
    } catch (err) {
      console.error(err);
      setError("could not delete lead from backend");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      lead.phone.includes(q) ||
      lead.company.toLowerCase().includes(q) ||
      lead.source.toLowerCase().includes(q);

    const matchesStatus =
      selectedStatus === "all" ||
      lead.status?.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-slate-50/50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Lead Manager
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage, track, and update your leads pipeline.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Lead
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <StatCards
          leads={leads}
          selectedStatus={selectedStatus}
          onSelectStatus={(status) => setSelectedStatus(status)}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <svg
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search leads by name, email, phone, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-sm placeholder:text-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full w-4 h-4 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>
              Showing{" "}
              <strong className="text-slate-800 font-semibold">
                {filteredLeads.length}
              </strong>{" "}
              of {leads.length} leads
            </span>
            {selectedStatus !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedStatus("all")}
                className="ml-2 text-blue-600 hover:text-blue-800 font-medium underline transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/90 text-slate-500 text-sm">
            Loading leads...
          </div>
        ) : (
          <Table
            leads={filteredLeads}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {editingLead && (
          <EditLeadModal
            key={editingLead.id}
            lead={editingLead}
            isOpen={true}
            onClose={() => setEditingLead(null)}
            onSave={handleSaveLead}
          />
        )}

        <AddLeadModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onLeadAdded={(newLead) => setLeads((prev) => [newLead, ...prev])}
          apiUrl={API_URL}
        />
      </div>
    </main>
  );
}
