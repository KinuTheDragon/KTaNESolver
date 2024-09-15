(function () {
    const ROOK_OFFSETS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const BISHOP_OFFSETS = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    const KNIGHT_OFFSETS = [[-2, -1], [-1, -2], [2, -1], [-1, 2], [-2, 1], [1, -2], [2, 1], [1, 2]];

    function setUpChessUI() {
        for (let i = 0; i < 6; i++)
            addTextInput("Position " + (i + 1), "position" + i);
        setResultCallback(getResult);
    }

    function getResult() {
        let error = getErrorMessage();
        if (error) return error;
        let singleSafeSquare = findSingleSafeSquare();
        if (!singleSafeSquare) return "Unsolvable board.";
        return "Press " + rcToPosition(singleSafeSquare) + ".";
    }

    function getErrorMessage() {
        let positionTexts = getPositionTexts();
        for (let i = 0; i < 6; i++) {
            if (!/^[A-Fa-f]-?[1-6]$/.test(positionTexts[i])) return "Position " + (i + 1) + " is in an invalid format.";
        }
        let positions = getRCPositions();
        if ((new Set(positions.map(([r, c]) => r * 6 + c))).size < 6)
            return "Invalid: duplicate position.";
    }

    function getPieceTypes() {
        let rcPositions = getRCPositions();
        let piece2 = edgework.serialNumberDigits.at(-1) % 2 === 1 ? "R" : "N";
        let piece4 = "R";
        let piece5 = (rcPositions[4][0] + rcPositions[4][1]) % 2 === 1 ? "Q" : "R";
        let piece1 = piece5 === "Q" ? "K" : "B";
        let piece3 = [piece1, piece2, piece4, piece5].filter(x => x === "R").length < 2 ? "Q" : "K";
        let piece6 = (pieces => !pieces.includes("Q") ? "Q" : !pieces.includes("N") ? "N" : "B")
                     ([piece1, piece2, piece3, piece4, piece5]);
        return [piece1, piece2, piece3, piece4, piece5, piece6];
    }

    function getBoard() {
        let rcPositions = getRCPositions();
        let pieceTypes = getPieceTypes();
        let board = Array.from({length: 6}, () => Array.from({length: 6}, () => null));
        for (let i = 0; i < 6; i++) {
            let [r, c] = rcPositions[i];
            board[r][c] = pieceTypes[i];
        }
        return board;
    }

    function getAttackedSquares() {
        let board = getBoard();
        let attacked = Array.from({length: 6}, () => Array.from({length: 6}, () => false));
        const attack = (r, c) => {if (0 <= r && r < 6 && 0 <= c && c < 6) attacked[r][c] = true;};
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                switch (board[r][c]) {
                    case null: continue;
                    case "K":
                        for (let roff = -1; roff <= 1; roff++) {
                            for (let coff = -1; coff <= 1; coff++) {
                                attack(r + roff, c + coff);
                            }
                        }
                        break;
                    case "R":
                    case "B":
                    case "Q":
                        let offsets = (board[r][c] !== "B" ? ROOK_OFFSETS   : [])
                               .concat(board[r][c] !== "R" ? BISHOP_OFFSETS : []);
                        for (let [roff, coff] of offsets) {
                            let current = [r, c];
                            attack(...current);
                            do {
                                current[0] += roff;
                                current[1] += coff;
                                attack(...current);
                            } while (0 <= current[0] && current[0] < 6 && 0 <= current[1] && current[1] < 6 &&
                                     !board[current[0]][current[1]]);
                        }
                        break;
                    case "N":
                        attack(r, c);
                        for (let [roff, coff] of KNIGHT_OFFSETS)
                            attack(r + roff, c + coff);
                        break;
                }
            }
        }
        return attacked;
    }

    function findSingleSafeSquare() {
        let attacked = getAttackedSquares();
        let safe = null;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (attacked[r][c]) continue;
                if (safe) return null;
                safe = [r, c];
            }
        }
        return safe;
    }

    function getRCPositions() {
        return getPositionTexts().map(x => positionToRC(x));
    }

    function positionToRC(textPosition) {
        return [+textPosition[textPosition.length - 1] - 1, textPosition[0].toUpperCase().charCodeAt(0) - 65];
    }

    function rcToPosition(rc) {
        return "abcdef"[rc[1]] + "-" + (rc[0] + 1);
    }

    function getPositionTexts() {
        let output = [];
        for (let i = 0; i < 6; i++) output.push(solverFields["position" + i]);
        return output;
    }

    registerSolver("Chess", setUpChessUI, [EDGEWORK_FIELD.SERIAL_NUMBER]);
})();