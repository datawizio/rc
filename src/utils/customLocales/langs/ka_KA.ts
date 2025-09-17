import Pagination from "../pagination/ka_KA";
import DatePicker from "../datePicker/ka_KA";
import TimePicker from "../timePicker/ka_KA";
import Calendar from "../calendar/ka_KA";

const typeTemplate = "${label} არ არის სწორი ${type}";

const localeValues = {
  locale: "ka",
  Pagination: Pagination,
  DatePicker: DatePicker,
  TimePicker: TimePicker,
  Calendar: Calendar,
  global: {
    placeholder: "გთხოვთ აირჩიოთ"
  },
  Table: {
    filterTitle: "ფილტრის მენიუ",
    filterConfirm: "კარგი",
    filterReset: "გადატვირთვა",
    filterEmptyText: "ფილტრები არ არის",
    emptyText: "მონაცემები არ არის",
    selectAll: "აირჩიეთ მიმდინარე გვერდი",
    selectInvert: "ინვერტული მიმდინარე გვერდი",
    selectNone: "ყველა მონაცემის წაშლა",
    selectionAll: "აირჩიეთ ყველა მონაცემი",
    sortTitle: "დალაგება",
    expand: "გაფართოების რიგი",
    collapse: "ჩამონგრევის რიგი",
    triggerDesc: "დააჭირეთ დალაგების დალაგების მიხედვით",
    triggerAsc: "დააჭირეთ დახარისხება ასვლის მიხედვით",
    cancelSort: "დააჭირეთ დახარისხების გაუქმებას"
  },
  Modal: {
    okText: "კარგი",
    cancelText: "გაუქმება",
    justOkText: "კარგი"
  },
  Popconfirm: {
    okText: "კარგი",
    cancelText: "გაუქმება"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Აქ მოძებნე",
    itemUnit: "ნივთი",
    itemsUnit: "საგნები",
    remove: "ამოიღეთ",
    selectCurrent: "აირჩიეთ მიმდინარე გვერდი",
    removeCurrent: "წაშალეთ მიმდინარე გვერდი",
    selectAll: "აირჩიეთ ყველა მონაცემი",
    removeAll: "ამოიღეთ ყველა მონაცემი",
    selectInvert: "ინვერტული მიმდინარე გვერდი"
  },
  Upload: {
    uploading: "ატვირთვა ...",
    removeFile: "ფაილის წაშლა",
    uploadError: "შეცდომა შეცდომა",
    previewFile: "გადახედვის ფაილი",
    downloadFile: "Გადმოწერეთ ფაილი"
  },
  Empty: {
    description: "Მონაცემები არ არის"
  },
  Icon: {
    icon: "ხატი"
  },
  Text: {
    edit: "რედაქტირება",
    copy: "დააკოპირეთ",
    copied: "გადაწერა",
    expand: "გაფართოება"
  },
  PageHeader: {
    back: "უკან"
  },
  Form: {
    defaultValidateMessages: {
      default: "საველე ვალიგების შეცდომა ${label}",
      required: "გთხოვთ, შეიყვანოთ ${label}",
      enum: "${label} უნდა იყოს ერთ-ერთი [${enum}]",
      whitespace: "${label} არ შეიძლება იყოს ცარიელი სიმბოლო",
      date: {
        format: "${label} თარიღის ფორმა არასწორია",
        parse: "${label} ვერ გადაკეთდება თარიღად",
        invalid: "${label} არასწორი თარიღია"
      },
      types: {
        string: typeTemplate,
        method: typeTemplate,
        array: typeTemplate,
        object: typeTemplate,
        number: typeTemplate,
        date: typeTemplate,
        boolean: typeTemplate,
        integer: typeTemplate,
        float: typeTemplate,
        regexp: typeTemplate,
        email: typeTemplate,
        url: typeTemplate,
        hex: typeTemplate
      },
      string: {
        len: "${label} უნდა იყოს ${len} სიმბოლო",
        min: "${label} least მინიმუმ ${min} სიმბოლო",
        max: "${label} მდე ${max} სიმბოლო",
        range: "${label} უნდა იყოს ${min} - ${max} სიმბოლოებს შორის"
      },
      number: {
        len: "${label} უნდა იყოს ტოლი ${len}",
        min: "${label} მინიმალური მნიშვნელობა ${min}",
        max: "${label} მაქსიმალური მნიშვნელობა ${max}",
        range: "${label} უნდა იყოს ${min} - ${max}"
      },
      array: {
        len: "უნდა იყოს ${len} ${label}",
        min: "მინიმუმ ${min} ${label}",
        max: "მაქსიმუმ ${max} ${label}",
        range: "${label} amount ღირებულება უნდა იყოს ${min} - ${max}"
      },
      pattern: {
        mismatch: "${label} არ შეესაბამება შაბლონს ${pattern}"
      }
    }
  },
  Image: {
    preview: "გადახედვა"
  }
};

export default localeValues;
