(function() {
    const BIG_TABLE = [
        "FFC CEH HAF ECD DDE AHA",
        "AHF DFC ECH CDE FEA HAD",
        "DED ECF FHE HAA AFH CDC",
        "HCE ADA CFD DHH EAC FEF",
        "CAH FHD DDA AEC HCF EFE",
        "EDA HAE AEC FFF CHD DCH"
    ].map(x => x.split(" "));
    const SMALL_TABLE = [
        "YOGRBP",
        "PYRBOG",
        "OGBPRY",
        "GBOYPR",
        "RPYOGB",
        "BRPGYO"
    ];
    const SMALL_TABLE_COLUMNS = "ACDEFH";
    const COLORS = "ROYGBP";

    function setUpSimonScreamsUI() {
        addNumberInput("Stage number", "stage", {min: 1, max: 3, step: 1});
        addTextInput("Clockwise order of colors", "colorOrder");
        addTextInput("Flash order", "flashOrder");
        setResultCallback(getResult);
    }

    function getResult() {
        return getActualResult() + "\nR = red, O = orange, Y = yellow, G = green, B = blue, P = purple";
    }

    function getActualResult() {
        let colorOrder = solverFields.colorOrder.toUpperCase();
        if (!/^[ROYGBP]{6}$/.test(colorOrder)) return "Invalid color order: invalid format.";
        if ((new Set(colorOrder)).size < 6) return "Invalid color order: no repeats allowed.";
        if (!/^[ROYGBP]{3,}$/.test(solverFields.flashOrder.toUpperCase())) return "Invalid flash order: invalid format.";
        let bigTableColumn = COLORS.indexOf(solverFields.flashOrder[solverFields.stage - 1].toUpperCase());
        let bigTableRow = getBigTableRow();
        let bigTableValue = BIG_TABLE[bigTableRow][bigTableColumn];
        let smallTableRows = getSmallTableRows();
        let smallTableColumn = SMALL_TABLE_COLUMNS.indexOf(bigTableValue[solverFields.stage - 1]);
        let smallTableValues = smallTableRows.map(x => SMALL_TABLE[x][smallTableColumn]);
        return "Press: " + smallTableValues.join("");
    }

    function getColorIndex(color) {
        return solverFields.colorOrder.toUpperCase().indexOf(color.toUpperCase());
    }

    function getBigTableRow() {
        let colorOrder = solverFields.colorOrder.toUpperCase();
        let flashOrder = solverFields.flashOrder.toUpperCase();
        for (let i = 0; i < flashOrder.length - 2; i++) {
            let indices = [0, 1, 2].map(x => getColorIndex(flashOrder[i + x]));
            indices = indices.map(x => mod(x - indices[0], 6));
            if (indices.every((x, i) => x === i)) return 0;
        }
        for (let i = 0; i < flashOrder.length - 2; i++) {
            let indices = [0, 1, 2].map(x => getColorIndex(flashOrder[i + x]));
            if (indices[2] === indices[0] && [1, 5].includes(mod(indices[0] - indices[1], 6))) return 1;
        }
        if ([..."RYB"].filter(x => flashOrder.includes(x)).length <= 1) return 2;
        for (let i = 0; i < 3; i++) {
            if (!flashOrder.includes(colorOrder[i]) && !flashOrder.includes(colorOrder[i + 3])) return 3;
        }
        for (let i = 0; i < flashOrder.length - 1; i++) {
            let indices = [0, 1].map(x => getColorIndex(flashOrder[i + x]));
            indices = indices.map(x => mod(x - indices[0], 6));
            if (indices.every((x, i) => x === i)) return 4;
        }
        return 5;
    }

    function getSmallTableRows() {
        let conditions = [
            edgework.indicators.length >= 3,
            edgework.portsTotal >= 3,
            edgework.serialNumberDigits.length >= 3,
            edgework.serialNumberLetters.length >= 3,
            edgework.batteriesTotal >= 3,
            edgework.batteryHolders >= 3
        ];
        return conditions.map((x, i) => [x, i]).filter(([x, i]) => x).map(([x, i]) => i);
    }

    registerSolver("Simon Screams", setUpSimonScreamsUI,
                   [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.BATTERIES,
                    EDGEWORK_FIELD.INDICATORS, EDGEWORK_FIELD.PORTS]);
})();