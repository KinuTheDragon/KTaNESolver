(function() {
    const PASSWORDS = (
        "about after again below could " +
        "every first found great house " +
        "large learn never other place " +
        "plant point right small sound " +
        "spell still study their there " +
        "these thing think three water " +
        "where which world would write"
    ).split(" ");

    function setUpPasswordUI() {
        for (let i = 0; i < 5; i++)
            addTextInput(`Column ${i + 1} letters`, "letters" + i);
        setResultCallback(getResult);
    }

    function getResult() {
        let possibleWords = [...PASSWORDS];
        let knownPossibleWords = [...PASSWORDS];
        for (let i = 0; i < 5; i++) {
            let column = solverFields["letters" + i].toLowerCase();
            if (column.length > 6) return "Too many letters in column " + (i + 1);
            if (!/^[a-z]*$/.test(column)) return "Non-letter in column " + (i + 1);
            if ((new Set(column)).size < column.length) return "Duplicate in column " + (i + 1);
            if (!column) continue;
            possibleWords = possibleWords.filter(x => column.includes(x[i]));
            if (!possibleWords.length) return "Impossible password";
            if (column.length === 6) knownPossibleWords = knownPossibleWords.filter(x => column.includes(x[i]));
        }
        return "Possible passwords:\n" +
            possibleWords.join(" ").toUpperCase() + "\n" +
            knownPossibleWords.filter(x => !possibleWords.includes(x)).map(x => x + "?").join(" ").toUpperCase();
    }

    registerSolver("Password", setUpPasswordUI, [], true);
})();