(function() {
    function setUpInitialButtonUI() {
        addChoiceInput("Button color", "buttonColor", ["Red", "Blue", "Yellow", "White", "Black"]);
        addChoiceInput("Button text", "buttonText", ["Abort", "Detonate", "Hold", "Press"]);
        updateStripInput();
        setUIChangeCallback(element => updateStripInput());
        setResultCallback(() => {
            if (shouldHoldButton()) {
                let releaseOn = ({Blue: 4, Yellow: 5})[solverFields.stripColor] ?? 1;
                return `Hold the button and release when the timer contains a ${releaseOn} in any position.`;
            } else {
                return "Press and immediately release the button.";
            }
        });
    }

    function shouldHoldButton() {
        let {buttonColor, buttonText} = solverFields;
        if (buttonColor === "Blue" && buttonText === "Abort") return true;
        if (edgework.batteriesTotal > 1 && buttonText === "Detonate") return false;
        if (buttonColor === "White" && edgework.indicatorCAR === true) return true;
        if (edgework.batteriesTotal > 2 && edgework.indicatorFRK === true) return false;
        if (buttonColor === "Yellow") return true;
        if (buttonColor === "Red" && buttonText === "Hold") return false;
        return true;
    }

    function updateStripInput() {
        if (shouldHoldButton() && !hasInput("stripColor")) {
            addChoiceInput("Strip color", "stripColor", ["Red", "Blue", "Yellow", "White"])
        } else if (!shouldHoldButton()) {
            removeInput("stripColor");
        }
    }

    registerSolver("The Button", setUpInitialButtonUI,
        [EDGEWORK_FIELD.BATTERIES, EDGEWORK_FIELD.INDICATOR_CAR, EDGEWORK_FIELD.INDICATOR_FRK], true
    );
})();