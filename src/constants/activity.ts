export const ACTIVITY_LABELS = {
  competency_development_activities: 'กิจกรรมเสริมสร้างสมรรถนะ',
  health: 'สุขภาพ',
  interpersonal_relationships_and_communication: 'ความสัมพันธ์ระหว่างบุคคลและการสื่อสาร',
  thinking_and_learning: 'การคิดและการเรียนรู้',
  virtue: 'คุณธรรมจริยธรรม',
  social_activities: 'กิจกรรมสังคม',
  university_activities: 'กิจกรรมมหาวิทยาลัย'
} as const;


export const ACTIVITY_COLORS = {
   competency_development_activities: {
    dark: "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30",
    light: "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
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