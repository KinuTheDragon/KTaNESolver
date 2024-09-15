(function() {
    const SHAPES = {
        CC: () => /[AEIOU]/.test(edgework.serialNumber) ? "FF" : "RC",
        CR: () => edgework.indicatorSND === true ? "CC" : "CF",
        CP: () => edgework.indicatorSIG === true ? "FF" : "RR",
        CF: () => edgework.batteriesAA >= 2 ? "FR" : "RF",
        RC: () => edgework.portsDVID > 0 ? "CP" : "FP",
        RR: () => edgework.serialNumberDigits.at(-1) % 2 === 1 ? "PR" : "PC",
        RP: () => edgework.indicatorMSA === true ? "FP" : "PR",
        RF: () => edgework.indicatorBOB === false ? "FC" : "PP",
        PC: () => edgework.portsParallel > 0 ? "RP" : "CR",
        PR: () => edgework.indicatorCAR === false ? "FC" : "CF",
        PP: () => edgework.indicatorIND === true ? "PF" : "RR",
        PF: () => edgework.portsRJ45 > 0 ? "CP" : "CC",
        FC: () => edgework.portsStereoRCA > 0 ? "RP" : "CR",
        FR: () => edgework.indicatorFRQ === false ? "RC" : "PP",
        FP: () => edgework.portsPS2 > 0 ? "PF" : "PC",
        FF: () => edgework.batteriesTotal >= 3 ? "FR" : "RF",
    };

    function setUpShapeShiftUI() {
        addChoiceInput("Left side", "left", ["(: Circle", "[: Rectangle", "<: Pointed", "{: Fancy"]);
        addChoiceInput("Right side", "right", ["): Circle", "]: Rectangle", ">: Pointed", "}: Fancy"]);
        setResultCallback(getResult);
    }

    function getResult() {
        let start = solverFields.left[3] + solverFields.right[3];
        let end = shapeShift(start);
        let left = end[0];
        let right = end[1];
        return "([<{"["CRPF".indexOf(left)] + ")]>}"["CRPF".indexOf(right)] + ": " +
            "Circle Rectangle Pointed Fancy".split(" ").find(x => x.startsWith(left)) + " left, " +
            "Circle Rectangle Pointed Fancy".split(" ").find(x => x.startsWith(right)) + " right";
    }

    function shapeShift(start) {
        let visited = [start];
        let current = start;
        while (true) {
            current = SHAPES[current]();
            if (visited.includes(current)) return current;
            visited.push(current);
        }
    }

    registerSolver("Shape Shift", setUpShapeShiftUI,
        [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.INDICATOR_SND, EDGEWORK_FIELD.INDICATOR_SIG,
         EDGEWORK_FIELD.BATTERIES, EDGEWORK_FIELD.PORTS_DVID, EDGEWORK_FIELD.INDICATOR_MSA,
         EDGEWORK_FIELD.INDICATOR_BOB, EDGEWORK_FIELD.PORTS_PARALLEL, EDGEWORK_FIELD.INDICATOR_CAR,
         EDGEWORK_FIELD.INDICATOR_IND, EDGEWORK_FIELD.PORTS_RJ45, EDGEWORK_FIELD.PORTS_STEREO_RCA,
         EDGEWORK_FIELD.INDICATOR_FRQ, EDGEWORK_FIELD.PORTS_PS2]);
})();