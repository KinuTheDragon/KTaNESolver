(function() {
    const COLORS = (
        "White Red Orange Yellow Lime Green Jade Grey " +
        "Cyan Azure Blue Violet Magenta Rose Black"
    ).split(" ");
    const WORDS = (
        "A LETTER, A WORD, THE LETTER, THE WORD, 1 LETTER, 1 WORD, ONE LETTER, " +
        "ONE WORD, B, C, D, E, G, K, N, P, Q, T, V, W, Y, BRAVO, CHARLIE, DELTA, " +
        "ECHO, GOLF, KILO, NOVEMBER, PAPA, QUEBEC, TANGO, VICTOR, WHISKEY, YANKEE, " +
        "COLOUR, RED, ORANGE, YELLOW, LIME, GREEN, JADE, CYAN, AZURE, BLUE, VIOLET, " +
        "MAGENTA, ROSE, IN RED, IN YELLOW, IN GREEN, IN CYAN, IN BLUE, IN MAGENTA, QUOTE, END QUOTE"
    ).split(", ");

    const BAMBOOZLE_TABLE = [
        [-10,   8,   6,  10,   6,  -5,   6,   3,   7,   3,  -4,  -9,   0,  -1,   0],
        [  8,   5,  -2,  -4,  -5,   8,   7,  10,   8,   7,  -8,  -8,   2,   1,  -6],
        [ -8,   2,  -6,  -8,  -4,   5,  -1,   4,   4,  -5,   8,   2,   7,  -4,   6],
        [  3,   9,   8,  -1,  -3,  -9,   0,  10,   6,  -2,   7,   3,   3,  -2,   0],
        [  5,  -3,   7,   9,   4,  -6,  10,   6,  -4,  -6,  -5,  -2,   5,  -7,  -3],
        [-10,   3,   9,   6,  -9,   0,   9,   1,  -9,   9,   0,  -4,  -4,   0,  -9],
        [ -9,  -9,   4,  10,  -5,  -9,   1,   8,   0,   7,  -3,   8,   3,   1,   5],
        [  7,  -5,   9,   0,  -9,   0,  -8,   6,  -7,  -4,  -9,  -6,   9,   2,   1],
        [  3,   2,  -5,   1,   9,  10,   3,  -4,   7,  -5, -10,   8,   8,   9,  10],
        [ -5,   8,  -1,  -1,  -1,  -8,   2,  -6,  -9,  10,  -4,   2,   6,  -2,  -9],
        [  1,  10,  -3, -10, -10,  10,   9,   5,   7,   3,   6,  -5,   2,   4,  -6],
        [ -2,   3,   8,  -9,  -2,  -9,   7,  -5,  10,   8,   9,  10,  -2,  10,   2],
        [  6,  -4,  10,  -8,   1,   7,   6,   9,   5,  -1,  -7,   2,  -9,  -1,  -4],
        [  5,   2,  -9,   3,  -5,   9,   1,   0,  -8,  -4,  10,  -4,   2,   5,   3],
        [  1,   5,   3,   8,  -2,   7,  -6,   2,  -2,   6,  -2,  -5,  -4,  -7,  -2],
        [-10,   2,   7,   9,  -4, -10, -10,  -9,   5,   4,  -4,   4,   7,  -6,   1],
        [  7,   9,   3,  -3,   1,  -6,   1,   8,   7,   2, -10,  -5,   9,  -5,   6],
        [ -6, -10,  -2,   2,   6,   6,  -2,   8,   6,   5,   5,  -6,  -8,   3, -10],
        [ -9,  -9, -10,   3,   7,   2,  -4,   4,  -1,   7,   3,   9,  -3,   7,  -4],
        [ -7,  10,  -8,   2,  -4,  -2,   1,  -4,   5,  10,   5,  -3,  -8,  -5,   9],
        [-10,  -5,   9,  10,   2,  -4,   6,  -2,  -1,   3,  10,  -4,   2,   7,  -7],
        [ -7, -10,   2,   5,   8,   7,  -6,  -6, -10,  -8,  -2,   6,   1,   6,  10],
        [ -3,   7,   1,  -5,  -5,   5,  -1,  -7,   2,   7,   2,  -9,  -6,  -6,  -8],
        [  4,  -8,   0, -10,   5,   5,   2,  -8,  -6,  -8,  10,   2,  -7,   4,  -3],
        [ -8,   8,   5,   9,   9,   6,   9,   5,  -3,   7,  -9,   3,   8,  -9,   1],
        [ -1,  10,   4,  -5,  -8,   3,   8,   2,  -9,  -3,  -4,   1,  -3,   1,   8],
        [ -5,  -4,   2,   0,  -9,  -2,  -4,   4,   5,   5,   8,  -7,  -1,  -7,  10],
        [  4,  10,  -7,   1,   9,   3,  -6,  -2,   1,   0,  -4,   9,   9,  -5,   4],
        [  7,  -2,   9,  -9,   4,   0,  -4,  -8,  -2,  -6,  -5,   7,   0,   7,  -8],
        [ -8,  -6,  -4,   3,  -4,   6,   5,   9,   9,   2, -10,   8,   1,   6,   7],
        [ -1,  -7,  -7,  -8,   3,  -1,  10,  -9,  -3,  -4,   7,   9,   4,  -3,  -9],
        [  6,   0,   1,   8,   0,   7,   8,   7,   9, -10,  -6,   0,   1,  -8,   4],
        [ -7,   9,   5,   1,   9,  10,  10,   4,   0,   8,   6,  -8,   5,   0,  -9],
        [ 10,  10,   1,   2,  -2,   9,  -2,   8,   8,   9,   8,   7,   3,  -5,  -1],
        [  7,   1,   6,  -9,  -8,   3,  10,  -9,   7,   8,   9,   0,  -1,  10,   4],
        [ -4,   0,  -2,  -3,   7,  -2,   5,   3,  -8,   5,   1,  -5,  -3,  -9,   3],
        [ -3, -10,   7,   3,   5,   2,   6,  -4,  -2,  -6,  -6,   0,   4,  -7,  -1],
        [  7,   8,  -6,   6,  -6,  10,  -8,  -5,   1,  -4,   1,  -2,   3,   1,  -2],
        [ -3,   2,  -7,   7,  -1,   6,   9,   2,   7,   2,   4,   3, -10,   6,   7],
        [ -8,  -5,  10,  -4,  -5,  -5,  -1,   6,  -8,   6,   0,   4,  10,   2,  -9],
        [ -6,  -7,   9,  -6,  -1,  -7, -10,  -3,  -6,   7,  -1,   2,   7,   8,  -1],
        [  6,  -8,   4,   9,  -8,  -1,   3,   1,   9,   9,  -3,  -4,   3,  -4,  -7],
        [  0,  -4,  -9,  -9,   5,  -8,  10,  10,   0,   0,  -7,  -1,   4,   5,  -9],
        [  4,   6,   3,  -3,   8,  -5,   0,   8,  -7,   8,  -5,  -8,  -4,   2, -10],
        [  1,   3,  -7,  -5,  -4,   6,  -6,  -4,   4,   6,  -1,   3,   2,  -4,  -6],
        [  4,  -5,  -3,   3,  -7,   9,  -8, -10,   2,  -5,  -7,   2,   8,  -2,  -2],
        [ -6,  -2,   6,  10, -10,   7,  -3,  -8,  -4,   7,   7,   4,  -8,  -7,   1],
        [  1, -10,   3,  -9,   5,  -7,   6,  -3,   9,   1,  -4,   8,   1,  -8,  -9],
        [  7,  -8,  -2,  -3,  -2,  -1,  -9,   7,   2,   8,   5,  -8,  -6,  -1,   4],
        [ -5,   6, -10,   5,   6,   6,  -4,   8,  -6,  -4,   5,  -9,   1,  -4,   3],
        [  8,   2,   8,   8,  -5,  -2,  -2,  -7,   4,   8,   3,   5,   3,  -2,  -6],
        [  9,   6,   0,  -7,  -3,   9,  -8,  -6,  -1,  10,   7,  -3,  -8, -10,  -9],
        [ -8,   0,  -9,   1,  -4,   7,   9,   3,   8,  -1,   2,   8,   6,   3,   4],
        [ -9,  -8,   9,  -4,  -2,   5,  -6,  10,   0,  -8,   9,  -6,   2,   7,  10],
        [  7,   0,  -6,   9,   6,  -1,  10,   3,   6,   6,  -7,  -3,  -5,  -9,   2],
    ];

    function setUpBamboozlingButtonUI() {
        addChoiceInput("Button color", "buttonColor", COLORS);
        addChoiceInput("Button upper text", "buttonText0", WORDS);
        addChoiceInput("Button lower text", "buttonText1", WORDS);
        for (let i = 0; i < 5; i++) {
            let choices = WORDS;
            if (i === 1) choices = ["THEN"];
            if (i === 2) choices = choices.map(x => x + ":");
            addChoiceInput("Word " + (i + 1), "word" + i, choices);
            if (i === 0)
                addCheckbox("Word 1 has comma", "comma");
            if (i >= 3)
                addChoiceInput("Word " + (i + 1) + " color", "color" + i, COLORS);
        }
        addChoiceInput("Punctuation type", "quoteType", ["Single quotes (')", "Double quotes (\")", "No quotes"]);
        setResultCallback(getResult);
    }

    function getResult() {
        let display = [d1, d2, d3, d4, d5] = [0, 1, 2, 3, 4].map(x => WORDS.indexOf(solverFields["word" + x].replace(/:$/, "")));
        let [b1, b2] = [0, 1].map(x => WORDS.indexOf(solverFields["buttonText" + x]));
        let [c4, c5] = [3, 4].map(x => COLORS.indexOf(solverFields["color" + x]));
        let b = COLORS.indexOf(solverFields.buttonColor);
        if (display.includes(b1))
            return "Double-tap the button when the last digit of the timer is " +
                    mod(BAMBOOZLE_TABLE[d4][c4], 10) + ".";
        if (display.includes(b2))
            return "Double-tap the button when the last digit of the timer is " +
                    mod(BAMBOOZLE_TABLE[d5][c5], 10) + ".";
        let v1 = BAMBOOZLE_TABLE[d4 - d1][b];
        let v2 = BAMBOOZLE_TABLE[d5 - d3][14 - b];
        let v3 = BAMBOOZLE_TABLE[b1][c4];
        let v4 = BAMBOOZLE_TABLE[b2][c5];
        let x = v1 + v2;
        let y = v3 + v4;
        if (solverFields.comma) [x, y] = [y, x];
        switch (solverFields.quoteType) {
            case "Single quotes (')":
                return `Press when the sum of the last two digits of the timer is ` +
                       `${mod(x, 9) + 3}, and again when it is ${mod(y, 9) + 3}.`;
            case "Double quotes (\")":
                return `Press when the sum of the last two digits of the timer is ` +
                       `${mod(2 * x, 9) + 3}, and again when it is ${mod(2 * y, 9) + 3}.`;
            case "No quotes":
                return `Press when the last digit of the timer is ${mod(x, 10)}, ` +
                       `and again when it is ${mod(y, 10)}.`;
        }
    }

    registerSolver("Bamboozling Button", setUpBamboozlingButtonUI, []);
})();