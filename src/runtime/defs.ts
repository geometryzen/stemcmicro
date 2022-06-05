//
// WARNING This module should not depend on anything.
// The imports below are for types only and will not create a dependency.
//
import { ExtensionEnv, FOCUS_EXPANDING, FOCUS_FACTORING } from "../env/ExtensionEnv";
import { Flt, piAsDouble, wrap_as_flt, zeroAsDouble } from "../tree/flt/Flt";
import { Num } from "../tree/num/Num";
import { negOne, one, zero } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { PI } from "./constants";

// TOS cannot be arbitrarily large because the OS seg faults on deep recursion.
// For example, a circular evaluation like x=x+1 can cause a seg fault.
// At this setting (100,000) the evaluation stack overruns before seg fault.

export const TOS = 100000;

export const DEBUG = false;
export const PRINTOUTRESULT = false;

// printing-related constants
export const PRINTMODE_LATEX = 'PRINTMODE_LATEX';
export const PRINTMODE_2DASCII = 'PRINTMODE_2DASCII';
export const PRINTMODE_COMPUTER = 'PRINTMODE_COMPUTER';
export const PRINTMODE_HUMAN = 'PRINTMODE_HUMAN';
export const PRINTMODE_LIST = 'PRINTMODE_LIST';

export type PrintMode =
    | typeof PRINTMODE_LATEX
    | typeof PRINTMODE_2DASCII
    | typeof PRINTMODE_COMPUTER
    | typeof PRINTMODE_HUMAN
    | typeof PRINTMODE_LIST;

export class Defs {
    /**
     * TODO: This is a bit of a code smell. Maybe a hack for the test harness?
     * What is exactly is it trying to do?
     * It is set to true during the execution of the test harness, and reset after.
     */
    private $test_flag = false;
    private $printMode: PrintMode = PRINTMODE_COMPUTER;
    constructor() {
        // Nothing to see here yet.
    }

    public recursionLevelNestedRadicalsRemoval = 0;
    public errorMessage = '';

    public symbolsDependencies: { [key: string]: string[] } = {};

    public symbolsHavingReassignments: string[] = [];
    public symbolsInExpressionsWithoutAssignments: string[] = [];
    public patternHasBeenFound = false;
    public inited = false;
    public chainOfUserSymbolsNotFunctionsBeingEvaluated: Sym[] = [];
    public readonly prints: string[] = [];

    /**
     * top of stack
     */
    public tos = 0;

    /**
     * Initialized to zero at the start of top level evaluation.
     * trigmode 1 causes sin squared terms to be replaced by cos squared during power operator application.
     * trigmode 2 causes cos squared terms to be replaced by sin squared during power operator application.
     */
    public trigmode: 0 | 1 | 2 = 0;

    /**
     * The program execution stack.
     * TODO: This should be moved to the $ to achieve isolation of executions.
     * It should also not allow undefined and null values as this requires casting elsewhere.
     * Encapsulation with assertion may help. 
     */
    public stack: (U | undefined | null)[] = [];

    public frame = TOS;

    public p0?: U;
    public p1?: U;
    public p2?: U;
    public p3?: U;
    public p4?: U;
    public p5?: U;
    public p6?: U;
    public p7?: U;
    public p8?: U;
    public p9?: U;

    public out_count = 0;
    /**
     * Causes the print output to render JavaScript.
     */
    public codeGen = false;
    public userSimplificationsInListForm: U[] = [];
    public userSimplificationsInStringForm: string[] = [];
    /**
     * Determines whether floating point numbers are rendered as EcmaScript numbers.
     * 
     * The default value is false.
     */
    public renderFloatAsEcmaScript = false;
    // ========================================================================
    // Behavior Settings
    // ========================================================================
    /**
     * 
     */
    public useDefinitions = true;
    /**
     * Determines whether numeric types are converted to floating point numbers fro numeric evaluation.
     * 
     * The default value as false.
     */
    public evaluatingAsFloat = false;
    /**
     * Determines whether complex numbers are driven towards rectangular or polar notation.
     * 
     * The default value is false.
     */
    public evaluatingAsPolar = false;

    /**
     * Omitting zero terms from sums risks losing the structure of sums when the sum is zero.
     */
    public omitZeroTermsFromSums = true;
    /**
     * In version 1.x, the print token for addition was 'add'.
     * In version 2.x, the default print token for addition is '+'.
     */
    public addSExprToken: '+' | 'add' = '+';
    /**
     * In version 1.x, the print token for multiplication was 'multiply'.
     * In version 2.x, the default print token for multiplication is '*'.
     */
    public mulSExprToken: '*' | 'multiply' = '*';

    /**
     * Determines the string used to represent the Euler Number.
     */
    public eulerNumberToken: 'e' | 'exp(1)' = 'exp(1)';
    /**
     * Determines the string used during rendering to represent Pi.
     */
    public piToken: 'π' | 'pi' = 'π';
    /**
     * Determines the string used during rendering to represent the empty list.
     */
    public nilToken: 'nil' | '()' = '()';

    /**
     * Determines whether structures which are zero can be reduced to a single symbol.
     * Mathematically, this is desirable, but some like to see structure preserved.
     */
    public useCanonicalZero = false;

    get printMode(): PrintMode {
        return this.$printMode;
    }
    setPrintMode(printMode: PrintMode) {
        this.$printMode = printMode;
    }

    get testFlag(): boolean {
        return this.$test_flag;
    }
    setTestFlag(test_flag: boolean) {
        this.$test_flag = test_flag;
    }
}

/**
 * @param version The major version number.
 */
