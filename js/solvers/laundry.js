(function () {
    const CLOTHING_ITEMS = [
        {
            item: "corset",
            washing: "60 C",
            drying: "dry flat",
            ironing: "300 F",
            special: "bleach"
        }, {
            item: "shirt",
            washing: "40 C",
            drying: "high heat",
            ironing: "no steam",
            special: "no tetrachlore"
        }, {
            item: "skirt",
            washing: "30 C",
            drying: "hang to dry",
            ironing: "iron",
            special: "reduced moist"
        }, {
            item: "skort",
            washing: "machine wash gentle or delicate",
            drying: "tumble dry",
            ironing: "200 C",
            special: "reduced moist"
        }, {
            item: "shorts",
            washing: "do not wring",
            drying: "dry in the shade",
            ironing: "300 F",
            special: "don't bleach"
        }, {
            item: "scarf",
            washing: "95 C",
            drying: "dry",
            ironing: "110 C",
            special: "don't dryclean"
        }
    ];

    const CLOTHING_MATERIALS = [
        {
            material: "polyester",
            washing: "50 C",
            drying: "no heat",
            ironing: "300 F",
            special: "petroleum only"
        }, {
            material: "cotton",
            washing: "95 C",
            drying: "medium heat",
            ironing: "iron",
            special: "don't dryclean"
        }, {
            material: "wool",
            washing: "hand wash",
            drying: "dry in the shade",
            ironing: "200 C",
            special: "reduced moist"
        }, {
            material: "nylon",
            washing: "30 C",
            drying: "drip dry",
            ironing: "don't iron",
            special: "low heat"
        }, {
            material: "corduroy",
            washing: "40 C",
            drying: "drip dry",
            ironing: "110 C",
            special: "wet cleaning"
        }, {
            material: "leather",
            washing: "do not wash",
            drying: "do not dry",
            ironing: "don't iron",
            special: "no tetrachlore"
        }
    ];

    const CLOTHING_COLORS = [
        {
            color: "ruby fountain",
            washing: "60 C",
            drying: "high heat",
            ironing: "don't iron",
            special: "any solvent"
        }, {
            color: "star lemon quartz",
            washing: "95 C",
            drying: "dry flat",
            ironing: "iron",
            special: "low heat"
        }, {
            color: "sapphire springs",
            washing: "30 C",
            drying: "tumble dry",
            ironing: "200 C",
            special: "short cycle"
        }, {
            color: "jade cluster",
            washing: "30 C",
            drying: "do not tumble dry",
            ironing: "300 F",
            special: "no steam finish"
        }, {
            color: "clouded pearl",
            washing: "machine wash permanent press",
            drying: "low heat",
            ironing: "no steam",
            special: "low heat"
        }, {
            color: "malinite",
            washing: "60 C",
            drying: "medium heat",
            ironing: "200 C",
            special: "no chlorine"
        }
    ];

    const WASHING_SYMBOLS = {
        "machine wash permanent press": "single-underlined tub",
        "machine wash gentle or delicate": "double-underlined tub",
        "hand wash": "hand in tub",
        "do not wash": "crossed-out tub",
        "30 C": "30°",
        "40 C": "40°",
        "50 C": "50°",
        "60 C": "60°",
        "70 C": "70°",
        "95 C": "95°",
        "do not wring": "crossed-out twisted strip"
    };

    const DRYING_SYMBOLS = {
        "tumble dry": "hollow circle in square",
        "low heat": "circle in square with 1 dot",
        "medium heat": "circle in square with 2 dots",
        "high heat": "circle in square with 3 dots",
        "no heat": "filled circle in square",
        "hang to dry": "square with arc at top",
        "drip dry": "square with three vertical lines",
        "dry flat": "square with one horizontal line",
        "dry in the shade": "square with two diagonal lines",
        "do not dry": "crossed-out square",
        "do not tumble dry": "crossed-out circle in square",
        "dry": "square"
    };

    function setUpLaundryUI() {
        addNumberInput("Number of unsolved modules (non-needy)", "unsolvedModules", {min: 1, step: 1});
        addNumberInput("Number of solved modules", "solvedModules", {min: 0, step: 1});
        setResultCallback(getResult);
    }

    function getResult() {
        if (edgework.batteriesTotal === 4 && edgework.batteryHolders === 2 && edgework.indicatorBOB === true)
            return "Insert the coin without changing anything.";
        let clothingItemIndex = mod(solverFields.unsolvedModules + edgework.indicators.length, 6);
        let itemMaterialIndex = mod(edgework.portsTotal + solverFields.solvedModules - edgework.batteryHolders, 6);
        let itemColorIndex = mod(edgework.serialNumberDigits.at(-1) + edgework.batteriesTotal, 6);
        let clothingItem = CLOTHING_ITEMS[clothingItemIndex];
        let itemMaterial = CLOTHING_MATERIALS[itemMaterialIndex];
        let itemColor = CLOTHING_COLORS[itemColorIndex];
        let washingType = getWashingType(clothingItem, itemMaterial, itemColor);
        let dryingType = getDryingType(clothingItem, itemMaterial, itemColor);
        let ironingType = getIroningType(clothingItem, itemMaterial, itemColor);
        let specialType = getSpecialType(clothingItem, itemMaterial, itemColor);
        return `Washing (left dial): ${washingType} (${WASHING_SYMBOLS[washingType]})\n` +
               `Drying (right dial): ${dryingType} (${DRYING_SYMBOLS[dryingType]})\n` +
               `Ironing (top box): ${ironingType.toUpperCase()}\nSpecial (bottom box): ${specialType.toUpperCase()}`;
    }

    function getWashingType(clothingItem, itemMaterial, itemColor) {
        if (itemMaterial.material === "leather" || itemColor.color === "jade cluster") return "30 C";
        return itemMaterial.washing;
    }

    function getDryingType(clothingItem, itemMaterial, itemColor) {
        if (itemMaterial.material === "wool" || itemColor.color === "star lemon quartz") return "high heat";
        return itemColor.drying;
    }

    function getIroningType(clothingItem, itemMaterial, itemColor) {
        return clothingItem.ironing;
    }

    function getSpecialType(clothingItem, itemMaterial, itemColor) {
        if (itemColor.color === "clouded pearl") return "no chlorine";
        if (clothingItem.item === "corset" || itemMaterial.material === "corduroy") return itemMaterial.special;
        if ([...itemMaterial.material.toUpperCase()].some(x => edgework.serialNumber.includes(x))) return itemColor.special;
        return clothingItem.special;
    }

    registerSolver("Laundry", setUpLaundryUI,
                   [EDGEWORK_FIELD.BATTERIES, EDGEWORK_FIELD.INDICATORS,
                    EDGEWORK_FIELD.PORTS, EDGEWORK_FIELD.SERIAL_NUMBER]);
})();