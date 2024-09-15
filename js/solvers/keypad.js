(function () {
    const SYMBOLS = [
        "©: Copyright",
        "★: Filled star",
        "☆: Hollow star",
        "ټ: Smiley face",
        "Җ: Double K",
        "Ω: Omega",
        "Ѭ: Squidknife",
        "Ѽ: Pumpkin",
        "ϗ: Cursive H",
        "б: Six",
        "Ϟ: Lightning",
        "Ѧ: A with line",
        "æ: ae",
        "Ԇ: Melted three",
        "Ӭ: Backwards E",
        "Ҋ: Backwards N",
        "Ѯ: Alien three",
        "¿: Question mark",
        "¶: Paragraph",
        "Ͼ: C with dot",
        "Ͽ: Backwards C with dot",
        "Ψ: Pitchfork",
        "Ҩ: Curlicue",
        "҂: Puzzle piece",
        "Ϙ: O with line",
        "ƛ: Lambda",
        "Ѣ: B with line"
    ];

    const COLUMNS = [
        [..."ϘѦƛϞѬϗϿ"],
        [..."ӬϘϿҨ☆ϗ¿"],
        [..."©ѼҨҖԆƛ☆"],
        [..."б¶ѢѬҖ¿ټ"],
        [..."ΨټѢϾ¶Ѯ★"],
        [..."бӬ҂æΨҊΩ"]
    ];

    function setUpKeypadUI() {
        for (let i = 0; i < 4; i++)
            addChoiceInput("Symbol " + (i + 1), "symbol" + i, SYMBOLS);
        setResultCallback(() => {
            let symbols = getKeypadSymbols();
            let hasDuplicate = (new Set(symbols)).size !== symbols.length;
            if (hasDuplicate) return "Invalid: Duplicate keypad symbol.";
            let column = getKeypadColumn();
            if (!column) return "Invalid: Impossible symbol set.";
            let order = symbols.toSorted((a, b) => column.indexOf(a[0]) - column.indexOf(b[0]));
            return "Press in order:\n" + order.join("\n");
        });
    }

    function getKeypadSymbols() {
        let symbols = [];
        for (let i = 0; i < 4; i++) symbols.push(solverFields["symbol" + i]);
        return symbols;
    }

    function getKeypadColumn() {
        let symbols = getKeypadSymbols().map(x => x[0]);
        let possibleColumns = [];
        for (let column of COLUMNS)
            if (symbols.every(x => column.includes(x))) possibleColumns.push(column);
        return possibleColumns.length === 1 ? possibleColumns[0] : null;
    }

    registerSolver("Keypad", setUpKeypadUI, [], true);
})();