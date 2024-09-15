(function () {
    const ELEMENTS = {
        "🜂": "Fire",
        "🜄": "Water",
        "🜃": "Earth",
        "🜁": "Air"
    };
    const CELESTIAL_BODIES = {
        "☉︎": "Sun",
        "☽︎": "Moon",
        "☿": "Mercury",
        "♀": "Venus",
        "♂": "Mars",
        "♃": "Jupiter",
        "♄": "Saturn",
        "♅": "Uranus",
        "♆": "Neptune",
        "⚘": "Pluto"
    };
    const ZODIAC_SIGNS = {
        "♈︎": "Aries",
        "♉︎": "Taurus",
        "♊︎": "Gemini",
        "♋︎": "Cancer",
        "♌︎": "Leo",
        "♍︎": "Virgo",
        "♎︎": "Libra",
        "♏︎": "Scorpio",
        "♐︎": "Sagittarius",
        "♑︎": "Capricorn",
        "♒︎": "Aquarius",
        "♓︎": "Pisces"
    };

    const RELATIONSHIPS01 = [
        [ 0,  0,  1, -1,  0,  1, -2,  2,  0, -1],
        [-2,  0, -1,  0,  2,  0, -2,  2,  0,  1],
        [-1, -1,  0, -1,  1,  2,  0,  2,  1, -2],
        [-1,  2, -1,  0, -2, -1,  0,  2, -2,  2]
    ];

    const RELATIONSHIPS02 = [
        [ 1,  0, -1,  0,  0,  2,  2,  0,  1,  0,  1,  0],
        [ 2,  2, -1,  2, -1, -1, -2,  1,  2,  0,  0,  2],
        [-2, -1,  0,  0,  1,  0,  1,  2, -1, -2,  1,  1],
        [ 1,  1, -2, -2,  2,  0, -1,  1,  0,  0, -1, -1]
    ];

    const RELATIONSHIPS12 = [
        [-1, -1,  2,  0, -1,  0, -1,  1,  0,  0, -2, -2],
        [-2,  0,  1,  0,  2,  0, -1,  1,  2,  0,  1,  0],
        [-2, -2, -1, -1,  1, -1,  0, -2,  0,  0, -1,  1],
        [-2,  2, -2,  0,  0,  1, -1,  0,  2, -2, -1,  1],
        [-2,  0, -1, -2, -2, -2, -1,  1,  1,  1,  0, -1],
        [-1, -2,  1, -1,  0,  0,  0,  1,  0, -1,  2,  0],
        [-1, -1,  0,  0,  1,  1,  0,  0,  0,  0, -1, -1],
        [-1,  2,  0,  0,  1, -2,  1,  0,  2, -1,  1,  0],
        [ 1,  0,  2,  1, -1,  1,  1,  1,  0, -2,  2,  0],
        [-1,  0,  0, -1, -2,  1,  2,  1,  1,  0,  0, -1]
    ];

    function setUpAstrologyUI() {
        addChoiceInput("Symbol 1", "symbol0", Object.entries(ELEMENTS).map(([k, v]) => k + ": " + v));
        addChoiceInput("Symbol 2", "symbol1", Object.entries(CELESTIAL_BODIES).map(([k, v]) => k + ": " + v));
        addChoiceInput("Symbol 3", "symbol2", Object.entries(ZODIAC_SIGNS).map(([k, v]) => k + ": " + v));
        setResultCallback(getResult);
    }

    function getOmenScore() {
        let index0 = Object.keys(ELEMENTS).indexOf(solverFields.symbol0.split(": ")[0]);
        let index1 = Object.keys(CELESTIAL_BODIES).indexOf(solverFields.symbol1.split(": ")[0]);
        let index2 = Object.keys(ZODIAC_SIGNS).indexOf(solverFields.symbol2.split(": ")[0]);
        let omenScore = 0;
        omenScore += RELATIONSHIPS01[index0][index1];
        omenScore += RELATIONSHIPS02[index0][index2];
        omenScore += RELATIONSHIPS12[index1][index2];
        let symbols = [0, 1, 2].map(x => solverFields["symbol" + x].split(": ")[1]);
        for (let symbol of symbols) {
            if ([...symbol.toUpperCase()].some(x => edgework.serialNumber.includes(x))) omenScore++;
            else omenScore--;
        }
        return omenScore;
    }

    function getResult() {
        let omenScore = getOmenScore();
        if (omenScore === 0) return "Press NO OMEN any time.";
        return `Press ${omenScore > 0 ? "GOOD" : "POOR"} OMEN when the timer contains ${Math.abs(omenScore)}.`;
    }

    registerSolver("Astrology", setUpAstrologyUI, [EDGEWORK_FIELD.SERIAL_NUMBER]);
})();