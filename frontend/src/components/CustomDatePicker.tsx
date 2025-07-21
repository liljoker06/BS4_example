'use client'
import { useState, useRef, useEffect } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  value: Date | null
  onChange: (date: Date | null) => void
}

export default function CustomDatePicker({ value, onChange }: Props) {
  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const calendarRef = useRef<HTMLDivElement>(null)

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const handleDateClick = (date: Date) => {
    onChange(date)
    setShowCalendar(false)
  }

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false)
      }
    }

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showCalendar])

  return (
    <div className="relative w-full max-w-xs" ref={calendarRef}>
      <input
        type="text"
        readOnly
        value={value ? format(value, 'dd/MM/yyyy', { locale: fr }) : ''}
        placeholder="jj/mm/aaaa"
        className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        onClick={() => setShowCalendar((prev) => !prev)}
      />

      {showCalendar && (
        <div className="absolute z-20 mt-2 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-lg p-4 animate-fade-in">
          {/* En-tête du calendrier */}
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
            >
              ←
            </button>
            <span className="text-sm font-semibold">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="text-sm px-2 py-1 hover:bg-gray-100 rounded"
            >
              →
            </button>
          </div>

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 text-xs text-center mb-2 font-semibold text-gray-500">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>

          {/* Jours du mois */}
          <div className="grid grid-cols-7 text-center gap-1 text-sm">
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className={`cursor-pointer p-2 rounded-full transition-all ${
                  isSameDay(day, value ?? new Date())
                    ? 'bg-blue-600 text-white font-bold'
                    : 'hover:bg-blue-100'
                }`}
                onClick={() => handleDateClick(day)}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
