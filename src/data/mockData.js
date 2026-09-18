// Static mock data powering the Mindora investor-demo prototype.
// In a real MVP this would be served from an API backed by a
// clinically-governed data store — nothing here should be treated
// as real patient data.

export const currentUser = {
  name: 'Joshua',
  fullName: 'Joshua Otieno',
  streak: 6,
  wellbeingScore: 72,
  scoreChange: -4,
  lastAssessment: '3 days ago',
}

export const checkInQuestions = [
  {
    id: 'mood',
    domain: 'Mood',
    prompt: 'Little interest or pleasure in doing things.',
  },
  {
    id: 'anxiety',
    domain: 'Anxiety & stress',
    prompt: 'Feeling nervous, anxious, or on edge.',
  },
  {
    id: 'sleep',
    domain: 'Sleep',
    prompt: 'Trouble falling asleep, staying asleep, or sleeping too much.',
  },
  {
    id: 'energy',
    domain: 'Energy',
    prompt: 'Feeling tired or having little energy.',
  },
  {
    id: 'social',
    domain: 'Social connection',
    prompt: 'Withdrawing from friends, family, or people you\u2019re usually close to.',
  },
  {
    id: 'functioning',
    domain: 'Daily functioning',
    prompt: 'Difficulty concentrating on things like work, studies, or daily tasks.',
  },
  {
    id: 'substance',
    domain: 'Substance use',
    prompt: 'Using alcohol or other substances to cope with how you\u2019ve been feeling.',
  },
  {
    id: 'emotional',
    domain: 'Emotional wellbeing',
    prompt: 'Feeling down, hopeless, or unable to shake off low mood.',
  },
  {
    id: 'irritability',
    domain: 'Emotional wellbeing',
    prompt: 'Feeling more irritable or on edge than usual.',
  },
  {
    id: 'outlook',
    domain: 'Emotional wellbeing',
    prompt: 'Feeling uncertain or discouraged about the days ahead.',
  },
  {
    id: 'selfharm',
    domain: 'Emotional wellbeing',
    prompt: 'Thoughts that you would be better off dead, or of hurting yourself in some way.',
  },
]

export const responseOptions = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export const wellbeingTrend = [
  { label: 'Wk 1', stress: 40, mood: 70, sleep: 65, energy: 68 },
  { label: 'Wk 2', stress: 46, mood: 66, sleep: 60, energy: 64 },
  { label: 'Wk 3', stress: 58, mood: 60, sleep: 52, energy: 58 },
  { label: 'Wk 4', stress: 62, mood: 58, sleep: 48, energy: 54 },
  { label: 'Wk 5', stress: 55, mood: 62, sleep: 55, energy: 59 },
  { label: 'Wk 6', stress: 47, mood: 68, sleep: 61, energy: 63 },
]

export const professionals = [
  {
    id: 'p1',
    name: 'Dr. Sarah Mwangi',
    type: 'Clinical Psychologist',
    tags: ['Anxiety', 'Depression', 'Young Adults'],
    experience: 9,
    location: 'Nairobi, Kenya',
    mode: 'Online / In-person',
    availability: 'Available tomorrow',
    fee: 3000,
    verified: true,
    languages: ['English', 'Swahili'],
    bio: 'Dr. Sarah Mwangi is a clinical psychologist with 9 years of experience supporting young adults through anxiety, depression, and major life transitions. She integrates cognitive-behavioural approaches with a warm, collaborative style.',
    qualifications: ['PhD, Clinical Psychology — University of Nairobi', 'Licensed Clinical Psychologist, Kenya Psychological Association'],
    focus: ['Anxiety disorders', 'Depression', 'Life transitions', 'Young adult mental health'],
    slots: ['Tomorrow, 9:00 AM', 'Tomorrow, 11:30 AM', 'Thu, 2:00 PM', 'Fri, 10:00 AM'],
  },
  {
    id: 'p2',
    name: 'Dr. Kevin Otieno',
    type: 'Psychiatrist',
    tags: ['Depression', 'Substance use'],
    experience: 14,
    location: 'Mombasa, Kenya',
    mode: 'Online',
    availability: 'Available this week',
    fee: 5500,
    verified: true,
    languages: ['English', 'Swahili'],
    bio: 'Dr. Kevin Otieno is a consultant psychiatrist specialising in mood disorders and substance use, with a focus on integrated medical and psychological care.',
    qualifications: ['MBChB, MMed Psychiatry — University of Nairobi', 'Registered, Kenya Medical Practitioners and Dentists Council'],
    focus: ['Mood disorders', 'Substance use', 'Medication management'],
    slots: ['Wed, 1:00 PM', 'Thu, 4:00 PM', 'Fri, 9:30 AM'],
  },
  {
    id: 'p3',
    name: 'Faith Chebet',
    type: 'Psychologist',
    tags: ['Stress', 'Relationships'],
    experience: 5,
    location: 'Kisumu, Kenya',
    mode: 'Online / In-person',
    availability: 'Available today',
    fee: 2200,
    verified: true,
    languages: ['English', 'Swahili', 'Kalenjin'],
    bio: 'Faith Chebet works with individuals and couples navigating stress, burnout, and relationship challenges, drawing on person-centred and solution-focused approaches.',
    qualifications: ['MSc Counselling Psychology — Moi University'],
    focus: ['Workplace stress', 'Relationship counselling', 'Burnout'],
    slots: ['Today, 5:00 PM', 'Tomorrow, 8:30 AM', 'Tomorrow, 3:00 PM'],
  },
]

