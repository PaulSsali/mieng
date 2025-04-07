'use client';

import { useState } from 'react';

export function ReportGenerator() {
  const [loading, setLoading] = useState(false);
  const [projectContext, setProjectContext] = useState('');
  const [engineeringDetails, setEngineeringDetails] = useState('');
  const [reportType, setReportType] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic');
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedContent('');

    try {
      const response = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectContext,
          engineeringDetails,
          reportType,
          additionalInstructions,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
    } catch (err) {
      setError('An error occurred while generating the report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Report Generator</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectContext" className="block text-sm font-medium mb-1">
            Project Context
          </label>
          <textarea
            id="projectContext"
            rows={3}
            className="w-full border rounded-md p-2"
            value={projectContext}
            onChange={(e) => setProjectContext(e.target.value)}
            placeholder="Describe the project context and background"
            required
          />
        </div>

        <div>
          <label htmlFor="engineeringDetails" className="block text-sm font-medium mb-1">
            Engineering Details
          </label>
          <textarea
            id="engineeringDetails"
            rows={5}
            className="w-full border rounded-md p-2"
            value={engineeringDetails}
            onChange={(e) => setEngineeringDetails(e.target.value)}
            placeholder="Enter specific engineering details, measurements, observations, etc."
            required
          />
        </div>

        <div>
          <label htmlFor="reportType" className="block text-sm font-medium mb-1">
            Report Type
          </label>
          <select
            id="reportType"
            className="w-full border rounded-md p-2"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            required
          >
            <option value="">Select Report Type</option>
            <option value="Initial Assessment">Initial Assessment</option>
            <option value="Progress Report">Progress Report</option>
            <option value="Environmental Impact">Environmental Impact</option>
            <option value="Technical Design">Technical Design</option>
            <option value="Final Project Report">Final Project Report</option>
          </select>
        </div>

        <div>
          <label htmlFor="additionalInstructions" className="block text-sm font-medium mb-1">
            Additional Instructions (Optional)
          </label>
          <textarea
            id="additionalInstructions"
            rows={2}
            className="w-full border rounded-md p-2"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Any specific instructions or requirements for the report"
          />
        </div>

        <div>
          <label htmlFor="aiModel" className="block text-sm font-medium mb-1">
            AI Model
          </label>
          <select
            id="aiModel"
            className="w-full border rounded-md p-2"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="anthropic">Anthropic Claude</option>
            <option value="deepseek">DeepSeek AI</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {generatedContent && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Generated Report</h3>
          <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-wrap">{generatedContent}</div>
        </div>
      )}
    </div>
  );
}

export default ReportGenerator; 