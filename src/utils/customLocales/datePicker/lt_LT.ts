import TimePickerLocale from "../timePicker/sq_AL";

const calendarLocale = {
  locale: "lt_LT",
  today: "Šiandien",
  now: "Dabar",
  backToToday: "Grįžti į šiandienę",
  ok: "Gerai",
  clear: "Aišku",
  month: "Mėnuo",
  year: "Metai",
  timeSelect: "pasirinkti laiką",
  dateSelect: "pasirinkite datą",
  weekSelect: "Pasirinkite savaitę",
  monthSelect: "Pasirinkite mėnesį",
  yearSelect: "Pasirinkite metus",
  decadeSelect: "Pasirinkite dešimtmetį",
  yearFormat: "YYYY",
  dateFormat: "M/D/YYYY",
  dayFormat: "D",
  dateTimeFormat: "M/D/YYYY HH:mm:ss",
  monthBeforeYear: true,
  previousMonth: "Ankstesnis mėnuo (PageUp)",
  nextMonth: "Kitas mėnuo (PageDown)",
  previousYear: "Praėjusiais metais (Control + left)",
  nextYear: "Kitais metais (Control + right)",
  previousDecade: "Paskutinis dešimtmetis",
  nextDecade: "Kitas dešimtmetis",
  previousCentury: "Praėjęs amžius",
  nextCentury: "Kitas amžius"
};

const datePickerLocale = {
  lang: {
    placeholder: "Pasirinkite datą",
    yearPlaceholder: "Pasirinkite metus",
    quarterPlaceholder: "Pasirinkite ketvirtį",
    monthPlaceholder: "Pasirinkite mėnesį",
    weekPlaceholder: "Pasirinkite savaitę",
    rangePlaceholder: ["Pradžios data", "Pabaigos data"],
    rangeYearPlaceholder: ["Pradžios metai", "Metų pabaiga"],
    rangeQuarterPlaceholder: ["Ketvirčio pradžia", "Ketvirčio pabaiga"],
    rangeMonthPlaceholder: ["Pradėti mėnesį", "Mėnesio pabaiga"],
    rangeWeekPlaceholder: ["Pradėti savaitę", "Savaitės pabaiga"],
    ...calendarLocale
  },
  timePickerLocale: {
    ...TimePickerLocale
  }
};

export default datePickerLocale;
