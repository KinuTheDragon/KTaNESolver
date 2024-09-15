(function() {
    const RESULTS = "CCDBSDPPSCBBSPSD";

    function setUpInitialUI() {
        addCheckbox("Wire is red", "isRed");
        addCheckbox("Wire is blue", "isBlue");
        addCheckbox("Wire has light", "hasLight");
        addCheckbox("Wire has star", "hasStar");
        setResultCallback(getResult);
    }

    function getResult() {
        return shouldCut() ? "Cut the wire." : "Do not cut the wire.";
    }

    function shouldCut() {
        let index =
            (solverFields.isRed    << 3) |
            (solverFields.isBlue   << 2) |
            (solverFields.hasLight << 1) |
            (solverFields.hasStar  << 0);
        let result = RESULTS[index];
        switch (result) {
            case "C": return true;
            case "D": return false;
            case "S": return edgework.serialNumberDigits.at(-1) % 2 === 0;
            case "P": return edgework.portsParallel >= 1;
            case "B": return edgework.batteriesTotal >= 2;
        }
    }

    registerSolver("Complicated Wires", setUpInitialUI,
        [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.PORTS_PARALLEL, EDGEWORK_FIELD.BATTERIES], true);
})();