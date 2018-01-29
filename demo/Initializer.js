(function () {
  var sidebyside = new SideBySide({
    instanceId: 1,
    showTotal: 2,
    headerFixed: true,
    questions: ['Like', 'Quantity', 'Comment', 'YesNo', 'Time' ],
    maxLimit: [ undefined, 100, undefined, undefined, undefined ]
  });

  var timePicker5 = new TimePicker({
    showSeconds: false,
    stepMinutes: 1,
    stepSeconds: 1,
    imperial: false,
    hideInput: true,
    minHour: -1,
    maxHour: -1,
    selectedHour: '6',
    selectedMin: '19',
    selectedSec: '0',
    question: 'Time',
    adcId: 1,
    inputCode: 5
  });

  var timePicker11 = new TimePicker({
    showSeconds: false,
    stepMinutes: 1,
    stepSeconds: 1,
    imperial: false,
    hideInput: true,
    minHour: -1,
    maxHour: -1,
    selectedHour: '-1',
    selectedMin: '-1',
    selectedSec: '-1',
    question: 'Time',
    adcId: 1,
    inputCode: 11
  });

  var datePicker5 = new DatePicker({
    adcId: 1,
    inputNameX: 'askia-input-date5',
    defaultDate: '',
    bound: 1,
    position: 'bottom left',
    setDefaultDate: 0,
    firstDay: 1,
    dpTheme: 'light-theme',
    disableWeekends: 0,
    showWeekNumber: 0,
    showMonthAfterYear: 0,
    numberOfMonths: 1,
    mainCalendar: 'left',
    minDate: '',
    maxDate: '',
    minBound: 1900,
    maxBound: 2100,
    xdefaultDate: '',
    xminBound: '1900',
    xmaxBound: '2100',
    lang: 2057,
    question: 'Time'
  });

  var datePicker11 = new DatePicker({
    adcId: 1,
    inputNameX: 'askia-input-date11',
    defaultDate: '',
    bound: 1,
    position: 'bottom left',
    setDefaultDate: 0,
    firstDay: 1,
    dpTheme: 'light-theme',
    disableWeekends: 0,
    showWeekNumber: 0,
    showMonthAfterYear: 0,
    numberOfMonths: 1,
    mainCalendar: 'left',
    minDate: '',
    maxDate: '',
    minBound: 1900,
    maxBound: 2100,
    xdefaultDate: '',
    xminBound: '1900',
    xmaxBound: '2100',
    lang: 2057,
    question: 'Time'
  });
} ());