export const referrals = [
  {
    id: 'MND-10482',
    label: 'Young adult',
    riskLevel: 'Elevated',
    reason: 'Screening responses indicate that professional assessment may be beneficial.',
    receivedAt: '2 hours ago',
    summary: {
      stress: 'Elevated',
      mood: 'Moderate concern',
      sleep: 'Elevated concern',
      functioning: 'Mild concern',
    },
    history: [
      { date: 'Aug 22', note: 'Weekly check-in completed — stress trending up' },
      { date: 'Aug 15', note: 'Weekly check-in completed — low concern' },
      { date: 'Aug 8', note: 'Weekly check-in completed — low concern' },
    ],
    flags: ['Self-reported sleep disruption for 2+ weeks', 'Elevated stress score for 2 consecutive check-ins'],
  },
  {
    id: 'MND-10391',
    label: 'Working professional',
    riskLevel: 'High',
    reason: 'Consistent high-concern responses across mood and daily functioning domains.',
    receivedAt: 'Yesterday',
    summary: {
      stress: 'Elevated',
      mood: 'High concern',
      sleep: 'Moderate concern',
      functioning: 'High concern',
    },
    history: [
      { date: 'Aug 21', note: 'Weekly check-in completed — high concern flagged' },
      { date: 'Aug 14', note: 'Weekly check-in completed — elevated concern' },
    ],
    flags: ['Two consecutive high-concern check-ins', 'Reported difficulty functioning at work'],
  },
]

export const clientRecord = {
  id: 'MND-10482',
  since: 'March 2026',
  wellbeingHistory: wellbeingTrend,
  assessments: [
    { date: 'Aug 22, 2026', result: 'Elevated concern' },
    { date: 'Aug 15, 2026', result: 'Low concern' },
    { date: 'Aug 8, 2026', result: 'Low concern' },
  ],
  appointments: {
    upcoming: [{ date: 'Sep 2, 2026, 10:00 AM', type: 'Online consultation' }],
    past: [{ date: 'Aug 19, 2026, 2:00 PM', type: 'Online consultation' }],
  },
  nextCheckIn: 'Fri, Sep 5',
}

export const adminOverview = {
  totalUsers: 18420,
  activeUsers: 9860,
  assessmentsCompleted: 41200,
  referralsMade: 2140,
  professionalsOnNetwork: 186,
  institutionalUsers: 12,
  userGrowth: [
    { label: 'Mar', value: 2400 },
    { label: 'Apr', value: 4100 },
    { label: 'May', value: 6800 },
    { label: 'Jun', value: 10200 },
    { label: 'Jul', value: 14300 },
    { label: 'Aug', value: 18420 },
  ],
  assessmentCompletion: [
    { label: 'Mar', value: 61 },
    { label: 'Apr', value: 64 },
    { label: 'May', value: 68 },
    { label: 'Jun', value: 71 },
    { label: 'Jul', value: 74 },
    { label: 'Aug', value: 78 },
  ],
  referralConversion: [
    { label: 'Mar', value: 34 },
    { label: 'Apr', value: 38 },
    { label: 'May', value: 41 },
    { label: 'Jun', value: 45 },
    { label: 'Jul', value: 49 },
    { label: 'Aug', value: 53 },
  ],
}

export const safetyQueue = {
  lowConcern: 412,
  elevated: 96,
  high: 24,
  acute: 3,
  alerts: [
    { id: 'MND-10391', level: 'High', note: 'Consecutive high-concern check-ins — pending clinical review.', time: '18 min ago' },
    { id: 'MND-10502', level: 'Acute', note: 'Response pattern flagged for urgent pathway — professional notified.', time: '41 min ago' },
    { id: 'MND-10298', level: 'Elevated', note: 'Referred to network psychologist — awaiting acceptance.', time: '2 hr ago' },
  ],
}