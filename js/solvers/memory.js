(function() {
    function setUpInitialMemoryUI() {
        for (let i = 0; i < 5; i++)
            addNumberInput(`Stage ${i + 1} display`, "display" + i, {min: 1, max: 4, step: 1});
        updateUI();
        setUIChangeCallback(updateUI);
        setResultCallback(getResult);
    }

    function updateUI(id) {
        if (id && !id.startsWith("display")) return;
        for (let i = 0; i < 4; i++) {
            let value = solverFields["other" + i] ?? 1;
            removeInput("other" + i);
            let hasPosition = getMemoryResultStageN(i + 1).position;
            addNumberInput(
                `Stage ${i + 1} ${!hasPosition ? 'position' : 'label'}`,
                "other" + i,
                {min: 1, max: 4, step: 1},
                i * 2 + 1
            );
            setInputValue("other" + i, value);
        }
    }

    function getMemoryResultStage1() {
        switch (solverFields.display0) {
            case 1: return {position: true, value: 2};
            case 2: return {position: true, value: 2};
            case 3: return {position: true, value: 3};
            case 4: return {position: true, value: 4};
        }
    }

    function getMemoryResultStage2() {
        switch (solverFields.display1) {
            case 1: return {position: false, value: 4};
            case 2: return {position: true, value: getFullMemoryResultStageN(1).position};
            case 3: return {position: true, value: 1};
            case 4: return {position: true, value: getFullMemoryResultStageN(1).position};
        }
    }

    function getMemoryResultStage3() {
        switch (solverFields.display2) {
            case 1: return {position: false, value: getFullMemoryResultStageN(2).label};
            case 2: return {position: false, value: getFullMemoryResultStageN(1).label};
            case 3: return {position: true, value: 3};
            case 4: return {position: false, value: 4};
        }
    }

    function getMemoryResultStage4() {
        switch (solverFields.display3) {
            case 1: return {position: true, value: getFullMemoryResultStageN(1).position};
            case 2: return {position: true, value: 1};
            case 3: return {position: true, value: getFullMemoryResultStageN(2).position};
            case 4: return {position: true, value: getFullMemoryResultStageN(2).position};
        }
    }

    function getMemoryResultStage5() {
        switch (solverFields.display4) {
            case 1: return {position: false, value: getFullMemoryResultStageN(1).label};
            case 2: return {position: false, value: getFullMemoryResultStageN(2).label};
            case 3: return {position: false, value: getFullMemoryResultStageN(4).label};
            case 4: return {position: false, value: getFullMemoryResultStageN(3).label};
        }
    }

    function getMemoryResultStageN(n) {
        switch (n) {
            case 1: return getMemoryResultStage1();
            case 2: return getMemoryResultStage2();
            case 3: return getMemoryResultStage3();
            case 4: return getMemoryResultStage4();
            case 5: return getMemoryResultStage5();
        }
    }

    function getFullMemoryResultStageN(n) {
        let result = getMemoryResultStageN(n);
        let other = solverFields["other" + (n - 1)];
        if (result.position) return {position: result.value, label: other};
        else return {position: other, label: result.value};
    }

    function getResult() {
        let results = [];
        for (let i = 0; i < 5; i++) {
            let result = getMemoryResultStageN(i + 1);
            if (result.position) results.push(ordinalize(result.value) + " position");
            else results.push("label " + result.value);
        }
        return results.map((x, i) => `Stage ${i + 1}: Press ${x}.`).join("\n");
    }

    registerSolver("Memory", setUpInitialMemoryUI, [], true);
})();