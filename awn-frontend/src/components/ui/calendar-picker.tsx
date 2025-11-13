"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarPickerProps {
  selectedDate: string
  onDateSelect: (date: string) => void
  availableDates: string[]
  locale: "ar" | "en"
}

export function CalendarPicker({ selectedDate, onDateSelect, availableDates, locale }: CalendarPickerProps) {
  // Start with current date (November 2024)
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 10, 1)) // November 2024
  
  const isArabic = locale === "ar"
  
  // Today is October 31, 2024 - FIXED: Define this at the top level
  const today = new Date(2024, 9, 31) // October 31, 2024
  today.setHours(0, 0, 0, 0)
  
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

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const isDateAvailable = (date: Date) => {
    const dateStr = formatDate(date)
    return availableDates.includes(dateStr)
  }

  const days = getDaysInMonth(currentMonth)
  const monthFormatter = new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-GB", { 
    month: "long"
  })
  const yearFormatter = new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-GB", { 
    year: "numeric" 
  })

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Don't allow going before November 2024
  const isPreviousDisabled = () => {
    return currentMonth.getFullYear() <= 2024 && currentMonth.getMonth() <= 10 // November 2024
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 max-w-sm mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          disabled={isPreviousDisabled()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        {(isArabic ? ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'] : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']).map(day => (
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

          const dateStr = formatDate(day)
          const isAvailable = isDateAvailable(day)
          const isSelected = selectedDate === dateStr
          const isPast = day <= today // All dates up to and including today are past
          const isToday = day.getTime() === today.getTime()

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => {
                if (isAvailable && !isPast) {
                  onDateSelect(dateStr)
                }
              }}
              disabled={!isAvailable || isPast}
              className={`
                p-2 text-sm rounded-lg transition-all duration-200 font-medium
                ${isSelected 
                  ? 'bg-primary text-white shadow-md' 
                  : isAvailable && !isPast
                  ? 'text-gray-900 hover:bg-primary/10 hover:text-primary cursor-pointer border border-primary/20'
                  : 'text-gray-300 cursor-not-allowed bg-gray-50'
                }
                ${isPast ? 'line-through opacity-30' : ''}
                ${isToday ? 'bg-red-50 text-red-600 border border-red-200' : ''}
              `}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-500 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded"></div>
          <span>{isArabic ? "محدد" : "Selected"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-primary/20 rounded"></div>
          <span>{isArabic ? "متاح للحجز" : "Available for booking"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-100 rounded"></div>
          <span>{isArabic ? "غير متاح" : "Not available"}</span>
        </div>
        <div className="flex items-center gap-2">
         
   
        </div>
      </div>
    </div>
  )
}