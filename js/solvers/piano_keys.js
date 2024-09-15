(function () {
    const SYMBOLS = [
        "♮: Natural",
        "♭: Flat",
        "♯: Sharp",
        "𝆝: Mordent",
        "𝆗: Turn",
        "𝄴: Common time",
        "𝄵: Cut-common time",
        "𝄐: Fermata",
        "𝄡: C clef",
    ];
    const WHITE_BLACK = {
        "C": "white 1",
        "D": "white 2",
        "E": "white 3",
        "F": "white 4",
        "G": "white 5",
        "A": "white 6",
        "B": "white 7",
        "C#": "black 1",
        "D#": "black 2",
        "F#": "black 3",
        "G#": "black 4",
        "A#": "black 5"
    };

    function setUpPianoKeysUI() {
        for (let i = 0; i < 3; i++)
            addChoiceInput("Symbol " + (i + 1), "symbol" + i, SYMBOLS);
        setResultCallback(getResult);
    }

    function getResult() {
        let symbols = getSymbols();
        if ((new Set(symbols)).size < 3) return "Invalid symbols: no duplicates allowed.";
        return getAllSequenceRepresentations().map(
            ([sequenceName, sequence]) =>
                sequenceName + ": " + sequence.replaceAll("#", "♯").replaceAll("b", "♭").replaceAll("♭l", "bl")
        ).join("\n");
    }

    function getAllSequenceRepresentations() {
        let sequence = getSequence().replaceAll("Fb", "E").replaceAll("E#", "F");
        let runLengthEncoded = [];
        for (let note of sequence.split(" ")) {
            if (runLengthEncoded.length && runLengthEncoded[runLengthEncoded.length - 1].note === note)
                runLengthEncoded[runLengthEncoded.length - 1].count++;
            else
                runLengthEncoded.push({note, count: 1});
        }
        sequence = runLengthEncoded.map(({note, count}) => count === 1 ? note : note + " x " + count).join(", ");
        let sharpened = sequence.replaceAll(
            /([A-G])b/g, (_, x) => String.fromCharCode(mod(x.charCodeAt(0) - 66, 7) + 65) + "#"
        );
        let flattened = sequence.replaceAll(
            /([A-G])#/g, (_, x) => String.fromCharCode(mod(x.charCodeAt(0) - 64, 7) + 65) + "b"
        );
        return [
            ["Manual", sequence],
            ["Sharp", sharpened],
            ["Flat", flattened],
            ["White/Black", sharpened.split(", ").map(
                x => [WHITE_BLACK[x.split(" x ")[0]] ?? x.split(" x ")[0]].concat(x.split(" x ").slice(1)).join(" x ")
            ).join(", ")]
        ]
    }

    function getSequence() {
        let symbols = getSymbols();
        if (symbols.includes("Flat") && edgework.serialNumberDigits.at(-1) % 2 === 0)
            return "Bb Bb Bb Bb Gb Ab Bb Ab Bb";
        if ((symbols.includes("Common time") || symbols.includes("Sharp")) && edgework.batteryHolders >= 2)
            return "Eb Eb D D Eb Eb D Eb Eb D D Eb";
        if (symbols.includes("Natural") && symbols.includes("Fermata"))
            return "E F# F# F# F# E E E";
        if ((symbols.includes("Cut-common time") || symbols.includes("Turn")) && edgework.portsStereoRCA > 0)
            return "Bb A Bb F Eb Bb A Bb F Eb";
        if (symbols.includes("C clef") && edgework.indicatorSND === true)
            return "E E E C E G G";
        if ((symbols.includes("Mordent") || symbols.includes("Fermata") || symbols.includes("Common time")) &&
            edgework.batteriesTotal >= 3)
            return "C# D E F C# D E F Bb A";
        if (symbols.includes("Flat") || symbols.includes("Sharp"))
            return "G G C G G C G C";
        if ((symbols.includes("Cut-common time") || symbols.includes("Mordent")) && /[378]/.test(edgework.serialNumber))
            return "A E F G F E D D F A";
        if (symbols.includes("Natural") || symbols.includes("Turn") || symbols.includes("C clef"))
            return "G G G Eb Bb G Eb Bb G";
        return "B D A G A B D A";
    }

    function getSymbols() {
        return [0, 1, 2].map(x => solverFields["symbol" + x].split(": ")[1]);
    }

    registerSolver("Piano Keys", setUpPianoKeysUI,
        [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.BATTERIES,
         EDGEWORK_FIELD.PORTS_STEREO_RCA, EDGEWORK_FIELD.INDICATOR_SND]);
})();