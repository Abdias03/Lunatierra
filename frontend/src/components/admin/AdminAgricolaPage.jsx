import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  createAdminCrop,
  createAdminLunarActivity,
  createAdminRecommendation,
  createAdminStage,
  fetchAdminLunarActivities,
  fetchAdminOverview,
  fetchAdminRecommendations,
  fetchAdminStages,
  fetchCropCatalog
} from '../../api';
import Card from '../shared/Card';
import SectionHeader from '../shared/SectionHeader';

const initialCropForm = {
  code: '',
  name: '',
  type: 'ANNUAL',
  description: ''
};

const initialStageForm = {
  cropId: '',
  name: '',
  minDay: '',
  maxDay: '',
  description: ''
};

const initialRecommendationForm = {
  cropId: '',
  stageId: '',
  condition: 'NORMAL',
  type: 'ACTION',
  message: '',
  priority: 1,
  version: 1,
  active: true
};

const initialLunarForm = {
  phase: 'NEW_MOON',
  activity: ''
};

function StatCard({ label, value }) {
  return (
    <Card className="bg-white/92 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-earth-900">{value}</p>
    </Card>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-earth-700">{label}</span>
      <input
        {...props}
        className="w-full rounded-[20px] border border-earth-100 bg-earth-50 px-4 py-3 text-sm text-earth-900 outline-none transition focus:border-leaf-500 focus:bg-white"
      />
    </label>
  );
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-earth-700">{label}</span>
      <textarea
        {...props}
        className="min-h-24 w-full rounded-[20px] border border-earth-100 bg-earth-50 px-4 py-3 text-sm text-earth-900 outline-none transition focus:border-leaf-500 focus:bg-white"
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-earth-700">{label}</span>
      <select
        {...props}
        className="w-full rounded-[20px] border border-earth-100 bg-earth-50 px-4 py-3 text-sm text-earth-900 outline-none transition focus:border-leaf-500 focus:bg-white"
      >
        {children}
      </select>
    </label>
  );
}

