//
// WARNING This module should not depend on anything.
// The imports below are for types only and will not create a dependency.
//
import { ExtensionEnv, MODE_EXPANDING, MODE_FACTORING } from "../env/ExtensionEnv";
import { evaluatingAsFloat } from "../modes/modes";
import { Flt, negOneAsFlt, piAsFlt } from "../tree/flt/Flt";
import { negOne, Rat } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { MATH_PI } from "./ns_math";

// TOS cannot be arbitrarily large because the OS seg faults on deep recursion.
// For example, a circular evaluation like x=x+1 can cause a seg fault.
// At this setting (100,000) the evaluation stack overruns before seg fault.

export const TOS = 100000;

export const DEBUG = false;
export const PRINTOUTRESULT = false;

/**
 * LATEX is MathJax compatible.
 */
export const PRINTMODE_LATEX = 'PRINTMODE_LATEX';
/**
 * ASCII is a two-dimensional rendering.
 */
export const PRINTMODE_ASCII = 'PRINTMODE_ASCII';
/**
 * INFIX is how we normally write math but whitespace is removed.
 */
export const PRINTMODE_INFIX = 'PRINTMODE_INFIX';
/**
 * HUMAN is like INFIX but with extra whitespace.
 */
export const PRINTMODE_HUMAN = 'PRINTMODE_HUMAN';
/**
 * SEXPR or Symbolic Expression is LISP-like.
 */
export const PRINTMODE_SEXPR = 'PRINTMODE_SEXPR';

export type PrintMode =
    | typeof PRINTMODE_LATEX
    | typeof PRINTMODE_ASCII
    | typeof PRINTMODE_INFIX
    | typeof PRINTMODE_HUMAN
    | typeof PRINTMODE_SEXPR;

export class Defs {
    /**
     * TODO: This is a bit of a code smell. Maybe a hack for the test harness?
     * What is exactly is it trying to do?
     * It is set to true during the execution of the test harness, and reset after.
     */
    private $test_flag = false;
    /**
     * The (default) PrintMode when using the (print ...) expression or print keyword.
     */
    private $printMode: PrintMode = PRINTMODE_INFIX;
    constructor() {
        // Nothing to see here yet.
    }

    public recursionLevelNestedRadicalsRemoval = 0;
    public errorMessage = '';

    public symbolsDependencies: { [key: string]: string[] } = {};

    public symbolsHavingReassignments: string[] = [];
    public symbolsInExpressionsWithoutAssignments: string[] = [];
    public patternHasBeenFound = false;

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

    public out_count = 0;
    /**
     * Causes the print output to render JavaScript.
     */
    public codeGen = false;
    public userSimplificationsInListForm: U[] = [];
    public userSimplificationsInStringForm: string[] = [];
    // ========================================================================
    // Behavior Settings
    // ========================================================================
    public imuToken: 'i' | 'j' = 'i';

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
}

export function noexpand_unary(func: (arg: U, $: ExtensionEnv) => U, arg: U, $: ExtensionEnv): U {
    const mode = $.getMode();
    $.setMode(MODE_FACTORING);
    try {
        return func(arg, $);
    }
    finally {
        $.setMode(mode);
    }
}

export function noexpand_binary(func: (lhs: U, rhs: U, $: ExtensionEnv) => U, lhs: U, rhs: U, $: ExtensionEnv): U {
    const mode = $.getMode();
    $.setMode(MODE_FACTORING);
    try {
        return func(lhs, rhs, $);
    }
    finally {
        $.setMode(mode);
    }
}

export function doexpand_unary(func: (arg: U, $: ExtensionEnv) => U, arg: U, $: ExtensionEnv): U {
    const mode = $.getMode();
    $.setMode(MODE_EXPANDING);
    try {
        return func(arg, $);
    }
    finally {
        $.setMode(mode);
    }
}

export function doexpand_binary(func: (lhs: U, rhs: U, $: ExtensionEnv) => U, lhs: U, rhs: U, $: ExtensionEnv): U {
    const mode = $.getMode();
    $.setMode(MODE_EXPANDING);
    try {
        return func(lhs, rhs, $);
    }
    finally {
        $.setMode(mode);
    }
}

/**
 *
 */
export class DynamicConstants {
    public static NegOne($: ExtensionEnv): Flt | Rat {
        return $.getModeFlag(evaluatingAsFloat) ? negOneAsFlt : negOne;
    }
    public static Pi($: ExtensionEnv): Sym | Flt {
        return $.getModeFlag(evaluatingAsFloat) ? piAsFlt : MATH_PI;
    }
}
