"use client";

import React, { useState } from "react";
import { customerData } from "./Table";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadAdded: (newLead: customerData) => void;
  apiUrl: string;
}

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  source: "Website",
  status: "New",
};

export default function AddLeadModal({
  isOpen,
  onClose,
  onLeadAdded,
  apiUrl,
}: AddLeadModalProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setFieldErrors({});
    setGeneralError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      const res = await fetch(`${apiUrl}/addLeads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          company: formData.company.trim(),
          source: formData.source.trim(),
          status: formData.status,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        if (data?.errors) {
          setFieldErrors(data.errors);
        } else {
          setGeneralError(data?.error || "Failed to add lead");
        }
        return;
      }

      onLeadAdded(data);
      handleClose();
    } catch {
      setGeneralError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Add Lead</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Create a new lead entry in your pipeline
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {generalError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {generalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="e.g. Jane Doe"
                className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.name
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.name[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="e.g. jane@example.com"
                className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.email
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.email[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="^\d{10}$"
                maxLength={15}
                placeholder="10-digit number"
                className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.phone
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.phone[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                placeholder="e.g. Acme Corp"
                className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.company
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {fieldErrors.company && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.company[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Source
              </label>
              <select
                name="source"
                value={formData.source}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors bg-white ${
                  fieldErrors.source
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              >
                <option value="Website">Website</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Instagram">Instagram</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Google Form">Google Form</option>
                <option value="Referral">Referral</option>
              </select>
              {fieldErrors.source && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.source[0]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 transition-colors bg-white ${
                  fieldErrors.status
                    ? "border-red-400 focus:ring-red-500/20 focus:border-red-500"
                    : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              {fieldErrors.status && (
                <p className="text-xs text-red-600 mt-1">
                  {fieldErrors.status[0]}
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Adding..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
