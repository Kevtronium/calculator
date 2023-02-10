function add(num1, num2) {
  return num1 + num2;
}

function subtract(num1, num2) {
  return num1 - num2;
}

function multiply(num1, num2) {
  return num1 * num2;
}

function divide(num1, num2) {
  return num1 / num2;
}

function operate(operator, num1, num2) {
  let result = 0;

  switch (operator) {
    case '+':
      result = add(num1, num2);
      break;
    case '-':
      result = subtract(num1, num2);
      break;
    case '*':
      result = multiply(num1, num2);
      break;
    default:
      result = divide(num1, num2);
  }
  return result;
}

function displayHasOnlyOneNumber(oldDisplay) {
  return oldDisplay.top === '';
}

function isNumber(char) {
  let isNum = true;

  if (
    char === '.' ||
    char === '=' ||
    char === '+' ||
    char === '-' ||
    char === '*' ||
    char === '÷' ||
    char === 'CLEAR' ||
    char === 'DELETE'
  ) {
    isNum = false;
  }

  return isNum;
}

function convertDisplayToArray(oldDisplay) {
  const topAndBottomDisplay = `${oldDisplay.top} ${oldDisplay.bottom}`;
  const displayArr = topAndBottomDisplay.split(' ');

  return displayArr;
}

function getNumbersAndOperator(oldDisplay) {
  const expr = { operator: '', num1: 0, num2: 0 };
  const arrStr = convertDisplayToArray(oldDisplay);

  expr.operator = arrStr[1];
  expr.num1 = parseFloat(arrStr[0]);
  expr.num2 = parseFloat(arrStr[2]);

  return expr;
}

function isValidExpression(oldDisplay, lastInput) {
  let isExpression = false;

  if (isNumber(lastInput)) {
    const arrStr = convertDisplayToArray(oldDisplay);

    if (arrStr.length === 3) {
      isExpression = true;
    }
  }

  return isExpression;
}

let lastInput = '';

function getNewDisplayValue(char) {
  const oldDisplay = { top: '', bottom: '' };
  const newDisplay = { top: '', bottom: '' };

  oldDisplay.top = document.querySelector('#top-display').textContent;
  oldDisplay.bottom = document.querySelector('#bottom-display').textContent;

  if (isNumber(char)) {
    newDisplay.top = oldDisplay.top;
    if (oldDisplay.bottom === '0') {
      newDisplay.bottom = `${char}`;
    } else if (displayHasOnlyOneNumber(oldDisplay)) {
      newDisplay.bottom = `${oldDisplay.bottom}${char}`;
    } else {
      if (lastInput !== '.' && !isNumber(lastInput)) {
        if (char !== oldDisplay.bottom) {
          newDisplay.bottom = char;
        } else {
          newDisplay.bottom = oldDisplay.bottom;
        }
      } else {
        newDisplay.bottom = `${oldDisplay.bottom}${char}`;
      }
    }
  } else if (char === 'CLEAR') {
    newDisplay.top = '';
    newDisplay.bottom = '0';
  } else if (char === 'DELETE') {
    newDisplay.top = oldDisplay.top;
    newDisplay.bottom = oldDisplay.bottom.slice(0, length - 1);
  } else if (char === '.') {
    newDisplay.top = oldDisplay.top;

    if (!isNumber(lastInput)) {
      newDisplay.bottom = `0${char}`;
    } else if (!oldDisplay.bottom.includes('.')) {
      newDisplay.bottom = `${oldDisplay.bottom}${char}`;
    } else {
      newDisplay.bottom = oldDisplay.bottom;
    }
  } else {
    if (char === '=') {
      if (isValidExpression(oldDisplay, lastInput)) {
        let expr = getNumbersAndOperator(oldDisplay);
        if (expr.operator === '÷' && expr.num2 === 0) {
          alert(`You can't divide by 0!`);
          newDisplay.top = oldDisplay.top;
          newDisplay.bottom = oldDisplay.bottom;
        } else {
          newDisplay.top = `${oldDisplay.top} ${oldDisplay.bottom} ${char}`;
          newDisplay.bottom = operate(
            expr.operator,
            expr.num1,
            expr.num2
          ).toString();
        }
      } else {
        newDisplay.top = oldDisplay.top;
        newDisplay.bottom = oldDisplay.bottom;
      }
    } else {
      if (oldDisplay.bottom === 0) {
        newDisplay.top = `${oldDisplay.bottom} ${char}`;
        newDisplay.bottom = oldDisplay.bottom;
      } else if (displayHasOnlyOneNumber(oldDisplay)) {
        newDisplay.top = `${oldDisplay.bottom} ${char}`;
        newDisplay.bottom = oldDisplay.bottom;
      } else if (isValidExpression(oldDisplay, lastInput)) {
        let expr = getNumbersAndOperator(oldDisplay);
        if (expr.operator === '÷' && expr.num2 === 0) {
          alert(`You can't divide by 0!`);
          newDisplay.top = oldDisplay.top;
          newDisplay.bottom = oldDisplay.bottom;
        } else {
          const result = operate(expr.operator, expr.num1, expr.num2);
          newDisplay.top = `${result} ${char}`;
          newDisplay.bottom = `${result}`;
        }
      } else if (lastInput === '=') {
        newDisplay.top = `${oldDisplay.bottom} ${char}`;
        newDisplay.bottom = oldDisplay.bottom;
      } else {
        newDisplay.top = oldDisplay.top;
        newDisplay.bottom = oldDisplay.bottom;
      }
    }
  }
  lastInput = char;
  return newDisplay;
}

function updateUI(displayValue) {
  const topDisplay = document.querySelector('#top-display');
  const bottomDisplay = document.querySelector('#bottom-display');

  topDisplay.textContent = displayValue.top;
  bottomDisplay.textContent = displayValue.bottom;
}

function handleBtnClick(e) {
  const newDisplayValue = getNewDisplayValue(e.target.textContent);
  updateUI(newDisplayValue);
}

function initializeBtns() {
  const btns = document.querySelectorAll('button');

  for (const ele of btns) {
    ele.addEventListener('click', handleBtnClick);
  }
}

initializeBtns();
