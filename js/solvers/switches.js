(function() {
    const BAD_STATES = [
        0b00100,
        0b01011,
        0b01111,
        0b10010,
        0b10011,
        0b10111,
        0b11000,
        0b11010,
        0b11100,
        0b11110
    ];

    function setUpSwitchesUI() {
        for (let i = 0; i < 5; i++)
            addCheckbox("Switch " + (i + 1) + " up", "switch" + i);
        for (let i = 0; i < 5; i++)
            addCheckbox("Top light " + (i + 1) + " lit", "light" + i);
        setResultCallback(getResult);
    }

    function getResult() {
        let start = [0, 1, 2, 3, 4].map(x => solverFields["switch" + x] << (4 - x)).reduce((a, b) => a | b);
        let end = [0, 1, 2, 3, 4].map(x => solverFields["light" + x] << (4 - x)).reduce((a, b) => a | b);
        if (start === end) return "Start and end cannot be the same.";
        let paths = {};
        let toProcess = [start];
        paths[start] = [];
        while (!(end in paths)) {
            if (!toProcess.length) return "Impossible to solve.";
            let current = toProcess.shift();
            let currentPath = paths[current];
            for (let i = 0; i < 5; i++) {
                let newPath = currentPath.concat([i]);
                let newState = current ^ (0b10000 >> i);
                if (BAD_STATES.includes(newState)) continue;
                if (newState in paths) continue;
                paths[newState] = newPath;
                toProcess.push(newState);
            }
        }
        return "Flip in order: " + paths[end].map(x => x + 1).join(", ");
    }

    registerSolver("Switches", setUpSwitchesUI, []);
})();