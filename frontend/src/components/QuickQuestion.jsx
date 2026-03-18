import { useState } from 'react';

export default function QuickQuestion({ onAsk, loading, answer }) {
  const [question, setQuestion] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }

    await onAsk(question);
  };

  return (
    <div className="space-y-4">
      <form className="space-y-3" onSubmit={submit}>
        <textarea
          rows="3"
          className="w-full rounded-2xl border border-earth-100 bg-earth-50 px-4 py-3 text-base text-earth-900 outline-none transition focus:border-sky-500"
          placeholder="Why is my plant yellow?"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-base font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-sky-500/60"
        >
          {loading ? 'Thinking...' : 'Ask a simple question'}
        </button>
      </form>

      {answer ? <p className="rounded-2xl bg-sky-100 p-4 text-sm leading-6 text-sky-700">{answer}</p> : null}
    </div>
  );
}
