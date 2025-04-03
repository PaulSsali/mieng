'use client';

import { useState } from 'react';

export function ReportFormatter() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [selectedModel, setSelectedModel] = useState('anthropic');
  const [formattedContent, setFormattedContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFormattedContent('');

    try {
      const response = await fetch('/api/ai/format-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to format report');
      }

      const data = await response.json();
      setFormattedContent(data.content);
    } catch (err) {
      setError('An error occurred while formatting the report. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">AI Report Formatter</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            Report Content
          </label>
          <textarea
            id="content"
            rows={10}
            className="w-full border rounded-md p-2"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your draft report content here to improve formatting"
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
          {loading ? 'Formatting...' : 'Format Report'}
        </button>
      </form>

      {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      {formattedContent && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Formatted Report</h3>
          <div className="border rounded-md p-4 bg-gray-50 whitespace-pre-wrap">{formattedContent}</div>
        </div>
      )}
    </div>
  );
}

export default ReportFormatter; 