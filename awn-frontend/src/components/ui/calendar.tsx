"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  initialFocus?: boolean
}

export function Calendar({ selected, onSelect, disabled, initialFocus }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date())
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const days = getDaysInMonth(currentMonth)
  const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "long" })
  const yearFormatter = new Intl.DateTimeFormat("en-GB", { year: "numeric" })

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="bg-white rounded-lg border p-4 max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="text-center">
          <div className="font-semibold">
            {monthFormatter.format(currentMonth)} {yearFormatter.format(currentMonth)}
          </div>
        </div>
        
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="p-2"></div>
          }

          const isSelected = selected && day.toDateString() === selected.toDateString()
          const isDisabled = disabled ? disabled(day) : false

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => {
                if (!isDisabled && onSelect) {
                  onSelect(day)
                }
              }}
              disabled={isDisabled}
              className={`
                p-2 text-sm rounded-lg transition-all duration-200 font-medium
                ${isSelected 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : !isDisabled
                  ? 'text-gray-900 hover:bg-blue-50 hover:text-blue-600 cursor-pointer'
                  : 'text-gray-300 cursor-not-allowed bg-gray-50'
                }
              `}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}