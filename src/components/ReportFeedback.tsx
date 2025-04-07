'use client';

import { useState } from 'react';

export function ReportFeedback() {
  const [loading, setLoading] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch('/api/ai/generate-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportContent,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate feedback');
      }

      const data = await response.json();
      setFeedback(data.feedback);
    } catch (err) {
      setError('An error occurred while generating feedback. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Report Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reportContent" className="block text-sm font-medium mb-1">
            Report Content
          </label>
          <textarea
            id="reportContent"
            rows={10}
            className="w-full border rounded-md p-2"
            value={reportContent}
            onChange={(e) => setReportContent(e.target.value)}
            placeholder="Paste the engineering report content here to get AI feedback"
            required
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
          {loading ? 'Generating Feedback...' : 'Get AI Feedback'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {feedback && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">AI Feedback</h3>
          <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-wrap">{feedback}</div>
        </div>
      )}
    </div>
  );
}

export default ReportFeedback; 