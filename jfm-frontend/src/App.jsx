import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('connecting')
  const [movies, setMovies] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        setStatus('success')

        // 兼容两种常见返回：
        // 1. 后端直接返回数组
        // 2. Spring 分页返回 { content: [...] }
        setMovies(Array.isArray(data) ? data : data.content ?? [])
      })
      .catch((err) => {
        setStatus('error')
        setError(err.message)
      })
  }, [])

  return (
    <main>
      <h1>JFM Frontend</h1>

      {status === 'connecting' && <p>connecting Backend...</p>}

      {status === 'success' && (
        <>
          <p>后端连接成功，已加载 {movies.length} 条数据。</p>

          <ul>
            {movies.map((movie) => (
              <li key={movie.id ?? movie.path ?? movie.name}>
                {movie.name ?? '未命名文件'}
              </li>
            ))}
          </ul>
        </>
      )}

      {status === 'error' && (
        <p>
          后端连接失败：
          <code>{error}</code>
        </p>
      )}
    </main>
  )
}

export default App
