(function () {
    const SYMBOLS = [
        "𝆝: Mordent",
        " 𝆪: Down-bow",
        "𝄿: Semiquaver rest",
        "𝅜: Breve",
        "𝄡: C clef",
        "𝄓: Caesura",
        "𝄋: Dal segno",
        "𝅘𝅥𝅯: Semiquaver note",
        "𝆯: Pedal up",
        " 𝆫: Up-bow",
        "𝆜: Marcato",
        "𝅝: Semibreve note",
        "𝆓: Accent",
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
            ["Manual", sequence.replace(/^\(, /, "(").replace(/, \), x, (\d+)$/, ") x $1")],
            ["Sharp", sharpened.replace(/^\(, /, "(").replace(/, \), x, (\d+)$/, ") x $1")],
            ["Flat", flattened.replace(/^\(, /, "(").replace(/, \), x, (\d+)$/, ") x $1")],
            ["White/Black", sharpened.split(", ").map(
                x => [WHITE_BLACK[x.split(" x ")[0]] ?? x.split(" x ")[0]].concat(x.split(" x ").slice(1)).join(" x ")
            ).join(", ").replace(/^\(, /, "(").replace(/, \), x, (\d+)$/, ") x $1")]
        ]
    }

    function getSequence() {
        let symbols = getSymbols();
        let moreEvenDigits = (d => d.filter(x => x === 0) > d.filter(x => x === 1))
            (edgework.serialNumberDigits.map(x => x % 2));
        let anyDuplicates = (new Set(edgework.serialNumber)).size < 6;
        let atMostTwoPortTypes = Object.values(edgework.ports).filter(x => x !== 0).length <= 2;
        let litIndicatorWithVowel = edgework.litIndicators.filter(x => /[AEIOU]/.test(x.name)).length > 0;
        if (symbols.includes("Caesura") && moreEvenDigits)
            return "Eb F Eb C Ab F Eb";
        if ((symbols.includes("Dal segno") || symbols.includes("Semiquaver note")) && anyDuplicates)
            return "C# B A F# G# A G# F#";
        if (symbols.includes("Mordent") && symbols.includes("Pedal up"))
            return "G A G E G A G E";
        if ((symbols.includes("Down-bow") || symbols.includes("Up-bow")) && atMostTwoPortTypes)
            return "Eb Eb Db Ab Eb Eb F Db";
        if (symbols.includes("Marcato") && litIndicatorWithVowel)
            return "B A G Eb D A B A G";
        if ((symbols.includes("Semiquaver rest") || symbols.includes("Semiquaver note")) && edgework.batteriesAA >= 3)
            return "F# G A A D B A G E D";
        if (symbols.includes("Semibreve note") && symbols.includes("Breve"))
            return "G E F G C B C D C B A G";
        if ((symbols.includes("Accent") || symbols.includes("Marcato") || symbols.includes("Up-bow")) &&
             /[19]/.test(edgework.serialNumber))
            return "G G G G G G G Bb Eb F G";
        if (symbols.includes("Dal segno") || symbols.includes("C clef") || symbols.includes("Caesura"))
            return "D D D C# C# C# B C# B F#";
        let maxDigit = Math.max(...edgework.serialNumberDigits);
        if (maxDigit === 0) return "Bb A Bb G";
        return "( Bb A Bb G ) x " + (maxDigit + 1);
    }

    function getSymbols() {
        return [0, 1, 2].map(x => solverFields["symbol" + x].split(": ")[1]);
    }

    registerSolver("Festive Piano Keys", setUpPianoKeysUI,
        [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.PORTS,
         EDGEWORK_FIELD.INDICATOR_BOB, EDGEWORK_FIELD.INDICATOR_CAR, EDGEWORK_FIELD.INDICATOR_IND,
         EDGEWORK_FIELD.INDICATOR_MSA, EDGEWORK_FIELD.INDICATOR_NSA, EDGEWORK_FIELD.INDICATOR_SIG,
         EDGEWORK_FIELD.BATTERIES_AA]);
})();