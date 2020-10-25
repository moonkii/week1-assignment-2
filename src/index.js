/* eslint-disable react/react-in-jsx-scope, react/jsx-filename-extension, no-unused-vars */

/* @jsx createElement */

function createElement(tagName, props, ...children) {
  const element = document.createElement(tagName);

  Object.entries(props || {})
    .forEach(([key, value]) => {
      element[key.toLowerCase()] = value;
    });

  children.flat()
    .forEach((child) => {
      if (child instanceof Node) {
        element.appendChild(child);
        return;
      }
      element.appendChild(document.createTextNode(child));
    });

  return element;
}

function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) {
      return func.apply(this, args);
    }
    return function pass(...args2) {
      return curried.apply(this, [...args, ...args2]);
    };
  };
}

const operators = ['+', '-', '*', '/', '='];

function calculate(x, f, y) {
  return {
    '+': x + y,
    '-': x - y,
    '*': x * y,
    '/': x / y,
    '=': x,
  }[f];
}

const curriedCalculate = curry(calculate);

const initialState = {
  acc: 0,
  cur: 0,
  calculating: curriedCalculate,
};

function render({ acc, cur, calculating }) {
  const handleClickNumber = (number) => {
    render({
      acc: acc * 10 + number,
      cur: acc === 0 ? number : acc * 10 + number,
      calculating,
    });
  };

  const handleClickOperator = (operator) => {
    const result = calculating(cur);

    if (typeof result === 'number') {
      render({
        acc: 0,
        cur: result,
        calculating: operator === '='
          ? curriedCalculate
          : curriedCalculate(result, operator),
      });
      return;
    }
    render({
      acc: 0,
      cur,
      calculating: calculating(cur, operator),
    });
  };

  const handleClickReset = () => {
    render(initialState);
  };

  const element = (
    <div>
      <p>간단 계산기</p>
      <p>{cur}</p>
      <p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
          <button type="button" onClick={() => handleClickNumber(number)}>
            {number}
          </button>
        ))}
      </p>
      <p>
        {operators.map((operator) => (
          <button type="button" onClick={() => handleClickOperator(operator)}>
            {operator}
          </button>
        ))}
      </p>
      <p>
        <button type="button" onClick={handleClickReset}>
          Clear
        </button>
      </p>
    </div>
  );

  document.getElementById('app').textContent = '';
  document.getElementById('app').appendChild(element);
}

render(initialState);
