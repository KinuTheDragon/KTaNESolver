(function () {
    function setUpKnobUI() {
        addChoiceInput("Columns 4 and 5 of lights", "lightPattern", [
            "▖: Bottom left",
            "▝: Top right",
            "▞: Forward slash",
            "▐: Right half",
            "▚: Backslash",
            "▟: J",
            "▜: 7",
        ]);
        setResultCallback(getResult);
    }

    function getResult() {
        return "Turn the knob to " + getKnobDirection() + " (relative to UP label)";
    }

    function getKnobDirection() {
        switch (solverFields.lightPattern[0]) {
            case "▞": case "▐": return "up";
            case "▖": case "▝": return "down";
            case "▟": return "left";
            case "▜": case "▚": return "right";
        }
    }

    registerSolver("Knob", setUpKnobUI, [], true);
})();