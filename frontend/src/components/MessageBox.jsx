import { useEffect, useState } from 'react'
import './styling/messagebox.css'
 
// Parses AI output text into structured fields
const parseAIResponse = (text) => {
  if (!text) return null
 
  const result = {
    condition: '',
    risk: '',
    riskScore: 0,
    advice: [],
    raw: text,
  }
 
  // Extract condition
  const conditionMatch = text.match(/possible condition[:\s]+([^\n.]+)/i)
  if (conditionMatch) result.condition = conditionMatch[1].trim()
 
  // Extract risk level
  const riskMatch = text.match(/risk level[:\s]+([^\n.,]+)/i)
  if (riskMatch) {
    result.risk = riskMatch[1].trim()
    const r = result.risk.toLowerCase()
    if (r.includes('high')) result.riskScore = 85
    else if (r.includes('medium')) result.riskScore = 55
    else if (r.includes('low')) result.riskScore = 25
    else result.riskScore = 40
  }
 
  // Extract advice
  const adviceMatch = text.match(/advice[:\s]+(.+)/is)
  if (adviceMatch) {
    result.advice = adviceMatch[1]
      .split(/[,;.\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 5)
      .slice(0, 5)
  }
 
  // If parsing fails, show fallback
  if (!result.condition && !result.risk) result.parsed = false
  else result.parsed = true
 
  return result
}
 
// SVG Progress Ring
const RiskRing = ({ score, label }) => {
  const radius = 44
  const circ = 2 * Math.PI * radius
  const offset = circ - (score / 100) * circ
 
  const color =
    score >= 70 ? '#ff4d4d' :
    score >= 45 ? '#f5a623' :
    '#38d9a9'
 
  const [animated, setAnimated] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])
 
  return (
    <div className="ring-wrapper">
      <svg className="ring-svg" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} className="ring-track" />
        <circle
          cx="50" cy="50" r={radius}
          className="ring-fill"
          style={{
            stroke: color,
            strokeDasharray: circ,
            strokeDashoffset: animated ? offset : circ,
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
        <text x="50" y="46" className="ring-score" style={{ fill: color }}>{score}</text>
        <text x="50" y="62" className="ring-label-inner">/ 100</text>
      </svg>
      <span className="ring-label" style={{ color }}>{label}</span>
    </div>
  )
}
 
const AICard = ({ parsed }) => {
  if (!parsed?.parsed) {
    return (
      <div className="ai-card ai-card--raw">
        <p className="raw-text">{parsed?.raw}</p>
      </div>
    )
  }
 
  return (
    <div className="ai-card">
      <div className="ai-card__header">
        <span className="ai-badge">AI Analysis</span>
      </div>
 
      <div className="ai-card__body">
        {/* Condition */}
        <div className="ai-section condition-section">
          <p className="section-label">Possible Condition</p>
          <p className="condition-text">{parsed.condition}</p>
        </div>
 
        {/* Risk Ring */}
        <div className="ai-section risk-section">
          <p className="section-label">Risk Level</p>
          <div className="ring-row">
            <RiskRing score={parsed.riskScore} label={parsed.risk} />
          </div>
        </div>
 
        {/* Advice */}
        {parsed.advice.length > 0 && (
          <div className="ai-section advice-section">
            <p className="section-label">Recommended Steps</p>
            <ul className="advice-list">
              {parsed.advice.map((tip, i) => (
                <li key={i} className="advice-item">
                  <span className="advice-dot" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
 
const MessageBox = ({ input, output }) => {
  const parsed = parseAIResponse(output)
 
  return (
    <div className="message-holder">
      <div className="symptoms-heading">
        <span className="heading-icon">🩺</span>
        <h1>Symptom Analyzer</h1>
        <p className="heading-sub">Describe your symptoms for a quick AI assessment</p>
      </div>
 
      {input && (
        <div className="chat-flow">
          <div className="user-bubble">
            <div className="bubble-avatar user-avatar">You</div>
            <div className="bubble-text">{input}</div>
          </div>
 
          <div className="ai-bubble">
            <div className="bubble-avatar ai-avatar">AI</div>
            <AICard parsed={parsed} />
          </div>
        </div>
      )}
    </div>
  )
}
 
export default MessageBox
 