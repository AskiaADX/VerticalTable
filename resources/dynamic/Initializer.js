{%
Dim i1
Dim i2
Dim i3
Dim i4
Dim i5
Dim i6
Dim i7
Dim i8
Dim i9
Dim varLim
Dim column
Dim columnQuestion
Dim ranking
Dim columnNumber = 1
For i1 = 2 To 5
    columnQuestion = CurrentADC.PropQuestion("questionCol" + i1)
    If columnQuestion.Id <> DK Then
        columnNumber = i1
    Else
        Break
    EndIf
Next i1
%}

(function () {
  var sidebyside = new SideBySide({
    instanceId: {%= CurrentADC.InstanceId %},
    responsiveWidth:  parseInt('{%= CurrentADC.PropValue("responsiveWidth") %}',10),
    showTotal: {%= CurrentADC.PropValue("showTotal") %},
    useSlider: {%= CurrentADC.PropValue("useSlider") %},
    headerFixed: {%= On(CurrentADC.PropValue("headerFixed") = "1", true, false)%},
    stepByStep: {%= On(CurrentADC.PropValue("stepByStep") = "yes", true, false)%},
    questions: [{% For i5 = 1 To columnNumber
    	column = CurrentADC.PropQuestion("questionCol" + i5)
            If ((column.Id = DK) and (i5 = 1)) Then
                column = CurrentQuestion
            EndIf
    %}{%:= On((column.Id <> DK), "'" + column.Shortcut + "'", "null")%}{%= On(i5 <> columnNumber, ",", "") 
		%}{%Next i5 %}],
    maxLimit: [{% For i6 = 1 To columnNumber
    	column = CurrentADC.PropQuestion("questionCol" + i6)
            If ((column.Id = DK) and (i6 = 1)) Then
                column = CurrentQuestion
            Endif
    varLim = CurrentADC.PropValue("maxNumLimit" + i6) %}{%= On((varLim <> "" and column.Type = "numeric" ), varLim, "undefined")%}{%= On(i6 <> columnNumber, ",", "") %}{% Next i6 %}],
    rankingBox: [{% For i7 = 1 To columnNumber
    	column = CurrentADC.PropQuestion("questionCol" + i7)
            If ((column.Id = DK) and (i7 = 1)) Then
                column = CurrentQuestion
            Endif
    ranking = CurrentADC.PropValue("colAsComboBox" + i7) %}{%= On((ranking = "2") and (column.Type = "single"), true, false)%}{%= On(i7 <> columnNumber, ",", "") %}{% Next i7 %}],
    suffixes: [{% For i8 = 1 To columnNumber
    	column = CurrentADC.PropQuestion("questionCol" + i8)
            If ((column.Id = DK) and (i8 = 1)) Then
                column = CurrentQuestion
            EndIf
    %}{%:= On((column.Type = "numeric"), "'" + CurrentADC.PropValue("numBoxSuffix" + i8) + "'", "''")%}{%= On(i8 <> columnNumber, ",", "") 
		%}{%Next i8 %}],
    decimals: [{% For i9 = 1 To columnNumber
    	column = CurrentADC.PropQuestion("questionCol" + i9)
            If ((column.Id = DK) and (i9 = 1)) Then
                column = CurrentQuestion
            EndIf
    %}{%:= On((column.Type = "numeric"), column.Decimals + "", "")%}{%= On(i9 <> columnNumber, ",", "") 
		%}{%Next i9 %}]
  });
  {% 
	For i2 = 1 to columnNumber 
    	column = CurrentADC.PropQuestion("questionCol"+i2)
    	If column.Type = "datetime" Then 
        	If(Not(column.IsDateOnly)) Then
                For i3 = 1 to CurrentQuestion.ParentLoop.Answers.Count
    				column = CurrentADC.PropQuestion("questionCol"+i2)
					column = column.AllIterations[i3] %}
  var timePicker{%= column.InputCode %} = new TimePicker({
    showSeconds: {%= CurrentADC.PropValue("showSeconds") %},
    stepMinutes: {%= CurrentADC.PropValue("stepMinutes") %},
    stepSeconds: {%= CurrentADC.PropValue("stepSeconds") %},
    imperial: {%= CurrentADC.PropValue("imperial")%},
    hideInput: true,
    minHour: {%= Hour(column.MinDate) %},
    maxHour: {%= Hour(column.MaxDate) %},
    selectedHour: '{%= Hour(column.Iteration(column.ParentLoop.Answers[i3].Index).Value.ToDate()) %}',
    selectedMin: '{%= Minute(column.Iteration(column.ParentLoop.Answers[i3].Index).Value.ToDate()) %}',
    selectedSec: '{%= Second(column.Iteration(column.ParentLoop.Answers[i3].Index).Value.ToDate()) %}',
    question: '{%= column.Shortcut %}',
    adcId: {%= CurrentADC.InstanceId %},
    inputCode: {%= column.InputCode %}
  });
{%            Next i3
        	EndIf
			column = CurrentADC.PropQuestion("questionCol"+i2)
			If (Not(column.IsTimeOnly)) Then 
				For i4 = 1 to CurrentQuestion.ParentLoop.Answers.Count
    				column = CurrentADC.PropQuestion("questionCol"+i2)
					column = column.AllIterations[i4] %}
  var datePicker{%= column.InputCode %} = new DatePicker({
    adcId: {%= CurrentADC.InstanceId%},
    inputNameX: 'askia-input-date{%= column.InputCode %}',
    defaultDate: '{%= CurrentADC.PropValue("defaultDate").ToString() %}',
    bound: {%= CurrentADC.PropValue("bound") %},
    position: '{%= CurrentADC.PropValue("position").ToString() %}',
    setDefaultDate: {%= CurrentADC.PropValue("setDefaultDate") %},
    firstDay: {%= CurrentADC.PropValue("firstDay").ToNumber() %},
    dpTheme: '{%= CurrentADC.PropValue("theme").ToString() %}',
    disableWeekends: {%= CurrentADC.PropValue("disableWeekends") %},
    showWeekNumber: {%= CurrentADC.PropValue("showWeekNumber") %},
    showMonthAfterYear: {%= CurrentADC.PropValue("showMonthAfterYear") %},
    numberOfMonths: {%= CurrentADC.PropValue("numberOfMonths") %},
    mainCalendar: '{%= CurrentADC.PropValue("mainCalendar") %}',
    minDate: '{%= column.MinDate.Format("yyyy-MM-dd") %}',
    maxDate: '{%= column.MaxDate.Format("yyyy-MM-dd") %}',
    minBound: {%= On(CvDkNa(column.MinDate.Format("yyyy").ToNumber()) < 1,1900,column.MinDate.Format("yyyy").ToNumber()) %},
    maxBound: {%= On(CvDkNa(column.MaxDate.Format("yyyy").ToNumber()) < 1,2100,column.MaxDate.Format("yyyy").ToNumber()) %},
    xdefaultDate: '{%= CurrentADC.PropValue("defaultDate").ToString() %}',
    xminBound: '{%= On(CvDkNa(column.MinDate.Format("yyyy").ToNumber()) < 1,1900,column.MinDate.Format("yyyy").ToNumber()) %}',
    xmaxBound: '{%= On(CvDkNa(column.MaxDate.Format("yyyy").ToNumber()) < 1,2100,column.MaxDate.Format("yyyy").ToNumber()) %}',
    lang: {%= Interview.Language.Id %},
    question: '{%:= column.Shortcut %}'
  });
    {% 	  		Next i4
        	EndIf
		EndIf
	Next i2 %}
} ());