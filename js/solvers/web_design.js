(function() {
    const WEBSITES = {
        "Edison Daily": {
            elements: "body a h3 blockquote",
            ids: "#header #comments",
            classes: ".post .title .author",
            threshold: "#00FF00"
        },
        "Buddymaker": {
            elements: "div span img a",
            ids: "#msg #cover #content #sidebar",
            classes: ".post .title .share",
            threshold: "#8040C0"
        },
        "PNGdrop": {
            elements: "div img",
            ids: "#main #comments #fullview",
            classes: ".username .share .large",
            threshold: "#BADA55"
        },
        "BobIRS": {
            elements: "ul ol img b i",
            ids: "#sidebar",
            classes: ".avatar .username",
            threshold: "#03E61E"
        },
        "Vidhost": {
            elements: "div iframe b i",
            ids: "#main #rating #comments",
            classes: ".username .share .channel",
            threshold: "#60061E"
        },
        "Go Team Falcon online": {
            elements: "body iframe",
            ids: "#rating #comments",
            classes: ".rating .fullscreen",
            threshold: "#501337"
        },
        "Stufflocker": {
            elements: "div h3 img iframe",
            ids: "#sidebar #download",
            classes: ".menu .author",
            threshold: "#B020E5"
        },
        "Steel Nexus": {
            elements: "body div img blockquote",
            ids: "#header #content #sidebar",
            classes: ".avatar .reply",
            threshold: "#BEA61E"
        }
    };

    const COLORS = {
        blue: "#0000FF",
        yellow: "#FFFF00",
        red: "#FF0000",
        green: "#00FF00",
        white: "#FFFFFF",
        orange: "#FFA500",
        purple: "#800080",
        magenta: "#FF00FF",
        gray: "#808080"
    };

    function setUpWebDesignUI() {
        addTextInput("Selector", "selector");
        addNumberInput("Line count", "lineCount", {min: 3, max: 6, step: 1});
        addCheckbox("Buttons are colored", "buttonsColored");
        addLinesUI();
        setUIChangeCallback(element => {
            if (element === "lineCount") addLinesUI();
        });
        setResultCallback(getResult);
    }

    function addLinesUI() {
        let oldLines = {...solverFields};
        removeInput(/line\d/);
        for (let i = 0; i < solverFields.lineCount; i++) {
            addTextInput("Line " + (i + 1), "line" + i, i + 2);
            setInputValue("line" + i, oldLines["line" + i] ?? "");
        }
    }

    function getWebsite() {
        let parts = solverFields.selector.replaceAll(/([.#])/g, " $1").trim().split(/ +/);
        let possibleWebsites = [];
        for (let website in WEBSITES) {
            let websiteData = WEBSITES[website];
            if (parts.every(part =>
                (part.startsWith("#") && websiteData.ids.split(" ").includes(part)) ||
                (part.startsWith(".") && websiteData.classes.split(" ").includes(part)) ||
                (websiteData.elements.split(" ").includes(part))
            )) possibleWebsites.push(website);
        }
        return possibleWebsites.length === 1 ? possibleWebsites[0] : null;
    }

    function getLinesText() {
        let output = [];
        for (let i = 0; i < solverFields.lineCount; i++) output.push(solverFields["line" + i]);
        return output;
    }

    function getLines() {
        return getLinesText().map(x => x.replace(/;$/, "").split(":").map(y => y.trim()))
                             .map(([property, value]) => ({property, value}));
    }

    function getColorTarget() {
        for (let line of getLines()) {
            for (let color in COLORS) {
                if (line.value.includes(color)) return COLORS[color];
            }
        }
        return "#7F7F7F";
    }

    function calculateResult() {
        let score = solverFields.lineCount;
        let lines = getLines();
        let threshold = WEBSITES[getWebsite()].threshold.match(/#(..)(..)(..)/).slice(1).map(x => parseInt(x, 16));
        let colorTarget = getColorTarget().match(/#(..)(..)(..)/).slice(1).map(x => parseInt(x, 16));
        if (colorTarget[0] < threshold[0]) score += 3;
        if (colorTarget[1] >= threshold[1]) score += 3;
        if (colorTarget[2] > threshold[2]) score += 3;
        score += lines.filter(x => ["margin", "padding"].includes(x.property)).length * 2;
        score += lines.filter(x => ["border", "border-radius"].includes(x.property) &&
                                   !["0px", "50%"].includes(x.value)).length;
        if (!lines.find(x => x.property === "position"))
            score -= lines.filter(x => x.property === "z-index").length;
        score -= lines.filter(x => x.property === "font-family" && x.value === "Comic Sans MS").length * 5;
        score += lines.filter(x => x.property === "font-family" && x.value !== "Comic Sans MS").length;
        score += lines.filter(x => ["box-shadow", "text-shadow"].includes(x.property) && x.value !== "none").length * 2;
        if (solverFields.buttonsColored) score *= 2;
        else score -= 3;
        while (score <= 0) score += 16;
        let index = (score - 1) % 9 + 1;
        switch (index) {
            case 2: case 3: case 5: case 7: return "Press Accept (✓).";
            case 6: case 8: return "Press Consider (Δ).";
            case 1: case 4: case 9: return "Press Reject (✗).";
        }
    }

    function getResult() {
        if (!getWebsite()) return "Invalid selector.";
        let lines = getLinesText();
        for (let i = 0; i < lines.length; i++)
            if (!/^[a-z-]+: ?[^:;]+;?$/.test(lines[i])) return "Invalid property on line " + (i + 1) + ".";
        return calculateResult();
    }

    registerSolver("Web Design", setUpWebDesignUI, []);
})();