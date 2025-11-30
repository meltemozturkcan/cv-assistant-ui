import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import ReactMarkdown from 'react-markdown'

// ... (Sabitleriniz: AVATAR_URL, API_URL, QUICK_QUESTIONS, SKILLS aynı kalsın) ...
const AVATAR_URL = '/meltem.png'
const API_URL = 'https://cv-assistant-duuy.onrender.com/ask'

const QUICK_QUESTIONS = [
  'Teknik yetkinlikleriniz neler?',
  'İş deneyiminizi özetleyebilir misiniz?',
  'Yer aldığınız projelerden bahsedebilir misiniz?',
  'Eğitim geçmişinizi paylaşabilir misiniz?'
]

const SKILLS = [
  'C#', '.NET Core', 'AI/ML', 'Python', 'Web API', 'Microservices',
  'React', 'Azure', 'Docker', 'PostgreSQL', 'MSSQL', 'GitHub'
]

function App() {
  // ... State tanımları aynı ...
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Merhaba. Ben Meltem Öztürkcan’ın profesyonel özgeçmiş asistanıyım. Bilgi almak istediğiniz konuyla ilgili sorunuzu paylaşabilirsiniz.'
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // isMobile state'ine artık render için ihtiyacımız yok ama overlay kontrolü için tutabiliriz
  const [isMobile, setIsMobile] = useState(false) 

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // İlk açılışta ve resize'da mobil kontrolü
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900)
      if (window.innerWidth > 900) {
        setIsSidebarOpen(false) // Desktopa geçince state'i resetle
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sendMessage = async (e, questionText = null) => {
    if (e) e.preventDefault()
    const userMessage = questionText || input.trim()
    if (!userMessage || isLoading) return

    setInput('')
    setIsSidebarOpen(false) // Mesaj gönderince mobilde menüyü kapat

    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await axios.post(API_URL, { question: userMessage })
      const cleanedAnswer = response.data.answer
        .replace(/\n{3,}/g, '\n\n')
        .replace(/^\s+/gm, '')
        .trim()

      setMessages(prev => [...prev, { role: 'assistant', content: cleanedAnswer }])
    } catch (error) {
      console.error('Hata:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = question => {
    sendMessage(null, question)
  }

  return (
    <div className="app">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button
          className="menu-btn"
          onClick={() => setIsSidebarOpen(true)} // Sadece açma işlemi
        >
          ☰
        </button>
        <div className="mobile-title">
          <img src={AVATAR_URL} alt="Meltem Öztürkcan" className="mobile-avatar" />
          <span>Meltem Öztürkcan</span>
        </div>
      </div>

      {/* 
         SIDEBAR DÜZELTME:
         Koşullu render'ı kaldırdık. className ile kontrol ediyoruz.
         Desktopta 'sidebar', Mobilde açıkken 'sidebar open' oluyor.
      */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <div className="profile-section">
            <img src={AVATAR_URL} alt="Meltem Öztürkcan" className="avatar-img" />
            <h2>Meltem Öztürkcan</h2>
            <p className="title">Full Stack .NET &amp; AI Developer</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '15px' }}>
              <span className="badge">İstanbul, Türkiye</span>
              <span className="badge">2+ Yıl Deneyim</span>
            </div>
            <p className="bio">
              Mikroservis mimarileri ve AI destekli sistemlerde uzman, modern teknolojilerle ölçeklenebilir çözümler üreten full-stack geliştirici.
            </p>
          </div>

          <div className="skills-section">
            <h3>Teknik Yetenekler</h3>
            <div className="skills-grid">
              {SKILLS.map((skill, index) => (
                <span key={index} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="expertise-section">
            <h3>Uzmanlık Alanları</h3>
            <div className="expertise-list">
              <div className="expertise-item">Full Stack .NET Development</div>
              <div className="expertise-item">AI/ML Integration</div>
              <div className="expertise-item">DevOps &amp; Cloud</div>
              <div className="expertise-item">Frontend &amp; UI/UX</div>
            </div>
          </div>

          <a href="/cv.pdf" download className="download-btn">📄 Özgeçmişi İncele</a>
        </div>

        <div className="sidebar-footer">
           {/* ... Footer içeriği aynı ... */}
           <div className="social-links">
              {/* Linklerinizi buraya koyun */}
              <a href="https://linkedin.com" target="_blank">LI</a>
              <a href="https://github.com" target="_blank">GH</a>
           </div>
           <p className="copyright">© 2025 Meltem Öztürkcan</p>
        </div>
      </aside>

      {/* Overlay: Sadece mobilde ve menü açıkken görünür */}
      <div 
        className={`overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        style={{
           display: (isMobile && isSidebarOpen) ? 'block' : 'none'
        }}
      />

      <main className="main-content">
        {/* ... Main content içeriği tamamen aynı ... */}
        <header className="chat-header">
          <div className="header-info">
            <h1>Meltem AI - Özgeçmiş Asistanı</h1>
            <p>Meltem’in kariyeri hakkında sorularınızı yanıtlamaya hazırım.</p>
          </div>
        </header>

        <div className="chat-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                {message.role === 'assistant' && (
                  <img src={AVATAR_URL} alt="Bot" className="message-avatar" />
                )}
                <div className="message-content">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <img src={AVATAR_URL} alt="Bot" className="message-avatar" />
                <div className="message-content loading">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="bottom-questions">
            {/* Quick questions kodunuz aynı */}
             <div className="quick-btns">
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => handleQuickQuestion(q)} disabled={isLoading}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <footer className="input-area">
          <form onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Sorunuzu yazın..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>Go</button>
          </form>
        </footer>
      </main>
    </div>
  )
}

export default App