"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BookCalendarProps {
  onSelectDate: (date: Date) => void
  selectedDate?: Date
  disabledDates?: Date[]
  minDate?: Date
  className?: string
}

export function BookCalendar({
  onSelectDate,
  selectedDate,
  disabledDates = [],
  minDate = new Date(),
  className
}: BookCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Array<Date | null>>([])

  // Generate calendar days for the current month view
  useEffect(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    
    // Calculate how many blank spaces needed at the start
    // Sunday is 0, so we need to adjust to start the week on Sunday
    const startOffset = firstDay.getDay()
    
    // Calculate total cells needed (previous month padding + days in month + next month padding)
    const daysArray: Array<Date | null> = []
    
    // Add previous month padding
    for (let i = 0; i < startOffset; i++) {
      daysArray.push(null)
    }
    
    // Add actual days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      daysArray.push(new Date(year, month, day))
    }
    
    // Add padding at the end to make sure we have a complete grid
    const rowsNeeded = Math.ceil(daysArray.length / 7)
    const totalCells = rowsNeeded * 7
    while (daysArray.length < totalCells) {
      daysArray.push(null)
    }
    
    setCalendarDays(daysArray)
  }, [currentMonth])

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Check if a date is disabled
  const isDisabled = (date: Date) => {
    if (!date) return true
    
    // Check if date is before minDate
    if (minDate && date < minDate) return true
    
    // Check if date is in disabledDates
    return disabledDates.some(disabledDate => 
      disabledDate.getFullYear() === date.getFullYear() &&
      disabledDate.getMonth() === date.getMonth() &&
      disabledDate.getDate() === date.getDate()
    )
  }

  // Check if a date is the selected date
  const isSelectedDate = (date: Date) => {
    if (!selectedDate || !date) return false
    
    return (
      selectedDate.getFullYear() === date.getFullYear() &&
      selectedDate.getMonth() === date.getMonth() &&
      selectedDate.getDate() === date.getDate()
    )
  }

  // Format month name
  const formatMonth = (date: Date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  return (
    <div className={cn("w-full rounded-lg overflow-hidden border", className)}>
      {/* Calendar header */}
      <div className="px-4 py-3 bg-muted flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="h-8 w-8 p-0 text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        
        <h2 className="text-lg font-medium text-foreground">
          {formatMonth(currentMonth)}
        </h2>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8 p-0 text-foreground"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      
      {/* Weekday headers */}
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground border-b">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 text-sm bg-card text-card-foreground">
        {calendarDays.map((date, i) => (
          <div 
            key={i} 
            className={cn(
              "h-12 border-t border-r relative",
              i % 7 === 0 ? "border-l" : "",
              Math.floor(i / 7) === Math.floor(calendarDays.length / 7) - 1 ? "border-b" : ""
            )}
          >
            {date && (
              <button
                type="button"
                onClick={() => !isDisabled(date) && onSelectDate(date)}
                disabled={isDisabled(date)}
                className={cn(
                  "w-full h-full flex items-center justify-center",
                  isSelectedDate(date) 
                    ? "bg-primary text-primary-foreground rounded-full" 
                    : isDisabled(date)
                    ? "text-muted-foreground/50 cursor-not-allowed" 
                    : "hover:bg-green-100 dark:hover:bg-green-900/30"
                )}
              >
                <time dateTime={date.toISOString().split('T')[0]}>
                  {date.getDate()}
                </time>
                
                {/* Availability indicator */}
                {!isDisabled(date) && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                    <div className="h-1 w-1 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <div className="h-1 w-1 rounded-full bg-green-500 dark:bg-green-400"></div>
                    <div className="h-1 w-1 rounded-full bg-green-500 dark:bg-green-400"></div>
                  </div>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
      
      {/* Calendar legend */}
      <div className="border-t px-4 py-3 bg-muted flex flex-wrap gap-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-primary"></div>
          <span className="text-foreground">Selected</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-green-500 dark:bg-green-400"></div>
          <span className="text-foreground">Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-red-500 dark:bg-red-400"></div>
          <span className="text-foreground">Fully Booked</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-yellow-500 dark:bg-yellow-400"></div>
          <span className="text-foreground">Limited Availability</span>
        </div>
      </div>
    </div>
  )
}