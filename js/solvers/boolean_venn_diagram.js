(function() {
    const OPERATORS = {
        "∧": "and",
        "^": "and",
        "∨": "or",
        "V": "or",
        "⊻": "xor",
        "X": "xor",
        "→": "implies",
        ">": "implies",
        "|": "nand",
        "↓": "nor",
        "!": "nor",
        "↔": "xnor",
        "-": "xnor",
        "←": "impliedby",
        "<": "impliedby"
    };
    const CASE_NAMES = ["Outside", "C", "B", "BC", "A", "AC", "AB", "ABC"];

    function setUpBVDUI() {
        addTextInput("Expression", "expression");
        setResultCallback(getResult);
    }

    function getExpressionInvalidity() {
        let {expression} = solverFields;
        expression = expression.toUpperCase().replaceAll(" ", "");
        let ops;
        if (/^\(A.B\).C$/.test(expression)) ops = [expression[2], expression[5]];
        else if (/^A.\(B.C\)$/.test(expression)) ops = [expression[1], expression[4]];
        else return "format";
        return ops.every(x => x in OPERATORS) ? null : "operator";
    }

    function getPostfix() {
        let {expression} = solverFields;
        expression = expression.toUpperCase().replaceAll(" ", "");
        if (expression.startsWith("("))
            return ["A", "B", OPERATORS[expression[2]], "C", OPERATORS[expression[5]]];
        return ["A", "B", "C", OPERATORS[expression[4]], OPERATORS[expression[1]]];
    }

    function getResult() {
        return getActualResult() + "\n∧ = ^\n∨ = v\n⊻ = x\n→ = >\n↓ = !\n↔ = -\n← = <"; 
    }

    function getActualResult() {
        let invalidity = getExpressionInvalidity();
        if (invalidity) return `Invalid expression: unknown ${invalidity}.`;
        return "Click on: " + getCasesOn().map(x => CASE_NAMES[x]).toSorted().join(", ");
    }

    function getCasesOn() {
        let postfix = getPostfix();
        let casesOn = [];
        for (let varCase = 0; varCase < 8; varCase++) {
            let a = !!((varCase >> 2) & 1);
            let b = !!((varCase >> 1) & 1);
            let c = !!((varCase >> 0) & 1);
            let stack = [];
            for (let op of postfix) {
                switch (op) {
                    case "A": stack.push(a); break;
                    case "B": stack.push(b); break;
                    case "C": stack.push(c); break;
                    default:
                        let right = stack.pop();
                        let left = stack.pop();
                        stack.push(applyOperator(op, left, right));
                        break;
                }
            }
            if (stack[0]) casesOn.push(varCase);
        }
        return casesOn;
    }

    function applyOperator(operator, left, right) {
        switch (operator) {
            case "and":       return left && right;
            case "or":        return left || right;
            case "xor":       return left !== right;
            case "implies":   return !left || right;
            case "nand":      return !(left && right);
            case "nor":       return !(left || right);
            case "xnor":      return left === right;
            case "impliedby": return left || !right;
        }
    }

    registerSolver("Boolean Venn Diagram", setUpBVDUI, []);
})();