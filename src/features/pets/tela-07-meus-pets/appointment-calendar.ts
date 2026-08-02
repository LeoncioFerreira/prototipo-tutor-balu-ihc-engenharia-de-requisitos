export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function buildCalendarDays(month: Date): Array<Date | null> {
  const first = startOfMonth(month);
  const lastDay = new Date(first.getFullYear(), first.getMonth() + 1, 0, 12).getDate();
  const days: Array<Date | null> = Array.from({ length: first.getDay() }, () => null);

  for (let day = 1; day <= lastDay; day += 1) {
    days.push(new Date(first.getFullYear(), first.getMonth(), day, 12));
  }
  while (days.length < 42) days.push(null);
  return days;
}

export function availableTimesFor(date: Date) {
  return date.getDate() % 2 === 0
    ? ["08:00", "09:30", "14:00", "16:30"]
    : ["09:30", "11:00", "14:00", "15:30"];
}
