import TimePickerLocale from "../timePicker/kk_KK";

const calendarLocale = {
  locale: "kk_KK",
  today: "Бүгін",
  now: "Енді",
  backToToday: "Бүгінге оралыңыз",
  ok: "Жарайды ма",
  clear: "Айқын",
  month: "Ай",
  year: "Жыл",
  timeSelect: "уақытты таңдаңыз",
  dateSelect: "күнді таңдаңыз",
  weekSelect: "Аптаны таңдаңыз",
  monthSelect: "Айды таңдаңыз",
  yearSelect: "Жыл таңдаңыз",
  decadeSelect: "Онжылдықты таңдаңыз",
  yearFormat: "YYYY",
  dateFormat: "M/D/YYYY",
  dayFormat: "D",
  dateTimeFormat: "M/D/YYYY HH:mm:ss",
  monthBeforeYear: true,
  previousMonth: "Алдыңғы ай (PageUp)",
  nextMonth: "Келесі ай (PageDown)",
  previousYear: "Өткен жыл (Control + left)",
  nextYear: "Келесі жыл (Control + right)",
  previousDecade: "Соңғы онжылдық",
  nextDecade: "Келесі онжылдық",
  previousCentury: "Өткен ғасыр",
  nextCentury: "Келесі ғасыр"
};

const datePickerLocale = {
  lang: {
    placeholder: "Күнді таңдаңыз",
    yearPlaceholder: "Жылды таңдаңыз",
    quarterPlaceholder: "Тоқсанды таңдаңыз",
    monthPlaceholder: "Айды таңдаңыз",
    weekPlaceholder: "Апта таңдаңыз",
    rangePlaceholder: ["Басталатын күн", "Аяқталу күні"],
    rangeYearPlaceholder: ["Басталу жылы", "Жылдың соңы"],
    rangeQuarterPlaceholder: ["Тоқсан басталуы", "Тоқсан аяқталуы"],
    rangeMonthPlaceholder: ["Айдың басталуы", "Аяқталған ай"],
    rangeWeekPlaceholder: ["Апта басталады", "Апта соңы"],
    ...calendarLocale
  },
  timePickerLocale: {
    ...TimePickerLocale
  }
};

export default datePickerLocale;
