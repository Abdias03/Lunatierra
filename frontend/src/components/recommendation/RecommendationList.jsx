import { useTranslation } from 'react-i18next';

const severityStyles = {
  success: 'bg-leaf-100 text-leaf-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-sky-100 text-sky-700',
};

export default function RecommendationList({ items }) {
  const { t } = useTranslation();

  if (!items.length) {
    return <p className="text-sm text-earth-700">{t('recommendations.noRecommendations')}</p>;
  }

  return (
    <div data-testid="recommendation-list-basic" className="recommendation-list-basic space-y-3">
      {items.map((item, index) => (
        <article key={`${item.title}-${index}`} className="rounded-3xl bg-earth-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-earth-900">{item.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityStyles[item.severity]}`}>
              {item.severity}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-earth-700">{item.message}</p>
        </article>
      ))}
    </div>
  );
}
