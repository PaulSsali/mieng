"use client";

import { FormData } from "../types";

interface ExperienceFormProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

export default function ExperienceForm({ formData, updateFormData }: ExperienceFormProps) {
  const experienceOptions = [
    "Less than 1 year",
    "1-2 years",
    "3-5 years",
    "6-10 years",
    "More than 10 years"
  ];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ experience: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ hasMentor: e.target.checked });
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
          Years of Professional Experience
        </label>
        <select
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleSelectChange}
          className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
          required
        >
          <option value="" disabled>Select experience level</option>
          {experienceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-gray-500">
          Include all relevant professional experience in your field.
        </p>
      </div>

      <div className="pt-4">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="hasMentor"
              name="hasMentor"
              type="checkbox"
              checked={formData.hasMentor}
              onChange={handleCheckboxChange}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="hasMentor" className="font-medium text-gray-700">
              I have a professional mentor
            </label>
            <p className="text-gray-500">
              Having a mentor can significantly improve your professional development and report completion success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 