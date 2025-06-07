export const ACTIVITY_LABELS = {
  competency_development_activities: 'กิจกรรมเสริมสร้างสมรรถนะ',
  social_activities: 'กิจกรรมสังคม',
  university_activities: 'กิจกรรมมหาวิทยาลัย'
} as const;

export const competencyNames = {
  health: "สุขภาพ",
  virtue: "คุณธรรมจริยธรรม",
  thinking_and_learning: "การคิดและการเรียนรู้",
  interpersonal_relationships_and_communication: "ความสัมพันธ์ระหว่างบุคคลและการสื่อสาร",
} as const;


export const ACTIVITY_COLORS = {
  competency_development_activities: {
    dark: "bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/30",
    light: "bg-purple-50 text-purple-600 ring-1 ring-purple-200"
  },
  social_activities: {
    dark: "bg-orange-500/20 text-orange-300 ring-1 ring-orange-500/30",
    light: "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
  },
  university_activities: {
    dark: "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30",
    light: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
  }
} as const;

export const ACTIVITY_TYPE_COLORS = {
  competency_development_activities: '#8B5CF6',
  social_activities: '#F59E0B', 
  university_activities: '#10B981'
} as const;