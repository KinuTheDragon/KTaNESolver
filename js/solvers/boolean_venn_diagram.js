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
    const CASE_NAMES = [
        "outside (-/FFF)",
        "bottom-right (C/FFT)",
        "bottom-left (B/FTF)",
        "bottom-middle (BC/FTT)",
        "top (A/TFF)",
        "top-right (AC/TFT)",
        "top-left (AB/TTF)",
        "middle (ABC/TTT)"
    ];

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
        setTimeout(updateImages, 1);
        return getActualResult() + "\n∧ = ^\n∨ = v\n⊻ = x\n→ = >\n↓ = !\n↔ = -\n← = <"; 
    }

    function updateImages() {
        if (getExpressionInvalidity()) return;
        const resultContainer = document.getElementById("result");
        let container = document.createElement("div");
        container.style.position = "relative";
        resultContainer.appendChild(container);
        let baseImg = document.createElement("img");
        baseImg.src = "img/boolean_venn_diagram/base.png";
        baseImg.classList.add("pixel");
        baseImg.style.position = "absolute";
        baseImg.style.top = 0;
        baseImg.style.left = "50%";
        baseImg.style.transform = "translateX(-50%)";
        baseImg.style.width = baseImg.style.height = "128px";
        container.appendChild(baseImg);
        for (let caseOn of getCasesOn()) {
            let img = document.createElement("img");
            img.src = "img/boolean_venn_diagram/" + caseOn + ".png";
            img.classList.add("pixel");
            img.style.position = "absolute";
            img.style.top = 0;
            img.style.left = "50%";
            img.style.transform = "translateX(-50%)";
            img.style.width = img.style.height = "128px";
            container.appendChild(img);
        }
    }

    function getActualResult() {
        let invalidity = getExpressionInvalidity();
        if (invalidity) return `Invalid expression: unknown ${invalidity}.`;
        return "Click on: " + getCasesOn().map(x => CASE_NAMES[x]).join(", ");
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