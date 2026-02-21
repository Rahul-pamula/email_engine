export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  compiledHtml?: string;
  design?: any;
}

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    "id": "blank",
    "name": "Blank Canvas",
    "description": "Start from scratch with a clean slate.",
    "category": "general"
  }
];
