import { APPOINTMENT_COLORS } from "./Theme";
import { DAYS_CONVERSION } from "./Constants";

export function getRandomAppointmentColor(prevColors = []) {
  let colors = APPOINTMENT_COLORS.filter(
    (color) => prevColors.indexOf(color) === -1
  );

  return colors[Math.floor(Math.random() * colors.length)];
}

export function getrRuleDays(courseDaysString) {
  courseDaysString = courseDaysString.trim();
  let courseDaysArr = [];
  for (const [keyDay, rDay] of Object.entries(DAYS_CONVERSION)) {
    if (courseDaysString.includes(keyDay)) {
      courseDaysString.replace(keyDay, "");
      courseDaysArr.push(rDay);
    }
  }
  return courseDaysArr.join(",");
}
