/// <reference path="C:\Files\Source\Repos\CalculatorApp\Scripts/jquery-1.11.1.js" />
/// <reference path="C:\Files\Source\Repos\CalculatorApp\Scripts/jquery-ui-1.11.1.js" />

$(document).ready(function () {
    CalculatorInitialize();
});

function CalculatorInitialize() {
    $('#btnClearCharacter').on("click", ClearCharacter);
    $('#btnClearAll').on("click", ClearAll);
    $('#btnChangeSign').on("click", ChangeNumberSign);
    AddNumberEvenListeners();
    AddOperatorEvenListeners();
    $('#btnComma').on("click", AddComma);
    $('#btnTotal').on("click", CalculateTotal);

    SetCalculation(0);
    SetResult(0);

    $('#btnAddComment').on("click", AddComment);
    $('#btnPrint').on("click", PrintCalculations)
    $('#btnClearResultsList').on("click", ClearResultsList);

    $("#sortable").sortable();
    $("#sortable").disableSelection();
}

function GetCalculation() {
    return $('#txtCalculation').val();
}

function GetLastCharacter(string) {
    return string[string.length - 1];
}

function IsLastCharacterOperator(string) {
    if (IsOperator(GetLastCharacter(string))) {
        return true;
    }

    return false;
}

function SetCalculation(calculation) {
    $('#txtCalculation').val(calculation);
}

function SetResult(result) {
    $('#txtResult').val(result);
}

function CalculateTotal() {
    var lasku = GetCalculation();
    var allCalculations = GetCalculation();

    var numberOfCalculations = CountNumberOfCalculations(allCalculations);

    for (var i = 0; i < numberOfCalculations; i++) {
        var calculation = TakeCalculation(allCalculations);
        var result = ExecuteCalculation(calculation);
        allCalculations = ReplaceCalculationWithResult(allCalculations, calculation, result);
    }

    $('#txtResult').val(allCalculations);

    var lisattava = '<li><div style="width: 95%; display: inline-block;">' + lasku + ' = ' + allCalculations + '</div><span class="ui-icon ui-icon-closethick" style="border: solid thin; border-radius: 0.3em; width: 18px; height: 18px; display: inline-block; vertical-align: middle;"></span>' + '</li>'
    $('#sortable').append(lisattava)

    SetCalculation(0);
}

function CountNumberOfCalculations(allCalculations) {
    var numberOfCalculations = 0;
    for (var i = 0; i < allCalculations.length; i++) {
        if (IsOperator(allCalculations[i])) {
            numberOfCalculations++;
        }
    }
    return numberOfCalculations;
}

function TakeCalculation(allCalculations) {
    var calculation = new Array(3);
    var firstOperatorIndex = 0;

    for (var i = 0; i < allCalculations.length; i++) {
        if (IsOperator(allCalculations[i])) {
            if (firstOperatorIndex === 0) {
                calculation["firstNumber"] = Number(allCalculations.substring(0, i));
                calculation["operator"] = allCalculations[i];
                firstOperatorIndex = i;
            } else {
                calculation["secondNumber"] = Number(allCalculations.substring(firstOperatorIndex + 1, i));
                break;
            }
        }
    }
  
    if (calculation["secondNumber"] === undefined) {
        calculation["secondNumber"] = Number(allCalculations.substring(firstOperatorIndex + 1, i));
    }

    return calculation;
}

function ExecuteCalculation(calculation) {
    var operator = calculation["operator"];
    var firstNumber = Number(calculation["firstNumber"]);
    var secondNumber = Number(calculation["secondNumber"]);

    switch (calculation["operator"]) {
        case '+':
            return firstNumber + secondNumber;
            break;
        case '-':
            return firstNumber - secondNumber;
            break;
        case '*':
            return firstNumber * secondNumber;
            break;
        case '/':
            return firstNumber / secondNumber;
            break;
    }
}

function ReplaceCalculationWithResult(allCalculations, calculation, result) {
    var poistettavaSetti = calculation.length;
    var newCalculation = allCalculations.substring(poistettavaSetti, allCalculations.length);
    newCalculation = result + newCalculation;
    return newCalculation;
}


function ClearCharacter() {
    var calculation = GetCalculation();

    if (calculation.length === 0 || calculation.length === 1) {
        SetCalculation(0);
    } else {
        var newCalculation = calculation.substring(0, calculation.length - 1);

        if (IsLastCharacterOperator(newCalculation)) {
            newCalculation = calculation.substring(0, newCalculation.length - 1);
        }

        SetCalculation(newCalculation);
    }
}

function ClearAll() {
    SetCalculation(0);
    SetResult(0);
}

function ChangeNumberSign() {
    var calculation = GetCalculation();
    var operatorPosition = CheckFirstOperatorPosition(calculation);

    if (operatorPosition === 0) {
        SetCalculation(-parseFloat(calculation));
    } else {
        var formerCalculation = calculation.substring(0, operatorPosition + 1);
        var lastAddedNumber = parseFloat(calculation.substring(operatorPosition + 1));
        var lastAddedNumberSignChanged = -(lastAddedNumber);
        SetCalculation(formerCalculation + lastAddedNumberSignChanged);
    }
}

function CheckFirstOperatorPosition(calculation) {
    var operatorPositions = [];

    for (var i = 0; i < calculation.length; i++) {
        if (IsOperator(calculation[i])) {
            operatorPositions.push(i);
        }
    }

    if (operatorPositions.length === 0) {
        return 0;
    } else {
        return operatorPositions[operatorPositions.length-1]
    }  
}

function IsOperator(character) {
    if (character == '+' ||
        character == '-' ||
        character == '*' ||
        character == '/') {
        return true;
    }
    return false;
}

function AddNumberEvenListeners() {
    for (var i = 0; i < 10; i++) {
        (function (j) {
            var btnNumber = "#btn" + j;
            $(btnNumber).on("click", function () { AddNumber(j); });
        })(i);
    }
}

function AddOperatorEvenListeners() {
    $('#btnSum').on("click", function () { AddOperator('+') })
    $('#btnSubstract').on("click", function () { AddOperator('-') })
    $('#btnMultiply').on("click", function () { AddOperator('*') })
    $('#btnDivide').on("click", function () { AddOperator('/') })
}

function AddNumber(number) {
    var calculation = GetCalculation();

    if (calculation == 0) {
        SetCalculation(number);
    } else {
        var newCalculation = calculation + number;
        SetCalculation(newCalculation);
    }
};

function AddOperator(operator) {
    var calculation = GetCalculation();

    if (calculation == 0) {
        return;
    }

    if (IsLastCharacterOperator(calculation)) {
        return;
    } else {
        var newCalculation = calculation + operator;
        SetCalculation(newCalculation);
    }
}

function AddComma() {

}

function AddComment() {
    var comment = window.prompt('Enter comment:');

    if (comment !== undefined &&
        comment !== "") {

        var lisattava = '<li><div style="width: 95%; display: inline-block;">' + comment + '</div><span class="ui-icon ui-icon-closethick" style="border: solid thin; border-radius: 0.3em; width: 18px; height: 18px; display: inline-block; vertical-align: middle;"></span>' + '</li>'
        $('#sortable').append(lisattava)
    }
}

function PrintCalculations() {
    $('span.ui-icon').remove();
    window.print();
}

function ClearResultsList() {
    if (window.confirm('Really want to empty all results?')) {
        window.location.reload(true);
    }
}