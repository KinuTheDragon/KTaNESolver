(function() {
    const RECIPES = {
        "Tutti Frutti": "Strawberry Cherry Raspberry",
        "Rocky Road": "Chocolate Nuts Marshmallow",
        "Raspberry Ripple": "Raspberry",
        "Double Chocolate": "Chocolate",
        "Double Strawberry": "Strawberry",
        "Cookies and Cream": "Cookies",
        "Neapolitan": "Strawberry Chocolate",
        "Mint Chocolate Chip": "Mint Chocolate",
        "The Classic": "Chocolate Cherry",
        "Vanilla": ""
    };

    const ALLERGIES = [
        "Chocolate",
        "Strawberry",
        "Raspberry",
        "Nuts",
        "Cookies",
        "Mint",
        "Fruit",
        "Cherry",
        "Marshmallows"
    ];

    const CUSTOMERS = {
        Mike: ["1-5-0", "6-8-3", "0-7-1", "4-3-2", "3-6-1"],
        Tim: ["0-8-3", "2-1-4", "4-3-5", "2-6-7", "1-4-3"],
        Tom: ["8-4-5", "1-6-7", "2-5-6", "3-7-5", "3-6-1"],
        Dave: ["2-6-7", "0-1-4", "8-2-3", "7-8-1", "5-7-3"],
        Adam: ["3-4-1", "3-6-2", "0-2-1", "2-4-7", "8-5-6"],
        Cheryl: ["1-6-3", "7-5-2", "1-4-5", "4-2-0", "3-7-5"],
        Sean: ["4-6-1", "2-3-6", "1-5-7", "6-8-2", "2-7-4"],
        Ashley: ["6-2-5", "4-1-7", "0-8-2", "1-2-6", "3-6-7"],
        Jessica: ["4-2-6", "1-2-3", "0-3-4", "6-5-0", "4-7-8"],
        Taylor: ["6-3-5", "5-1-2", "4-2-6", "7-1-0", "3-7-2"],
        Simon: ["0-3-5", "1-6-4", "5-4-8", "2-0-7", "7-3-6"],
        Sally: ["4-6-3", "1-0-2", "6-7-4", "2-5-8", "0-3-1"],
        Jade: ["3-7-1", "0-8-2", "7-1-3", "6-7-8", "4-5-1"],
        Sam: ["2-4-1", "7-8-0", "3-4-6", "1-0-3", "6-5-2"],
        Gary: ["1-2-5", "6-8-0", "3-2-1", "7-4-5", "1-8-4"],
        Victor: ["0-3-1", "2-5-7", "3-4-6", "6-7-1", "5-3-0"],
        George: ["8-1-2", "6-4-8", "0-4-3", "1-6-4", "3-2-5"],
        Jacob: ["7-3-2", "1-5-6", "5-4-7", "3-4-0", "6-2-1"],
        Pat: ["5-6-2", "1-3-6", "3-4-7", "2-0-5", "8-1-3"],
        Bob: ["5-6-8", "2-1-0", "4-8-2", "4-2-5", "0-5-1"]
    };

    function setUpIceCreamUI() {
        addChoiceInput("Customer", "customer", Object.keys(CUSTOMERS).toSorted());
        for (let i = 0; i < 4; i++) 
            addChoiceInput("Flavor " + (i + 1), "flavor" + i,
                           Object.keys(RECIPES).toSorted().filter(x => x !== "Vanilla"));
        addCheckbox("Has empty port plate", "hasEmptyPortPlate");
        setResultCallback(getResult);
    }

    function getFlavorOrder() {
        if (edgework.litIndicators.length > edgework.unlitIndicators.length)
            return "Cookies and Cream, Neapolitan, Tutti Frutti, The Classic, Rocky Road, Double Chocolate, " +
                   "Mint Chocolate Chip, Double Strawberry, Raspberry Ripple, Vanilla";
        if (solverFields.hasEmptyPortPlate)
            return "Double Chocolate, Mint Chocolate Chip, Neapolitan, Rocky Road, Tutti Frutti, " +
                   "Double Strawberry, Cookies and Cream, Raspberry Ripple, The Classic, Vanilla";
        if (edgework.batteriesTotal >= 3)
            return "Neapolitan, Tutti Frutti, Cookies and Cream, Raspberry Ripple, Double Strawberry, " +
                   "Mint Chocolate Chip, Double Chocolate, The Classic, Rocky Road, Vanilla";
        return "Double Strawberry, Cookies and Cream, Rocky Road, The Classic, Neapolitan, Double Chocolate, " +
               "Tutti Frutti, Raspberry Ripple, Mint Chocolate Chip, Vanilla";
    }

    function getResult() {
        if ((new Set([0, 1, 2, 3].map(x => solverFields["flavor" + x]))).size < 4)
            return "Invalid: duplicate flavor.";
        return "Sell " + getFlavor() + " on an even minute.";
    }

    function getFlavor() {
        let flavorOrder = getFlavorOrder().split(", ");
        let availableFlavors = [0, 1, 2, 3].map(x => solverFields["flavor" + x]).concat(["Vanilla"]);
        availableFlavors = flavorOrder.filter(x => availableFlavors.includes(x));
        let customerAllergies = CUSTOMERS[solverFields.customer][Math.floor(edgework.serialNumberDigits.at(-1) / 2)];
        customerAllergies = customerAllergies.split("-").map(x => ALLERGIES[+x]);
        if (customerAllergies.includes("Fruit"))
            customerAllergies = customerAllergies.concat("Strawberry Raspberry Cherry".split(" "));
        availableFlavors = availableFlavors.filter(x => customerAllergies.every(a => !RECIPES[x].includes(a)));
        return availableFlavors[0];
    }

    registerSolver("Ice Cream", setUpIceCreamUI, [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.INDICATORS]);
})();