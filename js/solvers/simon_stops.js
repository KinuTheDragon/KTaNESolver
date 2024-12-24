(function() {
    const COLOR_ORDER = "Red Orange Yellow Green Blue Violet".split(" ");

    const COLORS = {
        R: "Red",
        O: "Orange",
        Y: "Yellow",
        G: "Green",
        B: "Blue",
        P: "Violet",
        V: "Violet"
    };

    const CONTROL_INPUT_INDICES = [
        () => edgework.batteriesTotal * edgework.serialNumberLetters.filter(x => !"AEIOU".includes(x)).length,
        () => edgework.portsTotal * 2 + edgework.batteryHolders,
        () => 2 + edgework.unlitIndicators.length + 3 * edgework.litIndicators.length
    ];

    const CONTROL_INPUT_DATA = [
        "SC 1N PS 1P 2N OC NS 2P PP NP",
        "1P NP PP SC OC PS 2P 1N NS 2N",
        "OC 1N 1P NS 2P PP PS SC NP 2N"
    ].map(x => x.split(" "));

    const CONTROL_INPUT_NAMES = {
        "1N": "one color clockwise",
        "2N": "two colors clockwise",
        "1P": "one color counterclockwise",
        "2P": "two colors counterclockwise",
        "NP": "next primary color clockwise",
        "PP": "next primary color counterclockwise",
        "NS": "next secondary color clockwise",
        "PS": "next secondary color counterclockwise",
        "OC": "opposite color",
        "SC": "same color"
    };

    const NORMAL_INPUT = [
        ["Blue", null, "Yellow", "Red", "Violet", null],
        [null, "Yellow", null, "Violet", "Orange", "Blue"],
        ["Yellow", "Orange", "Green", null, null, "Red"]
    ];

    function setUpSimonStopsUI() {
        addTextInput("Flash order", "flashes");
        setResultCallback(getResult);
    }

    function getResult() {
        return getActualResult() + "\nR = red, O = orange, Y = yellow, G = green, B = blue, V/P = violet/purple";
    }

    function getActualResult() {
        let flashes = solverFields.flashes.trim().toUpperCase();
        if (flashes.length < 3 || flashes.length > 5) return "Invalid flash sequence";
        let flashColors = [...flashes].map(x => COLORS[x]);
        if (flashColors.includes(undefined)) return "Invalid flash color";
        let stage = flashColors.length - 3;
        let rowNumber = (CONTROL_INPUT_INDICES[stage]() + edgework.serialNumberDigits.at(-1)) % 10;
        let controlInput = CONTROL_INPUT_NAMES[CONTROL_INPUT_DATA[stage][rowNumber]];
        let normalInputData = NORMAL_INPUT[stage].map((x, i) => x ?? COLOR_ORDER[(i + edgework.batteriesTotal) % 6]);
        let indices = flashColors.map(x => COLOR_ORDER.indexOf(x));
        return "Press " + indices.map(x => normalInputData[x]).join(", ") + ".\nControl input: " + controlInput;
    }

    registerSolver("Simon Stops", setUpSimonStopsUI, [EDGEWORK_FIELD.BATTERIES,
                                                      EDGEWORK_FIELD.SERIAL_NUMBER,
                                                      EDGEWORK_FIELD.PORTS,
                                                      EDGEWORK_FIELD.INDICATORS]);
})();