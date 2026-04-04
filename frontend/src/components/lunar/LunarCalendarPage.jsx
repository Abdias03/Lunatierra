import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchLunarCalendar, fetchLunarDayInsight } from '../../api';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';

const PHASE_META = {
  NEW_MOON: { icon: '🌑' },
  WAXING_CRESCENT: { icon: '🌒' },
  FIRST_QUARTER: { icon: '🌓' },
  WAXING_GIBBOUS: { icon: '🌒' },
  FULL_MOON: { icon: '🌕' },
  WANING_GIBBOUS: { icon: '🌘' },
  LAST_QUARTER: { icon: '🌘' },
  WANING_CRESCENT: { icon: '🌘' }
};

function getPhaseMeta(phase, displayName) {
  return PHASE_META[phase] || { icon: '🌙', short: displayName || 'Moon' };
}

function toLocalDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  const [year, month, day] = String(value).split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function toLocalDateKey(value) {
  const localDate = toLocalDate(value);
  return localDate ? localDate.toLocaleDateString('en-CA') : '';
}

function isSameDay(firstDate, secondDate) {
  if (!firstDate || !secondDate) {
    return false;
  }

  return firstDate.getFullYear() === secondDate.getFullYear()
    && firstDate.getMonth() === secondDate.getMonth()
    && firstDate.getDate() === secondDate.getDate();
}

