"use client";

import { FormData } from "../types";

interface AvailabilityFormProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function AvailabilityForm({ formData, updateFormData }: AvailabilityFormProps) {
  const timelineOptions = [
    "3 months",
    "6 months",
    "9 months",
    "12 months",
    "18 months",
    "24 months"
  ];

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ hoursPerWeek: Math.max(0, value) });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ completionTimeline: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-gray-700 mb-1">
          Hours Available Per Week
        </label>
        <input
          id="hoursPerWeek"
          name="hoursPerWeek"
          type="number"
          min="1"
          max="40"
          value={formData.hoursPerWeek}
          onChange={handleNumberChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
          required
        />
        <p className="mt-2 text-sm text-gray-500">
          Estimate how many hours per week you can dedicate to your engineering reports.
        </p>
      </div>

      <div>
        <label htmlFor="completionTimeline" className="block text-sm font-medium text-gray-700 mb-1">
          Target Completion Timeline
        </label>
        <select
          id="completionTimeline"
          name="completionTimeline"
          value={formData.completionTimeline}
          onChange={handleSelectChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
          required
        >
          <option value="" disabled>Select completion timeline</option>
          {timelineOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Set a realistic timeline for completing your engineering reports.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h3 className="text-sm font-medium text-blue-800">Recommendation</h3>
        <p className="text-sm text-blue-700 mt-1">
          Based on industry averages, engineers dedicating {formData.hoursPerWeek} hours per week 
          typically complete their reports within {getRecommendedTimeline(formData.hoursPerWeek)}.
        </p>
      </div>
    </div>
  );
}

// Helper function to provide a recommended timeline based on hours per week
function getRecommendedTimeline(hoursPerWeek: number): string {
  if (hoursPerWeek >= 15) {
    return "6 months";
  } else if (hoursPerWeek >= 10) {
    return "9 months";
  } else if (hoursPerWeek >= 5) {
    return "12 months";
  } else if (hoursPerWeek >= 3) {
    return "18 months";
  } else {
    return "24 months";
  }
} 