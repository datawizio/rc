import TimePickerLocale from "../timePicker/ka_KA";

const calendarLocale = {
  locale: "ka_KA",
  today: "დღეს",
  now: "ახლა",
  backToToday: "დაუბრუნდით დღეს",
  ok: "Კარგი",
  clear: "ნათელია",
  month: "თვე",
  year: "წელი",
  timeSelect: "აირჩიეთ დრო",
  dateSelect: "აირჩიეთ თარიღი",
  weekSelect: "აირჩიეთ კვირა",
  monthSelect: "შეარჩიე თვე",
  yearSelect: "აირჩიეთ წელი",
  decadeSelect: "შეარჩიე ათწლეული",
  yearFormat: "YYYY",
  dateFormat: "M/D/YYYY",
  dayFormat: "D",
  dateTimeFormat: "M/D/YYYY HH:mm:ss",
  monthBeforeYear: true,
  previousMonth: "წინა თვე (PageUp)",
  nextMonth: "შემდეგი თვე (PageDown)",
  previousYear: "გასულ წელს (Control + left)",
  nextYear: "შემდეგ წელს (Control + right)",
  previousDecade: "ბოლო ათწლეული",
  nextDecade: "შემდეგი ათწლეული",
  previousCentury: "Ბოლო საუკუნე",
  nextCentury: "შემდეგი საუკუნე"
};

const datePickerLocale = {
  lang: {
    placeholder: "აირჩიეთ თარიღი",
    yearPlaceholder: "აირჩიეთ წელი",
    quarterPlaceholder: "აირჩიეთ კვარტალი",
    monthPlaceholder: "აირჩიეთ თვე",
    weekPlaceholder: "აირჩიეთ კვირა",
    rangePlaceholder: ["Დაწყების თარიღი", "Დასრულების თარიღი"],
    rangeYearPlaceholder: ["დაწყების წელი", "ბოლო წელი"],
    rangeQuarterPlaceholder: ["მეოთხედის დასაწყისი", "მეოთხედის დასასრული"],
    rangeMonthPlaceholder: ["თვის დაწყება", "ბოლო თვე"],
    rangeWeekPlaceholder: ["დაწყების კვირა", "კვირის ბოლო"],
    ...calendarLocale
  },
  timePickerLocale: {
    ...TimePickerLocale
  }
};

export default datePickerLocale;
