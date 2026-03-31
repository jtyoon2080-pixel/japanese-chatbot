import React, { useState, useEffect, useRef } from 'react';
import { Send, Share2, Plus, Trash2, MessageSquare, Edit3, Copy, Check, Sparkles, ChevronRight, ArrowLeft, Bot } from 'lucide-react';

// ── Sakura petal SVG background decoration ──────────────────────────────────
const SakuraPetal = ({ style }) => (
  <svg viewBox="0 0 24 24" style={style} className="sakura-petal" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9 2 6 5 6 8C6 11 8 13 12 14C16 13 18 11 18 8C18 5 15 2 12 2Z" fill="currentColor" opacity="0.6"/>
    <path d="M12 14C9 15 6 18 6 21H18C18 18 15 15 12 14Z" fill="currentColor" opacity="0.4"/>
    <path d="M2 10C2 13 5 16 8 16C10 16 11.5 15.2 12 14C10.8 13.5 8 12 6 9C4.5 8 2 8 2 10Z" fill="currentColor" opacity="0.5"/>
    <path d="M22 10C22 13 19 16 16 16C14 16 12.5 15.2 12 14C13.2 13.5 16 12 18 9C19.5 8 22 8 22 10Z" fill="currentColor" opacity="0.5"/>
    <circle cx="12" cy="13" r="1.5" fill="currentColor" opacity="0.8"/>
  </svg>
);

