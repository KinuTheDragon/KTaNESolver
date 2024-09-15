const moduleTypeInput = document.getElementById("moduleType");

let solvers = {};
let initialLoaded = false;

function transformName(name) {
    name = name.trim().toLowerCase();
    if (name.startsWith("the ")) name = name.slice(4);
    return name;
}

function registerSolver(name, callback, edgeworkFieldsUsed, isVanilla) {
    solvers[name] = {callback, edgeworkFieldsUsed, isVanilla};
    let option = document.createElement("option");
    let insertBefore = moduleTypeInput.firstElementChild;
    while (insertBefore && transformName(insertBefore.value) < transformName(name))
        insertBefore = insertBefore.nextSibling;
    option.appendChild(document.createTextNode(name));
    option.value = name;
    if (insertBefore) moduleTypeInput.insertBefore(option, insertBefore);
    else moduleTypeInput.appendChild(option);
    let selected = document.getElementById("filterType").value === "M" ? "Piano Keys" : "Wires";
    if (name === selected && !initialLoaded) {
        moduleTypeInput.value = name;
        callback();
        updateResult();
        setEdgeworkHighlights(edgeworkFieldsUsed);
        initialLoaded = true;
    }
}

function updateModule() {
    let solver = solvers[moduleTypeInput.value];
    clearUI();
    setUIChangeCallback(() => {});
    setResultCallback(() => "");
    solver.callback();
    updateResult();
    setEdgeworkHighlights(solver.edgeworkFieldsUsed);
}

moduleTypeInput.addEventListener("change", event => updateModule());