import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function PlanForm({ user, editingPlan, setEditingPlan, onSaved }) {
  const [subject, setSubject] = useState('')
  const [examDate, setExamDate] = useState('')
  const [topics, setTopics] = useState('')
  const [status, setStatus] = useState(null)

  // VCE subjects list
  const vceSubjects = [
    'English',
    'Biology',
    'Chemistry',
    'Physics',
    'Psychology',
    'General Mathematics',
    'Mathematical Methods',
    'Specialist Mathematics',
    'Legal Studies',
    'Business Management',
    'Economics',
    'Health and Human Development',
    'Environmental Science',
    'History',
    'Media',
    'Studio Arts',
    'Languages (e.g. Japanese, French)',
  ]

  // Suggested topics per subject
  const suggestedTopics = {
    English: ['Argument', 'Language Analysis', 'Creative Response'],
    Biology: ['Cell Structure', 'Photosynthesis', 'Genetics'],
    Chemistry: ['Stoichiometry', 'Acids and Bases', 'Organic Chemistry'],
    Physics: ['Motion', 'Electricity', 'Waves'],
    Psychology: ['Learning Theories', 'Mental Health', 'Research Methods'],
    'General Mathematics': ['Matrices', 'Networks', 'Statistics'],
    'Mathematical Methods': ['Functions', 'Calculus', 'Probability'],
    'Specialist Mathematics': ['Vectors', 'Complex Numbers', 'Mechanics'],
    'Legal Studies': ['Principles of Justice', 'Criminal Law', 'Rights of Accused'],
    'Business Management': ['Operations', 'Marketing', 'Finance'],
    Economics: ['Market Structures', 'Inflation', 'Economic Growth'],
    'Health and Human Development': ['Nutrition', 'Health Promotion', 'Global Health'],
    'Environmental Science': ['Biodiversity', 'Climate Change', 'Sustainability'],
    History: ['Revolutions', 'Cold War', 'Ancient Civilizations'],
    Media: ['Narratives', 'Production Design', 'Audience Engagement'],
    'Studio Arts': ['Art Elements', 'Materials', 'Visual Language'],
  }

  // Load values when editing
  useEffect(() => {
    if (editingPlan) {
      setSubject(editingPlan.subject)
      setExamDate(editingPlan.exam_date)
      setTopics(editingPlan.topics.join(', '))
    }
  }, [editingPlan])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const topicArray = topics.split(',').map(t => t.trim()).filter(Boolean)

    let error

    if (editingPlan) {
      // UPDATE existing plan
      const { error: updateError } = await supabase
        .from('plans')
        .update({
          subject,
          exam_date: examDate,
          topics: topicArray,
        })
        .eq('id', editingPlan.id)

      error = updateError
    } else {
      // INSERT new plan — includes user_id (required by RLS)
      const { error: insertError } = await supabase
        .from('plans')
        .insert({
          user_id: user.id,
          subject,
          exam_date: examDate,
          topics: topicArray,
        })

      error = insertError
    }

    if (error) {
      setStatus(`Error: ${error.message}`)
    } else {
      setStatus(editingPlan ? 'Plan updated!' : 'Plan submitted!')
      setSubject('')
      setExamDate('')
      setTopics('')
      setEditingPlan(null)
      onSaved()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h3>

      {/* Subject Dropdown */}
      <label>Subject</label>
      <select
        value={subject}
        onChange={(e) => {
          const selected = e.target.value
          setSubject(selected)

          // Auto-fill topics if available
          if (suggestedTopics[selected]) {
            setTopics(suggestedTopics[selected].join(', '))
          } else {
            setTopics('')
          }
        }}
      >
        <option value="">Select a subject</option>
        {vceSubjects.map((subj) => (
          <option key={subj} value={subj}>
            {subj}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={examDate}
        onChange={(e) => setExamDate(e.target.value)}
      />

      <input
        type="text"
        placeholder="Topics (comma-separated)"
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
      />

      <button type="submit">
        {editingPlan ? 'Save Changes' : 'Submit Plan'}
      </button>

      {editingPlan && (
        <button type="button" onClick={() => setEditingPlan(null)}>
          Cancel Edit
        </button>
      )}

      {status && <p>{status}</p>}
    </form>
  )
}