// ── Floating petals animation (CSS injected) ─────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Nunito', 'Noto Sans JP', sans-serif;
      background: #EEF2FF;
      min-height: 100vh;
    }

    :root {
      --primary: #4F6EF7;
      --primary-dark: #3451D1;
      --primary-light: #A5B4FC;
      --primary-pale: #EEF2FF;
      --accent: #F59E0B;
      --accent2: #10B981;
      --deep: #1E2A4A;
      --text: #2D3A5C;
      --text-muted: #6B7A99;
      --white: #FFFFFF;
      --bubble-user: #4F6EF7;
      --bubble-bot: #FFFFFF;
      --chat-bg: #E8EDF8;
    }

    @keyframes float {
      0% { transform: translateY(100vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
    }
    @keyframes sway {
      0%, 100% { transform: translateX(0); }
      50% { transform: translateX(20px); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pop {
      0% { transform: scale(0.85); opacity: 0; }
      70% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes pulse-ring {
      0% { box-shadow: 0 0 0 0 rgba(79,110,247,0.4); }
      70% { box-shadow: 0 0 0 10px rgba(79,110,247,0); }
      100% { box-shadow: 0 0 0 0 rgba(79,110,247,0); }
    }
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes bounce-dot {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .sakura-petal {
      position: fixed;
      color: var(--primary-light);
      animation: float linear infinite, sway ease-in-out infinite;
      pointer-events: none;
      z-index: 0;
    }

    .app-card {
      background: var(--white);
      border-radius: 28px;
      box-shadow: 0 20px 60px rgba(30,42,74,0.14), 0 4px 20px rgba(79,110,247,0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 88vh;
      max-height: 780px;
      position: relative;
      z-index: 1;
    }

    .header {
      background: linear-gradient(135deg, #3451D1 0%, #4F6EF7 50%, #7B93FA 100%);
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(79,110,247,0.35);
    }

    .header-title {
      font-size: 18px;
      font-weight: 900;
      color: white;
      display: flex;
      align-items: center;
      gap: 8px;
      letter-spacing: -0.3px;
    }

    .header-icon-circle {
      width: 34px;
      height: 34px;
      background: rgba(255,255,255,0.25);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .back-btn {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.4);
      color: white;
      border-radius: 20px;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
      font-family: 'Nunito', sans-serif;
    }
    .back-btn:hover { background: rgba(255,255,255,0.35); transform: translateX(-2px); }

    /* ── EDIT MODE ─────────────────────────────────────────────── */
    .edit-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: linear-gradient(180deg, #EEF2FF 0%, #E8EDF8 100%);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-card {
      background: white;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(30,42,74,0.07);
      border: 1.5px solid rgba(79,110,247,0.15);
    }

    .section-title {
      font-size: 15px;
      font-weight: 900;
      color: var(--deep);
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .section-subtitle {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 14px;
      line-height: 1.5;
    }

    .qa-row {
      background: linear-gradient(135deg, #EEF2FF 0%, #E8EDF8 100%);
      border-radius: 14px;
      padding: 14px;
      border: 1.5px solid rgba(79,110,247,0.12);
      margin-bottom: 10px;
      animation: fadeIn 0.3s ease;
      position: relative;
    }

    .qa-label-user {
      font-size: 11px;
      font-weight: 800;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .qa-label-bot {
      font-size: 11px;
      font-weight: 800;
      color: var(--accent2);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 5px;
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .qa-input {
      width: 100%;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1.5px solid rgba(79,110,247,0.2);
      font-size: 14px;
      font-family: 'Noto Sans JP', sans-serif;
      background: white;
      color: var(--text);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .qa-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(79,110,247,0.12); }
    .qa-input.bot-input:focus { border-color: var(--accent2); box-shadow: 0 0 0 3px rgba(16,185,129,0.12); }

    .qa-input::placeholder { color: #A0AABF; }

    .delete-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(239,68,68,0.1);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #EF4444;
      transition: all 0.2s;
    }
    .delete-btn:hover { background: #EF4444; color: white; transform: rotate(15deg); }

    .add-btn {
      width: 100%;
      padding: 12px;
      border-radius: 12px;
      border: 2px dashed rgba(79,110,247,0.35);
      background: transparent;
      color: var(--primary);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      font-family: 'Nunito', sans-serif;
    }
    .add-btn:hover { background: rgba(79,110,247,0.06); border-style: solid; }

    .primary-btn {
      width: 100%;
      padding: 14px;
      border-radius: 14px;
      border: none;
      background: linear-gradient(135deg, #3451D1, #4F6EF7);
      color: white;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(79,110,247,0.35);
      font-family: 'Nunito', sans-serif;
    }
    .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(79,110,247,0.4); }
    .primary-btn:active { transform: translateY(0); }

    .secondary-btn {
      width: 100%;
      padding: 14px;
      border-radius: 14px;
      border: 2px solid var(--primary);
      background: white;
      color: var(--primary);
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;
      font-family: 'Nunito', sans-serif;
    }
    .secondary-btn:hover { background: rgba(79,110,247,0.06); transform: translateY(-1px); }

    .share-box {
      margin-top: 14px;
      padding: 14px;
      background: linear-gradient(135deg, #EEF2FF, #E8EDF8);
      border-radius: 12px;
      border: 1.5px solid rgba(79,110,247,0.2);
      animation: fadeIn 0.3s ease;
    }
    .share-hint {
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 8px;
      font-weight: 600;
    }
    .share-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .share-input {
      flex: 1;
      padding: 8px 12px;
      border-radius: 10px;
      border: 1.5px solid rgba(79,110,247,0.2);
      font-size: 12px;
      color: var(--text-muted);
      background: white;
      outline: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .copy-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #3451D1, #4F6EF7);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .copy-btn:hover { transform: scale(1.1); }

    /* ── CHAT MODE ─────────────────────────────────────────────── */
    .chat-bg {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: linear-gradient(180deg, #DDE4F5 0%, #E8EDF8 100%);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .chat-date-divider {
      text-align: center;
      font-size: 11px;
      color: var(--text-muted);
      font-weight: 700;
      margin: 4px 0;
      background: rgba(255,255,255,0.5);
      border-radius: 20px;
      padding: 4px 12px;
      display: inline-block;
      align-self: center;
    }

    .msg-row {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      animation: pop 0.25s ease;
    }
    .msg-row.user { justify-content: flex-end; }
    .msg-row.bot { justify-content: flex-start; }

    .bot-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3451D1, #4F6EF7);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(79,110,247,0.35);
    }

    .bubble {
      max-width: 72%;
      padding: 11px 16px;
      border-radius: 20px;
      font-size: 14px;
      line-height: 1.5;
      font-family: 'Noto Sans JP', sans-serif;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .bubble.user {
      background: linear-gradient(135deg, #3451D1, #4F6EF7);
      color: white;
      border-bottom-right-radius: 6px;
    }
    .bubble.bot {
      background: white;
      color: var(--text);
      border-bottom-left-radius: 6px;
      border: 1.5px solid rgba(79,110,247,0.12);
    }

    .typing-bubble {
      display: flex;
      gap: 4px;
      align-items: center;
      padding: 14px 18px;
    }
    .typing-dot {
      width: 7px;
      height: 7px;
      background: var(--primary-light);
      border-radius: 50%;
      animation: bounce-dot 1.4s infinite ease-in-out both;
    }
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }

    .chat-input-area {
      background: white;
      border-top: 1.5px solid rgba(79,110,247,0.12);
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .chat-input {
      flex: 1;
      padding: 11px 18px;
      border-radius: 25px;
      border: 2px solid rgba(79,110,247,0.2);
      font-size: 14px;
      font-family: 'Noto Sans JP', sans-serif;
      background: #EEF2FF;
      color: var(--text);
      outline: none;
      transition: border-color 0.2s;
    }
    .chat-input:focus { border-color: var(--primary); background: white; }
    .chat-input::placeholder { color: #A0AABF; }

    .send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      background: linear-gradient(135deg, #3451D1, #4F6EF7);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(79,110,247,0.4);
      flex-shrink: 0;
      animation: pulse-ring 2s infinite;
    }
    .send-btn:hover { transform: scale(1.1) rotate(-10deg); }
    .send-btn:disabled { background: #C8D0E0; box-shadow: none; cursor: not-allowed; animation: none; transform: none; }

    /* scrollbar */
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(79,110,247,0.3); border-radius: 4px; }

    /* badge */
    .rule-count-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      font-size: 11px;
      font-weight: 900;
    }

    .welcome-banner {
      background: linear-gradient(135deg, rgba(79,110,247,0.1), rgba(16,185,129,0.08));
      border-radius: 16px;
      padding: 14px 16px;
      border: 1.5px solid rgba(79,110,247,0.15);
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
      text-align: center;
    }
    .welcome-banner strong { color: var(--primary); }
  `}</style>
);

// ── Petals component ──────────────────────────────────────────────────────────
const petals = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: 14 + Math.random() * 18,
  left: `${5 + Math.random() * 90}%`,
  duration: `${8 + Math.random() * 12}s`,
  swayDuration: `${3 + Math.random() * 4}s`,
  delay: `${Math.random() * 10}s`,
}));

const FloatingPetals = () => (
  <>
    {petals.map(p => (
      <SakuraPetal key={p.id} style={{
        width: p.size,
        height: p.size,
        left: p.left,
        bottom: '-20px',
        animationDuration: `${p.duration}, ${p.swayDuration}`,
        animationDelay: `${p.delay}, ${p.delay}`,
      }} />
    ))}
  </>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState('edit');
  const [qaPairs, setQaPairs] = useState([
    { id: 1, input: 'いってきます。', output: 'いってらっしゃい。' },
  ]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // ── URL data decode on mount ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decoded = JSON.parse(decodeURIComponent(atob(decodeURIComponent(data))));
        if (Array.isArray(decoded) && decoded.length > 0) {
          setQaPairs(decoded);
          setMode('chat');
          setMessages([{
            id: 0, sender: 'bot',
            text: '안녕! 나는 일본어 인사 챗봇이야 🌸 배운 인사말을 입력해봐!'
          }]);
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const [inputWarning, setInputWarning] = useState(''); // 규칙/글자수 경고 메시지

  const MAX_RULES = 30;
  const MAX_INPUT_LEN = 15;

  const addQaPair = () => {
    if (qaPairs.length >= MAX_RULES) {
      setInputWarning('rule_limit');
      return;
    }
    setInputWarning('');
    setQaPairs(prev => [...prev, { id: Date.now(), input: '', output: '' }]);
  };
  const removeQaPair = (id) => {
    setInputWarning('');
    setQaPairs(prev => prev.filter(p => p.id !== id));
  };
  const updateQaPair = (id, field, val) => {
    if (field === 'input' && [...val].length > MAX_INPUT_LEN) {
      setInputWarning('char_limit');
      return;
    }
    if (field === 'output' && [...val].length > MAX_INPUT_LEN) {
      setInputWarning('char_limit');
      return;
    }
    setInputWarning('');
    setQaPairs(prev => prev.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const generateShareLink = () => {
    const clean = qaPairs.filter(p => p.input.trim() && p.output.trim());
    const base64 = btoa(encodeURIComponent(JSON.stringify(clean)));
    const encoded = encodeURIComponent(base64);
    const base = window.location.href.split('?')[0];
    setShareLink(`${base}?data=${encoded}`);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (!shareLink) return;
    const ta = document.createElement('textarea');
    ta.value = shareLink;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch (e) { console.error(e); }
    finally { document.body.removeChild(ta); }
  };

  const startTestChat = () => {
    setMessages([{
      id: 0, sender: 'bot',
      text: '안녕! 🌸 지금까지 배운 일본어 인사말을 입력해봐! 잘 대답해줄게 😊'
    }]);
    setMode('chat');
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    setInputText('');
    setIsTyping(true);

    const match = qaPairs.find(
      p => p.input.replace(/\s+/g, '') === text.replace(/\s+/g, '')
    );

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(), sender: 'bot',
        text: match
          ? match.output
          : '어라? 아직 배우지 않은 인사말이거나 잘못 입력된 것 같아요. 😅 배운 인사말을 정확히 입력해보세요!'
      }]);
    }, 900);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isFromShare = typeof window !== 'undefined' && window.location.search.includes('data');

  return (
    <>
      <GlobalStyle />
      <FloatingPetals />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: "'Nunito', 'Noto Sans JP', sans-serif",
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }} className="app-card">

          {/* ── HEADER ─────────────────────────────────────── */}
          <div className="header">
            <div className="header-title">
              <div className="header-icon-circle">
                {mode === 'edit'
                  ? <Edit3 size={18} color="white" />
                  : <MessageSquare size={18} color="white" />}
              </div>
              {mode === 'edit' ? '챗봇 만들기 🌸' : '일본어 인사 챗봇 🌸'}
            </div>
            {mode === 'chat' && !isFromShare && (
              <button className="back-btn" onClick={() => setMode('edit')}>
                <ArrowLeft size={14} /> 수정
              </button>
            )}
          </div>

          {/* ─────────── EDIT MODE ─────────────────────────── */}
          {mode === 'edit' && (
            <div className="edit-scroll">

              {/* Rules section */}
              <div className="section-card">
                <div className="section-title">
                  <Sparkles size={16} color="#4F6EF7" />
                  대화 규칙 설정
                  <span className="rule-count-badge">{qaPairs.length}</span>
                </div>
                <p className="section-subtitle">
                  사용자가 입력할 인사말과 챗봇이 응답할 인사말을 짝지어 입력하세요.
                </p>

                {qaPairs.map((pair) => (
                  <div key={pair.id} className="qa-row">
                    <button className="delete-btn" onClick={() => removeQaPair(pair.id)} title="삭제">
                      <Trash2 size={13} />
                    </button>

                    <div className="qa-label-user">
                      <span style={{ fontSize: 14 }}>🙋</span> 사용자 입력
                    </div>
                    <input
                      type="text"
                      className="qa-input"
                      value={pair.input}
                      onChange={e => updateQaPair(pair.id, 'input', e.target.value)}
                      placeholder="예: ただいま"
                      style={{ paddingRight: '36px' }}
                    />

                    <div className="qa-label-bot">
                      <span style={{ fontSize: 14 }}>🤖</span> 챗봇 응답
                    </div>
                    <input
                      type="text"
                      className="qa-input bot-input"
                      value={pair.output}
                      onChange={e => updateQaPair(pair.id, 'output', e.target.value)}
                      placeholder="예: おかえり"
                      style={{ borderColor: 'rgba(16,185,129,0.3)' }}
                    />
                  </div>
                ))}

                <button className="add-btn" onClick={addQaPair}
                  style={ qaPairs.length >= MAX_RULES ? { opacity: 0.45, cursor: 'not-allowed' } : {} }>
                  <Plus size={16} /> 규칙 추가하기
                </button>

                {inputWarning === 'rule_limit' && (
                  <div style={{
                    marginTop: 8, padding: '10px 14px', borderRadius: 10,
                    background: '#FEF3C7', border: '1.5px solid #F59E0B',
                    fontSize: 13, color: '#92400E', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    ⚠️ 규칙은 최대 30개까지만 입력할 수 있어요!
                  </div>
                )}
                {inputWarning === 'char_limit' && (
                  <div style={{
                    marginTop: 8, padding: '10px 14px', borderRadius: 10,
                    background: '#FEF3C7', border: '1.5px solid #F59E0B',
                    fontSize: 13, color: '#92400E', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: 6
                  }}>
                    ⚠️ 입력 문구는 15글자까지만 입력할 수 있어요!
                  </div>
                )}
              </div>

              {/* Share section */}
              <div className="section-card">
                <div className="section-title">
                  <Share2 size={16} color="#4F6EF7" />
                  저장 및 공유
                </div>
                <p className="section-subtitle">
                  내가 만든 챗봇을 테스트하거나 친구들과 링크로 공유해보세요!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button className="primary-btn" onClick={startTestChat}>
                    <MessageSquare size={18} />
                    내가 만든 챗봇 테스트하기
                    <ChevronRight size={16} />
                  </button>
                  <button className="secondary-btn" onClick={generateShareLink}>
                    <Share2 size={16} />
                    공유 링크 만들기
                  </button>
                </div>

                {shareLink && (
                  <div className="share-box">
                    <p className="share-hint">🔗 아래 링크를 복사해서 친구에게 공유하세요!</p>
                    <div className="share-row">
                      <input type="text" readOnly value={shareLink} className="share-input" />
                      <button className="copy-btn" onClick={copyToClipboard}>
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                    {copied && (
                      <p style={{ fontSize: 12, color: '#10B981', fontWeight: 700, marginTop: 6, textAlign: 'center' }}>
                        ✅ 링크가 복사되었어요!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─────────── CHAT MODE ─────────────────────────── */}
          {mode === 'chat' && (
            <>
              <div className="chat-bg">
                <div className="chat-date-divider">채팅 시작 🌸</div>

                {messages.length === 0 && (
                  <div className="welcome-banner">
                    <strong>배운 일본어 인사말을 입력해봐! 🌸</strong><br />
                    정확하게 입력하면 챗봇이 바로 답해줄 거야 😊
                  </div>
                )}

                {messages.map(msg => (
                  <div key={msg.id} className={`msg-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="bot-avatar">
                        <Bot size={16} color="white" />
                      </div>
                    )}
                    <div className={`bubble ${msg.sender}`}>{msg.text}</div>
                  </div>
                ))}

                {isTyping && (
                  <div className="msg-row bot">
                    <div className="bot-avatar">
                      <Bot size={16} color="white" />
                    </div>
                    <div className="bubble bot typing-bubble">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input-area">
                <input
                  type="text"
                  className="chat-input"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="인사말을 입력하세요 (예: いってきます。)"
                />
                <button
                  type="button"
                  className="send-btn"
                  disabled={!inputText.trim()}
                  onClick={handleSend}
                >
                  <Send size={18} style={{ transform: 'translateX(-1px)' }} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}