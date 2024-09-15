(function() {
    const DISPLAY_WORDS = {
        YES: "ml",
        FIRST: "tr",
        DISPLAY: "br",
        OKAY: "tr",
        SAYS: "br",
        NOTHING: "ml",
        "[empty]": "bl",
        BLANK: "mr",
        NO: "br",
        LED: "ml",
        LEAD: "br",
        READ: "mr",
        RED: "mr",
        REED: "bl",
        LEED: "bl",
        "HOLD ON": "br",
        YOU: "mr",
        "YOU ARE": "br",
        YOUR: "mr",
        "YOU'RE": "mr",
        UR: "tl",
        THERE: "br",
        "THEY'RE": "bl",
        THEIR: "mr",
        "THEY ARE": "ml",
        SEE: "br",
        C: "tr",
        CEE: "br"
    };

    const BUTTON_WORDS = {
        READY: "YES, OKAY, WHAT, MIDDLE, LEFT, PRESS, RIGHT, BLANK, READY".split(", "),
        FIRST: "LEFT, OKAY, YES, MIDDLE, NO, RIGHT, NOTHING, UHHH, WAIT, READY, BLANK, WHAT, PRESS, FIRST".split(", "),
        NO: "BLANK, UHHH, WAIT, FIRST, WHAT, READY, RIGHT, YES, NOTHING, LEFT, PRESS, OKAY, NO".split(", "),
        BLANK: "WAIT, RIGHT, OKAY, MIDDLE, BLANK".split(", "),
        NOTHING: "UHHH, RIGHT, OKAY, MIDDLE, YES, BLANK, NO, PRESS, LEFT, WHAT, WAIT, FIRST, NOTHING".split(", "),
        YES: "OKAY, RIGHT, UHHH, MIDDLE, FIRST, WHAT, PRESS, READY, NOTHING, YES".split(", "),
        WHAT: "UHHH, WHAT".split(", "),
        UHHH: "READY, NOTHING, LEFT, WHAT, OKAY, YES, RIGHT, NO, PRESS, BLANK, UHHH".split(", "),
        LEFT: "RIGHT, LEFT".split(", "),
        RIGHT: "YES, NOTHING, READY, PRESS, NO, WAIT, WHAT, RIGHT".split(", "),
        MIDDLE: "BLANK, READY, OKAY, WHAT, NOTHING, PRESS, NO, WAIT, LEFT, MIDDLE".split(", "),
        OKAY: "MIDDLE, NO, FIRST, YES, UHHH, NOTHING, WAIT, OKAY".split(", "),
        WAIT: "UHHH, NO, BLANK, OKAY, YES, LEFT, FIRST, PRESS, WHAT, WAIT".split(", "),
        PRESS: "RIGHT, MIDDLE, YES, READY, PRESS".split(", "),
        YOU: "SURE, YOU ARE, YOUR, YOU'RE, NEXT, UH HUH, UR, HOLD, WHAT?, YOU".split(", "),
        "YOU ARE": "YOUR, NEXT, LIKE, UH HUH, WHAT?, DONE, UH UH, HOLD, YOU, U, YOU'RE, SURE, UR, YOU ARE".split(", "),
        YOUR: "UH UH, YOU ARE, UH HUH, YOUR".split(", "),
        "YOU'RE": "YOU, YOU'RE".split(", "),
        UR: "DONE, U, UR".split(", "),
        U: "UH HUH, SURE, NEXT, WHAT?, YOU'RE, UR, UH UH, DONE, U".split(", "),
        "UH HUH": "UH HUH".split(", "),
        "UH UH": "UR, U, YOU ARE, YOU'RE, NEXT, UH UH".split(", "),
        "WHAT?": "YOU, HOLD, YOU'RE, YOUR, U, DONE, UH UH, LIKE, YOU ARE, UH HUH, UR, NEXT, WHAT?".split(", "),
        DONE: "SURE, UH HUH, NEXT, WHAT?, YOUR, UR, YOU'RE, HOLD, LIKE, YOU, U, YOU ARE, UH UH, DONE".split(", "),
        NEXT: "WHAT?, UH HUH, UH UH, YOUR, HOLD, SURE, NEXT".split(", "),
        HOLD: "YOU ARE, U, DONE, UH UH, YOU, UR, SURE, WHAT?, YOU'RE, NEXT, HOLD".split(", "),
        SURE: "YOU ARE, DONE, LIKE, YOU'RE, YOU, HOLD, UH HUH, UR, SURE".split(", "),
        LIKE: "YOU'RE, NEXT, U, UR, HOLD, DONE, UH UH, WHAT?, UH HUH, YOU, LIKE".split(", ")
    };

    const POSITIONS = {
        tl: "Top-left",
        tr: "Top-right",
        ml: "Middle-left",
        mr: "Middle-right",
        bl: "Bottom-left",
        br: "Bottom-right"
    };

    function setUpWhosOnFirstUI() {
        addChoiceInput("Display word", "displayWord", Object.keys(DISPLAY_WORDS).toSorted());
        setUpButtonInput();
        setUIChangeCallback(setUpButtonInput);
        setResultCallback(() => "Press the first button that appears in this list:\n" +
            BUTTON_WORDS[solverFields.buttonLabel].join("\n")
        );
    }

    function setUpButtonInput(element) {
        if (element === "buttonLabel") return;
        let oldButtonLabel = solverFields.buttonLabel ?? Object.keys(BUTTON_WORDS).toSorted()[0];
        removeInput("buttonLabel");
        addChoiceInput(POSITIONS[DISPLAY_WORDS[solverFields.displayWord]] + " button label",
            "buttonLabel", Object.keys(BUTTON_WORDS).toSorted());
        setInputValue("buttonLabel", oldButtonLabel);
    }

    registerSolver("Who's on First", setUpWhosOnFirstUI, [], true);
})();