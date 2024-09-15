class Edgework {
    #indicatorBOB;
    #indicatorCAR;
    #indicatorCLR;
    #indicatorFRK;
    #indicatorFRQ;
    #indicatorIND;
    #indicatorMSA;
    #indicatorNSA;
    #indicatorSIG;
    #indicatorSND;
    #indicatorTRN;

    constructor() {
        this.serialNumber = "AA0AA0";
        this.batteriesAA = 0;
        this.batteriesD = 0;
        this.portsDVID = 0;
        this.portsParallel = 0;
        this.portsPS2 = 0;
        this.portsRJ45 = 0;
        this.portsSerial = 0;
        this.portsStereoRCA = 0;
        this.#indicatorBOB = null;
        this.#indicatorCAR = null;
        this.#indicatorCLR = null;
        this.#indicatorFRK = null;
        this.#indicatorFRQ = null;
        this.#indicatorIND = null;
        this.#indicatorMSA = null;
        this.#indicatorNSA = null;
        this.#indicatorSIG = null;
        this.#indicatorSND = null;
        this.#indicatorTRN = null;
        this.litNLL = 0;
        this.unlitNLL = 0;
        this.strikes = 0;
    }

    get batteriesTotal() {
        return this.batteriesAA + this.batteriesD;
    }

    get batteryHolders() {
        return Math.floor(this.batteriesAA / 2) + this.batteriesD;
    }

    get portsTotal() {
        return this.portsDVID + this.portsParallel + this.portsPS2 +
               this.portsRJ45 + this.portsSerial + this.portsStereoRCA;
    }

    get ports() {
        return {
            DVID: this.portsDVID,
            Parallel: this.portsParallel,
            PS2: this.portsPS2,
            RJ45: this.portsRJ45,
            Serial: this.portsSerial,
            StereoRCA: this.portsStereoRCA
        };
    }

    get indicatorBOB() {return this.#indicatorBOB;}
    set indicatorBOB(value) {this.#indicatorBOB = ({"": null, lit: true, unlit: false})[value];}

    get indicatorCAR() {return this.#indicatorCAR;}
    set indicatorCAR(value) {this.#indicatorCAR = ({"": null, lit: true, unlit: false})[value];}

    get indicatorCLR() {return this.#indicatorCLR;}
    set indicatorCLR(value) {this.#indicatorCLR = ({"": null, lit: true, unlit: false})[value];}

    get indicatorFRK() {return this.#indicatorFRK;}
    set indicatorFRK(value) {this.#indicatorFRK = ({"": null, lit: true, unlit: false})[value];}

    get indicatorFRQ() {return this.#indicatorFRQ;}
    set indicatorFRQ(value) {this.#indicatorFRQ = ({"": null, lit: true, unlit: false})[value];}

    get indicatorIND() {return this.#indicatorIND;}
    set indicatorIND(value) {this.#indicatorIND = ({"": null, lit: true, unlit: false})[value];}

    get indicatorMSA() {return this.#indicatorMSA;}
    set indicatorMSA(value) {this.#indicatorMSA = ({"": null, lit: true, unlit: false})[value];}

    get indicatorNSA() {return this.#indicatorNSA;}
    set indicatorNSA(value) {this.#indicatorNSA = ({"": null, lit: true, unlit: false})[value];}

    get indicatorSIG() {return this.#indicatorSIG;}
    set indicatorSIG(value) {this.#indicatorSIG = ({"": null, lit: true, unlit: false})[value];}

    get indicatorSND() {return this.#indicatorSND;}
    set indicatorSND(value) {this.#indicatorSND = ({"": null, lit: true, unlit: false})[value];}

    get indicatorTRN() {return this.#indicatorTRN;}
    set indicatorTRN(value) {this.#indicatorTRN = ({"": null, lit: true, unlit: false})[value];}

    get indicators() {
        return "BOB CAR CLR FRK FRQ IND MSA NSA SIG SND TRN".split(" ")
            .map(x => ({name: x, state: this["indicator" + x]}))
            .filter(x => x.state !== null)
            .concat(
                Array.from({length: this.litNLL}).fill(0).map(() => ({name: "NLL", state: true})),
                Array.from({length: this.unlitNLL}).fill(0).map(() => ({name: "NLL", state: false}))
            );
    }

    get litIndicators() {
        return this.indicators.filter(x => x.state === true).map(x => x.name);
    }

    get unlitIndicators() {
        return this.indicators.filter(x => x.state === false).map(x => x.name);
    }

    get serialNumberLetters() {
        return [...this.serialNumber].filter(x => "A" <= x && x <= "Z");
    }

    get serialNumberDigits() {
        return [...this.serialNumber].filter(x => "0" <= x && x <= "9").map(x => +x);
    }
}

let edgework = new Edgework();

function serialIsValid(serialNumber) {
    return /^[A-NP-XZ\d]{2}\d[A-NP-XZ]{2}\d$/.test(serialNumber);
}

function updateInput(input) {
    if (input.nodeName === "SELECT") {
        edgework[input.id] = input.value;
        let shouldAllowNulls = edgework.indicators.filter(x => x.state !== null && x.name !== "NLL").length >= 11;
        if (!shouldAllowNulls) {
            edgework.litNLL = 0;
            edgework.unlitNLL = 0;
            document.getElementById("litNLL").value = 0;
            document.getElementById("unlitNLL").value = 0;
        }
        document.getElementById("litNLL").disabled = document.getElementById("unlitNLL").disabled = !shouldAllowNulls;
    } else {
        switch (input.type) {
            case "number":
                if (!input.validity.valid) input.value = edgework[input.id];
                input.value = edgework[input.id] = +input.value;
                break;
            case "text":
                if (input.id === "serialNumber") {
                    let serial = input.value.toUpperCase();
                    let isValid = serialIsValid(serial);
                    if (!isValid) input.value = serial = edgework[input.id];
                    edgework[input.id] = serial;
                }
                break;
        }
    }
    uiChangeCallback();
    updateResult();
}

document.querySelectorAll("#edgework input, #edgework select").forEach(input => {
    input.addEventListener("change", event => updateInput(input));
    updateInput(input);
});

function resetEdgework() {
    edgework = new Edgework();
    document.querySelectorAll("#edgework input, #edgework select").forEach(input => {
        input.value = "";
        updateInput(input)
    });
}

const EDGEWORK_FIELD = {
    SERIAL_NUMBER: ["serialNumber"],
    BATTERIES: ["batteriesAA", "batteriesD"],
    BATTERIES_AA: ["batteriesAA"],
    BATTERIES_D: ["batteriesD"],
    PORTS: ["portsDVID", "portsParallel", "portsPS2", "portsRJ45", "portsSerial", "portsStereoRCA"],
    PORTS_DVID: ["portsDVID"],
    PORTS_PARALLEL: ["portsParallel"],
    PORTS_PS2: ["portsPS2"],
    PORTS_RJ45: ["portsRJ45"],
    PORTS_SERIAL: ["portsSerial"],
    PORTS_STEREO_RCA: ["portsStereoRCA"],
    INDICATORS: "BOB CAR CLR FRK FRQ IND MSA NSA SIG SND TRN".split(" ").map(x => "indicator" + x)
        .concat(["litNLL", "unlitNLL"]),
    INDICATOR_BOB: ["indicatorBOB"],
    INDICATOR_CAR: ["indicatorCAR"],
    INDICATOR_CLR: ["indicatorCLR"],
    INDICATOR_FRK: ["indicatorFRK"],
    INDICATOR_FRQ: ["indicatorFRQ"],
    INDICATOR_IND: ["indicatorIND"],
    INDICATOR_MSA: ["indicatorMSA"],
    INDICATOR_NSA: ["indicatorNSA"],
    INDICATOR_SIG: ["indicatorSIG"],
    INDICATOR_SND: ["indicatorSND"],
    INDICATOR_TRN: ["indicatorTRN"],
    INDICATOR_NLL: ["litNLL", "unlitNLL"],
    STRIKES: ["strikes"]
}