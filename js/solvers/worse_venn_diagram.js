(function() {
    const BINARY_OPERATORS = {
        "∧": "^",
        "^": "^",
        "∨": "V",
        "V": "V",
        "⊻": "Y",
        "Y": "Y",
        "↦": "|->",
        "|->": "|->",
        "⊥": "T",
        "T": "T",
        "×": "X",
        "X": "X",
        "△": "/\\",
        "/\\": "/\\",
        "⇥": "->|",
        "->|": "->|",
        "&": "&",
        "+": "+",
        "⊕": "O",
        "O": "O",
        "⇨": "=>",
        "=>": "=>"
    };

    const OPERATOR_OUTPUTS = {
        //      FF FU FT UF UU UT TF TU TT
        "^":   [0, 0, 0, 0, 1, 1, 0, 1, 2],
        "V":   [0, 1, 2, 1, 1, 2, 2, 2, 2],
        "Y":   [0, 1, 2, 1, 1, 1, 2, 1, 0],
        "|->": [2, 2, 2, 1, 1, 2, 0, 1, 2],
        "T":   [0, 1, 0, 1, 2, 1, 0, 1, 0],
        "X":   [1, 2, 0, 2, 0, 2, 0, 2, 1],
        "/\\": [0, 2, 1, 2, 1, 0, 1, 0, 2],
        "->|": [2, 2, 2, 0, 1, 2, 0, 0, 2],
        "&":   [0, 0, 1, 0, 0, 1, 1, 1, 2],
        "+":   [0, 0, 2, 0, 1, 2, 2, 2, 2],
        "O":   [0, 1, 1, 1, 2, 2, 1, 2, 2],
        "=>":  [1, 1, 2, 0, 0, 2, 0, 0, 2]
    };

    const BINARY_REGEX = "(" + Object.keys(BINARY_OPERATORS).map(x => x.replaceAll(/([|\\+^])/g, "\\$1")).join("|") + ")";
    const VAR_REGEX = "(!?[ABC][ID]?)";
    const EXPRESSION_REGEX1 = new RegExp(`^(!?)\\(${VAR_REGEX}${BINARY_REGEX}${VAR_REGEX}\\)([ID]?)${BINARY_REGEX}${VAR_REGEX}$`);
    const EXPRESSION_REGEX2 = new RegExp(`^${VAR_REGEX}${BINARY_REGEX}(!?)\\(${VAR_REGEX}${BINARY_REGEX}${VAR_REGEX}\\)([ID]?)$`);

    function setUpWVDUI() {
        addTextInput("Expression", "expression");
        addChoiceInput("Expression color", "goal", ["Red", "Green", "Blue"]);
        setResultCallback(getResult);
    }

    function getExpressionIsValid() {
        let {expression} = solverFields;
        expression = expression.toUpperCase().replaceAll(" ", "");
        return EXPRESSION_REGEX1.test(expression) || EXPRESSION_REGEX2.test(expression);
    }

    function getPostfix() {
        let {expression} = solverFields;
        expression = expression.toUpperCase().replaceAll(" ", "");
        if (EXPRESSION_REGEX2.test(expression)) {
            let [_, left, op1, negation, rightLeft, op2, rightRight, shifting] = expression.match(EXPRESSION_REGEX2);
            let parenthesized = getUnaryPostfix(rightLeft).concat(getUnaryPostfix(rightRight), [op2]);
            if (negation) parenthesized.push("!");
            if (shifting) parenthesized.push(shifting);
            return getUnaryPostfix(left).concat(parenthesized, [op1]);
        } else {
            let [_, negation, leftLeft, op1, leftRight, shifting, op2, right] = expression.match(EXPRESSION_REGEX1);
            let parenthesized = getUnaryPostfix(leftLeft).concat(getUnaryPostfix(leftRight), [op1]);
            if (negation) parenthesized.push("!");
            if (shifting) parenthesized.push(shifting);
            return parenthesized.concat(getUnaryPostfix(right), [op2]);
        }
    }

    function getUnaryPostfix(unaryPart) {
        if (unaryPart.startsWith("!"))
            return getUnaryPostfix(unaryPart.slice(1)).concat([unaryPart[0]]);
        if (unaryPart.endsWith("I") || unaryPart.endsWith("D"))
            return getUnaryPostfix(unaryPart.slice(0, -1)).concat([unaryPart.at(-1)]);
        return [unaryPart];
    }

    function getResult() {
        return getActualResult() + "\n" +
            Object.entries(BINARY_OPERATORS).filter(([x, y]) => x !== y)
                                            .map(([x, y]) => x + " = " + y.toLowerCase())
                                            .join("\n") + "\n⁺ = i\n⁻ = d"; 
    }

    function getActualResult() {
        if (!getExpressionIsValid()) return "Invalid expression.";
        return "Click on: " + getCasesOn().map(
            x => [Math.floor(x / 9), Math.floor(x / 3) % 3, x % 3].map(y => "FUT"[y]).join("")
        ).join(", ");
    }

    function getCasesOn() {
        let postfix = getPostfix();
        let casesOn = [];
        let goalValue = "Red Blue Green".split(" ").indexOf(solverFields.goal);
        for (let varCase = 0; varCase < 27; varCase++) {
            let a = Math.floor(varCase / 9) % 3;
            let b = Math.floor(varCase / 3) % 3;
            let c = Math.floor(varCase / 1) % 3;
            let stack = [];
            for (let op of postfix) {
                switch (op) {
                    case "A": stack.push(a); break;
                    case "B": stack.push(b); break;
                    case "C": stack.push(c); break;
                    case "I":
                        stack.push((stack.pop() + 1) % 3);
                        break;
                    case "D":
                        stack.push((stack.pop() + 2) % 3);
                        break;
                    case "!":
                        stack.push(2 - stack.pop());
                        break;
                    default:
                        let right = stack.pop();
                        let left = stack.pop();
                        stack.push(applyOperator(op, left, right));
                        break;
                }
            }
            if (stack[0] === goalValue) casesOn.push(varCase);
        }
        return casesOn;
    }

    function applyOperator(operator, left, right) {
        let key = left * 3 + right;
        let operatorOutputs = OPERATOR_OUTPUTS[operator];
        return operatorOutputs[key];
    }

    registerSolver("Worse Venn Diagram", setUpWVDUI, []);
})();