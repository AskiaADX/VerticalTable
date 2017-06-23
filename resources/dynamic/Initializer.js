{%
Dim nb = 0
Dim COLUMN_NUMBER = 5
Dim varLim
Dim ranking
Dim column
Dim i
Dim tmpQ
For i=1 To 5
    tmpQ = CurrentADC.Var("questionCol"+i).ToQuestion()
    If tmpQ.Id <> DK Then
        nb = nb + 1
    EndIf
Next
%}

(function () {
    var sidebysidetable = new SideBySideTable({
        instanceId: {%= CurrentADC.InstanceId %},
        nbCol: {%= nb %},
        showSum: {%= On(CurrentADC.PropValue("showTotal") = "1", true, false)%},
        stepByStep: {%= On(CurrentADC.PropValue("stepByStep") = "1", true, false)%},
        blockLimit: {%= On(CurrentADC.PropValue("blockLimit") = "1", true, false)%},
        respOnHeader: {%= On(CurrentADC.PropValue("respOnHeader") = "1", true, false)%},
        headerFixed: {%= On(CurrentADC.PropValue("headerFixed") = "1", true, false)%},
        questions: [{% For i=1 To COLUMN_NUMBER
            column = CurrentADC.Var("questionCol"+i).ToQuestion()
            If column.Id = DK and i=1 Then
                column = CurrentQuestion
            Endif
    %}{%:= On((column.Id <> DK), "'" + column.Shortcut + "'", "null")%}{%= On(i<>5, ",", "") 
		%}{%Next%} ],
        maxLimit: [{% For i=1 To COLUMN_NUMBER
    varLim = CurrentADC.PropValue("maxNumLimit"+i) %} {%= On((varLim <> ""), varLim, "null")%}{%= On(i<>5, ",", "") %}{%Next%} ],
        rankingBox: [{% For i=1 To COLUMN_NUMBER
    ranking = CurrentADC.PropValue("colAsComboBox"+i) %} {%= On((ranking = "2"), true, false)%}{%= On(i<>5, ",", "") %}{%Next%} ]
    });
} ());