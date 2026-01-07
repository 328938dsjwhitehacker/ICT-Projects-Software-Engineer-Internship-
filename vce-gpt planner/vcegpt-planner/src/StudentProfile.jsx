import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function StudentProfile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [yearLevel, setYearLevel] = useState('')
  const [age, setAge] = useState('')
  const [status, setStatus] = useState(null)

  // Load session and profile
  useEffect(() => {
    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const currentUser = session?.user
      setUser(currentUser)

      if (currentUser) {
        const { data, error } = await supabase
          .from('VCAA student users')
          .select('*')
          .eq('id', currentUser.id)
          .single()

        if (error) setStatus(error.message)
        else {
          setProfile(data)
          setName(data.name || '')
          setYearLevel(data.year_level || '')
          setAge(data.age || '')
        }
      }
    }

    loadSession()
  }, [])

  // Insert or update profile
  const saveProfile = async () => {
    if (!name || !yearLevel || !age) {
      setStatus('Please fill in all fields.')
      return
    }

    const payload = {
      id: user.id,
      name,
      year_level: parseInt(yearLevel),
      age: parseInt(age),
    }

    const { error } = profile
      ? await supabase.from('VCAA student users').update(payload).eq('id', user.id)
      : await supabase.from('VCAA student users').insert(payload)

    if (error) setStatus(error.message)
    else setStatus('Profile saved successfully.')
  }

  if (!user) return <p>Loading...</p>

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Student Profile</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Year Level"
        value={yearLevel}
        onChange={(e) => setYearLevel(e.target.value)}
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={saveProfile}>Save Profile</button>

      {status && <p>{status}</p>}
    </div>
  )
}