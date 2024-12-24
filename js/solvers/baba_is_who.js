(function() {
    const CHARACTERS = "BABA KEKE ME ROCK FLAG WALL".split(" ");
    const PROPERTIES = "YOU MOVE DEFEAT PUSH WIN STOP".split(" ");
    const ROW_NAMES = "Top Middle Bottom".split(" ");
    const COL_NAMES = "left right".split(" ");

    const CHARACTER_CONDITIONS = {
        BABA: x => x > 4,
        KEKE: x => x % 2 === 0,
        ME: x => [4, 6, 8, 9].includes(x),
        ROCK: x => x % 2 === 1,
        FLAG: x => x < 5,
        WALL: x => [2, 3, 5, 7].includes(x)
    };
    const CHARACTER_OFFSETS = {
        BABA: [0, 0],
        KEKE: [1, 0],
        ME: [-1, 0],
        ROCK: [0, -1],
        FLAG: [-1, 1],
        WALL: [1, 1]
    };
    const PROPERTY_SELECTORS = {
        YOU: () => edgework.batteriesTotal % 10,
        MOVE: () => edgework.serialNumberDigits.at(-1),
        DEFEAT: () => edgework.portsTotal % 10,
        PUSH: () => edgework.indicators.length,
        WIN: () => (edgework.serialNumber[3].charCodeAt(0) - 64) % 10,
        STOP: () => solverFields.numModules % 10
    };
    const PROPERTY_OFFSETS = {
        YOU: [1, 0],
        MOVE: [-1, 0],
        DEFEAT: [0, 1],
        PUSH: [-1, -1],
        WIN: [0, 0],
        STOP: [1, -1]
    };
    const PROPERTY_BASE_POSITIONS = {
        YOU: "DEFEAT",
        MOVE: "STOP",
        DEFEAT: "YOU",
        PUSH: "WIN",
        WIN: "MOVE",
        STOP: "PUSH"
    };

    function setUpBabaUI() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 2; col++) {
                addChoiceInput(`${ROW_NAMES[row]}-${COL_NAMES[col]} character`, `grid${row}${col}`, CHARACTERS);
            }
        }
        for (let i = 0; i < 6; i++) {
            addChoiceInput(`Rule ${i+1} character`, `ruleChar${i}`, CHARACTERS);
            addChoiceInput(`Rule ${i+1} property`, `ruleProp${i}`, PROPERTIES);
        }
        addNumberInput("Number of modules", "numModules", {min: 1, step: 1});
        setResultCallback(getResult);
    }

    function getResult() {
        let grid = [];
        for (let row = 0; row < 3; row++) {
            grid.push([]);
            for (let col = 0; col < 2; col++) {
                grid[row][col] = solverFields[`grid${row}${col}`];
            }
        }
        if (new Set(grid.flat()).size < 6) return "Invalid: Duplicate character in grid";
        let rules = [];
        for (let i = 0; i < 6; i++) {
            rules.push([solverFields[`ruleChar${i}`], solverFields[`ruleProp${i}`]]);
        }
        if (new Set(rules.map(x => x[0])).size < 6) return "Invalid: Duplicate character in rules";
        if (new Set(rules.map(x => x[1])).size < 6) return "Invalid: Duplicate property in rules";
        for (let rule of rules) {
            let [ruleChar, ruleProp] = rule;
            let value = PROPERTY_SELECTORS[ruleProp]();
            if (!CHARACTER_CONDITIONS[ruleChar](value)) continue;
            let base = PROPERTY_BASE_POSITIONS[ruleProp];
            let baseChar = rules.find(x => x[1] === base)[0];
            let baseRow = grid.findIndex(r => r.includes(baseChar));
            let baseCol = grid[baseRow].indexOf(baseChar);
            let [offset1, offset2] = [CHARACTER_OFFSETS[ruleChar], PROPERTY_OFFSETS[ruleProp]];
            let pressPosition = [(baseRow + offset1[0] + offset2[0] + 6) % 3, (baseCol + offset1[1] + offset2[1] + 4) % 2];
            let pressCharacter = grid[pressPosition[0]][pressPosition[1]];
            let pressProperty = rules.find(x => x[0] === pressCharacter)[1];
            if (pressProperty === "DEFEAT")
                pressCharacter = grid[1 - pressPosition[0]][pressPosition[1]];
            return "Press " + pressCharacter + ".";
        }
        return "Press " + rules.find(x => x[1] === "YOU")[0] + ".";
    }

    registerSolver("Baba is Who?", setUpBabaUI, [EDGEWORK_FIELD.BATTERIES,
                                                 EDGEWORK_FIELD.SERIAL_NUMBER,
                                                 EDGEWORK_FIELD.PORTS,
                                                 EDGEWORK_FIELD.INDICATORS]);
})();