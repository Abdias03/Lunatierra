import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function QuickQuestionI18n({ onAsk, loading, answer }) {
  const { t } = useTranslation();
  const [question, setQuestion] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const nextQuestion = question.trim();
    if (!nextQuestion) {
      return;
    }

    setLastQuestion(nextQuestion);
    await onAsk(nextQuestion);
    setQuestion('');
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="mr-8 rounded-[24px] rounded-bl-md border border-white/65 bg-white/82 px-4 py-4 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">{t('quickQuestion.helper')}</p>
          <p className="mt-2 text-sm leading-6 text-earth-700">{t('quickQuestion.prompt')}</p>
        </div>

        {lastQuestion ? (
          <div className="ml-10 rounded-[24px] rounded-br-md bg-sky-500 px-4 py-4 text-white shadow-[0_16px_28px_rgba(56,132,177,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/72">{t('quickQuestion.you')}</p>
            <p className="mt-2 text-sm leading-6 text-white">{lastQuestion}</p>
          </div>
        ) : null}

        {answer ? (
          <div className="mr-8 rounded-[24px] rounded-bl-md border border-white/65 bg-white/82 px-4 py-4 shadow-sm backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf-700">{t('quickQuestion.helper')}</p>
            <p className="mt-2 text-sm leading-6 text-earth-700">{answer}</p>
          </div>
        ) : null}
      </div>

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
    </div>
  );
}
