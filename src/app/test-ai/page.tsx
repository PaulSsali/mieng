import ReportGenerator from '@/components/ReportGenerator';

export default function TestAIPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Test AI Report Generation</h1>
      <p className="text-center mb-8 text-gray-600">
        This page demonstrates the AI-powered report generation capabilities.
        Enter project details below to generate an engineering report.
      </p>
      <ReportGenerator />
    </div>
  );
} 