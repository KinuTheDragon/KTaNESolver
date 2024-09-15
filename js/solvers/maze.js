(function() {
    const MAZES = `
#############
#. . .#. . .#
# ### # #####
#O#. .#. . .#
# # ####### #
#.#. .#. . O#
# ### # ### #
#.#. . .#. .#
# ######### #
#. . .#. .#.#
# ### # ### #
#. .#. .#. .#
#############

#############
#. . .#. . .#
### ### # ###
#. .#. .#O .#
# ### ##### #
#.#. .#. . .#
# # ### ### #
#. O#. .#.#.#
# ### ### # #
#.#.#.#. .#.#
# # # # ### #
#.#. .#. . .#
#############

#############
#. . .#.#. .#
# ### # # # #
#.#.#.#. .#.#
### # ##### #
#. .#.#. .#.#
# # # # # # #
#.#.#.#O#.#O#
# # # # # # #
#.#. .#.#.#.#
# ##### # # #
#. . . .#. .#
#############

#############
#O .#. . . .#
# # ####### #
#.#.#. . . .#
# # # ##### #
#.#. .#. .#.#
# ##### ### #
#O#. . . . .#
# ######### #
#. . . . .#.#
# ####### # #
#. . .#. .#.#
#############

#############
#. . . . . .#
######### # #
#. . . . .#.#
# ##### #####
#. .#. .#O .#
# # ##### # #
#.#. . .#.#.#
# ##### ### #
#.#. . . .#.#
# # ####### #
#.#. . O . .#
#############

#############
#.#. .#. O .#
# # # ### # #
#.#.#.#. .#.#
# # # # ### #
#. .#.#.#. .#
# ##### # ###
#. .#. .#.#.#
### # # # # #
#. .#O#.#. .#
# ##### ### #
#. . . .#. .#
#############

#############
#. O . .#. .#
# ##### # # #
#.#. .#. .#.#
# # ####### #
#. .#. .#. .#
##### ### ###
#. .#. . .#.#
# # # ##### #
#.#.#. . .#.#
# ####### # #
#. O . . . .#
#############

#############
#.#. . O#. .#
# # ### # # #
#. . .#. .#.#
# ######### #
#.#. . . .#.#
# # ##### # #
#.#. O#. . .#
# ### #######
#.#.#. . . .#
# # #########
#. . . . . .#
#############

#############
#.#. . . . .#
# # ##### # #
#.#.#O .#.#.#
# # # ### # #
#. . .#. .#.#
# ##### ### #
#.#.#. .#. .#
# # # ##### #
#O#.#.#. .#.#
# # # # # ###
#. .#. .#. .#
#############
`.trim().split("\n\n").map(x => x.split("\n"));

    const DIRECTIONS = {U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1]};

    function setUpInitialMazeUI() {
        addNumberInput("Green circle row", "greenCircleRow", {min: 1, max: 6, step: 1});
        addNumberInput("Green circle column", "greenCircleCol", {min: 1, max: 6, step: 1});
        addNumberInput("White square row", "startRow", {min: 1, max: 6, step: 1});
        addNumberInput("White square column", "startCol", {min: 1, max: 6, step: 1});
        addNumberInput("Red triangle row", "endRow", {min: 1, max: 6, step: 1});
        addNumberInput("Red triangle column", "endCol", {min: 1, max: 6, step: 1});
        setResultCallback(getResult);
    }

    function getMaze() {
        for (let maze of MAZES) {
            if (maze[solverFields.greenCircleRow * 2 - 1][solverFields.greenCircleCol * 2 - 1] === "O")
                return maze;
        }
    }

    function getOtherGreenCirclePosition() {
        let maze = getMaze();
        for (let row = 1; row < 6; row++) {
            for (let col = 1; col < 6; col++) {
                if (maze[row * 2 - 1][col * 2 - 1] === "O" &&
                    !(row === solverFields.greenCircleRow && col === solverFields.greenCircleCol))
                    return [row, col];
            }
        }
    }

    function keyify([row, col]) {
        return row * 10 + col;
    }

    function getPath() {
        let maze = getMaze();
        let start = [solverFields.startRow, solverFields.startCol];
        let startKey = keyify(start);
        let end = [solverFields.endRow, solverFields.endCol];
        let endKey = keyify(end);
        let paths = {[startKey]: []};
        let toProcess = [start];
        while (!(endKey in paths)) {
            let current = toProcess.shift();
            let currentPath = paths[keyify(current)];
            for (let direction in DIRECTIONS) {
                let [roff, coff] = DIRECTIONS[direction];
                let textRow = current[0] * 2 - 1 + roff;
                let textCol = current[1] * 2 - 1 + coff;
                if (maze[textRow][textCol] === "#") continue;
                let newPos = [current[0] + roff, current[1] + coff];
                let newPosKey = keyify(newPos);
                if (!(newPosKey in paths)) {
                    paths[newPosKey] = currentPath.concat([direction]);
                    toProcess.push(newPos);
                }
            }
        }
        return paths[endKey];
    }

    function runLengthEncode(path) {
        path = path.replaceAll(/(.)\1+/g, (x, y) => y + x.length + " ");
        for (let i = 0; i < 2; i++)
            path = path.replaceAll(/([^\d ])([^\d ])/g, (_, x, y) => x + " " + y);
        return path.trim().replaceAll(/ +/g, " ");
    }

    function getResult() {
        if (solverFields.startRow === solverFields.endRow && solverFields.startCol === solverFields.endCol)
            return "Start and end cannot be the same.";
        if (!getMaze()) return "Invalid green circle location.";
        let path = getPath().join("");
        let otherGreenCircle = getOtherGreenCirclePosition();
        return `Other green circle is at row ${otherGreenCircle[0]}, column ${otherGreenCircle[1]}\n`
            + "Path: " + path + "\nPath with lengths: " + runLengthEncode(path);
    }

    registerSolver("Maze", setUpInitialMazeUI, [], true);
})();