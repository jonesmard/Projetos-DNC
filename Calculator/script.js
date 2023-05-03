(function(doc, win) {
    'use strict'
    /*
    Nossa calculadora agora está funcional! A ideia desse desafio é modularizar
    o código, conforme vimos na aula anterior. Quebrar as responsabilidades
    em funções, onde cada função faça somente uma única coisa, e faça bem feito.
    - Remova as duplicações de código;
    - agrupe os códigos que estão soltos em funções (declarações de variáveis,
    listeners de eventos, etc);
    - faça refactories para melhorar esse código, mas de forma que o mantenha com a
    mesma funcionalidade.
    */
    let $ButtonEqual = doc.querySelector('[data-js="ButtonEqual"]'),
        $ButtonCE = doc.querySelector('[data-js="ButtonCE"]'),
        $Visor = doc.querySelector('[data-js="MessageResult"]'),
        $ButtonsNumbers = doc.querySelectorAll('[data-js="ButtonNumbers"]'),
        $ButtonsOperatos = doc.querySelectorAll('[data-js="ButtonOperators"]'),
        $ButtonDel = doc.querySelector('[data-js="ButtonDel"]'),
        $ButtonSpecialOperator = doc.querySelectorAll('[data-js="ButtonOperatorsSpecial"]'),
        $Link = doc.querySelector('[data-js="link"]')

    function initilize() {
        listenEvents()
    }

    function listenEvents() {
        $ButtonEqual.addEventListener('click', PressEqual, false)

        $ButtonCE.addEventListener('click', PressCE, false)

        $ButtonDel.addEventListener('click', PressDel, false)

        $Link.addEventListener('click', Clicou, false)

        Array.prototype.forEach.call($ButtonsNumbers, button =>
            button.addEventListener('click', ClickNumber, false)
        )
        Array.prototype.forEach.call($ButtonsOperatos, button =>
            button.addEventListener('click', PressOperator, false)
        )
        Array.prototype.forEach.call($ButtonSpecialOperator, button =>
            button.addEventListener('click', PressOperatorSpecial, false))

    }

    function Clicou(event) {
        event.preventDefault()
        window.location.href = 'index2.html'
    }

    function zeroIsAllValueInVisor() {
        if (/^0$/.test($Visor.value))
            return $Visor.value = this.value

    }

    function ClickNumber() {
        return zeroIsAllValueInVisor.call(this) ? zeroIsAllValueInVisor.call(this) : $Visor.value += this.value
    }

    function PressDel() {
        $Visor.value = $Visor.value.slice(0, -1)
    }

    function PressOperatorSpecial() {
        const RegexForOperatorSpecial = /[()√%\s]$/g
        zeroIsAllValueInVisor.call(this)
        if (RegexForOperatorSpecial.test($Visor.value))
            return $Visor.value = $Visor.value.replace(RegexForOperatorSpecial, this.value)

        $Visor.value += this.value
    }

    function RegexForLastOperator() {
        const RegexIfLastItemIsOperator = /([/-]|[+*]|\s)$/g
        if (RegexIfLastItemIsOperator.test($Visor.value))
            return $Visor.value = $Visor.value.replace(RegexIfLastItemIsOperator, this.value)


    }

    function PressOperator() {
        zeroIsAllValueInVisor.call(this)
        return RegexForLastOperator.call(this) ? RegexForLastOperator.call(this) : $Visor.value += this.value
    }

    function PressCE() {
        $Visor.value = 0
    }

    const RegexForValueWithOperators = /\d+([.]\d+)?([/-]|[+*])?([.]\d+)?/g //Números e Operadores simples
    const RegexForMultiplcation = /\d+\*\d+/g //Operador de multiplicação
    const RegexForDivision = /\d+\/\d+/g //Operador de Divisão
    const RegexForOtherOperators = /[-+]/g // Operadores Plus e Less
    const RegexForTest_If_LastValue_Is_Operator = /([\/-]|[*+])$/ //Operadores simples
    const RegexForNumberBeforePercentage = /\d+([.]\d+)?\%/g //Porcentagem no final
    const RegexForNumberAfterPercetage = /\d+\%\d+/ //Porcentagem no meio
    const RegexForDetectRadic = /√\d+/g //Raiz quadrada
    const RegexForPercentageInNumber = /\d+(\.\d+)?\%(\d+)?(\.\d+)?/g //Verifi
    const RegexForParenteseInNumber = /(?:\d+(?:\.\d+)?)?\(\d+([\/*\+\%√-]\d+)?(?:\d+(?:\.\d+)?)?/g

    function PressEqual() {
        let ValueInVisor = RegexForTest_If_LastValue_Is_Operator.test($Visor.value) ? $Visor.value.replace(RegexForTest_If_LastValue_Is_Operator, '') : $Visor.value
        $Visor.value = ValueInVisor

        Parentese()

        Radic()

        Percentage()

        PriorityDivOrMult()

        let AllValueInArray = $Visor.value.match(RegexForValueWithOperators)
        $Visor.value = CalcOperatorsPrimary(AllValueInArray)

        formatNumbers()
    }

    function PriorityDivOrMult() {
        if (RegexForOtherOperators.test($Visor.value)) {
            OrganizzerCalcMultiply(RegexForOtherOperators, RegexForMultiplcation)

            OrganizzeCalcDvision(RegexForDivision, RegexForValueWithOperators)
        }
    }

    function Parentese() {
        if (RegexForParenteseInNumber.test($Visor.value)) {
            const RegexForCatchParentese = /\(\d+([\/*\+\%√-]\d+)+\)/g
            let ValueWithParentese = $Visor.value.match(RegexForCatchParentese)
            let ValueWithParenteseForCalc = $Visor.value.match(RegexForCatchParentese).join('').replace(/[\(\)]/g, '').match(RegexForValueWithOperators).join('')
            let resultParentese
            resultParentese = CalcDivAndMult()
            ValueWithParenteseForCalc = ValueWithParenteseForCalc.match(RegexForValueWithOperators)
            let ValueForCalcParentese = CalcOperatorsPrimary(ValueWithParenteseForCalc)

            $Visor.value = $Visor.value.replace(ValueWithParentese.join(''), ValueForCalcParentese)
        }
    }

    function CalcDivAndMult() {
        if (RegexForValueWithOperators.test(ValueWithParenteseForCalc)) {
            if (RegexForMultiplcation.test(ValueWithParenteseForCalc)) {
                let ValueProvisory = ValueWithParenteseForCalc
                let ValueForMult = ValueWithParenteseForCalc.match(RegexForMultiplcation)
                let result
                for (let index = 0; index < ValueForMult.length; index++) {
                    let ValueForMultCalc = ValueForMult[index].match(RegexForValueWithOperators)
                    result = ValueForMultCalc.reduce(CalcMultiply)
                }
                ValueWithParenteseForCalc = ValueProvisory.replace(ValueForMult, result)
            }
            if (RegexForDivision.test(ValueWithParenteseForCalc)) {
                let ValueProvisory = ValueWithParenteseForCalc
                let ValueForDiv = ValueWithParenteseForCalc.match(RegexForDivision)
                let result
                for (let index = 0; index < ValueForDiv.length; index++) {
                    let ValueForDivCalc = ValueForDiv[index].match(RegexForValueWithOperators)
                    result = ValueForDivCalc.reduce(Division)
                }
                ValueWithParenteseForCalc = ValueProvisory.replace(ValueForDiv, result)
            }
        }
    }

    function Division(accumulated, actual) {
        let firstValue = accumulated.slice(0, -1)
        let lastValue = actual.match(RegexForLastOperator()) ? actual : actual.slice(0, -1)
        return Number(firstValue) / Number(lastValue)

    }

    function Radic() {
        if (RegexForDetectRadic.test($Visor.value)) {
            let ValueRadic = $Visor.value.match(RegexForDetectRadic).join('')
            let Radic = ValueRadic.slice(1)
            let resultRadic = Math.sqrt(Number(Radic))
            $Visor.value = $Visor.value.replace(ValueRadic, resultRadic)
        }
    }

    function Percentage() {
        if (RegexForPercentageInNumber.test($Visor.value)) {
            let result
            let ValueFinale
            if (RegexForNumberBeforePercentage.test($Visor.value)) {
                let FirstValuewhitchPercetage = $Visor.value.match(/\d+(?:[.]\d+)?\%/).join('')
                let firstValuePercentege = FirstValuewhitchPercetage.slice(0, -1)
                result = Number(firstValuePercentege) / 100
                ValueFinale = $Visor.value.replace(FirstValuewhitchPercetage, result)

            }
            if (RegexForNumberAfterPercetage.test($Visor.value)) {
                let ValueAfterPercetage = $Visor.value.match(/\%\d+/g).join('').slice(1)
                result = result * Number(ValueAfterPercetage)
                ValueFinale = $Visor.value.replace(RegexForPercentageInNumber, result)
            }
            $Visor.value = ValueFinale
        }
    }

    function OrganizzerCalcMultiply() {
        if (RegexForMultiplcation.test($Visor.value)) {
            let ValueProvisory = $Visor.value
            let ValueForMult = $Visor.value.match(RegexForMultiplcation)
            for (let index = 0; index < ValueForMult.length; index++) {
                let ValueForMultCalc = ValueForMult[index].match(RegexForValueWithOperators)
                let result = ValueForMultCalc.reduce(CalcMultiply)
                $Visor.value = ValueProvisory.replace(ValueForMult, result)
            }

        }
    }

    function CalcMultiply(accumulated, actual) {
        let firstValue = accumulated.slice(0, -1)
        let lastValue = actual.match(RegexForLastOperator()) ? actual : actual.slice(0, -1)
        return (Number(firstValue) * Number(lastValue))

    }

    function OrganizzeCalcDvision() {
        if (RegexForDivision.test($Visor.value)) {
            let ValueProvisory = $Visor.value
            let ValueForDiv = $Visor.value.match(RegexForDivision)
            ValueProvisory = CalcDivision(ValueForDiv, ValueProvisory)
            return $Visor.value = ValueProvisory
        }
    }

    function CalcDivision(ValueForDiv, ValueProvisory) {
        for (let index = 0; index < ValueForDiv.length; index++) {
            let ValueForDivCalc = ValueForDiv[index].match(RegexForValueWithOperators)
            ValueForDivCalc.reduce(function(accumulated, actual) {
                let firstValue = accumulated.slice(0, -1)
                let operator = accumulated.split('').pop()
                let lastValue = actual.match(RegexForLastOperator()) ? actual : actual.slice(0, -1)
                let ValueForSubs = `${firstValue}${operator}${lastValue}`
                let result = (Number(firstValue) / Number(lastValue))
                ValueProvisory = ValueProvisory.replace(ValueForSubs, result)
                return (Number(firstValue) / Number(lastValue))
            })
        }
        return ValueProvisory
    }

    function CalcOperatorsPrimary(AllValueInArray) {
        return AllValueInArray.reduce(function(accumulated, actual) {
            let firstValue = accumulated.slice(0, -1)
            let operator = accumulated.split('').pop()
            let lastValue = actual.match(RegexForLastOperator()) ? actual : actual.slice(0, -1)
            let lastOperator = actual.match(RegexForLastOperator()) ? '' : actual.split('').pop()
            switch (operator) {
                case '+':
                    return (Number(firstValue) + Number(lastValue)) + lastOperator
                case '-':
                    return (Number(firstValue) - Number(lastValue)) + lastOperator
                case '/':
                    return (Number(firstValue) / Number(lastValue)) + lastOperator
                case '*':
                    return (Number(firstValue) * Number(lastValue)) + lastOperator
            }
        })
    }

    function formatNumbers() {
        if ($Visor.value.length > 3) {
            const RegexNumberAfterPoint = /\.\d+/g
            const RegexPoint = /\d+\./g
            let NumberFormat = $Visor.value.match(RegexNumberAfterPoint) ? $Visor.value.match(RegexNumberAfterPoint).join('') : ''
            $Visor.value = NumberFormat.length > 4 ? $Visor.value = parseFloat($Visor.value).toFixed(4) : $Visor.value
            let NumberAfterPoint = $Visor.value.match(RegexNumberAfterPoint) ? $Visor.value.match(RegexNumberAfterPoint).join('').replace('.', ',') : ''
            let Value = RegexPoint.test($Visor.value) ? $Visor.value.match(RegexPoint).join('').replace('.', '') : $Visor.value
            let tam = Value.length;
            let temp = '';
            for (let i = tam - 1; i >= 0; i--) {
                temp = Value.charAt(i) + temp;
                if ((Value.substr(i).length % 3 == 0) && (i > 0)) {
                    temp = "." + temp;
                }
            }
            $Visor.value = temp + NumberAfterPoint
        }
    }

    initilize()

})(document, window)