import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QuickQuestionI18n({ onAsk, loading, answer }) {
  const { t } = useTranslation();
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
      <form className="space-y-4" onSubmit={submit}>
        <textarea
          rows="3"
          className="w-full rounded-[22px] border border-white/60 bg-white/80 px-4 py-4 text-base text-earth-900 outline-none transition focus:border-sky-500 focus:bg-white"
          placeholder={t('quickQuestion.placeholder')}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-[24px] bg-sky-500 px-4 py-4 text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-sky-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-sky-500/60"
        >
          {loading ? t('quickQuestion.thinking') : t('quickQuestion.submit')}
        </button>
      </form>

      {answer ? <p className="rounded-[22px] bg-white/75 p-4 text-sm leading-6 text-sky-700 shadow-sm">{answer}</p> : null}
    </div>
  );
}
