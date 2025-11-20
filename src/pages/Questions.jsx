import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { questionsApi } from '../api/client.js'

export default function Questions() {
  const { examCategoryId, subjectId } = useParams()
  const [items,setItems]=useState([])
  const [error,setError]=useState('')
  useEffect(()=>{
    questionsApi.listApproved(examCategoryId, subjectId)
      .then(setItems)
      .catch(e=>setError(e.message))
  },[examCategoryId,subjectId])
  return (
    <div>
      <h2>Preguntas aprobadas</h2>
      {error && <div>{error}</div>}
      {items.map(q=>(
        <div key={q.id} style={{border:'1px solid #ccc', margin:'8px', padding:'8px'}}>
          <strong>{q.statement}</strong>
          <ol type="A">
            {q.options?.map(opt=><li key={opt.id}>{opt.text}</li>)}
          </ol>
        </div>
      ))}
    </div>
  )
}