export function set_behaviors_to_version(version: 1 | 2 | 3) {
    switch (version) {
        case 3: {
            defs.evaluatingAsFloat = false;
            defs.evaluatingAsPolar = false;
            defs.omitZeroTermsFromSums = true;
            defs.useCanonicalZero = true;
            // TODO: We may need some definitions. Need more ganularity.
            // Revoke them slowly and observe the effects.
            defs.useDefinitions = true;
            defs.addSExprToken = '+';
            defs.mulSExprToken = '*';
            defs.piToken = 'π';
            defs.nilToken = '()';
            break;
        }
        case 2: {
            defs.evaluatingAsFloat = false;
            defs.evaluatingAsPolar = false;
            defs.omitZeroTermsFromSums = true;
            defs.useCanonicalZero = false;
            // TODO: We may need some definitions. Need more ganularity.
            // Revoke them slowly and observe the effects.
            defs.useDefinitions = true;
            defs.addSExprToken = '+';
            defs.mulSExprToken = '*';
            defs.piToken = 'π';
            defs.nilToken = '()';
            break;
        }
        case 1: {
            defs.evaluatingAsFloat = false;
            defs.evaluatingAsPolar = false;
            defs.omitZeroTermsFromSums = true;
            defs.useCanonicalZero = true;
            defs.useDefinitions = true;
            defs.addSExprToken = 'add';
            defs.mulSExprToken = 'multiply';
            defs.piToken = 'pi';
            defs.nilToken = 'nil';
            break;
        }
    }
}

/**
 * Global (singleton) instance of Defs.
 */
export const defs = new Defs();

/**
 * This should only be used for scripting when the stack is being used.
 * Otherwise, there should be a convenient way to throw structured Error(s).
 */
export function halt(s: string): never {
    defs.errorMessage += 'Halt: ';
    defs.errorMessage += s;
    const message = defs.errorMessage;

    defs.errorMessage = '';
    move_top_of_stack(0);

    const e = new Error(message);
    throw e;
}

export function move_top_of_stack(stackPos: number) {
    if (defs.tos <= stackPos) {
        // we are moving the stack pointer
        // "up" the stack (as if we were doing a push)
        defs.tos = stackPos;
        return;
    }
    // we are moving the stack pointer
    // "down" the stack i.e. as if we were
    // doing a pop, we can zero-
    // out all the elements that we pass
    // so we can reclaim the memory
    while (defs.tos > stackPos) {
        defs.stack[defs.tos] = null;
        defs.tos--;
    }
}

/**
 * This is a good function to call after an abnormal program termination.
 * It is called 
 * 
 * 1. Resets the stack pointer.
 */
export function hard_reset() {
    // console.lg('hard_reset()');
    move_top_of_stack(0);
    defs.frame = TOS;
}

export function use_factoring_with_unary_function(func: (arg: U, $: ExtensionEnv) => U, arg: U, $: ExtensionEnv): U {
    const phase = $.getFocus();
    $.setFocus(FOCUS_FACTORING);
    try {
        return func(arg, $);
    }
    finally {
        $.setFocus(phase);
    }
}

export function use_factoring_with_binary_function(func: (lhs: U, rhs: U, $: ExtensionEnv) => U, lhs: U, rhs: U, $: ExtensionEnv): U {
    const phase = $.getFocus();
    $.setFocus(FOCUS_FACTORING);
    try {
        return func(lhs, rhs, $);
    }
    finally {
        $.setFocus(phase);
    }
}

export function use_expanding_with_unary_function(func: (arg: U, $: ExtensionEnv) => U, arg: U, $: ExtensionEnv): U {
    const phase = $.getFocus();
    $.setFocus(FOCUS_EXPANDING);
    try {
        return func(arg, $);
    }
    finally {
        $.setFocus(phase);
    }
}

export function use_expanding_with_binary_function(func: (lhs: U, rhs: U, $: ExtensionEnv) => U, lhs: U, rhs: U, $: ExtensionEnv): U {
    const phase = $.getFocus();
    $.setFocus(FOCUS_EXPANDING);
    try {
        return func(lhs, rhs, $);
    }
    finally {
        $.setFocus(phase);
    }
}

// Call a function temporarily setting "evaluatingPolar" to true
export function evalPolar<T extends unknown[], V>(func: (...args: T) => V, ...args: T): V {
    const prev_evaluatingPolar = defs.evaluatingAsPolar;
    defs.evaluatingAsPolar = true;
    try {
        return func(...args);
    }
    finally {
        defs.evaluatingAsPolar = prev_evaluatingPolar;
    }
}

/**
 * Call a function temporarily setting "evaluatingAsFloats" to true.
 */
export function evaluateAsFloats<T extends unknown[], V>(func: (...args: T) => V, ...args: T): V {
    const prev_evaluatingAsFloats = defs.evaluatingAsFloat;
    defs.evaluatingAsFloat = true;
    try {
        return func(...args);
    }
    finally {
        defs.evaluatingAsFloat = prev_evaluatingAsFloats;
    }
}

export class DynamicConstants {
    // Maybe the oracle should own these, or initialize with i.
    private static oneAsDouble = wrap_as_flt(1.0);
    private static negOneAsDouble = wrap_as_flt(-1.0);

    // i is the square root of -1 i.e. -1 ^ 1/2
    public static imaginaryunit: U;

    public static One(): Num {
        return defs.evaluatingAsFloat ? DynamicConstants.oneAsDouble : one;
    }

    public static NegOne(): Num {
        return defs.evaluatingAsFloat ? DynamicConstants.negOneAsDouble : negOne;
    }

    public static Zero(): Num {
        return defs.evaluatingAsFloat ? zeroAsDouble : zero;
    }

    public static Pi(): Sym | Flt {
        return defs.evaluatingAsFloat ? piAsDouble : PI;
    }
}
