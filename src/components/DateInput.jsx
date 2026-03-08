import { useState, useEffect, useRef } from 'react';
import { formatDateMMDDYYYY, parseMMDDYYYYToISO } from '../constants';

const CALENDAR_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/** Text input that displays and accepts MM/DD/YYYY; stores YYYY-MM-DD via onChange. Includes calendar picker. */
export default function DateInput({ value, onChange, id, name, required, minDate }) {
  const [focused, setFocused] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMonth, setPickerMonth] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return { year: y, month: m };
    }
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  });
  const wrapperRef = useRef(null);

  const displayValue = focused ? localValue : (value ? formatDateMMDDYYYY(value) : '');

  useEffect(() => {
    if (!focused && value) setLocalValue(formatDateMMDDYYYY(value));
  }, [value, focused]);

  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      setPickerMonth({ year: y, month: m });
    }
  }, [value]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [pickerOpen]);

  const handleFocus = () => {
    setFocused(true);
    setLocalValue(value ? formatDateMMDDYYYY(value) : '');
  };

  const handleBlur = () => {
    setFocused(false);
    const parsed = parseMMDDYYYYToISO(localValue);
    if (parsed) {
      // Validate that parsed date is not in the past
      if (minDate) {
        const today = getTodayDate();
        const [y, m, d] = parsed.split('-').map(Number);
        const selectedDate = new Date(y, m - 1, d);
        const todayDate = new Date(today.year, today.month - 1, today.day);
        if (selectedDate < todayDate) {
          // Invalid past date, revert to previous value
          if (value) setLocalValue(formatDateMMDDYYYY(value));
          else setLocalValue('');
          return;
        }
      }
      onChange(parsed);
    } else if (value) setLocalValue(formatDateMMDDYYYY(value));
    else setLocalValue('');
  };

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const openPicker = (e) => {
    e.preventDefault();
    setPickerOpen((open) => !open);
  };

  const getTodayDate = () => {
    const today = new Date();
    return {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
  };

  const isDateDisabled = (year, month, day) => {
    if (!minDate) return false;
    const today = getTodayDate();
    const date = new Date(year, month - 1, day);
    const todayDate = new Date(today.year, today.month - 1, today.day);
    return date < todayDate;
  };

  const canGoPrevMonth = () => {
    if (!minDate) return true;
    const today = getTodayDate();
    const { year, month } = pickerMonth;
    return year > today.year || (year === today.year && month > today.month);
  };

  const goPrevMonth = () => {
    if (!canGoPrevMonth()) return;
    setPickerMonth((p) => {
      if (p.month === 1) return { year: p.year - 1, month: 12 };
      return { year: p.year, month: p.month - 1 };
    });
  };

  const goNextMonth = () => {
    setPickerMonth((p) => {
      if (p.month === 12) return { year: p.year + 1, month: 1 };
      return { year: p.year, month: p.month + 1 };
    });
  };

  const selectDay = (year, month, day) => {
    if (isDateDisabled(year, month, day)) return;
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(iso);
    setPickerOpen(false);
  };

  const { year, month } = pickerMonth;
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const days = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  const monthLabel = first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="date-input-wrap" ref={wrapperRef}>
      <input
        type="text"
        id={id}
        name={name}
        placeholder="MM/DD/YYYY"
        required={required}
        value={displayValue}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        inputMode="numeric"
        autoComplete="off"
      />
      <button
        type="button"
        className="date-input-calendar-btn"
        onClick={openPicker}
        onMouseDown={(e) => e.preventDefault()}
        title="Choose date"
        aria-label="Open calendar"
      >
        {CALENDAR_ICON}
      </button>
      {pickerOpen && (
        <div className="date-input-picker" onMouseDown={(e) => e.preventDefault()}>
          <div className="date-input-picker-header">
            <button type="button" className={`date-input-picker-nav${!canGoPrevMonth() ? ' disabled' : ''}`} onClick={goPrevMonth} aria-label="Previous month" disabled={!canGoPrevMonth()}>&lsaquo;</button>
            <span className="date-input-picker-title">{monthLabel}</span>
            <button type="button" className="date-input-picker-nav" onClick={goNextMonth} aria-label="Next month">&rsaquo;</button>
          </div>
          <div className="date-input-picker-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="date-input-picker-days">
            {days.map((d, i) => {
              if (d === null) return <span key={`e-${i}`} className="date-input-picker-day empty" />;
              const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
              const isSelected = value === iso;
              const isDisabled = isDateDisabled(year, month, d);
              return (
                <button
                  key={d}
                  type="button"
                  className={`date-input-picker-day${isSelected ? ' selected' : ''}${isDisabled ? ' disabled' : ''}`}
                  onClick={() => selectDay(year, month, d)}
                  disabled={isDisabled}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
