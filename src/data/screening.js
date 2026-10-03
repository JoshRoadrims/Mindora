// Mirrors mindora-backend/src/lib/screening.js — question text and option
// labels only. Scoring stays server-side; nothing here computes a risk
// level, by design.

export const FREQUENCY_OPTIONS = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
]

export const YES_NO_OPTIONS = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Yes' },
]

export const SCREENING_QUESTIONS = [
  { id: 'phq9_1', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Little interest or pleasure in doing things' },
  { id: 'phq9_2', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Feeling down, depressed, or hopeless' },
  { id: 'phq9_3', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Trouble falling or staying asleep, or sleeping too much' },
  { id: 'phq9_4', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Feeling tired or having little energy' },
  { id: 'phq9_5', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Poor appetite or overeating' },
  { id: 'phq9_6', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Feeling bad about yourself — or that you are a failure, or have let yourself or your family down' },
  { id: 'phq9_7', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Trouble concentrating on things, such as reading or watching television' },
  { id: 'phq9_8', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Moving or speaking so slowly that other people could have noticed — or the opposite, being so fidgety or restless that you have been moving around a lot more than usual' },
  { id: 'phq9_9', domain: 'PHQ9', scale: 'frequency', instrument: 'Depression (PHQ-9)', prompt: 'Thoughts that you would be better off dead, or of hurting yourself in some way', isSafetyItem: true },

  { id: 'gad7_1', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Feeling nervous, anxious, or on edge' },
  { id: 'gad7_2', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Not being able to stop or control worrying' },
  { id: 'gad7_3', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Worrying too much about different things' },
  { id: 'gad7_4', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Trouble relaxing' },
  { id: 'gad7_5', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Being so restless that it is hard to sit still' },
  { id: 'gad7_6', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Becoming easily annoyed or irritable' },
  { id: 'gad7_7', domain: 'GAD7', scale: 'frequency', instrument: 'Anxiety (GAD-7)', prompt: 'Feeling afraid as if something awful might happen' },

  { id: 'cageaid_1', domain: 'CAGEAID', scale: 'yesno', instrument: 'Alcohol & drug use (CAGE-AID)', prompt: 'Have you ever felt that you should cut down on your drinking or drug use?' },
  { id: 'cageaid_2', domain: 'CAGEAID', scale: 'yesno', instrument: 'Alcohol & drug use (CAGE-AID)', prompt: 'Have people annoyed you by criticizing your drinking or drug use?' },
  { id: 'cageaid_3', domain: 'CAGEAID', scale: 'yesno', instrument: 'Alcohol & drug use (CAGE-AID)', prompt: 'Have you ever felt bad or guilty about your drinking or drug use?' },
  { id: 'cageaid_4', domain: 'CAGEAID', scale: 'yesno', instrument: 'Alcohol & drug use (CAGE-AID)', prompt: 'Have you ever used alcohol or drugs first thing in the morning to steady your nerves or get rid of a hangover?' },
]