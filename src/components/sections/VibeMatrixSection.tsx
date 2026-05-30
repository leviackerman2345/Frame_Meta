import {
  PortalGridSection,
  type PortalCard,
} from "@/components/sections/PortalGridSection";

interface VibeMatrixSectionProps {
  cards: PortalCard[];
}

export function VibeMatrixSection({ cards }: VibeMatrixSectionProps) {
  return (
    <PortalGridSection
      title="The Vibe Matrix"
      subtitle="Find shows by mood and atmosphere instead of genre alone."
      cards={cards}
    />
  );
}
