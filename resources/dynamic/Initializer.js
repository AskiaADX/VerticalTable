{%
Dim nb = 1
Dim COLUMN_NUMBER = 5
Dim varLim
Dim ranking
Dim column
Dim inputName
Dim inputId
Dim i
Dim j

'DATEPCIKER OPTIONS

dim inputNameX 
dim defaultDate
dim bound 
dim position
dim setDefaultDate 
dim firstDay 
dim dpTheme
dim disableWeekends 
dim showWeekNumber 
dim showMonthAfterYear 
dim numberOfMonths 
dim mainCalendar
dim minDate
dim maxDate
dim minBound
dim maxBound

%}

(function () {
    var sidebysidetable = new SideBySideTable({
        instanceId: {%= CurrentADC.InstanceId %},
        nbCol: {%= COLUMN_NUMBER %},
        showSum: {%= On(CurrentADC.PropValue("showTotal") = "1", true, false)%},
        stepByStep: {%= On(CurrentADC.PropValue("stepByStep") = "1", true, false)%},
        blockLimit: {%= On(CurrentADC.PropValue("blockLimit") = "1", true, false)%},
        respOnHeader: {%= On(CurrentADC.PropValue("respOnHeader") = "1", true, false)%},
        headerFixed: {%= On(CurrentADC.PropValue("headerFixed") = "1", true, false)%},
        questions: [{% For i=1 To COLUMN_NUMBER
    	column = CurrentADC.PropQuestion("questionCol"+i)
            If column.Id = DK and i=1 Then
                column = CurrentQuestion
            Endif
    %}{%:= On((column.Id <> DK), "'" + column.Shortcut + "'", "null")%}{%= On(i<>5, ",", "") 
		%}{%Next%} ],
        maxLimit: [{% For i=1 To COLUMN_NUMBER
    	column = CurrentADC.PropQuestion("questionCol"+i)
            If column.Id = DK and i=1 Then
                column = CurrentQuestion
            Endif
    varLim = CurrentADC.PropValue("maxNumLimit"+i) %} {%= On((varLim <> "" and column.Type = "numeric" ), varLim, "null")%}{%= On(i<>5, ",", "") %}{%Next%} ],
        rankingBox: [{% For i=1 To COLUMN_NUMBER
    	ranking = CurrentADC.PropValue("colAsComboBox"+i) %} {%= On((ranking = "2"), true, false)%}{%= On(i<>5, ",", "") %}{%Next%} ]
    });
    
    {% 
	For i = 1 to COLUMN_NUMBER 
    	column = CurrentADC.PropQuestion("questionCol"+i)
    	If column.Type = "datetime" Then 
        	If(Not(column.IsDateOnly)) Then
                For j=1 to CurrentQuestion.ParentLoop.Answers.Count
    				column = CurrentADC.PropQuestion("questionCol"+i)
					column = column.AllIterations[j] %}
                    var timePickerR{%= j%}C{%= i%} = new TimePicker({
                        showSeconds: {%=CurrentADC.PropValue("showSeconds")%},
                        stepMinutes: {%=CurrentADC.PropValue("stepMinutes")%},
                        stepSeconds: {%=CurrentADC.PropValue("stepSeconds")%},
                        imperial: {%=CurrentADC.PropValue("imperial")%},
                        hideInput: true,
                        minHour: {%= Hour(column.MinDate) %},
                        maxHour: {%= Hour(column.MaxDate) %},
                        selected_hour: "{%= Hour(column.Iteration(column.ParentLoop.Answers[j].Index).Value.ToDate()) %}",
                        selected_min: "{%= Minute(column.Iteration(column.ParentLoop.Answers[j].Index).Value.ToDate()) %}",
                        selected_sec: "{%= Second(column.Iteration(column.ParentLoop.Answers[j].Index).Value.ToDate()) %}",
                        question: "{%= column.Shortcut %}",
                        adcId: {%= CurrentADC.InstanceId%},
                        row: {%= j %},
                        col: {%= i%}
                    });
        {% 	  Next
			EndIf
			column = CurrentADC.PropQuestion("questionCol"+i)
			If (Not(column.IsTimeOnly)) Then 
				'DATEPCIKER OPTIONS

                inputNameX = column.InputName("date")
                defaultDate = CurrentADC.PropValue("defaultDate").ToString()
                bound = CurrentADC.PropValue("bound")
                position = "'"+CurrentADC.PropValue("position").ToString()+"'"
                setDefaultDate = CurrentADC.PropValue("setDefaultDate")
                firstDay = CurrentADC.PropValue("firstDay").ToNumber()
                dpTheme = "'"+CurrentADC.PropValue("theme").ToString()+"'"
                disableWeekends = CurrentADC.PropValue("disableWeekends")
                showWeekNumber = CurrentADC.PropValue("showWeekNumber")
                showMonthAfterYear = CurrentADC.PropValue("showMonthAfterYear")
                numberOfMonths = CurrentADC.PropValue("numberOfMonths")
                mainCalendar = "'"+CurrentADC.PropValue("mainCalendar")+"'"
                minDate = column.MinDate.Format("yyyy-MM-dd")
                maxDate = column.MaxDate.Format("yyyy-MM-dd")

             	minBound = column.MinDate.Format("yyyy").ToNumber()
                maxBound = column.MaxDate.Format("yyyy").ToNumber()

                if CvDkNa(minBound) < 1 Then
                    minBound = 1900
                EndIf

                if CvDkNa(maxBound) < 1 Then
                    maxBound = 2100
                EndIf
				For j=1 to CurrentQuestion.ParentLoop.Answers.Count 
    				column = CurrentADC.PropQuestion("questionCol"+i)
					column = column.AllIterations[j]
                    inputName = column.InputName()
                    inputId     = (inputName + "_" + i).Replace("D", "askia-input-dateO")%}
                	var datePickerR{%= j%}C{%= i%} = new DatePicker({
                        adcId: {%= CurrentADC.InstanceId %},
                        inputNameX: "{%= inputId %}",
                        defaultDate: "{%= defaultDate %}",
                        bound: {%= bound%},
                        position: {%= position %},
                        setDefaultDate:{%= setDefaultDate%},
                        firstDay: {%= firstDay%},
                        dpTheme: {%= dpTheme%},
                        disableWeekends: {%= disableWeekends %},
                        showWeekNumber: {%= showWeekNumber %},
                        showMonthAfterYear: {%= showMonthAfterYear%},
                        numberOfMonths: {%= numberOfMonths %},
                        mainCalendar: {%= mainCalendar%},
                        minDate:'{%=minDate%}',
                        maxDate:'{%= maxDate%}',
                        minBound:{%= minBound%},
                        maxBound:{%= maxBound%},
                        xdefaultDate: '{%=defaultDate.ToString()%}',
                        xminBound: '{%=minBound%}',
                        xmaxBound: '{%=maxBound%}',
                        lang: {%= Interview.Language.Id %},
                        question: '{%:= column.Shortcut %}'
                	});
        {% 	  Next 	
			EndIf
		EndIf
	Next%}
} ());