import { forwardRef } from 'react';
import { PosterTemplate, PosterTemplateProps } from './PosterTemplate';
import {
  RoyalNavyGoldTemplate,
  CrimsonBoldYouthTemplate,
  EmeraldGramVikasTemplate,
  TricolorRashtriyaGauravTemplate,
  RoyalPurpleEliteTemplate,
  MaroonHeritageTemplate,
  WhatsAppStatusTemplate,
  SquareSocialPostTemplate,
  GrandVictoryHoardingTemplate,
  GramVikasSankalpPatrikaTemplate,
} from './NewTemplates';
import { DesignTemplate } from '../../types';

export interface StudioTemplateRendererProps extends PosterTemplateProps {
  template?: DesignTemplate | null;
}

export function getTemplateDimensions(template?: DesignTemplate | null): { width: number; height: number } {
  if (!template) return { width: 1080, height: 1350 };
  const name = template.name.toLowerCase();
  const id = (template.id || '').toLowerCase();

  if (name.includes('whatsapp') || id.includes('whatsapp')) return { width: 1080, height: 1920 };
  if (name.includes('square') || id.includes('square')) return { width: 1080, height: 1080 };
  if (name.includes('hoarding') || id.includes('hoarding')) return { width: 1920, height: 1080 };
  if (name.includes('patrika') || id.includes('patrika')) return { width: 1080, height: 1528 };
  if (name.includes('banner') || id.includes('banner')) return { width: 1774, height: 887 };
  if (name.includes('id card') || id.includes('id-card')) return { width: 1536, height: 1024 };
  if (name.includes('pamphlet') || id.includes('pamphlet')) return { width: 1054, height: 1492 };

  return { width: 1080, height: 1350 };
}

export const StudioTemplateRenderer = forwardRef<HTMLDivElement, StudioTemplateRendererProps>(
  ({ template, ...props }, ref) => {
    const name = (template?.name || '').toLowerCase();
    const id = (template?.id || '').toLowerCase();

    // 10 New Templates
    if (name.includes('navy') || id.includes('navy')) {
      return <RoyalNavyGoldTemplate ref={ref} {...props} />;
    }
    if (name.includes('crimson') || id.includes('crimson') || name.includes('youth')) {
      return <CrimsonBoldYouthTemplate ref={ref} {...props} />;
    }
    if (name.includes('emerald') || id.includes('emerald') || (name.includes('vikas') && name.includes('poster'))) {
      return <EmeraldGramVikasTemplate ref={ref} {...props} />;
    }
    if (name.includes('tricolor') || id.includes('tricolor') || name.includes('gaurav')) {
      return <TricolorRashtriyaGauravTemplate ref={ref} {...props} />;
    }
    if (name.includes('purple') || id.includes('purple') || name.includes('elite')) {
      return <RoyalPurpleEliteTemplate ref={ref} {...props} />;
    }
    if (name.includes('maroon') || id.includes('maroon') || name.includes('heritage')) {
      return <MaroonHeritageTemplate ref={ref} {...props} />;
    }
    if (name.includes('whatsapp') || id.includes('whatsapp') || name.includes('status')) {
      return <WhatsAppStatusTemplate ref={ref} {...props} />;
    }
    if (name.includes('square') || id.includes('square') || name.includes('social')) {
      return <SquareSocialPostTemplate ref={ref} {...props} />;
    }
    if (name.includes('hoarding') || id.includes('hoarding') || (name.includes('grand') && name.includes('banner'))) {
      return <GrandVictoryHoardingTemplate ref={ref} {...props} />;
    }
    if (name.includes('patrika') || id.includes('patrika') || name.includes('manifesto')) {
      return <GramVikasSankalpPatrikaTemplate ref={ref} {...props} />;
    }

    // Default / Original 4 templates render the original PosterTemplate (untouched)
    return <PosterTemplate ref={ref} {...props} />;
  }
);

StudioTemplateRenderer.displayName = 'StudioTemplateRenderer';
