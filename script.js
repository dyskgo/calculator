//Event Delegation
function getEventTarget(e) {
            e = e || window.event; 
            return e.target || e.srcElement; 
        }

//Assign DOM Elements to New Variable Names
let display = document.getElementById('display'); 
let formulaField = document.getElementById('formula_field');
let numberButtons = document.getElementsByClassName('number');

//The Operate Function
let operate = function(operator, a, b) {
  if (operator === '+') return a+b;
  if (operator === '-') return a-b; 
  if (operator === '*') return a*b;
  if (operator === '/') {
    if (b === 0) {
      formulaField.innerHTML = 'Don\'t divide by zero';
      return;
    }
    return a/b;
    }
  if (operator === '^') return a**b; 
}

//Global Variables and Arrays
let numbers = [];
let operators = [];
let num;
let operator;
let solution; 
let nextRound = 0;
let negativeCounter = 0



//Clear Display Function 
let newCalc = function() {
    if (nextRound === 1) {
        formulaField.innerHTML = '';
        numbers = [];
        operators = [];
        display.value = '';
        nextRound--; 
      }
}
//Number Button Function
let numberButton = function(element) {
      newCalc();
      display.value += element.id;
}

//Decimal Button Function
let decimalButton = function(element) {
    newCalc();
    if (display.value.includes('.')) return; 
    if (display.value === '') return display.value = '0.'; 
    display.value += element.id; 
}

//Negative Button Function 
let negativeButton = function() { 
    if (nextRound === 1) return; 
    negativeCounter++
    if (negativeCounter > 1) {
        negativeCounter = 0; 
        display.value = display.value.slice(1); 
        return;
    }
    display.value = '-' + display.value; 
}

//Operator Button Function 
let operatorButton = function(element) {
    if (display.value === '-') return; 
    if (nextRound === 1) {
      formulaField.innerHTML = '';
      nextRound--;
      numbers = []
      operators = [];
    }
    if (display.value === '') return; //Edit here
    if (display.value.includes('-')) negativeCounter = 0; 
    num = Number(display.value);
    formulaField.innerHTML += ' ' + num + ' ' + element.id;
    numbers.push(num);
    operator = element.id; 
    operators.push(element.id);
    display.value = '';
}

//Backspace Button Function 
let backspaceButton = function() {
    if (display.value !== '') {
        display.value = display.value.slice(0, -1);  //Something here
        if (display.value === '') nextRound = 0;
        return;
    } else {
        if (numbers.length === operators.length && numbers.length > 0) {
            operators.pop();
        } 
        else if (numbers.length > operators.length && numbers.length > 0) {
            numbers.pop();
        }
        let lastIndex = formulaField.innerHTML.lastIndexOf(' ');
        formulaField.innerHTML = formulaField.innerHTML.substring(0, lastIndex);
        nextRound = 0;
        console.log(numbers);
        console.log(operators);
        return; 
    }
}

let equalsButton = function() {
    if (nextRound === 1 || display.value === '-') return;
    //|| display.value === ''
    if (display.value !== '') {
      num = Number(display.value);
      numbers.push(num);
      formulaField.innerHTML += ' ' + num; 
    }
      solution = equals(numbers, operators);
      if (isNaN(solution)) {
        display.value = 'Error';
        } else {
          display.value = solution;
        }
      nextRound++; 
}

let clearButton = function() {
  display.value = ''; 
  num = 0; 
  numbers = [];
  operators = []; 
  formulaField.innerHTML = ''; 
}

//Click Function for Caculator Buttons
document.getElementById('calculator').addEventListener('click', function clickButton(e) { 
  let target = getEventTarget(e);
  if (target.className === 'number') {
    numberButton(target);
  } 
  if (target.className === 'decimal') {
    decimalButton(target);   
  }
  if (target.className === 'negative') {
    negativeButton();
  }
  if (target.className === 'operator') {
    operatorButton(target); 
  }
  if (target.className === 'backspace') {
    backspaceButton(); 
  }
  if (target.id === 'equals') {
    equalsButton(); 
  }
if (target.id === 'clear') {
  clearButton(); 
    }
})


//Functions to return operators
let plusSign = function(value) {
  return value === '+';
};

let minusSign = function(value) {
  return value === '-';
}

let multiplySign = function(value) {
  return value === '*';
}

let divideSign = function(value) {
  return value === '/';
}

let exponentSign = function(value) {
    return value === '^';
}


//Equals Function - BEDMAS 
let equals = function(array1, array2) {
  let mathArray = [];
  for (i = 0; i < array1.length; i++) {
    mathArray.push(array1[i]);
    if (array2[i] === undefined) { break; } 
    mathArray.push(array2[i]); 
  }
  while (mathArray.indexOf('^') >= 0) {
      let index = mathArray.findIndex(exponentSign);
      mathArray.splice(index - 1, 3, operate('^', mathArray[index - 1], mathArray[index + 1]));
  }
  while (mathArray.indexOf('/') >= 0) {
    let index = mathArray.findIndex(divideSign);
    mathArray.splice(index - 1, 3, operate('/', mathArray[index - 1], mathArray[index + 1])); 
  }
  while (mathArray.indexOf('*') >= 0) {
    let index = mathArray.findIndex(multiplySign);
    mathArray.splice(index - 1, 3, operate('*', mathArray[index - 1], mathArray[index + 1]));
  }
  while (mathArray.indexOf('+') >= 0) {
    let index = mathArray.findIndex(plusSign); 
    mathArray.splice(index - 1, 3, operate('+', mathArray[index - 1], mathArray[index + 1]));
  } 
  while (mathArray.indexOf('-') >= 0) {
    let index = mathArray.findIndex(minusSign);
    mathArray.splice(index - 1, 3, operator('-', mathArray[index - 1], mathArray[index + 1]));
  }
  let finalNum = Number(mathArray[0]);
  return round(finalNum, 8); 
}

//Round Numbers Accurately (Jack L Moore)
let round = function(value, decimals) {
  return Number(Math.round(value + 'e' + decimals)+ 'e-' + decimals); 
}



