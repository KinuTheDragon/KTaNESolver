(function () {
    function setUpInitialWiresUI() {
        addNumberInput("Number of wires", "numWires", {min: 3, max: 6, step: 1});
        setUpWiresUI();
        setUIChangeCallback(element => {
            if (element === "numWires") setUpWiresUI();
        });
        setResultCallback(() => {
            let index = getNthWireToCut();
            return `Cut the ${ordinalize(index + 1)} wire.`;
        });
    }

    function setUpWiresUI() {
        let oldColors = {...solverFields};
        removeInput(/color.*/);
        for (let i = 0; i < solverFields.numWires; i++) {
            addChoiceInput(`Wire #${i + 1}`, "color" + i, "Red Blue Yellow White Black".split(" "));
            setInputValue("color" + i, oldColors["color" + i] ?? "Red");
        }
    }

    function getWires() {
        let wires = [];
        for (let i = 0; i < solverFields.numWires; i++) wires.push(solverFields["color" + i]);
        return wires;
    }

    function getWireColorCount(color) {
        let wires = getWires();
        return wires.filter(x => x === color).length;
    }

    function getNthWireColorIndex(color, n) {
        let indices = getWires().map((x, i) => x === color ? i : null).filter(x => x !== null);
        return indices[mod(n, indices.length)];
    }

    function getNthWireToCut() {
        let serialIsOdd = edgework.serialNumberDigits.at(-1) % 2 === 1;
        switch (solverFields.numWires) {
            case 3:
                if (getWireColorCount("Red") === 0) return 1;
                if (solverFields.color2 === "White") return 2;
                if (getWireColorCount("Blue") > 1) return getNthWireColorIndex("Blue", 1);
                return 2;
            case 4:
                if (getWireColorCount("Red") > 1 && serialIsOdd)
                    return getNthWireColorIndex("Red", -1);
                if (solverFields.color3 === "Yellow" && getWireColorCount("Red") === 0) return 0;
                if (getWireColorCount("Blue") === 1) return 0;
                if (getWireColorCount("Yellow") > 1) return 3;
                return 1;
            case 5:
                if (solverFields.color4 === "Black" && serialIsOdd)
                    return 3;
                if (getWireColorCount("Red") === 1 && getWireColorCount("Yellow") > 1)
                    return 0;
                if (getWireColorCount("Black") === 0) return 1;
                return 0;
            case 6:
                if (getWireColorCount("Yellow") === 0 && serialIsOdd)
                    return 2;
                if (getWireColorCount("Yellow") === 1 && getWireColorCount("White") > 1)
                    return 3;
                if (getWireColorCount("Red") === 0) return 5;
                return 3;
        }
    }

    registerSolver("Wires", setUpInitialWiresUI, [EDGEWORK_FIELD.SERIAL_NUMBER], true);
})();