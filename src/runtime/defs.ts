//
// WARNING This module should not depend on anything.
// The imports below are for types only and will not create a dependency.
//
import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { Flt, negOneAsFlt, piAsFlt } from "../tree/flt/Flt";
import { negOne, Rat } from "../tree/rat/Rat";
import { Sym } from "../tree/sym/Sym";
import { U } from "../tree/tree";
import { MATH_PI } from "./ns_math";

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
     * The (default) PrintMode when using the (print ...) expression or print keyword.
     */
    private $printMode: PrintMode = PRINTMODE_INFIX;
    constructor() {
        // Nothing to see here yet.
    }

    public recursionLevelNestedRadicalsRemoval = 0;

    public symbolsDependencies: { [key: string]: string[] } = {};

    public symbolsHavingReassignments: string[] = [];
    public symbolsInExpressionsWithoutAssignments: string[] = [];

    /**
     * top of stack
     */
    public tos = 0;

    /**
     * The program execution stack.
     * TODO: This should be moved to the $ to achieve isolation of executions.
     * It should also not allow undefined and null values as this requires casting elsewhere.
     * Encapsulation with assertion may help. 
     */
    public stack: (U | undefined | null)[] = [];

    /**
     * Causes the print output to render JavaScript.
     */
    public codeGen = false;
    public userSimplificationsInListForm: U[] = [];
    public userSimplificationsInStringForm: string[] = [];

    get printMode(): PrintMode {
        return this.$printMode;
    }
    setPrintMode(printMode: PrintMode) {
        this.$printMode = printMode;
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
    move_top_of_stack(0);
    throw new Error(`Stop: ${s}`);
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

export function noexpand_unary(func: (arg: U, $: ExtensionEnv) => U, arg: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.expanding, false);
    try {
        return func(arg, $);
    }
    finally {
        $.popDirective();
    }
}

export function noexpand_binary(func: (lhs: U, rhs: U, $: ExtensionEnv) => U, lhs: U, rhs: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.expanding, false);
    try {
        return func(lhs, rhs, $);
    }
    finally {
        $.popDirective();
    }
}

export function doexpand_unary(func: (arg: U, $: ExtensionEnv) => U, arg: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.expanding, true);
    try {
        return func(arg, $);
    }
    finally {
        $.popDirective();
    }
}

export function doexpand_binary(func: (lhs: U, rhs: U, $: ExtensionEnv) => U, lhs: U, rhs: U, $: ExtensionEnv): U {
    $.pushDirective(Directive.expanding, true);
    try {
        return func(lhs, rhs, $);
    }
    finally {
        $.popDirective();
    }
}

/**
 *
 */
export class DynamicConstants {
    public static NegOne($: ExtensionEnv): Flt | Rat {
        return $.getDirective(Directive.evaluatingAsFloat) ? negOneAsFlt : negOne;
    }
    public static Pi($: ExtensionEnv): Sym | Flt {
        return $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : MATH_PI;
    }
}
