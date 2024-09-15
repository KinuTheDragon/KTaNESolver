(function() {
    for (let module of MODULES) {
        let path = `js/solvers/${module}.js`;
        let script = document.createElement("script");
        script.src = path;
        document.body.appendChild(script);
    }
    updateFilter();
})();