export default function AdminAgricolaPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [overview, setOverview] = useState({});
  const [crops, setCrops] = useState([]);
  const [stages, setStages] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [lunarActivities, setLunarActivities] = useState([]);
  const [cropForm, setCropForm] = useState(initialCropForm);
  const [stageForm, setStageForm] = useState(initialStageForm);
  const [recommendationForm, setRecommendationForm] = useState(initialRecommendationForm);
  const [lunarForm, setLunarForm] = useState(initialLunarForm);
  const [saving, setSaving] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAdminData = async () => {
    try {
      setError('');
      const [overviewData, cropData, stageData, recommendationData, lunarData] = await Promise.all([
        fetchAdminOverview(),
        fetchCropCatalog(),
        fetchAdminStages(),
        fetchAdminRecommendations(),
        fetchAdminLunarActivities()
      ]);

      setOverview(overviewData || {});
      setCrops(cropData || []);
      setStages(stageData || []);
      setRecommendations(recommendationData || []);
      setLunarActivities(lunarData || []);
    } catch {
      setError(t('admin.loadError'));
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [i18n.language]);

  useEffect(() => {
    if (!success) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setSuccess(''), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [success]);

  const stageOptions = useMemo(
    () => stages.filter((stage) => String(stage.cropId) === String(recommendationForm.cropId)),
    [stages, recommendationForm.cropId]
  );

  const handleCropSubmit = async (event) => {
    event.preventDefault();
    setSaving('crop');

    try {
      await createAdminCrop(cropForm);
      setCropForm(initialCropForm);
      setSuccess(t('admin.cropSaved'));
      await loadAdminData();
    } catch {
      setError(t('admin.cropSaveError'));
    } finally {
      setSaving('');
    }
  };

  const handleStageSubmit = async (event) => {
    event.preventDefault();
    setSaving('stage');

    try {
      await createAdminStage({
        ...stageForm,
        cropId: Number(stageForm.cropId),
        minDay: Number(stageForm.minDay),
        maxDay: Number(stageForm.maxDay)
      });
      setStageForm(initialStageForm);
      setSuccess(t('admin.stageSaved'));
      await loadAdminData();
    } catch {
      setError(t('admin.stageSaveError'));
    } finally {
      setSaving('');
    }
  };

  const handleRecommendationSubmit = async (event) => {
    event.preventDefault();
    setSaving('recommendation');

    try {
      await createAdminRecommendation({
        ...recommendationForm,
        cropId: recommendationForm.cropId ? Number(recommendationForm.cropId) : null,
        stageId: recommendationForm.stageId ? Number(recommendationForm.stageId) : null,
        priority: Number(recommendationForm.priority),
        version: Number(recommendationForm.version)
      });
      setRecommendationForm(initialRecommendationForm);
      setSuccess(t('admin.recommendationSaved'));
      await loadAdminData();
    } catch {
      setError(t('admin.recommendationSaveError'));
    } finally {
      setSaving('');
    }
  };

  const handleLunarSubmit = async (event) => {
    event.preventDefault();
    setSaving('lunar');

    try {
      await createAdminLunarActivity(lunarForm);
      setLunarForm(initialLunarForm);
      setSuccess(t('admin.lunarSaved'));
      await loadAdminData();
    } catch {
      setError(t('admin.lunarSaveError'));
    } finally {
      setSaving('');
    }
  };

  return (
    <main data-testid="admin-agricola-page" className="admin-agricola-page min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,231,199,0.55),_rgba(247,242,231,0.95)_32%,_#efe2cf_100%)] px-4 pb-16 pt-6 text-earth-900">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-earth-800 shadow-sm backdrop-blur transition hover:bg-white active:scale-95"
        >
          ← {t('common.back')}
        </button>

        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-500">{t('admin.internal')}</p>
          <h1 className="text-3xl font-semibold">{t('admin.title')}</h1>
          <p className="max-w-2xl text-sm leading-6 text-earth-700">{t('admin.subtitle')}</p>
        </header>

        {error ? (
          <Card className="border-rose-200 bg-rose-50/95 p-4">
            <p className="text-sm text-rose-700">{error}</p>
          </Card>
        ) : null}

        {success ? (
          <Card className="border-leaf-200 bg-leaf-50/95 p-4">
            <p className="text-sm text-earth-800">{success}</p>
          </Card>
        ) : null}

        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label={t('admin.stats.users')} value={overview.totalUsers ?? 0} />
          <StatCard label={t('admin.stats.activeToday')} value={overview.activeToday ?? 0} />
          <StatCard label={t('admin.stats.activeWeek')} value={overview.activeThisWeek ?? 0} />
          <StatCard label={t('admin.stats.crops')} value={overview.totalCrops ?? 0} />
          <StatCard label={t('admin.stats.stages')} value={overview.totalStages ?? 0} />
          <StatCard label={t('admin.stats.rules')} value={overview.totalRecommendations ?? 0} />
          <StatCard label={t('admin.stats.lunar')} value={overview.totalLunarActivities ?? 0} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.catalogEyebrow')} title={t('admin.newCrop')} />
            <form className="mt-4 space-y-4" onSubmit={handleCropSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t('admin.code')} value={cropForm.code} onChange={(e) => setCropForm((c) => ({ ...c, code: e.target.value }))} placeholder="TOMATO" required />
                <Input label={t('admin.displayName')} value={cropForm.name} onChange={(e) => setCropForm((c) => ({ ...c, name: e.target.value }))} placeholder="Jitomate" required />
              </div>
              <Select label={t('admin.type')} value={cropForm.type} onChange={(e) => setCropForm((c) => ({ ...c, type: e.target.value }))}>
                <option value="ANNUAL">ANNUAL</option>
                <option value="PERENNIAL">PERENNIAL</option>
              </Select>
              <Textarea label={t('admin.description')} value={cropForm.description} onChange={(e) => setCropForm((c) => ({ ...c, description: e.target.value }))} />
              <button type="submit" disabled={saving === 'crop'} className="w-full rounded-full bg-leaf-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-leaf-700 active:scale-95">
                {saving === 'crop' ? t('admin.save') : t('admin.addCrop')}
              </button>
            </form>
          </Card>

          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.stagesEyebrow')} title={t('admin.newStage')} />
            <form className="mt-4 space-y-4" onSubmit={handleStageSubmit}>
              <Select label={t('admin.crop')} value={stageForm.cropId} onChange={(e) => setStageForm((c) => ({ ...c, cropId: e.target.value }))} required>
                <option value="">{t('admin.selectCrop')}</option>
                {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.displayName}</option>)}
              </Select>
              <Input label={t('admin.stageName')} value={stageForm.name} onChange={(e) => setStageForm((c) => ({ ...c, name: e.target.value }))} placeholder={i18n.language.startsWith('es') ? 'Floración' : 'Flowering'} required />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label={t('admin.minDay')} type="number" value={stageForm.minDay} onChange={(e) => setStageForm((c) => ({ ...c, minDay: e.target.value }))} required />
                <Input label={t('admin.maxDay')} type="number" value={stageForm.maxDay} onChange={(e) => setStageForm((c) => ({ ...c, maxDay: e.target.value }))} required />
              </div>
              <Textarea label={t('admin.description')} value={stageForm.description} onChange={(e) => setStageForm((c) => ({ ...c, description: e.target.value }))} required />
              <button type="submit" disabled={saving === 'stage'} className="w-full rounded-full bg-earth-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-earth-800 active:scale-95">
                {saving === 'stage' ? t('admin.save') : t('admin.addStage')}
              </button>
            </form>
          </Card>

          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.rulesEyebrow')} title={t('admin.newRecommendation')} />
            <form className="mt-4 space-y-4" onSubmit={handleRecommendationSubmit}>
              <Select label={t('admin.crop')} value={recommendationForm.cropId} onChange={(e) => setRecommendationForm((c) => ({ ...c, cropId: e.target.value, stageId: '' }))}>
                <option value="">{t('admin.general')}</option>
                {crops.map((crop) => <option key={crop.id} value={crop.id}>{crop.displayName}</option>)}
              </Select>
              <Select label={t('admin.stageName')} value={recommendationForm.stageId} onChange={(e) => setRecommendationForm((c) => ({ ...c, stageId: e.target.value }))}>
                <option value="">{t('admin.allStages')}</option>
                {stageOptions.map((stage) => <option key={stage.id} value={stage.id}>{`${stage.cropName} · ${stage.stageName}`}</option>)}
              </Select>
              <div className="grid gap-4 sm:grid-cols-2">
                <Select label={t('admin.condition')} value={recommendationForm.condition} onChange={(e) => setRecommendationForm((c) => ({ ...c, condition: e.target.value }))}>
                  {['NORMAL', 'RAIN_HIGH', 'RAIN_LOW', 'HUMID', 'DRY', 'HEAT_HIGH', 'LOW_WATER', 'ANY'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
                <Select label={t('admin.type')} value={recommendationForm.type} onChange={(e) => setRecommendationForm((c) => ({ ...c, type: e.target.value }))}>
                  {['ACTION', 'OBSERVATION', 'WARNING'].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </Select>
              </div>
              <Textarea label={t('admin.message')} value={recommendationForm.message} onChange={(e) => setRecommendationForm((c) => ({ ...c, message: e.target.value }))} required />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label={t('admin.priority')} type="number" value={recommendationForm.priority} onChange={(e) => setRecommendationForm((c) => ({ ...c, priority: e.target.value }))} />
                <Input label={t('admin.version')} type="number" value={recommendationForm.version} onChange={(e) => setRecommendationForm((c) => ({ ...c, version: e.target.value }))} />
                <Select label={t('admin.active')} value={recommendationForm.active ? 'true' : 'false'} onChange={(e) => setRecommendationForm((c) => ({ ...c, active: e.target.value === 'true' }))}>
                  <option value="true">{t('admin.yes')}</option>
                  <option value="false">{t('admin.no')}</option>
                </Select>
              </div>
              <button type="submit" disabled={saving === 'recommendation'} className="w-full rounded-full bg-leaf-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-leaf-700 active:scale-95">
                {saving === 'recommendation' ? t('admin.save') : t('admin.addRecommendation')}
              </button>
            </form>
          </Card>

          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.moonEyebrow')} title={t('admin.newLunar')} />
            <form className="mt-4 space-y-4" onSubmit={handleLunarSubmit}>
              <Select label={t('admin.moonPhase')} value={lunarForm.phase} onChange={(e) => setLunarForm((c) => ({ ...c, phase: e.target.value }))}>
                {['NEW_MOON', 'WAXING_CRESCENT', 'FIRST_QUARTER', 'WAXING_GIBBOUS', 'FULL_MOON', 'WANING_GIBBOUS', 'LAST_QUARTER', 'WANING_CRESCENT'].map((phase) => (
                  <option key={phase} value={phase}>{phase}</option>
                ))}
              </Select>
              <Textarea label={t('admin.suggestedActivity')} value={lunarForm.activity} onChange={(e) => setLunarForm((c) => ({ ...c, activity: e.target.value }))} required />
              <button type="submit" disabled={saving === 'lunar'} className="w-full rounded-full bg-earth-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-earth-800 active:scale-95">
                {saving === 'lunar' ? t('admin.save') : t('admin.addLunar')}
              </button>
            </form>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.usersEyebrow')} title={t('admin.activeUsers')} />
            <div className="mt-4 space-y-3">
              {overview.recentUsers?.length ? (
                overview.recentUsers.map((user) => (
                  <div key={user.id} className="rounded-[20px] bg-earth-50 px-4 py-3">
                    <p className="text-sm font-semibold text-earth-900">{user.name}</p>
                    <p className="mt-1 text-xs text-earth-600">{user.email || t('admin.noEmail')}</p>
                    <p className="mt-2 text-xs text-earth-500">
                      {t('admin.streakLine', { count: user.streakCount || 0, date: user.lastCheckDate || t('admin.noActivity') })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-earth-600">{t('admin.emptyUsers')}</p>
              )}
            </div>
          </Card>

          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.currentCatalog')} title={t('admin.registeredCrops')} />
            <div className="mt-4 space-y-3">
              {crops.map((crop) => (
                <div key={crop.id} className="rounded-[20px] bg-earth-50 px-4 py-3">
                  <p className="text-sm font-semibold text-earth-900">{`${crop.displayName} · ${crop.code}`}</p>
                  <p className="mt-1 text-xs text-earth-600">{crop.description || t('admin.noDescription')}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.savedStages')} title={t('admin.quickView')} />
            <div className="mt-4 max-h-[28rem] space-y-3 overflow-auto pr-1">
              {stages.map((stage) => (
                <div key={stage.id} className="rounded-[20px] bg-earth-50 px-4 py-3">
                  <p className="text-sm font-semibold text-earth-900">{`${stage.cropName} · ${stage.stageName}`}</p>
                  <p className="mt-1 text-xs text-earth-600">{t('admin.daysRange', { min: stage.minDay, max: stage.maxDay })}</p>
                  <p className="mt-2 text-xs leading-5 text-earth-500">{stage.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.savedRules')} title={t('admin.recommendations')} />
            <div className="mt-4 max-h-[28rem] space-y-3 overflow-auto pr-1">
              {recommendations.map((recommendation) => (
                <div key={recommendation.id} className="rounded-[20px] bg-earth-50 px-4 py-3">
                  <p className="text-sm font-semibold text-earth-900">{`${recommendation.cropName} · ${recommendation.stageName}`}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-earth-500">{`${recommendation.type} · ${recommendation.condition}`}</p>
                  <p className="mt-2 text-sm leading-6 text-earth-700">{recommendation.message}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <Card className="bg-white/92 p-5">
            <SectionHeader eyebrow={t('admin.lunarCalendar')} title={t('admin.registeredActivities')} />
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {lunarActivities.map((activity) => (
                <div key={activity.id} className="rounded-[20px] bg-earth-50 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-earth-500">{activity.phase}</p>
                  <p className="mt-2 text-sm text-earth-800">{activity.activity}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

