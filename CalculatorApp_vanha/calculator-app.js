/// <reference path="C:\Files\Source\Repos\CalculatorApp_vanha\Scripts/jquery-1.11.1.intellisense.js" />
/// <reference path="C:\Files\Source\Repos\CalculatorApp_vanha\Scripts/jquery-1.11.1.js" />
/// <reference path="C:\Files\Source\Repos\CalculatorApp_vanha\Scripts/jquery-ui-1.11.2.js" />
/// <reference path="C:\Files\Source\Repos\CalculatorApp_vanha\Scripts/jspdf/jspdf.source.js" />

$(document).ready(function () {
    CalculatorInitialize();
});

function CalculatorInitialize() {
    var UI = new CalculatorUI();
    var Functions = new CalculatorFunctions(UI);
    var eventListeners = new CalculatorEventListeners(UI, Functions);
    eventListeners.AddAll();
    
    UI.SetCalculation(0);
    UI.SetResult(0);   
}

var CalculatorEventListeners = function(UI, Functions) {

    this.AddAll = function () {
        /* Calculator funtions event listeners */
        $('#btnClearCharacter').on("click", Functions.ClearCharacter);
        $('#btnChangeSign').on("click", Functions.ChangeNumberSign);
        $('#btnComma').on("click", Functions.AddComma);
        $('#btnTotal').on("click", Functions.CalculateTotal);
        AddNumberEventListeners();
        AddOperatorEventListeners();

        /* Calculator UI interface event listeners */
        $('#btnClearAll').on("click", UI.ClearAll);
        $('#btnAddComment').on("click", UI.AddComment);
        $('#btnClearResultsList').on("click", UI.ClearResultsList);
        $('#btnPrint').on("click", UI.PrintCalculations);
        $('#btnPDF').on("click", UI.DownloadPDF);

        /* JQuery UI sortable component initialization */
        $("#sortable").sortable({
            placeholder: "ui-state-highlight"
        }).disableSelection();
    }

    var AddNumberEventListeners = function() {
        for (var i = 0; i < 10; i++) {
            (function (j) {
                var btnNumber = "#btn" + j;
                $(btnNumber).on("click", function () { Functions.AddNumber(j); });
            })(i);
        }
    }

    var AddOperatorEventListeners = function () {
        $('#btnSum').on("click", function () { Functions.AddOperator('+') })
        $('#btnSubstract').on("click", function () { Functions.AddOperator('-') })
        $('#btnMultiply').on("click", function () { Functions.AddOperator('*') })
        $('#btnDivide').on("click", function () { Functions.AddOperator('/') })
    }

}

var DynamicEventListeners = {
    RemoveCalculation: function (event) { $(event.target).parent().remove(); }
};

var CalculatorUI = function() {

    /* Public functions */

    this.GetCalculation = function () {
        return GetCalculationPrivate();
    }

    this.SetCalculation = function (calculation) {
        SetCalculationPrivate(calculation);
    }

    this.SetResult = function (result) {
        SetResultPrivate(result);
    }

    this.AddCalculationResult = function (result) {
        var lasku = GetCalculationPrivate();
        $('#txtResult').val(result);

        var lisattava = '<li>' +
                        '<div>' + lasku + ' = ' + result + '</div>' +
                        '<div class="ui-icon ui-icon-closethick" onclick="DynamicEventListeners.RemoveCalculation(event);"></div>' +
                        '<div></div>' +
                        '</li>';
        $('#sortable').append(lisattava)

        this.SetCalculation(0);
    }

    this.AddComment = function () {
        var comment = window.prompt('Enter comment:');

        if (comment !== undefined &&
            comment !== "") {

            var lisattava = '<li>' + 
                            '<div>' + comment + '</div>' +
                            '<div class="ui-icon ui-icon-closethick" onclick="DynamicEventListeners.RemoveCalculation(event);"></div>' +
                            '<div></div>' +
                            '</li>';
            $('#sortable').append(lisattava)
        }
    }

    this.PrintCalculations = function () {
        window.print();
    }

    this.ClearAll = function () {
        SetCalculationPrivate(0);
        SetResultPrivate(0);
    }

    this.ClearResultsList = function () {
        if (window.confirm('Really want to empty all results?')) {
            $('#sortable').empty();
            SetCalculationPrivate(0);
            SetResultPrivate(0);
        }
    }

    this.DownloadPDF = function () {
        var newPdf = new jsPDF();

        var xAxisPosition = 15;
        var yAxisPosition = 15;

        newPdf.setFontSize(26);
        newPdf.text(xAxisPosition, yAxisPosition, 'Calculations');

        newPdf.setFontSize(14);
        newPdf.setFont("courier");

        var counter = 0;

        $.each($('ol#sortable li'), function (index, value) {
            if (counter > 25) {
                newPdf.addPage();
                yAxisPosition = 15;
                counter = 0;
            }
            counter = counter + 1;
            yAxisPosition = yAxisPosition + 10;
            newPdf.text(15, yAxisPosition, $(this).children('div:first-child').text())
        });

        newPdf.save('Test.pdf');
    }

    /* Private functions */

    var GetCalculationPrivate = function () {
        return $('#txtCalculation').val();
    }

    var SetResultPrivate = function (result) {
        $('#txtResult').val(result);
    }

    var SetCalculationPrivate = function (calculation) {
        $('#txtCalculation').val(calculation);
    }

}


