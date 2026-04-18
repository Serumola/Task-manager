import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import { reportsAPI } from "../../services/api";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import "./Calendar.css";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    fetchCalendarTasks();
  }, [currentDate]);

  async function fetchCalendarTasks() {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const data = await reportsAPI.getCalendar(month, year);
      setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to fetch calendar tasks");
    } finally {
      setLoading(false);
    }
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function getFirstDayOfMonth(year, month) {
    return new Date(year, month - 1, 1).getDay();
  }

  function getTasksForDay(day) {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.due_date?.startsWith(dateStr));
  }

  function isToday(day) {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  }

  function getPriorityColor(priority) {
    switch (priority) {
      case "high": return "#ef4444";
      case "medium": return "#f59e0b";
      case "low": return "#22c55e";
      default: return "#6b7280";
    }
  }

  function prevMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth() + 1);

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDay(day);
      const isTodayDay = isToday(day);

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isTodayDay ? "today" : ""}`}
        >
          <div className="day-number">
            {day}
            {isTodayDay && <span className="today-indicator">Today</span>}
          </div>
          <div className="day-tasks">
            {dayTasks.slice(0, 3).map(task => (
              <div 
                key={task.id}
                className="task-dot"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
                title={`${task.title} (${task.priority})`}
              />
            ))}
            {dayTasks.length > 3 && (
              <span className="more-tasks">+{dayTasks.length - 3}</span>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-page">
      <Sidebar />
      <div className="calendar-content">
        <div className="calendar-header">
          <div>
            <h1 className="page-title">Calendar</h1>
            <p className="page-subtitle">View and manage your tasks by date</p>
          </div>
          <div className="calendar-controls">
            <button className="today-btn" onClick={goToToday}>
              Today
            </button>
            <div className="nav-controls">
              <button className="nav-btn" onClick={prevMonth}>
                <ChevronLeft size={20} />
              </button>
              <h2 className="current-month">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button className="nav-btn" onClick={nextMonth}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading calendar...</div>
        ) : (
          <div className="calendar-container">
            <div className="calendar-grid">
              {dayNames.map(day => (
                <div key={day} className="day-header">{day}</div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        )}

        <div className="calendar-legend">
          <h3>Task Priority</h3>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: "#ef4444" }}></div>
              <span>High</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: "#f59e0b" }}></div>
              <span>Medium</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: "#22c55e" }}></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
