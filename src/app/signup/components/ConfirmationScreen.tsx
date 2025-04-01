"use client";

import { FormData } from "../types";

interface ConfirmationScreenProps {
  formData: FormData;
}

export default function ConfirmationScreen({ formData }: ConfirmationScreenProps) {
  const sections = [
    {
      title: "Personal Information",
      fields: [
        { label: "Name", value: formData.name },
        { label: "Email", value: formData.email },
      ]
    },
    {
      title: "Engineering Details",
      fields: [
        { label: "Discipline", value: formData.discipline },
        { label: "Experience", value: formData.experience },
        { label: "Has Mentor", value: formData.hasMentor ? "Yes" : "No" }
      ]
    },
    {
      title: "Report Completion Plan",
      fields: [
        { label: "Hours Per Week", value: `${formData.hoursPerWeek} hours` },
        { label: "Target Completion", value: formData.completionTimeline }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">Ready to complete your registration</h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Please review your information below before finishing setup.</p>
            </div>
          </div>
        </div>
      </div>

      {sections.map((section, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {section.fields.map((field, fieldIndex) => (
              <div key={fieldIndex} className="px-4 py-3 flex justify-between">
                <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                <dd className="text-sm text-gray-900">{field.value}</dd>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          By clicking "Finish Setup" you agree to our{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
} 