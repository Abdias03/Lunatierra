import { useTranslation } from 'react-i18next';

const severityStyles = {
  success: 'bg-leaf-100 text-leaf-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-sky-100 text-sky-700'
};

export default function RecommendationListI18n({ items }) {
  const { t } = useTranslation();

  if (!items.length) {
    return <p data-testid="recommendation-list-empty" className="text-sm text-earth-700">{t('recommendations.empty')}</p>;
  }

  return (
    <div data-testid="recommendation-list" className="recommendation-list space-y-3">
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className="rounded-[24px] border border-white/70 bg-white/86 p-4 shadow-card transition duration-200 hover:-translate-y-0.5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-earth-900">{item.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyles[item.severity]}`}>
              {t(`recommendations.severity.${item.severity}`, item.severity)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-earth-700">{item.message}</p>
        </article>
      ))}
    </div>
  );
}