function buildGridDays(year, month, calendarDays) {
  const firstDay = new Date(year, month - 1, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const blanks = Array.from({ length: offset }, (_, index) => ({
    key: `blank-${index}`,
    empty: true
  }));

  return [
    ...blanks,
    ...calendarDays.map((day) => ({
      ...day,
      key: day.date,
      empty: false
    }))
  ];
}

function buildInterpretation(day, t) {
  const topActivity = day?.activities?.[0];

  if (!topActivity) {
    return t('lunarCalendar.todayCalm');
  }

  return t('lunarCalendar.todayInterpretation', { action: topActivity.toLowerCase() });
}

export default function LunarCalendarPage({
  lunarData,
  locationLabel = 'San Luis Acatlán, Guerrero'
}) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const localToday = useMemo(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }, []);
  const swipeStartX = useRef(0);
  const swipeLocked = useRef(false);

  const [viewDate, setViewDate] = useState(() => new Date(localToday.getFullYear(), localToday.getMonth(), 1));
  const [calendarDays, setCalendarDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(localToday);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transitionClass, setTransitionClass] = useState('lunar-month-enter');
  const [selectionFxDay, setSelectionFxDay] = useState('');
  const [bounceDay, setBounceDay] = useState('');
  const [dayInsight, setDayInsight] = useState(null);
  const [insightTransitionClass, setInsightTransitionClass] = useState('lunar-insight-enter');

  const weekDays = useMemo(() => t('lunarCalendar.weekDays', { returnObjects: true }), [t]);
  const monthFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language.startsWith('en') ? 'en-US' : 'es-MX', { month: 'long', year: 'numeric' }),
    [i18n.language]
  );

  useEffect(() => {
    let active = true;

    const loadCalendar = async () => {
      try {
        setLoading(true);
        setError('');
        const month = viewDate.getMonth() + 1;
        const year = viewDate.getFullYear();
        const response = await fetchLunarCalendar(month, year);

        if (!active) {
          return;
        }

        setCalendarDays(response);
        setSelectedDate((current) => {
          const currentMatch = response.find((item) => isSameDay(toLocalDate(item.date), current));
          if (currentMatch) {
            return toLocalDate(currentMatch.date);
          }

          const todayMatch = response.find((item) => isSameDay(toLocalDate(item.date), localToday));
          if (todayMatch) {
            return toLocalDate(todayMatch.date);
          }

          return response[0] ? toLocalDate(response[0].date) : localToday;
        });
      } catch {
        if (active) {
          setError(t('lunarCalendar.loadError'));
          setCalendarDays([]);
          setSelectedDate(localToday);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadCalendar();

    return () => {
      active = false;
    };
  }, [localToday, t, viewDate]);

  useEffect(() => {
    if (!transitionClass) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setTransitionClass('');
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, [transitionClass]);

  useEffect(() => {
    if (!selectionFxDay) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setSelectionFxDay('');
    }, 240);

    return () => window.clearTimeout(timeoutId);
  }, [selectionFxDay]);

  useEffect(() => {
    if (!bounceDay) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setBounceDay('');
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [bounceDay]);

  useEffect(() => {
    if (!selectedDate) {
      return undefined;
    }

    let active = true;
    setInsightTransitionClass('lunar-insight-out');

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetchLunarDayInsight(toLocalDateKey(selectedDate));

        if (!active) {
          return;
        }

        setDayInsight(response);
        setInsightTransitionClass('lunar-insight-in');
      } catch {
        if (active) {
          setDayInsight(null);
          setInsightTransitionClass('lunar-insight-in');
        }
      }
    }, 120);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [selectedDate]);

  const gridDays = useMemo(
    () => buildGridDays(viewDate.getFullYear(), viewDate.getMonth() + 1, calendarDays),
    [calendarDays, viewDate]
  );

  const selectedDay = useMemo(
    () => calendarDays.find((day) => isSameDay(toLocalDate(day.date), selectedDate)) || null,
    [calendarDays, selectedDate]
  );

  const currentPhase = selectedDay?.phase || lunarData.phase;
  const currentDisplayName = selectedDay?.displayName || lunarData.displayName || t('lunarCalendar.headerEyebrow');
  const currentPhaseMeta = getPhaseMeta(currentPhase, currentDisplayName);
  const selectedActivities = dayInsight?.actions?.slice(0, 3)
    || selectedDay?.activities?.slice(0, 3)
    || lunarData.activities?.slice(0, 3)
    || [];
  const recommendedCrops = dayInsight?.recommendedCrops?.slice(0, 3)
    || selectedDay?.crops?.slice(0, 3)
    || lunarData.recommendedCrops?.slice(0, 3)
    || [];
  const avoidActions = dayInsight?.avoid?.slice(0, 2) || [];
  const monthLabel = monthFormatter.format(viewDate);

  const changeMonth = (direction) => {
    setTransitionClass(direction === 'next' ? 'lunar-month-slide-left' : 'lunar-month-slide-right');
    setViewDate((current) => new Date(
      current.getFullYear(),
      current.getMonth() + (direction === 'next' ? 1 : -1),
      1
    ));
  };

  const handlePointerDown = (event) => {
    swipeLocked.current = false;
    swipeStartX.current = event.clientX;
  };

  const handlePointerUp = (event) => {
    const deltaX = event.clientX - swipeStartX.current;

    if (swipeLocked.current || Math.abs(deltaX) < 40) {
      return;
    }

    swipeLocked.current = true;
    changeMonth(deltaX < 0 ? 'next' : 'previous');
  };

  const handleTouchStart = (event) => {
    swipeLocked.current = false;
    swipeStartX.current = event.touches[0].clientX || 0;
  };

  const handleTouchEnd = (event) => {
    const deltaX = (event.changedTouches[0].clientX || 0) - swipeStartX.current;

    if (swipeLocked.current || Math.abs(deltaX) < 40) {
      return;
    }

    swipeLocked.current = true;
    changeMonth(deltaX < 0 ? 'next' : 'previous');
  };

  const handleSelectDay = (day) => {
    setSelectedDate(toLocalDate(day.date));
    setSelectionFxDay(day.date);
    setBounceDay(day.date);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-14 pt-6 text-earth-900">
      <div className="mx-auto max-w-md space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-[14px] py-2 text-sm font-medium text-[#2F2F2F] shadow-sm backdrop-blur-md transition hover:bg-white/85 active:scale-95"
        >
          ← {t('common.back')}
        </button>

        <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(160deg,_rgba(249,244,223,0.98)_0%,_rgba(255,255,255,0.94)_54%,_rgba(238,229,249,0.96)_100%)] p-5 shadow-[0_24px_50px_rgba(63,46,30,0.12)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-earth-500">{t('lunarCalendar.headerEyebrow')}</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="moon-float text-4xl">{currentPhaseMeta.icon}</span>
            <div>
              <h1 className="text-3xl font-semibold text-earth-900">{currentDisplayName}</h1>
              <p className="mt-1 text-sm leading-6 text-earth-700">{locationLabel}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/70 bg-white/88 p-4 shadow-[0_20px_40px_rgba(63,46,30,0.10)]">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => changeMonth('previous')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-earth-100 text-lg font-semibold text-earth-900 transition hover:bg-earth-200 active:scale-[0.97]"
              aria-label={t('lunarCalendar.previousMonth')}
            >
              ←
            </button>

            <p className="text-base font-semibold capitalize text-earth-900">{monthLabel}</p>

            <button
              type="button"
              onClick={() => changeMonth('next')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-earth-100 text-lg font-semibold text-earth-900 transition hover:bg-earth-200 active:scale-[0.97]"
              aria-label={t('lunarCalendar.nextMonth')}
            >
              →
            </button>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-3">
          {[
            { label: t('lunarCalendar.phaseLegend.full'), icon: '🌕' },
            { label: t('lunarCalendar.phaseLegend.waning'), icon: '🌘' },
            { label: t('lunarCalendar.phaseLegend.new'), icon: '🌑' },
            { label: t('lunarCalendar.phaseLegend.waxing'), icon: '🌒' }
          ].map((item) => (
            <Card key={item.label} className="bg-white/88 p-3 text-center">
              <p className="moon-float text-2xl">{item.icon}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-earth-700">
                {item.label}
              </p>
            </Card>
          ))}
        </section>

        <section
          className="overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-4 shadow-[0_24px_50px_rgba(63,46,30,0.12)]"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="mb-4 grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <p key={day} className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-earth-500">
                {day}
              </p>
            ))}
          </div>

          {loading ? (
            <div className="rounded-[24px] bg-earth-50 px-4 py-8 text-center text-sm text-earth-600">
              {t('lunarCalendar.loading')}
            </div>
          ) : (
            <div className={`grid grid-cols-7 gap-2 ${transitionClass}`}>
              {gridDays.map((day) => {
                if (day.empty) {
                  return <div key={day.key} className="aspect-[0.86]" />;
                }

                const dayDate = toLocalDate(day.date);
                const meta = getPhaseMeta(day.phase, day.displayName);
                const isSelected = isSameDay(dayDate, selectedDate);
                const isToday = isSameDay(dayDate, localToday);
                const hasActivities = (day.activities.length || 0) > 0;
                const isFlashing = selectionFxDay === day.date;
                const isBouncing = bounceDay === day.date;

                return (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`lunar-day-button relative aspect-[0.86] rounded-[22px] border px-2 py-2 text-left ${
                      isSelected
                        ? 'bg-[linear-gradient(180deg,_#86c55a_0%,_#6fae4f_100%)] text-white shadow-[0_16px_32px_rgba(63,46,30,0.18)] scale-[1.05] border-leaf-400 ring-1 ring-white/45'
                        : isToday
                          ? 'today-pulse border-leaf-300 bg-[#f7fbf1] text-earth-900 shadow-[0_0_0_1px_rgba(140,191,79,0.22),0_12px_24px_rgba(98,149,57,0.14)]'
                          : 'border-earth-100 bg-[#fbf8f2] text-earth-900 shadow-[0_8px_18px_rgba(82,62,42,0.08)] hover:bg-white'
                    } ${isBouncing ? 'lunar-day-selected-bounce' : ''}`}
                  >
                    {isFlashing ? <span className="lunar-day-flash" /> : null}

                    <span className={`absolute left-2 top-2 text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-earth-900'}`}>
                      {dayDate.getDate()}
                    </span>

                    <div className="flex h-full items-center justify-center">
                      <span className="moon-float text-[1.35rem] leading-none">{meta.icon}</span>
                    </div>

                    {hasActivities ? (
                      <span className={`absolute bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full ${isSelected ? 'bg-white/90' : 'bg-leaf-500/80'}`} />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {error ? (
          <Card className="border border-rose-200 bg-rose-50/90 p-4">
            <p className="text-sm leading-6 text-rose-700">{error}</p>
          </Card>
        ) : null}

        {selectedDay ? (
          <section className={`space-y-4 reward-bloom ${insightTransitionClass}`}>
            <SectionHeader eyebrow={t('lunarCalendar.selectedEyebrow')} title={selectedDay.displayName} />

            <Card className="bg-[linear-gradient(160deg,_rgba(255,255,255,0.98)_0%,_rgba(246,242,233,0.98)_100%)]">
              <p className="text-sm leading-6 text-earth-700">
                {dayInsight?.message || buildInterpretation(selectedDay, t)}
              </p>
            </Card>

            <Card className="bg-white/92">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('lunarCalendar.actionsEyebrow')}</p>
              <div className="mt-3 space-y-2">
                {selectedActivities.map((activity, index) => (
                  <div key={`${activity}-${index}`} className="flex items-start gap-3 rounded-[20px] bg-earth-50 px-3 py-3">
                    <span className="mt-0.5 text-base">🌱</span>
                    <p className="text-sm leading-6 text-earth-800">{activity}</p>
                  </div>
                ))}
              </div>
            </Card>

            {avoidActions.length ? (
              <Card className="bg-white/92">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('lunarCalendar.avoidEyebrow')}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {avoidActions.map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-2 text-sm font-medium text-earth-900"
                    >
                      <span>🌙</span>
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ) : null}

            <Card className="bg-white/92">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{t('lunarCalendar.cropsEyebrow')}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendedCrops.map((crop, index) => (
                  <span
                    key={`${crop}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-leaf-100 px-3 py-2 text-sm font-medium text-earth-900"
                  >
                    <span>{index === 0 ? '🌽' : index === 1 ? '🌱' : '🎃'}</span>
                    {crop}
                  </span>
                ))}
                {!recommendedCrops.length ? (
                  <p className="text-sm leading-6 text-earth-700">{t('lunarCalendar.noCrops')}</p>
                ) : null}
              </div>
            </Card>
          </section>
        ) : null}
      </div>
    </main>
  );
}

