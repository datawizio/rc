const typeTemplate = "${label} nuk është një ${type} e vlefshme";

const timePicker = {
  placeholder: "Zgjidh kohën",
  rangePlaceholder: ["Koha e fillimit", "Koha e përfundimit"]
};

const pagination = {
  items_per_page: "/ faqe",
  jump_to: "Shko te",
  jump_to_confirm: "konfirmo",
  page: "faqe",
  prev_page: "Faqja e mëparshme",
  next_page: "Faqja tjetër",
  prev_5: "5 faqet e mëparshme",
  next_5: "5 faqet e ardhshme",
  prev_3: "3 faqet e mëparshme",
  next_3: "3 faqet e ardhshme"
};

const datePicker = {
  lang: {
    locale: "sq_AL",
    placeholder: "Zgjidh datën",
    yearPlaceholder: "Zgjidh vitin",
    quarterPlaceholder: "Zgjidh tremujorin",
    monthPlaceholder: "Zgjidh muajin",
    weekPlaceholder: "Zgjidh javën",
    rangePlaceholder: ["Data e fillimit", "Data e përfundimit"],
    rangeYearPlaceholder: ["Viti i fillimit", "Viti i përfundimit"],
    rangeQuarterPlaceholder: [
      "Tremujori i fillimit",
      "Tremujori i përfundimit"
    ],
    rangeMonthPlaceholder: ["Muaji i fillimit", "Muaji i përfundimit"],
    rangeWeekPlaceholder: ["Java e fillimit", "Java e përfundimit"],
    today: "Sot",
    now: "Tani",
    backToToday: "Kthehu te sot",
    ok: "Ok",
    clear: "Pastro",
    month: "Muaj",
    year: "Vit",
    timeSelect: "Zgjidh kohën",
    dateSelect: "Zgjidh datën",
    weekSelect: "Zgjidh javën",
    monthSelect: "Zgjidh muajin",
    yearSelect: "Zgjidh vitin",
    decadeSelect: "Zgjidh dekadën",
    yearFormat: "YYYY",
    dateFormat: "D/M/YYYY",
    dayFormat: "D",
    dateTimeFormat: "D/M/YYYY HH:mm:ss",
    monthBeforeYear: true,
    previousMonth: "Muaji i kaluar (PageUp)",
    nextMonth: "Muaji tjetër (PageDown)",
    previousYear: "Viti i kaluar (Control + majtas)",
    nextYear: "Viti tjetër (Control + djathtas)",
    previousDecade: "Dekada e kaluar",
    nextDecade: "Dekada tjetër",
    previousCentury: "Shekulli i kaluar",
    nextCentury: "Shekulli tjetër"
  },
  timePickerLocale: timePicker
};

const localeValues = {
  locale: "sq",
  Pagination: pagination,
  DatePicker: datePicker,
  TimePicker: timePicker,
  Calendar: datePicker,
  global: {
    placeholder: "Ju lutemi zgjidhni"
  },
  Table: {
    filterTitle: "Menyja e filtrimit",
    filterConfirm: "OK",
    filterReset: "Rivendos",
    filterEmptyText: "Pa filtra",
    emptyText: "Nuk ka të dhëna",
    selectAll: "Zgjidh faqen aktuale",
    selectInvert: "Përmbys faqen aktuale",
    selectNone: "Fshi të gjitha të dhënat",
    selectionAll: "Zgjidh të gjitha të dhënat",
    sortTitle: "Rendit",
    expand: "Zgjero rreshtin",
    collapse: "Palos rreshtin",
    triggerDesc: "Kliko për të renditur në mënyrë zbritëse",
    triggerAsc: "Kliko për të renditur në mënyrë rritëse",
    cancelSort: "Kliko për të anuluar renditjen"
  },
  Modal: {
    okText: "OK",
    cancelText: "Anulo",
    justOkText: "OK"
  },
  Popconfirm: {
    okText: "OK",
    cancelText: "Anulo"
  },
  Transfer: {
    titles: ["", ""],
    searchPlaceholder: "Kërko këtu",
    itemUnit: "artikull",
    itemsUnit: "artikuj",
    remove: "Hiq",
    selectCurrent: "Zgjidh faqen aktuale",
    removeCurrent: "Hiq faqen aktuale",
    selectAll: "Zgjidh të gjitha të dhënat",
    removeAll: "Hiq të gjitha të dhënat",
    selectInvert: "Përmbys faqen aktuale"
  },
  Upload: {
    uploading: "Duke ngarkuar...",
    removeFile: "Hiq skedarin",
    uploadError: "Gabim gjatë ngarkimit",
    previewFile: "Parapamje e skedarit",
    downloadFile: "Shkarko skedarin"
  },
  Empty: {
    description: "Nuk ka të dhëna"
  },
  Icon: {
    icon: "ikonë"
  },
  Text: {
    edit: "Redakto",
    copy: "Kopjo",
    copied: "U kopjua",
    expand: "Zgjero"
  },
  PageHeader: {
    back: "Kthehu"
  },
  Form: {
    optional: "(opsionale)",
    defaultValidateMessages: {
      default: "Gabim validimi për fushën ${label}",
      required: "Ju lutemi shkruani ${label}",
      enum: "${label} duhet të jetë një nga [${enum}]",
      whitespace: "${label} nuk mund të përmbajë vetëm hapësira",
      date: {
        format: "Formati i datës për ${label} është i pavlefshëm",
        parse: "${label} nuk mund të konvertohet në një datë",
        invalid: "${label} është një datë e pavlefshme"
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
        len: "${label} duhet të ketë ${len} karaktere",
        min: "${label} duhet të ketë të paktën ${min} karaktere",
        max: "${label} duhet të ketë deri në ${max} karaktere",
        range: "${label} duhet të ketë nga ${min} deri në ${max} karaktere"
      },
      number: {
        len: "${label} duhet të jetë i barabartë me ${len}",
        min: "${label} duhet të jetë minimumi ${min}",
        max: "${label} duhet të jetë maksimumi ${max}",
        range: "${label} duhet të jetë midis ${min}-${max}"
      },
      array: {
        len: "Duhet të jetë ${len} ${label}",
        min: "Të paktën ${min} ${label}",
        max: "Jo më shumë se ${max} ${label}",
        range: "Numri i ${label} duhet të jetë midis ${min}-${max}"
      },
      pattern: {
        mismatch: "${label} nuk përputhet me modelin ${pattern}"
      }
    }
  },
  Image: {
    preview: "Parapamje"
  }
};

export default localeValues;
