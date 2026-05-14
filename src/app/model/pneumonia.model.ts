// models/pneumonia.model.ts
export interface ActivatedZone {
  name:      string;
  intensity: 'élevée' | 'modérée';
  score:     number;
}

export interface AttentionAnalysis {
  activated_zones: ActivatedZone[];
  dominant_zone:   string;
  narrative:       string;
}

export interface ClinicalInterpretation {
  alert_level:          'ALERTE' | 'NORMAL';
  summary:              string;
  professional_message: string;
  attention_analysis:   AttentionAnalysis;
}

export interface PneumoniaResponse {
  prediction:     'NORMAL' | 'PNEUMONIA';
  confidence:     number;
  raw:            { normal: number; pneumonia: number };
  clinical:       ClinicalInterpretation;
  heatmap_base64: string;
}
