(function() {
    const SIMON_SPINS_TRAITS = [
        // [Trait name, col. 1, col. 2, col. 3]
        ["Paddle height", "Frontmost", "Middle", "Backmost"],
        ["Background color", "Red", "Yellow", "Blue"],
        ["Paddle bottom shape", "Square", "Star", "Circle"],
        ["Nub position", "Left", "Right", "Top"],
        ["Symbol rotation", "None", "Clockwise", "Counterclockwise"],
        ["Symbol size", "Large", "Medium", "Small"],
        ["Symbol fill", "Hollow", "Striped", "Filled"],
        ["Paddle rotation", "Clockwise", "Counterclockwise", "None"],
        ["Beam color", "Red", "Yellow", "Blue"],
        ["Shape", "Two points", "Four points", "Three points"],
        ["Flash pattern", "Color inversion", "Shape hiding", "No flash"],
        ["Paddle flip direction", "Left to right", "Right to left", "None"],
        ["Number of beams", "Three", "Two", "One"],
        ["Background stripe", "None", "Horizontal", "Vertical"],
        ["Paddle bottom shape color", "Blue", "Red", "Yellow"],
        ["Beam length", "Short", "Long", "Medium"],
        ["Paddle bottom shape positioning", "Two vertical", "One", "Two horizontal"],
        ["Paddle edge color", "Red", "Blue", "Yellow"],
        ["Paddle shape", "Pentagon", "Circle", "Square"],
        ["Nub count", "Two", "Three", "One"]
    ];
    
    function setUpInitialSimonSpinsUI() {
        addNumberInput("Stage number", "stage", {min: 1, max: 5, step: 1});
        setUpSimonSpinsUI();
        setUIChangeCallback(element => setUpSimonSpinsUI());
        setResultCallback(getResult);
    }

    function getStartingRow() {
        return (+edgework.serialNumber[2]) + ((+edgework.serialNumber[5]) % 2) * 10;
    }

    function setUpSimonSpinsUI() {
        let previousData = {...solverFields};
        removeInput(/trait\d/);
        let startingRow = getStartingRow();
        for (let i = 0; i < solverFields.stage; i++) {
            let row = (startingRow + i + 1) % 20;
            addChoiceInput(SIMON_SPINS_TRAITS[row][0], "trait" + i, SIMON_SPINS_TRAITS[row].slice(1));
            if (previousData["trait" + i] !== undefined) setInputValue("trait" + i, previousData["trait" + i]);
        }
    }

    function getResult() {
        return getActualResult() + "\n(Note: Directions are indicated by if the paddle were at the 12 o'clock position.)";
    }

    function getActualResult() {
        let startingRow = getStartingRow();
        let stage = solverFields.stage;
        let checkTraitRow = (startingRow + stage - 1) % 20;
        let inputTraitRow = (checkTraitRow + 1) % 20;
        let checkTraitName = SIMON_SPINS_TRAITS[checkTraitRow][0].toUpperCase();
        let inputTraitName = SIMON_SPINS_TRAITS[inputTraitRow][0].toUpperCase();
        let findCheckTrait;
        if (stage === 1) findCheckTrait = 1;
        else {
            let previousTraits = SIMON_SPINS_TRAITS[checkTraitRow].slice(1);
            let previousSelectedTrait = solverFields["trait" + (stage - 2)];
            let previousTraitIndex = previousTraits.indexOf(previousSelectedTrait);
            findCheckTrait = (previousTraitIndex + 1) % 3 + 1;
        }
        return "Select the " + inputTraitName + " of the paddle with a " + checkTraitName +
               " of " + SIMON_SPINS_TRAITS[checkTraitRow][findCheckTrait].toUpperCase() + ",\n" +
               "then pick the paddles with the above traits in order.";
    }

    registerSolver("Simon Spins", setUpInitialSimonSpinsUI, [EDGEWORK_FIELD.SERIAL_NUMBER]);
})();