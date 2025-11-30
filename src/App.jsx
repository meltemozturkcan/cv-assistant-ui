import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import ReactMarkdown from 'react-markdown'

const AVATAR_URL = '/meltem.png'
const API_URL = 'https://cv-assistant-duuy.onrender.com/ask'

// Sabit veriler...
const QUICK_QUESTIONS = [
  'Teknik yetkinlikleriniz neler?', 'İş deneyiminizi özetleyebilir misiniz?',
  'Projelerinizden bahseder misiniz?', 'Eğitim durumunuz nedir?'
]

const SKILLS = ['C#', '.NET Core', 'Python', 'React', 'Azure', 'Docker', 'SQL']

function App() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Merhaba. Ben Meltem Öztürkcan’ın asistanıyım. Nasıl yardımcı olabilirim?'
  }])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Sidebar kontrolü: Başlangıçta false (kapalı)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mesaj Gönderme
  const sendMessage = async (e, questionText = null) => {
    if (e) e.preventDefault()
    const text = questionText || input.trim()
    if (!text || isLoading) return

    setInput('')
    setIsSidebarOpen(false) // Mobilde mesaj atınca menüyü kapat
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    try {
      const res = await axios.post(API_URL, { question: text })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.answer }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Hata oluştu.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      
      {/* 
          SIDEBAR
          isMobile kontrolü YOK. Her zaman render edilir.
          Mobilde görünürlüğünü CSS'teki transform ve 'open' class'ı yönetir.
      */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="profile-section">
            <img src={AVATAR_URL} className="avatar-img" alt="Profile" />
            <h2>Meltem Öztürkcan</h2>
            <p>.NET Developer</p>
            <div style={{display:'flex', justifyContent:'center', marginTop:'10px'}}>
               <span className="badge">İstanbul</span>
            </div>
          </div>
          
          {/* İçerik örnekleri */}
          <div style={{marginTop: '20px'}}>
            <h3 style={{fontSize:'0.9rem', color:'#aaa', marginBottom:'10px'}}>Yetenekler</h3>
            <div style={{display:'flex', flexWrap:'wrap', gap:'5px'}}>
              {SKILLS.map(s => <span key={s} className="badge">{s}</span>)}
            </div>
          </div>
          
          <div style={{marginTop:'auto', paddingTop:'20px'}}>
             <p style={{fontSize:'0.7rem', opacity:0.6}}>© 2025 Meltem Öztürkcan</p>
          </div>
        </div>
      </aside>

      {/* 
          OVERLAY 
          Sidebar açıkken arka planı karartır ve tıklayınca kapatır 
      */}
      <div 
        className={`overlay ${isSidebarOpen ? 'active' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* MAIN CONTENT */}
      <main className="main-content">
        
        {/* Mobile Header: Sadece mobilde görünür (CSS ile) */}
        <div className="mobile-header">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>☰</button>
          <span>Meltem AI</span>
          <img src={AVATAR_URL} style={{width:'30px', borderRadius:'50%'}} alt="mobile-logo"/>
        </div>

        {/* Chat Alanı */}
        <div className="chat-container">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className="message-content">
                   <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && <div className="message assistant"><div className="message-content">...</div></div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Alt Input */}
        <div className="input-area">
          <form onSubmit={sendMessage}>
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Mesaj yazın..." 
              disabled={isLoading}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default App