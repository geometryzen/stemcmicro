import { rational } from './bignum';
import { ExtensionEnv } from './env/ExtensionEnv';
import { zzfloat } from './operators/float/float';
import { is_flt } from './operators/flt/is_flt';
import { is_tensor } from './operators/tensor/is_tensor';
import { APPROXRATIO } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { cadr } from './tree/helpers';
import { wrap_as_int } from './tree/rat/Rat';
import { car, cdr, cons, is_cons, items_to_cons, U } from './tree/tree';

/*
 Guesses a rational for each float in the passed expression
*/
export function Eval_approxratio(p1: U, $: ExtensionEnv): void {
    stack_push(approxratioRecursive(cadr(p1), $));
}

function approxratioRecursive(expr: U, $: ExtensionEnv): U {
    if (is_tensor(expr)) {
        return expr.map(function (elem) {
            return approxratioRecursive(elem, $);
        });
    }
    if (is_flt(expr)) {
        return approxOneRatioOnly(expr, $);
    }
    if (is_cons(expr)) {
        return cons(approxratioRecursive(car(expr), $), approxratioRecursive(cdr(expr), $));
    }
    return expr;
}

function approxOneRatioOnly(p1: U, $: ExtensionEnv): U {
    const supposedlyTheFloat = zzfloat(p1, $);
    if (is_flt(supposedlyTheFloat)) {
        const theFloat = supposedlyTheFloat.d;
        const splitBeforeAndAfterDot = theFloat.toString().split('.');
        if (splitBeforeAndAfterDot.length === 2) {
            const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
            const precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
            const theRatio = floatToRatioRoutine(theFloat, precision);
            return rational(theRatio[0], theRatio[1]);
        }
        return wrap_as_int(theFloat);
    }

    // we didn't manage, just leave unexpressed
    return items_to_cons(APPROXRATIO, supposedlyTheFloat);
}

// original routine by John Kennedy, see
// https://web.archive.org/web/20111027100847/http://homepage.smc.edu/kennedy_john/DEC2FRAC.PDF
// courtesy of Michael Borcherds
// who ported this to JavaScript under MIT licence
// also see
// https://github.com/geogebra/geogebra/blob/master/common/src/main/java/org/geogebra/common/kernel/algos/AlgoFractionText.java
// potential other ways to do this:
//   https://rosettacode.org/wiki/Convert_decimal_number_to_rational
//   http://www.homeschoolmath.net/teaching/rational_numbers.php
//   http://stackoverflow.com/questions/95727/how-to-convert-floats-to-human-readable-fractions

function floatToRatioRoutine(
    decimal: number,
    AccuracyFactor: number
): [number, number] {
    if (isNaN(decimal)) {
        return [0, 0];
    }
    // return 0/0
    if (decimal === Infinity) {
        // 1/0
        return [1, 0];
    }
    if (decimal === -Infinity) {
        // -1/0
        return [-1, 0];
    }
    const DecimalSign = decimal < 0.0 ? -1.0 : 1.0;
    decimal = Math.abs(decimal);
    if (Math.abs(decimal - Math.floor(decimal)) < AccuracyFactor) {
        // handles exact integers including 0
        const FractionNumerator = decimal * DecimalSign;
        const FractionDenominator = 1.0;
        return [FractionNumerator, FractionDenominator];
    }
    if (decimal < 1.0e-19) {
        // X = 0 already taken care of
        const FractionNumerator = DecimalSign;
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        const FractionDenominator = 9999999999999999999.0;
        return [FractionNumerator, FractionDenominator];
    }
    if (decimal > 1.0e19) {
        // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
        const FractionNumerator = 9999999999999999999.0 * DecimalSign;
        const FractionDenominator = 1.0;
        return [FractionNumerator, FractionDenominator];
    }
    let Z = decimal;
    let PreviousDenominator = 0.0;
    let FractionDenominator = 1.0;
    let FractionNumerator = undefined;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        Z = 1.0 / (Z - Math.floor(Z));
        const temp = FractionDenominator;
        FractionDenominator =
            FractionDenominator * Math.floor(Z) + PreviousDenominator;
        PreviousDenominator = temp;
        FractionNumerator = Math.floor(decimal * FractionDenominator + 0.5);
        // Rounding Function
        if (
            !(
                Math.abs(decimal - FractionNumerator / FractionDenominator) >
                AccuracyFactor
            ) ||
            Z === Math.floor(Z)
        ) {
            break;
        }
    }
    FractionNumerator = DecimalSign * FractionNumerator;
    return [FractionNumerator, FractionDenominator];
}

