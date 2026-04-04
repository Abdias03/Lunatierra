import { useTranslation } from 'react-i18next';
import MitziAvatar from '../plant/MitziAvatar';

export default function FloatingMitziBubble({
  visible = false,
  level = 1,
  mood = 'neutral',
  message = '',
  cropName = '',
  dayLabel = '',
  success = false,
  reviewing = false,
  onReview,
  onOpenDetail
}) {
  const { t } = useTranslation();

  if (!visible) {
    return null;
  }

  return (
    <div
      data-testid="floating-mitzi-bubble"
      className="floating-mitzi-bubble pointer-events-none fixed bottom-[90px] right-4 z-40 w-[min(260px,calc(100vw-1.5rem))]"
    >
      <div
        className={`pointer-events-auto rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,255,255,0.98)_0%,_rgba(245,249,239,0.98)_100%)] px-3.5 py-3 shadow-[0_14px_32px_rgba(52,40,26,0.14)] backdrop-blur-sm ${
          success ? 'reward-bloom' : 'mitzi-bubble-enter'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] bg-leaf-50 shadow-[0_8px_18px_rgba(82,122,46,0.10)]">
            <MitziAvatar level={level} mood={mood} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-earth-500">
                Mitzi
              </p>
              {cropName ? (
                <span className="rounded-full bg-earth-50 px-2 py-0.5 text-[10px] font-semibold text-earth-700">
                  {cropName}
                </span>
              ) : null}
            </div>

            {dayLabel ? (
              <p className="mt-0.5 text-[11px] font-medium text-earth-500">{dayLabel}</p>
            ) : null}

            <p className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-5 text-earth-900">
              {message}
            </p>

            <div className="mt-2.5 flex items-center gap-1.5">
              <button
                type="button"
                onClick={onReview}
                disabled={reviewing || success}
                className={`reward-button inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[12px] font-semibold transition active:scale-[0.96] ${
                  success
                    ? 'reward-success bg-[#6FAE4F] text-white shadow-[0_10px_22px_rgba(111,174,79,0.22)]'
                    : 'bg-earth-900 text-white shadow-[0_10px_22px_rgba(48,36,24,0.18)] hover:-translate-y-0.5'
                }`}
              >
                {reviewing
                  ? t('today.reviewing')
                  : success
                    ? t('mitzi.checkedSuccess')
                    : t('mitzi.checkedAction')}
              </button>

              <button
                type="button"
                onClick={onOpenDetail}
                className="inline-flex items-center justify-center rounded-full bg-earth-50 px-3 py-1.5 text-[12px] font-semibold text-earth-800 transition hover:bg-earth-100 active:scale-[0.97]"
              >
                {t('mitzi.viewDetail')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
