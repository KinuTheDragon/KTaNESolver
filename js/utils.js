function ordinalize(num) {
    if (Math.floor(num % 100 / 10) === 1) return num + "th";
    switch (num % 10) {
        case 1: return num + "st";
        case 2: return num + "nd";
        case 3: return num + "rd";
        default: return num + "th";
    }
}

function mod(a, b) {
    return (a % b + b) % b;
}