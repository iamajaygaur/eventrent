import { useState, useEffect, useRef } from 'react';

const CLOCK_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

/** Parse "HH:mm" (24h) to { hour12, minute, ampm } */
function parseTime(value) {
  if (!value || !/^\d{1,2}:\d{2}$/.test(value)) return { hour12: 12, minute: 0, ampm: 'AM' };
  const [h, m] = value.split(':').map(Number);
  const hour24 = Math.min(23, Math.max(0, h));
  const minute = Math.min(59, Math.max(0, m));
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 < 12 ? 'AM' : 'PM';
  return { hour12, minute, ampm };
}

/** Build "HH:mm" from 12h + AM/PM */
function toTimeString(hour12, minute, ampm) {
  let h = hour12;
  if (ampm === 'PM' && hour12 !== 12) h += 12;
  if (ampm === 'AM' && hour12 === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

/** Display value for input: "HH:mm" -> "02:30 PM" or "" */
function formatDisplay(value) {
  if (!value) return '';
  const { hour12, minute, ampm } = parseTime(value);
  return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AMPM = ['AM', 'PM'];

/** Check if selected date is today */
function isToday(selectedDate) {
  if (!selectedDate) return false;
  const today = new Date();
  const [y, m, d] = selectedDate.split('-').map(Number);
  const selected = new Date(y, m - 1, d);
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return selected.getTime() === todayDate.getTime();
}

/** Check if a time is before the minimum allowed time */
function isTimeDisabled(hour12, minute, ampm, minTime, selectedDate) {
  if (!minTime || !isToday(selectedDate)) return false;
  const [minH, minM] = minTime.split(':').map(Number);
  const timeStr = toTimeString(hour12, minute, ampm);
  const [h, m] = timeStr.split(':').map(Number);
  return h < minH || (h === minH && m < minM);
}

/** Time input with popover picker; value is "HH:mm" (24h). Same rounded-card UI as date picker. */
export default function TimeInput({ value, onChange, name, required, minTime, selectedDate }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [local, setLocal] = useState(() => parseTime(value));
  const wrapperRef = useRef(null);
  const hourRef = useRef(null);
  const minRef = useRef(null);
  const ampmRef = useRef(null);

  useEffect(() => {
    setLocal(parseTime(value));
  }, [value]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDocClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [pickerOpen]);

  const openPicker = (e) => {
    e.preventDefault();
    setPickerOpen((open) => !open);
  };

  const scrollToSelected = (ref, index) => {
    if (!ref.current) return;
    const el = ref.current.querySelector('[data-index="' + index + '"]');
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  };

  useEffect(() => {
    if (!pickerOpen) return;
    const t = setTimeout(() => {
      scrollToSelected(hourRef, local.hour12 - 1);
      scrollToSelected(minRef, local.minute);
      scrollToSelected(ampmRef, local.ampm === 'AM' ? 0 : 1);
    }, 50);
    return () => clearTimeout(t);
  }, [pickerOpen, local.hour12, local.minute, local.ampm]);

  const displayValue = value ? formatDisplay(value) : '';

  return (
    <div className="time-input-wrap" ref={wrapperRef}>
      <input
        type="text"
        name={name}
        required={required}
        value={displayValue}
        readOnly
        placeholder="--:-- --"
        onClick={openPicker}
        onFocus={(e) => e.target.blur()}
        aria-label="Select time"
      />
      <button
        type="button"
        className="time-input-clock-btn"
        onClick={openPicker}
        onMouseDown={(e) => e.preventDefault()}
        title="Choose time"
        aria-label="Open time picker"
      >
        {CLOCK_ICON}
      </button>
      {pickerOpen && (
        <div className="time-input-picker" onMouseDown={(e) => e.preventDefault()}>
          <div className="time-input-picker-columns">
            <div className="time-input-picker-col" ref={hourRef}>
              <div className="time-input-picker-col-label">Hour</div>
              <div className="time-input-picker-col-list">
                {HOURS.map((h) => {
                  const hourDisabled = isTimeDisabled(h, local.minute, local.ampm, minTime, selectedDate);
                  return (
                    <button
                      key={h}
                      type="button"
                      className={`time-input-picker-option${local.hour12 === h ? ' selected' : ''}${hourDisabled ? ' disabled' : ''}`}
                      data-index={h - 1}
                      onClick={() => {
                        if (hourDisabled) return;
                        const next = { ...local, hour12: h };
                        setLocal(next);
                        onChange(toTimeString(next.hour12, next.minute, next.ampm));
                      }}
                      disabled={hourDisabled}
                    >
                      {String(h).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="time-input-picker-col" ref={minRef}>
              <div className="time-input-picker-col-label">Min</div>
              <div className="time-input-picker-col-list">
                {MINUTES.map((m) => {
                  const minuteDisabled = isTimeDisabled(local.hour12, m, local.ampm, minTime, selectedDate);
                  return (
                    <button
                      key={m}
                      type="button"
                      className={`time-input-picker-option${local.minute === m ? ' selected' : ''}${minuteDisabled ? ' disabled' : ''}`}
                      data-index={m}
                      onClick={() => {
                        if (minuteDisabled) return;
                        const next = { ...local, minute: m };
                        setLocal(next);
                        onChange(toTimeString(next.hour12, next.minute, next.ampm));
                      }}
                      disabled={minuteDisabled}
                    >
                      {String(m).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="time-input-picker-col" ref={ampmRef}>
              <div className="time-input-picker-col-label">AM/PM</div>
              <div className="time-input-picker-col-list">
                {AMPM.map((a) => {
                  const ampmDisabled = isTimeDisabled(local.hour12, local.minute, a, minTime, selectedDate);
                  return (
                    <button
                      key={a}
                      type="button"
                      className={`time-input-picker-option${local.ampm === a ? ' selected' : ''}${ampmDisabled ? ' disabled' : ''}`}
                      data-index={a === 'AM' ? 0 : 1}
                      onClick={() => {
                        if (ampmDisabled) return;
                        const next = { ...local, ampm: a };
                        setLocal(next);
                        onChange(toTimeString(next.hour12, next.minute, next.ampm));
                      }}
                      disabled={ampmDisabled}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
