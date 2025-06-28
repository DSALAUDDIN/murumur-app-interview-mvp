import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post('/api/postTest')
        console.log(res.data)
        setData(res.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div>
      <h1>Display the data obtained from API here</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App