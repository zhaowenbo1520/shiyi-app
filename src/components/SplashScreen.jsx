import { useEffect, useState, useRef } from 'react'
import './SplashScreen.css'

export default function SplashScreen({ onFinish }) {
  const [exiting, setExiting] = useState(false)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(() => {
    // Start exit fade at 1600ms (animations have completed)
    const exitTimer = setTimeout(() => setExiting(true), 1600)
    // Fully remove at 1750ms (150ms fade-out window)
    const removeTimer = setTimeout(() => onFinishRef.current(), 1750)

    return () => {
      clearTimeout(exitTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  return (
    <div className={`splash-overlay${exiting ? ' splash-exit' : ''}`}>
      <div className="splash-scene">
        {/* Storage slot */}
        <div className="splash-slot" />

        {/* Visual: ring + note */}
        <div className="splash-visual">
          {/*
            Time ring — fixed behind the note.
            Four subtle tick marks + a second hand that sweeps ~50°.
          */}
          <div className="splash-ring-container">
            <div className="splash-ring">
              <span className="splash-ring-mark splash-ring-mark--top" />
              <span className="splash-ring-mark splash-ring-mark--right" />
              <span className="splash-ring-mark splash-ring-mark--bottom" />
              <span className="splash-ring-mark splash-ring-mark--left" />
            </div>
            <div className="splash-hand" />
          </div>

          {/*
            Note card — rises, lifts, then settles into the slot.
            The card wraps a simple content area with two lines and a dot.
          */}
          <div className="splash-note-wrapper">
            <div className="splash-note">
              <div className="splash-note-content">
                <div className="splash-note-line" />
                <div className="splash-note-line splash-note-line--short" />
                <div className="splash-note-dot" />
              </div>
            </div>
          </div>
        </div>

        {/* Product name & tagline */}
        <div className="splash-text">
          <h1 className="splash-title">拾遗</h1>
          <p className="splash-subtitle">把容易忘的，轻轻捡回</p>
        </div>
      </div>
    </div>
  )
}
