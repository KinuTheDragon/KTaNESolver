const solverContainer = document.getElementById("solver");
const resultContainer = document.getElementById("result");
let solverFields = {};
let uiChangeCallback = element => {};
let resultCallback = () => "";

function clearUI() {
    solverFields = {};
    while (solverContainer.firstChild)
        solverContainer.removeChild(solverContainer.firstChild);
}

function removeInput(key) {
    if (typeof key === "object" && key.constructor === RegExp) {
        let regex = new RegExp("^" + key.source + "$");
        for (let k of Object.keys(solverFields)) {
            if (regex.test(k)) removeInput(k);
        }
        return;
    }
    delete solverFields[key];
    let rowOfInput = document.getElementById(key)?.parentNode?.parentNode;
    if (rowOfInput) rowOfInput.parentNode.removeChild(rowOfInput);
}

function hasInput(key) {
    return document.getElementById(key) !== null;
}

function setInputValue(key, value) {
    let input = document.getElementById(key);
    if (input.type === "checkbox") input.checked = value;
    else input.value = value;
    solverFields[key] = value;
}

function setUIChangeCallback(callback) {
    uiChangeCallback = callback;
}

function setResultCallback(callback) {
    resultCallback = callback;
}

function addNumberInput(label, key, options, insertPosition) {
    addInput(label, key, () => {
        let input = document.createElement("input");
        input.type = "number";
        input.id = key;
        if (options.min !== null) input.min = options.min;
        if (options.max !== null) input.max = options.max;
        if (options.step !== null) input.step = options.step;
        solverFields[key] = input.value = options.value ?? options.min ?? options.max ?? 0;
        input.addEventListener("change", event => {
            if (!input.validity.valid) input.value = solverFields[key];
            solverFields[key] = input.value = +input.value;
        })
        return input;
    }, insertPosition);
}

function addChoiceInput(label, key, values, insertPosition) {
    addInput(label, key, () => {
        let input = document.createElement("select");
        input.id = key;
        values.forEach(x => {
            if (typeof x !== "object") x = {name: x, value: x};
            let {name, value} = x;
            let option = document.createElement("option");
            option.appendChild(document.createTextNode(name));
            option.value = value;
            input.appendChild(option);
        });
        solverFields[key] = input.value;
        input.addEventListener("change", event => {
            solverFields[key] = input.value;
        });
        return input;
    }, insertPosition);
}

function addTextInput(label, key, insertPosition) {
    addUnvalidatedInput(label, key, "text", insertPosition, "");
}

function addCheckbox(label, key, insertPosition) {
    addUnvalidatedInput(label, key, "checkbox", insertPosition, false);
}

// Below this line is only to be used internally.
function updateResult() {
    while (resultContainer.firstChild) resultContainer.removeChild(resultContainer.firstChild);
    let result = resultCallback();
    resultContainer.appendChild(document.createTextNode(result));
}

function addInput(label, key, callback, insertPosition) {
    let row = document.createElement("tr");
    let labelCell = document.createElement("td");
    row.appendChild(labelCell);
    let labelElement = document.createElement("label");
    labelCell.appendChild(labelElement);
    labelElement.setAttribute("for", key);
    labelElement.appendChild(document.createTextNode(label + ":"));
    let inputCell = document.createElement("td");
    row.appendChild(inputCell);
    let input = callback();
    input.addEventListener(input.type === "text" ? "input" : "change", event => {
        uiChangeCallback(input.id);
        updateResult();
    });
    inputCell.appendChild(input);
    if (insertPosition === undefined)
        solverContainer.appendChild(row);
    else {
        let insertBefore = solverContainer.firstChild;
        for (let i = 0; i < insertPosition; i++)
            insertBefore = insertBefore.nextSibling;
        solverContainer.insertBefore(row, insertBefore);
    }
}

function addUnvalidatedInput(label, key, type, insertPosition, initialValue) {
    addInput(label, key, () => {
        let input = document.createElement("input");
        input.id = key;
        input.type = type;
        solverFields[key] = initialValue;
        input.addEventListener(input.type === "text" ? "input" : "change", event => {
            let value = input.value;
            if (input.type === "checkbox") value = input.checked;
            solverFields[key] = value;
        });
        return input;
    }, insertPosition);
}

function setEdgeworkHighlights(highlights) {
    let highlightIds = highlights.flat();
    document.querySelectorAll(".highlight").forEach(x => x.classList.remove("highlight"));
    highlightIds.forEach(x => document.querySelector(`label[for=${x}]`).classList.add("highlight"));
}

function updateFilter() {
    if (moduleTypeInput.value === "") {
        setTimeout(updateFilter, 1);
        return;
    }
    let currentIsVanilla = solvers[moduleTypeInput.value].isVanilla;
    let filterType = document.getElementById("filterType").value;
    [...document.getElementById("moduleType").children].forEach(opt => {
        let {isVanilla} = solvers[opt.value];
        let moduleType = isVanilla ? "V" : "M";
        let shouldShow = filterType.includes(moduleType);
        opt.hidden = !shouldShow;
        opt.disabled = !shouldShow;
    });
    if (currentIsVanilla && filterType === "M") {
        moduleTypeInput.value = "Piano Keys";
        updateModule();
    } else if (!currentIsVanilla && filterType === "V") {
        moduleTypeInput.value = "Wires";
        updateModule();
    }
}