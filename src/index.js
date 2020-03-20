function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const operators = {
        "(": 0,
        ")": 0,
        "+": 1,
        "-": 1,
        "*": 2,
        "/": 2
    };
    const splittedExpr = splitExpr(expr, Object.keys(operators));
    const rpn = toRPN(splittedExpr, operators);
    const output = [];

    rpn.forEach(x => {
        if(Number.isInteger(x)) {
            output.push(x);
        } else {
            switch(x) {
                case "*": {
                    let right = output.pop(), left = output.pop();
                    let res = left * right;
                    output.push(res);
                    break;
                }
                case "/": {
                    let right = output.pop(), left = output.pop();

                    if(right === 0) {
                        throw TypeError("TypeError: Division by zero.");
                    }

                    let res = left / right;
                    output.push(res);
                    break;
                }
                case "+": {
                    let right = output.pop(), left = output.pop();
                    let res = left + right;
                    output.push(res);
                    break;
                }
                case "-": {
                    let right = output.pop(), left = output.pop();
                    let res = left - right;
                    output.push(res);
                    break;
                }
            }
        }
    });

    return output.pop();
}

const splitExpr = function(expr, operators) {
    if(!areBracketsPaired(expr))
        throw "ExpressionError: Brackets must be paired";
    expr = expr.replace(/\s/g, "");
    const result = [];
    let n = "";

    for(let i = 0; i < expr.length; i++) {
        let s = expr[i];

        if(!operators.some(o => s === o)) {
            n += s;
        } else {
            if(n.length > 0) {
                result.push(Number(n));
                n = "";
            }

            result.push(s);
        }
    }

    if(n.length > 0) {
        result.push(Number(n));
    }

    return result;
}

const toRPN = function(splittedExpr, operators) {
    const ops = Object.keys(operators);
    let output = [];
    const operations = [];

    splittedExpr.forEach(x => {
        if(!ops.some(o => o === x)) {
            output.push(x);
        } else {
            if(operations.length > 0 && x !== "(") {
                if(x === ")") {
                    let operation = operations.pop();
                    while(operation !== "(") {
                        output.push(operation);
                        operation = operations.pop();
                    }
                } else if(getPriority(x, operators) > getPriority(operations[operations.length - 1], operators)) {
                    operations.push(x);
                } else {
                    while (operations.length > 0 && getPriority(x, operators) <= getPriority(operations[operations.length - 1], operators)) {
                        output.push(operations.pop());
                    }
                    operations.push(x);
                }
            } else {
                operations.push(x);
            }
        }
    });

    while(operations.length > 0) {
        output.push(operations.pop());
    }

    return output;
}

const getPriority = function(operator, priorities) {
    return priorities[operator];
}

const areBracketsPaired = function(str) {
    const brackets = [];

    for(let i = 0; i < str.length; i++) {
        if(str[i] === "(")
            brackets.push(str[i]);
        else if(str[i] === ")") {
            if(!brackets.length)
                return false;

            brackets.pop();
        }
    }
    return brackets.length === 0;
}

module.exports = {
    expressionCalculator
}