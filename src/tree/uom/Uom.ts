import { Atom } from '../atom/Atom';
import { U } from '../tree';
import { Dimensions } from './Dimensions';
import { notImplemented } from './notImplemented';
import { notSupported } from './notSupported';
import { QQ } from './QQ';

// const NAMES_SI = ['kilogram', 'meter', 'second', 'coulomb', 'kelvin', 'mole', 'candela'];
const SYMBOLS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'cd'];

const patterns =
    [
        [-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F/m
        [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // S
        [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1],  // F
        [-1, 1, +0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/kg
        [+0, 1, -3, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // C/m ** 3
        [+0, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // J/kg
        [+0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Hz
        [+0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1],  // A
        [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s ** 2
        [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // m/s
        [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // kg·m/s
        [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa
        [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],  // Pa·s
        [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W/m ** 2
        [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N/m
        [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // T
        [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // W/(m·K)
        [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V/m
        [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // N
        [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H/m
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/K
        [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1],  // J/(kg·K)
        [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], // J/(mol·K)
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1],  // J/(mol)
        [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J
        [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // J·s
        [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1],   // W
        [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1],  // V
        [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1],  // Ω
        [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1],   // H
        [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]   // Wb
    ];

const decodes =
    [
        ["F/m"],
        ["S"],
        ["F"],
        ["C/kg"],
        ["C/m ** 3"],
        ["J/kg"],
        ["Hz"],
        ["A"],
        ["m/s ** 2"],
        ["m/s"],
        ["kg·m/s"],
        ["Pa"],
        ["Pa·s"],
        ["W/m ** 2"],
        ["N/m"],
        ["T"],
        ["W/(m·K)"],
        ["V/m"],
        ["N"],
        ["H/m"],
        ["J/K"],
        ["J/(kg·K)"],
        ["J/(mol·K)"],
        ["J/mol"],
        ["J"],
        ["J·s"],
        ["W"],
        ["V"],
        ["Ω"],
        ["H"],
        ["Wb"]
    ];

const dumbString = function (formatted: string, dimensions: Dimensions, labels: string[], compact: boolean | undefined) {
    const stringify = function (rational: QQ, label: string): string | null {
        if (rational.numer === 0) {
            return null;
        }
        else if (rational.denom === 1) {
            if (rational.numer === 1) {
                return label;
            }
            else {
                return label + " ** " + rational.numer;
            }
        }
        return label + " ** " + rational;
    };

    const unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function (x) {
        return typeof x === 'string';
    }).join(" ");
    if (compact) {
        return unitsString;
    }
    else {
        if (unitsString) {
            if (formatted !== "1") {
                return `${formatted} ${unitsString}`;
            }
            else {
                return unitsString;
            }
        }
        else {
            return formatted;
        }
    }
};

/**
 * 
 * @param multiplier 
 * @param formatted 
 * @param dimensions 
 * @param labels 
 * @param compact Determines whether a multiplier of unity will be included in the result. 
 * @returns 
 */
const unitString = function (formatted: string, dimensions: Dimensions, labels: string[], compact: boolean | undefined): string {
    const M = dimensions.M;
    const L = dimensions.L;
    const T = dimensions.T;
    const Q = dimensions.Q;
    const temperature = dimensions.temperature;
    const amount = dimensions.amount;
    const intensity = dimensions.intensity;
    for (let i = 0, len = patterns.length; i < len; i++) {
        const pattern = patterns[i];
        if (M.numer === pattern[0] && M.denom === pattern[1] &&
            L.numer === pattern[2] && L.denom === pattern[3] &&
            T.numer === pattern[4] && T.denom === pattern[5] &&
            Q.numer === pattern[6] && Q.denom === pattern[7] &&
            temperature.numer === pattern[8] && temperature.denom === pattern[9] &&
            amount.numer === pattern[10] && amount.denom === pattern[11] &&
            intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
            return decodes[i][0];
        }
    }
    return dumbString(formatted, dimensions, labels, compact);
};

function mul(lhs: Uom, rhs: Uom): Uom {
    return new Uom(lhs.dimensions.mul(rhs.dimensions), lhs.labels);
}

function div(lhs: Uom, rhs: Uom): Uom {
    return new Uom(lhs.dimensions.div(rhs.dimensions), lhs.labels);
}

/**
 * The Uom class represents the units for a measure.
 */
export class Uom extends Atom<'Uom'> {

    /**
     *
     */
    public static ZERO = new Uom(Dimensions.ONE, SYMBOLS_SI);

    /**
     *
     */
    public static ONE = new Uom(Dimensions.ONE, SYMBOLS_SI);

    /**
     *
     */
    public static KILOGRAM = new Uom(Dimensions.MASS, SYMBOLS_SI);

    /**
     *
     */
    public static METER = new Uom(Dimensions.LENGTH, SYMBOLS_SI);

    /**
     *
     */
    public static SECOND = new Uom(Dimensions.TIME, SYMBOLS_SI);

    /**
     *
     */
    public static COULOMB = new Uom(Dimensions.CHARGE, SYMBOLS_SI);

    /**
     *
     */
    public static AMPERE = new Uom(Dimensions.CURRENT, SYMBOLS_SI);

    /**
     *
     */
    public static KELVIN = new Uom(Dimensions.TEMPERATURE, SYMBOLS_SI);

    /**
     *
     */
    public static MOLE = new Uom(Dimensions.AMOUNT, SYMBOLS_SI);

    /**
     *
     */
    public static CANDELA = new Uom(Dimensions.INTENSITY, SYMBOLS_SI);

    /**
     * @param dimensions
     * @param labels The label strings to use for each dimension.
     */
    constructor(public dimensions: Dimensions, public labels: string[]) {
        super('Uom', 0, 0);
        if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
        }
    }

    /**
     * @param rhs
     * @returns
     */
    compatible(rhs: Uom): Uom {
        if (rhs instanceof Uom) {
            this.dimensions.compatible(rhs.dimensions);
            return this;
        }
        else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
        }
    }

    equals(other: U): boolean {
        if (other instanceof Uom) {
            return this.dimensions.equals(other.dimensions);
        }
        return false;
    }

    /**
     * @param rhs
     * @returns
     */
    mul(rhs: Uom): Uom {
        return mul(this, rhs);
    }

    /**
     * @param rhs
     * @returns
     */
    div(rhs: Uom): Uom {
        return div(this, rhs);
    }

    /**
     * Intentionaly undocumented.
     */
    pattern(): string {
        const ns: number[] = [];
        ns.push(this.dimensions.M.numer);
        ns.push(this.dimensions.M.denom);
        ns.push(this.dimensions.L.numer);
        ns.push(this.dimensions.L.denom);
        ns.push(this.dimensions.T.numer);
        ns.push(this.dimensions.T.denom);
        ns.push(this.dimensions.Q.numer);
        ns.push(this.dimensions.Q.denom);
        ns.push(this.dimensions.temperature.numer);
        ns.push(this.dimensions.temperature.denom);
        ns.push(this.dimensions.amount.numer);
        ns.push(this.dimensions.amount.denom);
        ns.push(this.dimensions.intensity.numer);
        ns.push(this.dimensions.intensity.denom);
        return JSON.stringify(ns);
    }

    /**
     * @param exponent
     * @returns
     */
    pow(exponent: QQ): Uom {
        return new Uom(this.dimensions.pow(exponent), this.labels);
    }

    /**
     * @returns
     */
    inv(): Uom {
        return new Uom(this.dimensions.inv(), this.labels);
    }

    /**
     * @returns true if this unit is dimensionless and the multiplier is unity.
     */
    isOne(): boolean {
        return this.dimensions.isOne();
    }

    /**
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lerp(target: Uom, α: number): Uom {
        throw new Error(notImplemented('lerp').message);
    }

    /**
     * @returns
     */
    quad(): Uom {
        return new Uom(this.dimensions.mul(this.dimensions), this.labels);
    }

    /**
     * @param n
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reflect(n: Uom): Uom {
        return this;
    }

    /**
     * @param rotor
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rotate(rotor: Uom): Uom {
        return this;
    }

    /**
     * @param target
     * @param α
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slerp(target: Uom, α: number): Uom {
        throw new Error(notImplemented('slerp').message);
    }

    /**
     * @returns
     */
    sqrt(): Uom {
        return new Uom(this.dimensions.sqrt(), this.labels);
    }

    /**
     * @param σ
     * @returns
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stress(σ: Uom): Uom {
        throw new Error(notSupported('stress').message);
    }

    /**
     * @param fractionDigits
     * @param compact Determines whether a multiplier of unity will be included in the result.
     * @returns
     */
    toExponential(fractionDigits?: number, compact?: boolean): string {
        return unitString(Number(1).toExponential(fractionDigits), this.dimensions, this.labels, compact);
    }

    /**
     * @param fractionDigits
     * @param compact Determines whether a multiplier of unity will be included in the result.
     * @returns
     */
    toFixed(fractionDigits?: number, compact?: boolean): string {
        return unitString(Number(1).toFixed(fractionDigits), this.dimensions, this.labels, compact);
    }

    toInfixString(): string {
        const radix = 10;
        const compact = true;
        return unitString(Number(1).toString(radix), this.dimensions, this.labels, compact);
    }

    toListString(): string {
        const radix = 10;
        const compact = true;
        return unitString(Number(1).toString(radix), this.dimensions, this.labels, compact);
    }

    /**
     * @param precision
     * @param compact Determines whether a multiplier of unity will be included in the result.
     * @returns
     */
    toPrecision(precision?: number, compact?: boolean): string {
        return unitString(Number(1).toPrecision(precision), this.dimensions, this.labels, compact);
    }

    /**
     * @param radix
     * @param compact Determines whether a multiplier of unity will be included in the result.
     * @returns
     */
    toString(radix?: number, compact?: boolean): string {
        return unitString(Number(1).toString(radix), this.dimensions, this.labels, compact);
    }

    /**
     * @param uom
     * @returns
     */
    static isOne(uom: Uom): boolean {
        if (uom === void 0) {
            return true;
        }
        else if (uom instanceof Uom) {
            return uom.isOne();
        }
        else {
            throw new Error("isOne argument must be a Unit or undefined.");
        }
    }

    /**
     * @param uom
     * @returns
     */
    static assertDimensionless(uom: Uom): void {
        if (!Uom.isOne(uom)) {
            throw new Error("uom must be dimensionless.");
        }
    }

    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    static compatible(lhs: Uom, rhs: Uom): Uom | undefined {
        if (lhs) {
            if (rhs) {
                return lhs.compatible(rhs);
            }
            else {
                if (lhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new Error(lhs + " is incompatible with 1");
                }
            }
        }
        else {
            if (rhs) {
                if (rhs.isOne()) {
                    return void 0;
                }
                else {
                    throw new Error("1 is incompatible with " + rhs);
                }
            }
            else {
                return void 0;
            }
        }
    }

    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    static mul(lhs: Uom, rhs: Uom): Uom | undefined {
        if (lhs) {
            if (rhs) {
                return lhs.mul(rhs);
            }
            else if (Uom.isOne(rhs)) {
                return lhs;
            }
            else {
                return void 0;
            }
        }
        else if (Uom.isOne(lhs)) {
            return rhs;
        }
        else {
            return void 0;
        }
    }

    /**
     * @param lhs
     * @param rhs
     * @returns
     */
    static div(lhs: Uom, rhs: Uom): Uom | undefined {
        if (lhs) {
            if (rhs) {
                return lhs.div(rhs);
            }
            else {
                return lhs;
            }
        }
        else {
            if (rhs) {
                return rhs.inv();
            }
            else {
                return void 0;
            }
        }
    }

    /**
     * @param uom
     * @returns
     */
    static sqrt(uom: Uom): Uom | undefined {
        if (typeof uom !== 'undefined') {
            if (!uom.isOne()) {
                return new Uom(uom.dimensions.sqrt(), uom.labels);
            }
            else {
                return void 0;
            }
        }
        else {
            return void 0;
        }
    }
}
