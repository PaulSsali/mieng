"use client";

import { FormData } from "../types";

interface DisciplineFormProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function DisciplineForm({ formData, updateFormData }: DisciplineFormProps) {
  const engineeringDisciplines = [
    "Aerospace Engineering",
    "Agricultural Engineering",
    "Biomedical Engineering",
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Engineering",
    "Electrical Engineering",
    "Environmental Engineering",
    "Industrial Engineering",
    "Mechanical Engineering",
    "Mining Engineering",
    "Nuclear Engineering",
    "Petroleum Engineering",
    "Software Engineering",
    "Structural Engineering",
    "Systems Engineering"
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ discipline: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="discipline" className="block text-sm font-medium text-gray-700 mb-1">
          Select Your Engineering Discipline
        </label>
        <select
          id="discipline"
          name="discipline"
          value={formData.discipline}
          onChange={handleSelectChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
          required
        >
          <option value="" disabled>Select a discipline</option>
          {engineeringDisciplines.map((discipline) => (
            <option key={discipline} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Choose the engineering field that best matches your expertise and career goals.
        </p>
      </div>
    </div>
  );
} 