var CalculatorFunctions = function(UI) {

    /* Public functions */

    this.AddNumber = function (number) {
        var calculation = UI.GetCalculation();

        if (calculation === "0") {
            UI.SetCalculation(number);
        } else {
            var newCalculation = calculation + number;
            UI.SetCalculation(newCalculation);
        }
    }

    this.AddOperator = function (operator) {
        var calculation = UI.GetCalculation();

        if (calculation === "0") {
            return;
        }

        if (IsLastCharacterOperator(calculation)) {
            return;
        } else {
            var newCalculation = calculation + operator;
            UI.SetCalculation(newCalculation);
        }
    }

    this.AddComma = function () {
        var calculation = UI.GetCalculation();
        var lastCharacter = calculation.slice(-1);

        if (IsLastCharacterOperator(lastCharacter)) {
            return;
        }

        var newCalculcation = calculation + '.';
        UI.SetCalculation(newCalculcation);
    }

    this.ClearCharacter = function () {
        var calculation = UI.GetCalculation();
        
        if (calculation.length === 0 || calculation.length === 1) {
            UI.SetCalculation(0);
        } else {
            var newCalculation = calculation.substring(0, calculation.length - 1);
        
            if (IsLastCharacterOperator(newCalculation)) {
                newCalculation = calculation.substring(0, newCalculation.length - 1);
            }
        
            UI.SetCalculation(newCalculation);
        }
    }

    this.ChangeNumberSign = function() {
        var calculation = UI.GetCalculation();
        var operatorPosition = CheckFirstOperatorPosition(calculation);
        
        if (operatorPosition === 0) {
            UI.SetCalculation(-parseFloat(calculation));
        }
    }

    this.CalculateTotal = function () {
        var allCalculations = UI.GetCalculation();
        var numberOfCalculations = CountNumberOfCalculations(allCalculations);
        
        if (numberOfCalculations === 0)
            return;
        
        for (var i = 0; i < numberOfCalculations; i++) {
            var calculation = TakeCalculation(allCalculations);
            var result = ExecuteCalculation(calculation);
            allCalculations = ReplaceCalculationWithResult(allCalculations, calculation, result);
        }
        
        UI.AddCalculationResult(result);
    }

    /* Private functions */

    var IsLastCharacterOperator = function (string) {
        if (IsOperator(string[string.length - 1]))
            return true;
        return false;
    }

    var IsOperator = function (character) {
        if (character == '+' ||
            character == '-' ||
            character == '*' ||
            character == '/') {
            return true;
        }
        return false;
    }

    var CheckFirstOperatorPosition = function (calculation) {
        var operatorPositions = [];

        for (var i = 0; i < calculation.length; i++) {
            if (IsOperator(calculation[i])) {
                operatorPositions.push(i);
            }
        }

        if (operatorPositions.length === 0) {
            return 0;
        } else {
            return operatorPositions[operatorPositions.length - 1]
        }
    }

    var ReplaceCalculationWithResult = function (allCalculations, calculation, result) {
        var poistettavaSetti = calculation["firstNumber"].toString().length +
                               calculation["operator"].toString().length +
                               calculation["secondNumber"].toString().length;
        var newCalculation = allCalculations.substring(poistettavaSetti, allCalculations.length);
        return result + newCalculation;
    }

    var CountNumberOfCalculations = function (allCalculations) {
        var numberOfCalculations = 0;
        for (var i = 0; i < allCalculations.length; i++) {
            if (IsOperator(allCalculations[i])) {
                numberOfCalculations++;
            }
        }
        return numberOfCalculations;
    }

    var TakeCalculation = function (allCalculations) {
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

    var ExecuteCalculation = function (calculation) {
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
}

