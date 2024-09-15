(function() {
    const MORSE = {
        ".-":   "a",
        "-...": "b",
        "-.-.": "c",
        "-..":  "d",
        ".":    "e",
        "..-.": "f",
        "--.":  "g",
        "....": "h",
        "..":   "i",
        ".---": "j",
        "-.-":  "k",
        ".-..": "l",
        "--":   "m",
        "-.":   "n",
        "---":  "o",
        ".--.": "p",
        "--.-": "q",
        ".-.":  "r",
        "...":  "s",
        "-":    "t",
        "..-":  "u",
        "...-": "v",
        ".--":  "w",
        "-..-": "x",
        "-.--": "y",
        "--..": "z"
    };
    const MORSE_REVERSE = Object.fromEntries(Object.entries(MORSE).map(([a, b]) => [b, a]));

    const WORDS = {
        shell:  "3.505",
        halls:  "3.515",
        slick:  "3.522",
        trick:  "3.532",
        boxes:  "3.535",
        leaks:  "3.542",
        strobe: "3.545",
        bistro: "3.552",
        flick:  "3.555",
        bombs:  "3.565",
        break:  "3.572",
        brick:  "3.575",
        steak:  "3.582",
        sting:  "3.592",
        vector: "3.595",
        beats:  "3.600"
    };

    function setUpMorseCodeUI() {
        addTextInput("Morse code", "morse");
        setResultCallback(getActualResult);
    }

    function getActualResult() {
        return "Use space to separate letters, slash to separate repeats.\n" + getResult();
    }

    function getResult() {
        let {morse} = solverFields;
        if (!/^[a-zA-Z.\-\/ ]+$/.test(morse)) return "Invalid Morse code.";
        if (!/^[^\/]*(\/[^\/]*)?$/.test(morse)) return "Invalid Morse code.";
        for (let c in MORSE_REVERSE) morse = morse.toLowerCase().replaceAll(c, " " + MORSE_REVERSE[c] + " ");
        morse = morse.trim().replaceAll(/ +/g, " ");
        let possibleWords = [];
        for (let word in WORDS) {
            let morseWord = [...word].map(c => MORSE_REVERSE[c]).join(" ");
            if (morse.includes("/")) {
                let [left, right] = morse.split("/").map(x => x.trim());
                if (morseWord.endsWith(left) && morseWord.startsWith(right)) possibleWords.push(word);
            } else if (morseWord.includes(morse)) possibleWords.push(word);
        }
        if (possibleWords.length) return possibleWords.map(x => x + " → " + WORDS[x] + " MHz").join("\n");
        return "No words matched.";
    }

    registerSolver("Morse Code", setUpMorseCodeUI, [], true);
})();