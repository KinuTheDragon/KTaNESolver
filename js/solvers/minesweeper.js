(function() {
    const COLORS = {
        Red: 5,
        Orange: 2,
        Yellow: 3,
        Green: 1,
        Blue: 6,
        Purple: 4
    };

    function setUpMinesweeperUI() {
        addNumberInput("Number of colored squares", "count", {min: 5, max: 7, step: 1});
        updateMinesweeperUI();
        setUIChangeCallback(updateMinesweeperUI);
        setResultCallback(getResult);
    }

    function updateMinesweeperUI(element) {
        if (element && element !== "count") return;
        removeInput("square");
        addChoiceInput(
            "Square #" + (((edgework.serialNumberDigits[1] || 10) - 1) % solverFields.count + 1),
            "square", Object.keys(COLORS)
        );
    }

    function getResult() {
        let index = COLORS[solverFields.square] + edgework.serialNumberLetters[0].charCodeAt(0) - 64;
        let {count} = solverFields;
        return "Click square #" + (count - (index - 1) % count) + ".";
    }

    registerSolver("Minesweeper", setUpMinesweeperUI, [EDGEWORK_FIELD.SERIAL_NUMBER]);
})();