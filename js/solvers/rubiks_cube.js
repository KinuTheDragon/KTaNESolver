(function() {
    const RUBIKS_CUBE_COLORS = "Yellow Blue Red Green Orange White".split(" ");
    const RUBIKS_CUBE_COLORS_SORTED = "Red Orange Yellow Green Blue White".split(" ");

    const TABLE_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const TABLE_MOVES = `
L' F'
D' U'
U B'
F B
L D
R' U
U' F
B' L'
B R
D L
R D'
F' R'
`.trim().split("\n").map(x => x.split(" "));

    function setUpRubiksUI() {
        addChoiceInput("Upward face color", "up", RUBIKS_CUBE_COLORS_SORTED);
        addChoiceInput("Left face color", "left", RUBIKS_CUBE_COLORS_SORTED);
        addChoiceInput("Front face color", "front", RUBIKS_CUBE_COLORS_SORTED);
        addChoiceInput("Down face color", "down", RUBIKS_CUBE_COLORS_SORTED);
        addChoiceInput("Right face color", "right", RUBIKS_CUBE_COLORS_SORTED);
        setResultCallback(getResult);
    }

    function getResult() {
        let colorsUsed = [solverFields.up, solverFields.left, solverFields.front, solverFields.down, solverFields.right];
        if (new Set(colorsUsed).size < 5) return "Invalid: Duplicate colors.";
        let tableLeft = [];
        for (let row = 0; row < 12; row++) {
            tableLeft.push([...TABLE_CHARS.slice(row * 3, row * 3 + 3)]);
        }
        cycleColumn(tableLeft, 0, solverFields.up);
        cycleColumn(tableLeft, 1, solverFields.left);
        cycleColumn(tableLeft, 2, solverFields.front);
        let downIndex = RUBIKS_CUBE_COLORS.indexOf(solverFields.down);
        let serialNumberEliminated = edgework.serialNumber.slice(0, downIndex) + edgework.serialNumber.slice(downIndex + 1);
        let moves = [...serialNumberEliminated].flatMap(x => TABLE_MOVES[tableLeft.findIndex(y => y.includes(x))]);
        if (!"Red Green Blue".split(" ").includes(solverFields.right))
            moves = moves.filter((x, i) => i % 2 === 0).concat(moves.filter((x, i) => i % 2 === 1));
        if ("Red Yellow".split(" ").includes(solverFields.right))
            moves = moves.slice(0, 5).map(x => x.endsWith("'") ? x[0] : x + "'").concat(moves.slice(5));
        if ("Green White".split(" ").includes(solverFields.right))
            moves.reverse();
        return "Do the following moves: " + moves.join(" ");
    }

    function cycleColumn(array, columnIndex, color) {
        let cycleCount = RUBIKS_CUBE_COLORS.indexOf(color) + 1;
        let currentColumn = array.map(x => x[columnIndex]);
        let cycled = currentColumn.concat(currentColumn).slice(12 - cycleCount);
        for (let row = 0; row < 12; row++) {
            array[row][columnIndex] = cycled[row];
        }
    }

    registerSolver("Rubik's Cube", setUpRubiksUI, [EDGEWORK_FIELD.SERIAL_NUMBER]);
})();