const approx_just_an_integer = 0;
const approx_sine_of_rational = 1;
const approx_sine_of_pi_times_rational = 2;
const approx_rationalOfPi = 3;
const approx_radicalOfRatio = 4;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const approx_nothingUseful = 5;
const approx_ratioOfRadical = 6;
const approx_rationalOfE = 7;
const approx_logarithmsOfRationals = 8;
const approx_rationalsOfLogarithms = 9;

export type ApproxResult = [string, number, number, number, number];

function approxRationalsOfRadicals(theFloat: number): ApproxResult {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    // simple radicals.

    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    for (const i of [2, 3, 5, 6, 7, 8, 10]) {
        for (let j = 1; j <= 10; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const hypothesis = Math.sqrt(i) / j;
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            if (error < 2 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * sqrt( ${i} ) / ${j}`;
                    bestResultSoFar = [
                        result,
                        approx_ratioOfRadical,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar as ApproxResult;
}

function approxRadicalsOfRationals(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    // simple radicals.
    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    // this one catches things like Math.sqrt(3/4), but
    // things like Math.sqrt(1/2) are caught by the paragraph
    // above (and in a better form)
    for (const i of [1, 2, 3, 5, 6, 7, 8, 10]) {
        for (const j of [1, 2, 3, 5, 6, 7, 8, 10]) {
            let error: number, likelyMultiplier: number, ratio: number;
            const hypothesis = Math.sqrt(i / j);
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            if (error < 2 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * (sqrt( ${i} / ${j} )`;
                    bestResultSoFar = [
                        result,
                        approx_radicalOfRatio,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

export function approxRadicals(theFloat: number): ApproxResult | null {
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        // Do nothing
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    // simple radicals.

    // we always prefer a rational of a radical of an integer
    // to a radical of a rational. Radicals of rationals generate
    // radicals at the denominator which we'd rather avoid
    const approxRationalsOfRadicalsResult = approxRationalsOfRadicals(theFloat);
    if (approxRationalsOfRadicalsResult != null) {
        return approxRationalsOfRadicalsResult;
    }

    const approxRadicalsOfRationalsResult = approxRadicalsOfRationals(theFloat);
    if (approxRadicalsOfRationalsResult != null) {
        return approxRadicalsOfRationalsResult;
    }

    return null;
}

function approxLogs(theFloat: number): ApproxResult | null {
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        // Do nothing
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    // we always prefer a rational of a log to a log of
    // a rational
    const approxRationalsOfLogsResult = approxRationalsOfLogs(theFloat);
    if (approxRationalsOfLogsResult != null) {
        return approxRationalsOfLogsResult;
    }

    const approxLogsOfRationalsResult = approxLogsOfRationals(theFloat);
    if (approxLogsOfRationalsResult != null) {
        return approxLogsOfRationalsResult;
    }

    return null;
}

export function approxRationalsOfLogs(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    // simple rationals of logs
    for (let i = 2; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const hypothesis = Math.log(i) / j;
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            // it does happen that due to roundings
            // a "higher multiple" is picked, which is obviously
            // unintended.
            // E.g. 1 * log(1 / 3 ) doesn't match log( 3 ) BUT
            // it matches -5 * log( 3 ) / 5
            // so we avoid any case where the multiplier is a multiple
            // of the divisor.
            if (
                likelyMultiplier !== 1 &&
                Math.abs(Math.floor(likelyMultiplier / j)) ===
                Math.abs(likelyMultiplier / j)
            ) {
                continue;
            }

            if (error < 2.2 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * log( ${i} ) / ${j}`;
                    bestResultSoFar = [
                        result,
                        approx_rationalsOfLogarithms,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

function approxLogsOfRationals(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    // simple logs of rationals
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const hypothesis = Math.log(i / j);
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            if (error < 1.96 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * log( ${i} / ${j} )`;
                    bestResultSoFar = [
                        result,
                        approx_logarithmsOfRationals,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

function approxRationalsOfPowersOfE(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    // simple rationals of a few powers of e
    for (let i = 1; i <= 2; i++) {
        for (let j = 1; j <= 12; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const hypothesis = Math.pow(Math.E, i) / j;
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            if (error < 2 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * (e ^ ${i} ) / ${j}`;
                    bestResultSoFar = [
                        result,
                        approx_rationalOfE,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

function approxRationalsOfPowersOfPI(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    let bestResultSoFar: ApproxResult | null = null;

    // here we do somethng a little special: since
    // the powers of pi can get quite big, there might
    // be multiple hypothesis where more of the
    // magnitude is shifted to the multiplier, and some
    // where more of the magnitude is shifted towards the
    // exponent of pi. So we prefer the hypotheses with the
    // lower multiplier since it's likely to insert more
    // information.
    let minimumComplexity = Number.MAX_VALUE;

    // simple rationals of a few powers of PI
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 12; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const hypothesis = Math.pow(Math.PI, i) / j;
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            if (error < 2 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * (pi ^ ${i} ) / ${j} )`;
                    bestResultSoFar = [
                        result,
                        approx_rationalOfPi,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

function approxTrigonometric(theFloat: number): ApproxResult | null {
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        // Do nothing
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    // we always prefer a sin of a rational without the PI
    const approxSineOfRationalsResult = approxSineOfRationals(theFloat);
    if (approxSineOfRationalsResult != null) {
        return approxSineOfRationalsResult;
    }

    const approxSineOfRationalMultiplesOfPIResult = approxSineOfRationalMultiplesOfPI(
        theFloat
    );
    if (approxSineOfRationalMultiplesOfPIResult != null) {
        return approxSineOfRationalMultiplesOfPIResult;
    }

    return null;
}

function approxSineOfRationals(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    // we only check very simple rationals because they begin to get tricky
    // quickly, also they collide often with the "rational of pi" hypothesis.
    // For example sin(11) is veeery close to 1 (-0.99999020655)
    // (see: http://mathworld.wolfram.com/AlmostInteger.html )
    // we stop at rationals that mention up to 10
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const fraction = i / j;
            const hypothesis = Math.sin(fraction);
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            if (error < 2 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * sin( ${i}/${j} )`;
                    bestResultSoFar = [
                        result,
                        approx_sine_of_rational,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

function approxSineOfRationalMultiplesOfPI(theFloat: number): ApproxResult | null {
    let precision: number;
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        const numberOfDigitsAfterTheDot = splitBeforeAndAfterDot[1].length;
        precision = 1 / Math.pow(10, numberOfDigitsAfterTheDot);
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }

    let bestResultSoFar: ApproxResult | null = null;
    let minimumComplexity = Number.MAX_VALUE;

    // check rational multiples of pi
    for (let i = 1; i <= 13; i++) {
        for (let j = 1; j <= 13; j++) {
            let error: number, likelyMultiplier: number, ratio: number;
            const fraction = i / j;
            const hypothesis = Math.sin(Math.PI * fraction);
            if (Math.abs(hypothesis) > 1e-10) {
                ratio = theFloat / hypothesis;
                likelyMultiplier = Math.round(ratio);
                error = Math.abs(1 - ratio / likelyMultiplier);
            }
            else {
                ratio = 1;
                likelyMultiplier = 1;
                error = Math.abs(theFloat - hypothesis);
            }
            // magic number 23 comes from the case sin(pi/10)
            if (error < 23 * precision) {
                const complexity = simpleComplexityMeasure(likelyMultiplier, i, j);
                if (complexity < minimumComplexity) {
                    minimumComplexity = complexity;
                    const result = `${likelyMultiplier} * sin( ${i}/${j} * pi )`;
                    bestResultSoFar = [
                        result,
                        approx_sine_of_pi_times_rational,
                        likelyMultiplier,
                        i,
                        j,
                    ];
                }
            }
        }
    }

    return bestResultSoFar;
}

export function approxAll(theFloat: number): ApproxResult | null {
    const splitBeforeAndAfterDot = theFloat.toString().split('.');

    if (splitBeforeAndAfterDot.length === 2) {
        // Do nothing
    }
    else {
        return [
            '' + Math.floor(theFloat),
            approx_just_an_integer,
            Math.floor(theFloat),
            1,
            2,
        ];
    }


    let constantsSumMin = Number.MAX_VALUE;
    let constantsSum = 0;
    let bestApproxSoFar: ApproxResult | null = null;

    const approxRadicalsResult = approxRadicals(theFloat);
    if (approxRadicalsResult != null) {
        constantsSum = simpleComplexityMeasure(approxRadicalsResult);
        if (constantsSum < constantsSumMin) {
            constantsSumMin = constantsSum;
            bestApproxSoFar = approxRadicalsResult;
        }
    }

    const approxLogsResult = approxLogs(theFloat);
    if (approxLogsResult != null) {
        constantsSum = simpleComplexityMeasure(approxLogsResult);
        if (constantsSum < constantsSumMin) {
            constantsSumMin = constantsSum;
            bestApproxSoFar = approxLogsResult;
        }
    }

    const approxRationalsOfPowersOfEResult = approxRationalsOfPowersOfE(theFloat);
    if (approxRationalsOfPowersOfEResult != null) {
        constantsSum = simpleComplexityMeasure(approxRationalsOfPowersOfEResult);
        if (constantsSum < constantsSumMin) {
            constantsSumMin = constantsSum;
            bestApproxSoFar = approxRationalsOfPowersOfEResult;
        }
    }

    const approxRationalsOfPowersOfPIResult = approxRationalsOfPowersOfPI(
        theFloat
    );
    if (approxRationalsOfPowersOfPIResult != null) {
        constantsSum = simpleComplexityMeasure(approxRationalsOfPowersOfPIResult);
        if (constantsSum < constantsSumMin) {
            constantsSumMin = constantsSum;
            bestApproxSoFar = approxRationalsOfPowersOfPIResult;
        }
    }

    const approxTrigonometricResult = approxTrigonometric(theFloat);
    if (approxTrigonometricResult != null) {
        constantsSum = simpleComplexityMeasure(approxTrigonometricResult);
        if (constantsSum < constantsSumMin) {
            constantsSumMin = constantsSum;
            bestApproxSoFar = approxTrigonometricResult;
        }
    }

    return bestApproxSoFar;
}

function simpleComplexityMeasure(arr: ApproxResult): number;
function simpleComplexityMeasure(a: number, b: number, c: number): number;
function simpleComplexityMeasure(aResult: number | ApproxResult, b?: number, c?: number) {
    let theSum = 0;

    if (aResult instanceof Array) {
        // we want PI and E to somewhat increase the
        // complexity of the expression, so basically they count
        // more than any integer lower than 3, i.e. we consider
        // 1,2,3 to be more fundamental than PI or E.
        switch (aResult[1]) {
            case approx_sine_of_pi_times_rational:
                theSum = 4;
                break;
            // exponents of PI and E need to be penalised as well
            // otherwise they come to explain any big number
            // so we count them just as much as the multiplier
            case approx_rationalOfPi:
                theSum = Math.pow(4, Math.abs(aResult[3])) * Math.abs(aResult[2]);
                break;
            case approx_rationalOfE:
                theSum = Math.pow(3, Math.abs(aResult[3])) * Math.abs(aResult[2]);
                break;
            default:
                theSum = 0;
        }

        theSum +=
            Math.abs(aResult[2]) * (Math.abs(aResult[3]) + Math.abs(aResult[4]));
    }
    else {
        theSum += Math.abs(aResult) * (Math.abs(b as number) + Math.abs(c as number));
    }

    // heavily discount unit constants

    if (aResult instanceof Array && aResult[2] === 1) {
        theSum -= 1;
    }
    else {
        theSum += 1;
    }

    if (aResult instanceof Array && aResult[3] === 1) {
        theSum -= 1;
    }
    else {
        theSum += 1;
    }

    if (aResult instanceof Array && aResult[4] === 1) {
        theSum -= 1;
    }
    else {
        theSum += 1;
    }

    if (theSum < 0) {
        theSum = 0;
    }

    return theSum;
}

/*
export function testApprox() {
  for (const i of [2, 3, 5, 6, 7, 8, 10]) {
    for (const j of [2, 3, 5, 6, 7, 8, 10]) {
      if (i === j) {
        continue;
      } // this is just 1
      Console.log(`testapproxRadicals testing: 1 * sqrt( ${i} ) / ${j}`);
      const value = Math.sqrt(i) / j;
      const returned = approxRadicals(value);
      const returnedValue =
        (returned[2] * Math.sqrt(returned[3])) / returned[4];
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail testapproxRadicals: 1 * sqrt( ${i} ) / ${j} . obtained: ${returned}`
        );
      }
    }
  }

  for (const i of [2, 3, 5, 6, 7, 8, 10]) {
    for (const j of [2, 3, 5, 6, 7, 8, 10]) {
      if (i === j) {
        continue;
      } // this is just 1
      Console.log(
        `testapproxRadicals testing with 4 digits: 1 * sqrt( ${i} ) / ${j}`
      );
      const originalValue = Math.sqrt(i) / j;
      const value = originalValue.toFixed(4);
      const returned = approxRadicals(Number(value));
      const returnedValue =
        (returned[2] * Math.sqrt(returned[3])) / returned[4];
      if (Math.abs(originalValue - returnedValue) > 1e-15) {
        Console.log(
          `fail testapproxRadicals with 4 digits: 1 * sqrt( ${i} ) / ${j} . obtained: ${returned}`
        );
      }
    }
  }

  for (const i of [2, 3, 5, 6, 7, 8, 10]) {
    for (const j of [2, 3, 5, 6, 7, 8, 10]) {
      if (i === j) {
        continue;
      } // this is just 1
      Console.log(`testapproxRadicals testing: 1 * sqrt( ${i} / ${j} )`);
      const value = Math.sqrt(i / j);
      const returned = approxRadicals(value);
      if (returned != null) {
        const returnedValue =
          returned[2] * Math.sqrt(returned[3] / returned[4]);
        if (
          returned[1] === approx_radicalOfRatio &&
          Math.abs(value - returnedValue) > 1e-15
        ) {
          Console.log(
            `fail testapproxRadicals: 1 * sqrt( ${i} / ${j} ) . obtained: ${returned}`
          );
        }
      }
    }
  }

  for (const i of [1, 2, 3, 5, 6, 7, 8, 10]) {
    for (const j of [1, 2, 3, 5, 6, 7, 8, 10]) {
      if (i === 1 && j === 1) {
        continue;
      }
      Console.log(
        `testapproxRadicals testing with 4 digits:: 1 * sqrt( ${i} / ${j} )`
      );
      const originalValue = Math.sqrt(i / j);
      const value = originalValue.toFixed(4);
      const returned = approxRadicals(Number(value));
      const returnedValue = returned[2] * Math.sqrt(returned[3] / returned[4]);
      if (
        returned[1] === approx_radicalOfRatio &&
        Math.abs(originalValue - returnedValue) > 1e-15
      ) {
        Console.log(
          `fail testapproxRadicals with 4 digits:: 1 * sqrt( ${i} / ${j} ) . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      Console.log(`testApproxAll testing: 1 * log(${i} ) / ${j}`);
      const value = Math.log(i) / j;
      const returned = approxAll(value);
      const returnedValue = (returned[2] * Math.log(returned[3])) / returned[4];
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll: 1 * log(${i} ) / ${j} . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      Console.log(`testApproxAll testing with 4 digits: 1 * log(${i} ) / ${j}`);
      const originalValue = Math.log(i) / j;
      const value = originalValue.toFixed(4);
      const returned = approxAll(Number(value));
      const returnedValue = (returned[2] * Math.log(returned[3])) / returned[4];
      if (Math.abs(originalValue - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll with 4 digits: 1 * log(${i} ) / ${j} . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      Console.log(`testApproxAll testing: 1 * log(${i} / ${j} )}`);
      const value = Math.log(i / j);
      const returned = approxAll(value);
      const returnedValue = returned[2] * Math.log(returned[3] / returned[4]);
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll: 1 * log(${i} / ${j} ) . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 5; i++) {
    for (let j = 1; j <= 5; j++) {
      Console.log(`testApproxAll testing with 4 digits: 1 * log(${i} / ${j} )`);
      const originalValue = Math.log(i / j);
      const value = originalValue.toFixed(4);
      const returned = approxAll(Number(value));
      const returnedValue = returned[2] * Math.log(returned[3] / returned[4]);
      if (Math.abs(originalValue - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll with 4 digits: 1 * log(${i} / ${j} ) . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 12; j++) {
      Console.log(`testApproxAll testing: 1 * (e ^ ${i} ) / ${j}`);
      const value = Math.pow(Math.E, i) / j;
      const returned = approxAll(value);
      const returnedValue =
        (returned[2] * Math.pow(Math.E, returned[3])) / returned[4];
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll: 1 * (e ^ ${i} ) / ${j} . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 12; j++) {
      Console.log(
        `approxRationalsOfPowersOfE testing with 4 digits: 1 * (e ^ ${i} ) / ${j}`
      );
      const originalValue = Math.pow(Math.E, i) / j;
      const value = originalValue.toFixed(4);
      const returned = approxRationalsOfPowersOfE(Number(value));
      const returnedValue =
        (returned[2] * Math.pow(Math.E, returned[3])) / returned[4];
      if (Math.abs(originalValue - returnedValue) > 1e-15) {
        Console.log(
          `fail approxRationalsOfPowersOfE with 4 digits: 1 * (e ^ ${i} ) / ${j} . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 12; j++) {
      Console.log(`testApproxAll testing: 1 * pi ^ ${i} / ${j}`);
      const value = Math.pow(Math.PI, i) / j;
      const returned = approxAll(value);
      const returnedValue =
        (returned[2] * Math.pow(Math.PI, returned[3])) / returned[4];
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll: 1 * pi ^ ${i} / ${j} ) . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= 12; j++) {
      Console.log(
        `approxRationalsOfPowersOfPI testing with 4 digits: 1 * pi ^ ${i} / ${j}`
      );
      const originalValue = Math.pow(Math.PI, i) / j;
      const value = originalValue.toFixed(4);
      const returned = approxRationalsOfPowersOfPI(Number(value));
      const returnedValue =
        (returned[2] * Math.pow(Math.PI, returned[3])) / returned[4];
      if (Math.abs(originalValue - returnedValue) > 1e-15) {
        Console.log(
          `fail approxRationalsOfPowersOfPI with 4 digits: 1 * pi ^ ${i} / ${j} ) . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 4; j++) {
      Console.log(`testApproxAll testing: 1 * sin( ${i}/${j} )}`);
      const fraction = i / j;
      const value = Math.sin(fraction);
      const returned = approxAll(value);
      const returnedFraction = returned[3] / returned[4];
      const returnedValue = returned[2] * Math.sin(returnedFraction);
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail testApproxAll: 1 * sin( ${i}/${j} ) . obtained: ${returned}`
        );
      }
    }
  }

  // 5 digits create no problem
  for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 4; j++) {
      Console.log(`testApproxAll testing with 5 digits: 1 * sin( ${i}/${j} )`);
      const fraction = i / j;
      const originalValue = Math.sin(fraction);
      const value = originalValue.toFixed(5);
      const returned = approxAll(Number(value));
      if (returned == null) {
        Console.log(
          `fail testApproxAll with 5 digits: 1 * sin( ${i}/${j} ) . obtained:  undefined `
        );
      }
      const returnedFraction = returned[3] / returned[4];
      const returnedValue = returned[2] * Math.sin(returnedFraction);
      const error = Math.abs(originalValue - returnedValue);
      if (error > 1e-14) {
        Console.log(
          `fail testApproxAll with 5 digits: 1 * sin( ${i}/${j} ) . obtained: ${returned} error: ${error}`
        );
      }
    }
  }

  // 4 digits create two collisions
  for (let i = 1; i <= 4; i++) {
    for (let j = 1; j <= 4; j++) {
      Console.log(`testApproxAll testing with 4 digits: 1 * sin( ${i}/${j} )`);
      const fraction = i / j;
      const originalValue = Math.sin(fraction);
      const value = originalValue.toFixed(4);
      const returned = approxAll(Number(value));
      if (returned == null) {
        Console.log(
          `fail testApproxAll with 4 digits: 1 * sin( ${i}/${j} ) . obtained:  undefined `
        );
      }
      const returnedFraction = returned[3] / returned[4];
      const returnedValue = returned[2] * Math.sin(returnedFraction);
      const error = Math.abs(originalValue - returnedValue);
      if (error > 1e-14) {
        Console.log(
          `fail testApproxAll with 4 digits: 1 * sin( ${i}/${j} ) . obtained: ${returned} error: ${error}`
        );
      }
    }
  }

  let value = 0;
  if (approxAll(value)[0] !== '0') {
    Console.log('fail testApproxAll: 0');
  }

  value = 0.0;
  if (approxAll(value)[0] !== '0') {
    Console.log('fail testApproxAll: 0.0');
  }

  value = 0.0;
  if (approxAll(value)[0] !== '0') {
    Console.log('fail testApproxAll: 0.00');
  }

  value = 0.0;
  if (approxAll(value)[0] !== '0') {
    Console.log('fail testApproxAll: 0.000');
  }

  value = 0.0;
  if (approxAll(value)[0] !== '0') {
    Console.log('fail testApproxAll: 0.0000');
  }

  value = 1;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1');
  }

  value = 1.0;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1.0');
  }

  value = 1.0;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1.00');
  }

  value = 1.0;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1.000');
  }

  value = 1.0;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1.0000');
  }

  value = 1.0;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1.00000');
  }

  value = Math.sqrt(2);
  if (approxAll(value)[0] !== '1 * sqrt( 2 ) / 1') {
    Console.log('fail testApproxAll: Math.sqrt(2)');
  }

  value = 1.41;
  if (approxAll(value)[0] !== '1 * sqrt( 2 ) / 1') {
    Console.log('fail testApproxAll: 1.41');
  }

  // if we narrow down to a particular family then we can get
  // an OK guess even with few digits, expecially for really "famous" numbers

  value = 1.4;
  if (approxRadicals(value)[0] !== '1 * sqrt( 2 ) / 1') {
    Console.log('fail approxRadicals: 1.4');
  }

  value = 0.6;
  if (approxLogs(value)[0] !== '1 * log( 2 ) / 1') {
    Console.log('fail approxLogs: 0.6');
  }

  value = 0.69;
  if (approxLogs(value)[0] !== '1 * log( 2 ) / 1') {
    Console.log('fail approxLogs: 0.69');
  }

  value = 0.7;
  if (approxLogs(value)[0] !== '1 * log( 2 ) / 1') {
    Console.log('fail approxLogs: 0.7');
  }

  value = 1.09;
  if (approxLogs(value)[0] !== '1 * log( 3 ) / 1') {
    Console.log('fail approxLogs: 1.09');
  }

  value = 1.09;
  if (approxAll(value)[0] !== '1 * log( 3 ) / 1') {
    Console.log('fail approxAll: 1.09');
  }

  value = 1.098;
  if (approxAll(value)[0] !== '1 * log( 3 ) / 1') {
    Console.log('fail approxAll: 1.098');
  }

  value = 1.1;
  if (approxAll(value)[0] !== '1 * log( 3 ) / 1') {
    Console.log('fail approxAll: 1.1');
  }

  value = 1.11;
  if (approxAll(value)[0] !== '1 * log( 3 ) / 1') {
    Console.log('fail approxAll: 1.11');
  }

  value = Math.sqrt(3);
  if (approxAll(value)[0] !== '1 * sqrt( 3 ) / 1') {
    Console.log('fail testApproxAll: Math.sqrt(3)');
  }

  value = 1.0;
  if (approxAll(value)[0] !== '1') {
    Console.log('fail testApproxAll: 1.0000');
  }

  value = 3.141592;
  if (approxAll(value)[0] !== '1 * (pi ^ 1 ) / 1 )') {
    Console.log('fail testApproxAll: 3.141592');
  }

  value = 31.41592;
  if (approxAll(value)[0] !== '10 * (pi ^ 1 ) / 1 )') {
    Console.log('fail testApproxAll: 31.41592');
  }

  value = 314.1592;
  if (approxAll(value)[0] !== '100 * (pi ^ 1 ) / 1 )') {
    Console.log('fail testApproxAll: 314.1592');
  }

  value = 31415926.53589793;
  if (approxAll(value)[0] !== '10000000 * (pi ^ 1 ) / 1 )') {
    Console.log('fail testApproxAll: 31415926.53589793');
  }

  value = Math.sqrt(2);
  if (approxTrigonometric(value)[0] !== '2 * sin( 1/4 * pi )') {
    Console.log('fail approxTrigonometric: Math.sqrt(2)');
  }

  value = Math.sqrt(3);
  if (approxTrigonometric(value)[0] !== '2 * sin( 1/3 * pi )') {
    Console.log('fail approxTrigonometric: Math.sqrt(3)');
  }

  value = (Math.sqrt(6) - Math.sqrt(2)) / 4;
  if (approxAll(value)[0] !== '1 * sin( 1/12 * pi )') {
    Console.log('fail testApproxAll: (Math.sqrt(6) - Math.sqrt(2))/4');
  }

  value = Math.sqrt(2 - Math.sqrt(2)) / 2;
  if (approxAll(value)[0] !== '1 * sin( 1/8 * pi )') {
    Console.log('fail testApproxAll: Math.sqrt(2 - Math.sqrt(2))/2');
  }

  value = (Math.sqrt(6) + Math.sqrt(2)) / 4;
  if (approxAll(value)[0] !== '1 * sin( 5/12 * pi )') {
    Console.log('fail testApproxAll: (Math.sqrt(6) + Math.sqrt(2))/4');
  }

  value = Math.sqrt(2 + Math.sqrt(3)) / 2;
  if (approxAll(value)[0] !== '1 * sin( 5/12 * pi )') {
    Console.log('fail testApproxAll: Math.sqrt(2 + Math.sqrt(3))/2');
  }

  value = (Math.sqrt(5) - 1) / 4;
  if (approxAll(value)[0] !== '1 * sin( 1/10 * pi )') {
    Console.log('fail testApproxAll: (Math.sqrt(5) - 1)/4');
  }

  value = Math.sqrt(10 - 2 * Math.sqrt(5)) / 4;
  if (approxAll(value)[0] !== '1 * sin( 1/5 * pi )') {
    Console.log('fail testApproxAll: Math.sqrt(10 - 2*Math.sqrt(5))/4');
  }

  // this has a radical form but it's too long to write
  value = Math.sin(Math.PI / 7);
  if (approxAll(value)[0] !== '1 * sin( 1/7 * pi )') {
    Console.log('fail testApproxAll: Math.sin(Math.PI/7)');
  }

  // this has a radical form but it's too long to write
  value = Math.sin(Math.PI / 9);
  if (approxAll(value)[0] !== '1 * sin( 1/9 * pi )') {
    Console.log('fail testApproxAll: Math.sin(Math.PI/9)');
  }

  value = 1836.15267;
  if (approxRationalsOfPowersOfPI(value)[0] !== '6 * (pi ^ 5 ) / 1 )') {
    Console.log('fail approxRationalsOfPowersOfPI: 1836.15267');
  }

  for (let i = 1; i <= 13; i++) {
    for (let j = 1; j <= 13; j++) {
      Console.log(`approxTrigonometric testing: 1 * sin( ${i}/${j} * pi )`);
      const fraction = i / j;
      value = Math.sin(Math.PI * fraction);
      // we specifically search for sines of rational multiples of PI
      // because too many of them would be picked up as simple
      // rationals.
      const returned = approxTrigonometric(value);
      const returnedFraction = returned[3] / returned[4];
      const returnedValue = returned[2] * Math.sin(Math.PI * returnedFraction);
      if (Math.abs(value - returnedValue) > 1e-15) {
        Console.log(
          `fail approxTrigonometric: 1 * sin( ${i}/${j} * pi ) . obtained: ${returned}`
        );
      }
    }
  }

  for (let i = 1; i <= 13; i++) {
    for (let j = 1; j <= 13; j++) {
      // with four digits, there are two collisions with the
      // "simple fraction" argument hypotesis, which we prefer since
      // it's a simpler expression, so let's skip those
      // two tests
      if ((i === 5 && j === 11) || (i === 6 && j === 11)) {
        continue;
      }

      Console.log(
        `approxTrigonometric testing with 4 digits: 1 * sin( ${i}/${j} * pi )`
      );
      const fraction = i / j;
      const originalValue = Math.sin(Math.PI * fraction);
      const value = originalValue.toFixed(4);
      // we specifically search for sines of rational multiples of PI
      // because too many of them would be picked up as simple
      // rationals.
      const returned = approxTrigonometric(Number(value));
      const returnedFraction = returned[3] / returned[4];
      const returnedValue = returned[2] * Math.sin(Math.PI * returnedFraction);
      const error = Math.abs(originalValue - returnedValue);
      if (error > 1e-14) {
        Console.log(          `fail approxTrigonometric with 4 digits: 1 * sin( ${i}/${j} * pi ) . obtained: ${returned} error: ${error}`        );
      }
    }
  }

  return Console.log('testApprox done');
}
*/