import ReportFormatter from '@/components/ReportFormatter';

export default function TestFormatterPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Test AI Report Formatting</h1>
      <p className="text-center mb-8 text-gray-600">
        This page demonstrates the AI-powered report formatting capabilities.
        Paste your draft report content below to improve its structure and readability.
      </p>
      <ReportFormatter />
    </div>
  );
} 