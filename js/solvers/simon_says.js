(function () {
    function getSimonIndex() {
        let hasVowel = /[AEIOU]/.test(edgework.serialNumber);
        let strikes = Math.min(edgework.strikes, 2);
        return hasVowel * 3 + strikes;
    }

    const SIMON_ROWS = "bygr rbyg ygbr bryg ygbr gryb".split(" ");
    const SIMON_INSTRUCTIONS = [
        "Rotate clockwise, skipping green",
        "Swap green and yellow",
        "Swap with opposite side",
        "Swap red/blue and green/yellow",
        "Swap with opposite side",
        "Rotate counterclockwise"
    ];

    function getSimonColor(letter) {
        switch (letter) {
            case "r": return "Red";
            case "b": return "Blue";
            case "g": return "Green";
            case "y": return "Yellow";
        }
    }

    function getSimonResult() {
        let index = getSimonIndex();
        let row = SIMON_ROWS[index];
        return SIMON_INSTRUCTIONS[index] + ":\n" +
            [..."rbgy"].map((x, i) => getSimonColor(x) + " → " + getSimonColor(row[i])).join("\n");
    }

    registerSolver("Simon Says", () => setResultCallback(getSimonResult),
        [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.STRIKES], true);
})();