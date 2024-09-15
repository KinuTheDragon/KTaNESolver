(function() {
    const MEMORY_BANKS = (
        "RNOYGCBPKW" +
        "NKWCRYPGOB" +
        "WBYKOGNRPC" +
        "ORBPNWCKGY" +
        "PCNBKROYWG" +
        "GYKOWBRNCP" +
        "CGRWPKYOBN" +
        "KOPGCNWBYR" +
        "YWGRBPKCNO" +
        "BPCNYOGWRK"
    );
    const MEMORY_BANKS_KEY = {
        R: "Red",
        N: "Pink",
        O: "Orange",
        Y: "Yellow",
        G: "Green",
        C: "Cyan",
        B: "Blue",
        P: "Purple",
        K: "Black",
        W: "White"
    };
    const MEMORY_BANKS_COLORS = [
        "Red",
        "Pink",
        "Orange",
        "Yellow",
        "Green",
        "Cyan",
        "Blue",
        "Purple",
        "Black",
        "White"
    ];
    const NEW_MODULES = [
        "Three Wires",
        "Colored Buttons",
        "Punctuation Buttons",
        "Colored Piano",
        "Colorful Message"
    ];
    const MODULE_COLORS = [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Purple"
    ];

    const THREE_WIRES = [
        123, 132, 213, 231, 312, 213, 123, 312, 132, 321,
        132, 321, 123, 312, 213, 231, 321, 132, 123, 231,
        213, 123, 312, 321, 231, 132, 312, 231, 213, 123,
        231, 312, 132, 213, 123, 321, 231, 123, 321, 213,
        312, 231, 321, 132, 321, 123, 213, 321, 312, 132,
        321, 213, 231, 123, 132, 312, 132, 213, 231, 312,
    ];
    const COLORED_BUTTONS = [
        43, 54, 33, 61, 11, 21, 51, 61, 34, 43,
        45, 15, 64, 21, 26, 15, 56, 26, 62, 64,
        45, 52, 51, 42, 31, 32, 53, 34, 62, 14,
        55, 53, 25, 66, 56, 23, 52, 44, 42, 46,
        23, 65, 24, 35, 14, 46, 12, 16, 65, 63,
        13, 31, 36, 16, 22, 41, 63, 24, 32, 36,
    ];
    const PUNCT_BUTTONS = (
        '!,. ".? "!? .!, ,". .!" ,.? ,." ,?. !?. ' +
        '",! .?, !," .," ?,. "?! ?." ?". ?!. !?" ' +
        ',." ?., .!, !," ",! !?, !?. "!. !," "!? ' +
        '!?. !.? .", ,!" "., "., ?", !?, "?! ?!. ' +
        '?!, ?!. ?., ,!. ?." !,? ?!" ?,! !." ?,. ' +
        ',"? ."! ?,! .?! .!" ".? .!" .!? ?," ".?'
    ).split(" ");
    const COLORED_PIANO = (
        "CFAGCEGDGE" +
        "DEGFDGCEAF" +
        "EGDCADECFG" +
        "FCFEGAAADC" +
        "GAEDFCDFCA" +
        "ADCAEFFGED"
    );
    const COLORFUL_MESSAGE = (
        "ALETCERUTS" +
	    "TOCDRAESSE" +
	    "MELSURYELI" +
	    "SDAEESARBA" +
	    "RORASHLTAL" +
	    "EPLEESBDED"
    );

    function setUpPunctuationMarksUI() {
        addNumberInput("Initial number", "initialNumber", {min: 0, max: 99, step: 1});
        addChoiceInput("New module", "newModule", NEW_MODULES);
        updateUI();
        setUIChangeCallback(updateUI);
        setResultCallback(getResult);
    }

    function updateUI(id) {
        if (id && id !== "newModule") return;
        removeInput(/spec.*/);
        switch (solverFields.newModule) {
            case "Three Wires":
                addChoiceInput("Middle wire color", "specWire", MODULE_COLORS);
                break;
            case "Colored Buttons":
                addChoiceInput("Flashing button color", "specColoredButtons", MODULE_COLORS);
                break;
            case "Punctuation Buttons":
                addChoiceInput("Display color", "specPunctButtons", MODULE_COLORS);
                break;
            case "Colored Piano":
                break;
            case "Colorful Message":
                for (let i = 0; i < 6; i++)
                    addChoiceInput("Flash color " + (i + 1), "specMessage" + i, MODULE_COLORS);
                break;
        }
    }

    function getMemoryBanksColor() {
        return MEMORY_BANKS_KEY[MEMORY_BANKS[solverFields.initialNumber]];
    }

    function getResult() {
        return "Step 1: Double-tap to get the initial number.\n" +
               "Step 2: Tap, then press " + getMemoryBanksColor().toLowerCase() + ".\n" +
               getSpecificResult().map((x, i) => "Step " + (i + 3) + ": " + x).join("\n");
    }

    function getSpecificResult() {
        switch (solverFields.newModule) {
            case "Three Wires": {
                let index = MEMORY_BANKS_COLORS.indexOf(getMemoryBanksColor()) +
                            MODULE_COLORS.indexOf(solverFields.specWire) * 10;
                let order = THREE_WIRES[index];
                return ["Cut in order: " + [...order.toString()].map(x => "top middle bottom".split(" ")[+x - 1]).join(", ")];
            }
            case "Colored Buttons": {
                let index = MEMORY_BANKS_COLORS.indexOf(getMemoryBanksColor()) +
                            MODULE_COLORS.indexOf(solverFields.specColoredButtons) * 10;
                let values = COLORED_BUTTONS[index];
                return [`Press the ${ordinalize(Math.floor(values / 10))} button, ` +
                        `then the ${ordinalize(values % 10)} button.`];
            }
            case "Punctuation Buttons": {
                let index = MEMORY_BANKS_COLORS.indexOf(getMemoryBanksColor()) +
                            MODULE_COLORS.indexOf(solverFields.specPunctButtons) * 10;
                let label = PUNCT_BUTTONS[index];
                return ["Press the button labeled " + label];
            }
            case "Colored Piano": {
                let column = MEMORY_BANKS_COLORS.indexOf(getMemoryBanksColor());
                let columnNotes = MODULE_COLORS.map((x, i) => [x, COLORED_PIANO[i * 10 + column]]);
                columnNotes.sort((a, b) => "CDEFGA".indexOf(a[1]) - "CDEFGA".indexOf(b[1]));
                let colors = columnNotes.map(x => x[0].toLowerCase());
                return ["Press the key that matches position and color of the following list: " + colors.join(", ")];
            }
            case "Colorful Message": {
                let flashes = [];
                for (let i = 0; i < 6; i++) flashes.push(solverFields["specMessage" + i]);
                if ((new Set(flashes)).size < 6) return ["Press the small button.", "Enter the flashes above."];
                let column = MEMORY_BANKS_COLORS.indexOf(getMemoryBanksColor());
                return ["Press the small button.",
                        "Enter " + flashes.map(x => COLORFUL_MESSAGE[MODULE_COLORS.indexOf(x) * 10 + column]).join("")];
            }
        }
    }

    registerSolver("...?", setUpPunctuationMarksUI, []);
})();