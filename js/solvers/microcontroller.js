(function () {
    const PINOUTS = {
        "STRK (Strike)": {
            6:  "AIN VCC RST DIN PWM GND".split(" "),
            8:  "AIN PWM GND DIN VCC GND RST GND".split(" "),
            10: "GND GND GND GND AIN DIN GND VCC RST PWM".split(" ")
        },
        "LEDS (Diodes)": {
            6:  "PWM RST VCC DIN AIN GND".split(" "),
            8:  "PWM DIN VCC GND AIN GND RST GND".split(" "),
            10: "PWM AIN DIN GND GND GND GND RST VCC GND".split(" ")
        },
        "CNTD (Countdown)": {
            6:  "GND AIN PWM VCC DIN RST".split(" "),
            8:  "PWM GND GND VCC AIN GND DIN RST".split(" "),
            10: "PWM DIN AIN GND GND VCC GND GND RST GND".split(" ")
        },
        "EXPL (Explosion)": {
            6:  "PWM VCC RST AIN DIN GND".split(" "),
            8:  "AIN GND RST GND VCC GND DIN PWM".split(" "),
            10: "RST DIN VCC GND GND GND AIN GND PWM GND".split(" ")
        }
    };

    const TABLE = {
        VCC: "Yellow Yellow Red Red Green".split(" "),
        AIN: "Magenta Red Magenta Blue Red".split(" "),
        DIN: "Green Magenta Green Yellow Yellow".split(" "),
        PWM: "Blue Green Blue Green Blue".split(" "),
        RST: "Red Blue Yellow Magenta Magenta".split(" "),
        GND: "White White White White White".split(" ")
    };

    function setUpMicrocontrollerUI() {
        addChoiceInput("Microcontroller type", "type", Object.keys(PINOUTS));
        addTextInput("Microcontroller serial number", "serial");
        addChoiceInput("White mark", "mark", ["Top-left", "Top-right", "Bottom-left", "Bottom-right"]);
        setResultCallback(getResult);
    }

    function getResult() {
        let serial = solverFields.serial.trim().toUpperCase();
        if (serial.startsWith("FNX ")) serial = serial.slice(4);
        if (!/^[1-9]\d{2,4}-?\d{1,3}$/.test(serial)) return "Invalid microcontroller serial number.";
        if (!serial.includes("-"))
            serial = serial.slice(0, serial.length / 2 + 1) + "-" + serial.slice(serial.length / 2 + 1);
        let [left, right] = serial.split("-");
        if (left.length !== right.length + 2) return "Invalid microcontroller serial number.";
        if (left.startsWith("0") || (right !== "0" && right.startsWith("0"))) return "Invalid microcontroller serial number.";
        let numPins = left.length * 2;
        let pinout = PINOUTS[solverFields.type][numPins];
        let tableRow = getTableRow();
        let colors = pinout.map(x => TABLE[x][tableRow]);
        let topRow = colors.slice(0, left.length);
        let bottomRow = colors.slice(left.length).toReversed();
        if (solverFields.mark.startsWith("Bottom-")) [topRow, bottomRow] = [bottomRow, topRow];
        if (solverFields.mark.endsWith("-right")) {
            topRow.reverse();
            bottomRow.reverse();
        }
        return `Top row: ${topRow.join(", ")}\nBottom row: ${bottomRow.join(", ")}`;
    }

    function getTableRow() {
        let serial = solverFields.serial.trim().toUpperCase();
        if (serial.startsWith("FNX ")) serial = serial.slice(4);
        if (!serial.includes("-"))
            serial = serial.slice(0, serial.length / 2 + 1) + "-" + serial.slice(serial.length / 2 + 1);
        if (/[14]$/.test(serial)) return 0;
        if (edgework.indicatorSIG === true || edgework.portsRJ45 > 0) return 1;
        if (/[CLRX18]/.test(edgework.serialNumber)) return 2;
        if (+serial[1] === edgework.batteriesTotal) return 3;
        return 4;
    }

    registerSolver("Microcontroller", setUpMicrocontrollerUI,
                   [EDGEWORK_FIELD.SERIAL_NUMBER, EDGEWORK_FIELD.INDICATOR_SIG,
                    EDGEWORK_FIELD.BATTERIES, EDGEWORK_FIELD.PORTS_RJ45]);
})();