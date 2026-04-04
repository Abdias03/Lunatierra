import { useTranslation } from 'react-i18next';
import Card from '../shared/Card';

export default function HighlightCard({ recommendationData, onOpenQuestions }) {
  const { t } = useTranslation();
  const topItems = recommendationData.recommendations.slice(0, 2) || [];

  return (
    <Card data-testid="highlight-card" className="highlight-card relative overflow-hidden bg-[linear-gradient(135deg,_rgba(92,138,61,1)_0%,_rgba(62,97,40,1)_62%,_rgba(44,33,20,0.95)_100%)] text-white">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-14 right-6 h-28 w-28 rounded-full bg-white/10" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/75">{t('highlight.eyebrow')}</p>
        <h2 className="mt-2 max-w-[14rem] text-3xl font-semibold leading-tight">{t('highlight.title')}</h2>
        <p className="mt-4 max-w-[17rem] text-sm leading-6 text-white/85">
          {recommendationData.dailyFocus || t('dashboard.loading')}
        </p>

        <div className="mt-5 space-y-3">
          {topItems.map((item, index) => (
            <div key={`${item.title}-${index}`} className="rounded-2xl bg-white/12 px-4 py-3 backdrop-blur">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-white/78">{item.message}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onOpenQuestions}
          className="mt-5 rounded-full bg-white px-4 py-3 text-sm font-semibold text-leaf-700 transition duration-200 hover:-translate-y-0.5 active:scale-95"
        >
          {t('highlight.cta')}
        </button>
      </div>
    </Card>
  );
}
