(function() {
    const CUT_IF_CONNECTED = {
        red: "C B A AC B AC ABC AB B".split(" "),
        blue: "B AC B A B BC C AC A".split(" "),
        black: "ABC AC B AC B BC AB C C".split(" ")
    };

    function setUpWireSequencesUI() {
        for (let color of "Red Blue Black".split(" "))
            addNumberInput(color + " wire index", color.toLowerCase() + "WireIndex", {min: 1, max: 9, step: 1});
        setResultCallback(() => {
            let output = [];
            for (let color of "Red Blue Black".split(" ")) {
                let connections =
                    CUT_IF_CONNECTED[color.toLowerCase()][solverFields[color.toLowerCase() + "WireIndex"] - 1];
                output.push([color, getCondition(connections)]);
            }
            return output.map(([color, cond]) => color + ": Cut" + (cond ? " if connected to " + cond : "")).join("\n");
        });
    }

    function getCondition(connections) {
        switch (connections.length) {
            case 3: return null;
            case 2: return connections[0] + " or " + connections[1];
            case 1: return connections;
        }
    }

    registerSolver("Wire Sequences", setUpWireSequencesUI, [], true);
})();