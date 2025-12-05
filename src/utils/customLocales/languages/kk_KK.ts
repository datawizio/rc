const typeTemplate = "${label} жарамды ${type} емес";

const timePicker = {
  placeholder: "Уақытты таңдаңыз",
  rangePlaceholder: ["Басталу уақыты", "Аяқталу уақыты"]
};

const pagination = {
  items_per_page: "/ бет",
  jump_to: "Бару",
  jump_to_confirm: "растаңыз",
  page: "бет",
  prev_page: "Алдыңғы бет",
  next_page: "Келесі бет",
  prev_5: "Алдыңғы 5 бет",
  next_5: "Келесі 5 бет",
  prev_3: "Алдыңғы 3 бет",
  next_3: "Келесі 3 бет"
};

const datePicker = {
  lang: {
    locale: "kk_KK",
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
  },
  timePickerLocale: timePicker
};

const localeValues = {
  locale: "kk",
  Pagination: pagination,
  DatePicker: datePicker,
  TimePicker: timePicker,
  Calendar: datePicker,
  global: {
    placeholder: "Таңдаңыз"
  },
  Table: {
    filterTitle: "Сүзгі мәзірі",
    filterConfirm: "ЖАРАЙДЫ МА",
    filterReset: "Қалпына келтіру",
    filterEmptyText: "Сүзгілер жоқ",
    emptyText: "Деректер жоқ",
    selectAll: "Ағымдағы бетті таңдаңыз",
    selectInvert: "Ағымдағы бетті аудару",
    selectNone: "Барлық деректерді жою",
    selectionAll: "Барлық деректерді таңдаңыз",
    sortTitle: "Сұрыптау",
    expand: "Жолды кеңейту",
    collapse: "Жолды жию",
    triggerDesc: "Сұрыптау тармағын таңдаңыз",
    triggerAsc: "Сұрыптауды өсу бойынша нұқыңыз",
    cancelSort: "Сұрыптауды болдырмау үшін нұқыңыз"
  },
  Modal: {
    okText: "ЖАРАЙДЫ МА",
    cancelText: "Болдырмау",
    justOkText: "ЖАРАЙДЫ МА"
  },
  Popconfirm: {
    okText: "ЖАРАЙДЫ МА",
    cancelText: "Болдырмау"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Осы жерден іздеңіз",
    itemUnit: "элемент",
    itemsUnit: "заттар",
    remove: "Алып тастаңыз",
    selectCurrent: "Ағымдағы бетті таңдаңыз",
    removeCurrent: "Ағымдағы бетті жою",
    selectAll: "Барлық деректерді таңдаңыз",
    removeAll: "Барлық деректерді жойыңыз",
    selectInvert: "Ағымдағы бетті аудару"
  },
  Upload: {
    uploading: "Жүктелуде ...",
    removeFile: "Файлды жою",
    uploadError: "Жүктеу қатесі",
    previewFile: "Алдын-ала қарау файлы",
    downloadFile: "Файлды жүктеу"
  },
  Empty: {
    description: "Деректер жоқ"
  },
  Icon: {
    icon: "белгішесін басыңыз"
  },
  Text: {
    edit: "Өңдеу",
    copy: "Көшіру",
    copied: "Көшірілген",
    expand: "Кеңейту"
  },
  PageHeader: {
    back: "Артқа"
  },
  Form: {
    defaultValidateMessages: {
      default: "${label} өрісін тексеру қатесі",
      required: "${label} енгізіңіз",
      enum: "${label} [${enum}] біреуі болуы керек",
      whitespace: "${label} бос таңба болмауы керек",
      date: {
        format: "${label} күн пішімі жарамсыз",
        parse: "${label} күнге өзгертілмейді",
        invalid: "${label} жарамсыз күн"
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
        len: "${label} ${len} таңбаларынан тұруы керек",
        min: "${label} кемінде ${min} таңбадан тұрады",
        max: "${label} ${max} таңбаларына дейін",
        range: "${label} ${min} - ${max} таңбалары арасында болуы керек"
      },
      number: {
        len: "${label} ${len} -ге тең болуы керек",
        min: "${label} ең төменгі мәні - ${min}",
        max: "${label} максималды мәні - ${max}",
        range: "${label} ${min} - ${max} арасында болуы керек"
      },
      array: {
        len: "${len} ${label} болуы керек",
        min: "Кем дегенде ${min} ${label}",
        max: "Ең көбі ${max} ${label}",
        range: "${label} мөлшері ${min} - ${max} арасында болуы керек"
      },
      pattern: {
        mismatch: "${label} үлгісі ${pattern} сәйкес келмейді"
      }
    }
  },
  Image: {
    preview: "Алдын-ала қарау"
  }
};

export default localeValues;
