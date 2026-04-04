import PlantVisual from './PlantVisual';

export default function PlantStageIllustration({ stageName, animateGrowth = false }) {
  return <PlantVisual stage={stageName} animateGrowth={animateGrowth} />;
}
