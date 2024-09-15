(function() {
    const ENEMIES = {
        Demon:  {str: 50, dex: 50, int: 50},
        Dragon: {str: 10, dex: 11, int: 13},
        Eagle:  {str: 4,  dex: 7,  int: 3},
        Goblin: {str: 3,  dex: 6,  int: 5},
        Golem:  {str: 9,  dex: 4,  int: 7},
        Troll:  {str: 8,  dex: 5,  int: 4},
        Lizard: {str: 4,  dex: 6,  int: 3},
        Wizard: {str: 4,  dex: 3,  int: 8}
    };

    const WEAPONS = {
        Broadsword:    {type: "str", bonus: 0},
        Caber:         {type: "str", bonus: 2},
        "Nasty knife": {type: "dex", bonus: 0},
        Longbow:       {type: "dex", bonus: 2},
        "Magic orb":   {type: "int", bonus: 0},
        Grimoire:      {type: "int", bonus: 2}
    };

    const ITEMS = {
        Balloon: () => (solverFields.gravity < 9.3 || solverFields.pressure > 110) && solverFields.enemyType !== "Eagle",
        Battery: () => edgework.batteriesTotal <= 1 && !["Golem", "Wizard"].includes(solverFields.enemyType),
        Bellows: () => ["Dragon", "Eagle"].includes(solverFields.enemyType) ?
                        solverFields.pressure > 105 : solverFields.pressure < 95,
        "Cheat code": () => false,
        "Crystal ball": () => solverFields.int > edgework.serialNumberDigits.at(-1) && solverFields.enemyType !== "Wizard",
        Feather: () => solverFields.dex > solverFields.str || solverFields.dex > solverFields.int,
        "Hard drive": () => Math.max(...Object.values(edgework.ports)) >= 2,
        Lamp: () => solverFields.temperature < 12 && solverFields.enemyType !== "Lizard",
        Moonstone: () => edgework.unlitIndicators.length >= 2,
        Potion: () => true,
        "Small dog": () => !["Demon", "Dragon", "Troll"].includes(solverFields.enemyType),
        Stepladder: () => getHeightInches() < 48 && !["Goblin", "Lizard"].includes(solverFields.enemyType),
        Sunstone: () => edgework.litIndicators.length >= 2,
        Symbol: () => ["Demon", "Golem"].includes(solverFields.enemyType) || solverFields.temperature > 31,
        Ticket: () => getHeightInches() >= 54 && solverFields.gravity >= 9.2 && solverFields.gravity <= 10.4,
        Trophy: () => solverFields.str > edgework.serialNumberDigits[0] ||
                      solverFields.enemyType === "Troll"
    };

    function setUpAdventureGameUI() {
        addChoiceInput("Enemy type", "enemyType", Object.keys(ENEMIES).toSorted());
        addNumberInput("Strength (STR)", "str", {min: 1, max: 10, step: 1});
        addNumberInput("Dexterity (DEX)", "dex", {min: 1, max: 10, step: 1});
        addNumberInput("Intelligence (INT)", "int", {min: 1, max: 10, step: 1});
        // 3'0" to 6'6"
        addNumberInput("Height (feet)", "heightFeet", {min: 3, max: 6, step: 1});
        addNumberInput("Height (inches)", "heightInches", {min: 0, max: 11, step: 1});
        addNumberInput("Temperature (°C)", "temperature", {min: -5, max: 45, step: 1, value: 0});
        addNumberInput("Gravity (m/s²)", "gravity", {min: 8.5, max: 11.1, step: 0.1});
        addNumberInput("Air pressure (kPa)", "pressure", {min: 85, max: 120, step: 1});
        for (let i = 0; i < 8; i++)
            addChoiceInput("Item " + (i + 1), "item" + i,
                           Object.keys(WEAPONS).concat(Object.keys(ITEMS)).toSorted());
        // Enforce maximum of 6'6"
        setUIChangeCallback(id => {
            if ((id === "heightFeet" || id === "heightInches") &&
                solverFields.heightFeet === 6 && solverFields.heightInches > 6)
                setInputValue("heightInches", 6);
        });
        setResultCallback(getResult);
    }

    function getResult() {
        let items = Array.from({length: 8}).fill(0).map((_, i) => solverFields["item" + i]);
        if ((new Set(items)).size < 8) return "Invalid: duplicate item.";
        let weapons = items.filter(x => x in WEAPONS);
        if (weapons.length !== 3) return "Invalid: must have 3 weapons and 5 items.";
        items = items.filter(x => x in ITEMS).toSorted();
        let potionIncluded = items.includes("Potion");
        let itemsToUse = items.filter(x => ITEMS[x]());
        if (potionIncluded)
            itemsToUse = ["Potion (update stats after using)"].concat(itemsToUse.filter(x => x !== "Potion"));
        let statAdvantages = Object.fromEntries(
            "str dex int".split(" ").map(x => [x, solverFields[x] - ENEMIES[solverFields.enemyType][x]])
        );
        let weaponScores = [];
        for (let weapon of weapons) {
            let {type: weaponType, bonus} = WEAPONS[weapon];
            weaponScores.push({weapon, score: statAdvantages[weaponType] + bonus});
        }
        weaponScores.sort((a, b) => b.score - a.score);
        let weapon = weaponScores[0].weapon;
        return "Use: " + itemsToUse.concat([weapon]).join(", ");
    }

    function getHeightInches() {
        return solverFields.heightFeet * 12 + solverFields.heightInches;
    }

    registerSolver("Adventure Game", setUpAdventureGameUI,
        [EDGEWORK_FIELD.BATTERIES, EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.PORTS, EDGEWORK_FIELD.INDICATORS]);
})();