import ReportFeedback from '@/components/ReportFeedback';

export default function TestFeedbackPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Test AI Report Feedback</h1>
      <p className="text-center mb-8 text-gray-600">
        This page demonstrates the AI-powered report feedback capabilities.
        Paste your report content below to get professional feedback.
      </p>
      <ReportFeedback />
    </div>
  );
} 