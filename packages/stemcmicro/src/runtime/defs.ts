//
// WARNING This module should not depend on anything.
// The imports below are for types only and will not create a dependency.
//
import { Flt, negOne, Rat, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { U } from "math-expression-tree";
import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { negOneAsFlt, piAsFlt } from "../tree/flt/Flt";
import { MATH_PI } from "./ns_math";

export enum PrintMode {
    /**
     * Two-dimensional rendering.
     */
    Ascii = 0,
    /**
     * Like infix but with extra whitespace and may have multiplication operators removed.
     */
    Human = 1,
    /**
     * Infix is how we normally write math but whitespace is removed and may be parsed by a computer.
     */
    Infix = 2,
    /**
     * MathJax compatible.
     */
    LaTeX = 3,
    /**
     * Symbolic Expression is LISP-like.
     */
    SExpr = 4,
    EcmaScript = 5
}

export class Defs {
    constructor() {
        // Nothing to see here yet.
    }

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

export function noexpand_unary<T extends keyof ExtensionEnv>(func: (arg: U, $: Pick<ExtensionEnv, T | "pushDirective" | "popDirective">) => U, arg: U, $: Pick<ExtensionEnv, T | "pushDirective" | "popDirective">): U {
    $.pushDirective(Directive.expanding, 0);
    try {
        return func(arg, $);
    } finally {
        $.popDirective();
    }
}

export function noexpand_binary<T extends keyof ExtensionEnv>(func: (lhs: U, rhs: U, $: Pick<ExtensionEnv, T | "pushDirective" | "popDirective">) => U, lhs: U, rhs: U, $: Pick<ExtensionEnv, T | "pushDirective" | "popDirective">): U {
    $.pushDirective(Directive.expanding, 0);
    try {
        return func(lhs, rhs, $);
    } finally {
        $.popDirective();
    }
}

export function doexpand_unary<T extends keyof ExtensionEnv>(func: (arg: U, $: Pick<ExtensionEnv, T | "pushDirective" | "popDirective">) => U, arg: U, $: Pick<ExtensionEnv, T | "pushDirective" | "popDirective">): U {
    $.pushDirective(Directive.expanding, 1);
    try {
        return func(arg, $);
    } finally {
        $.popDirective();
    }
}

export function doexpand_binary<T extends keyof ExprContext>(func: (lhs: U, rhs: U, $: Pick<ExprContext, T | "pushDirective" | "popDirective">) => U, lhs: U, rhs: U, $: Pick<ExprContext, T | "pushDirective" | "popDirective">): U {
    $.pushDirective(Directive.expanding, 1);
    try {
        return func(lhs, rhs, $);
    } finally {
        $.popDirective();
    }
}

/**
 *
 */
export class DynamicConstants {
    public static NegOne($: Pick<ExprContext, "getDirective">): Flt | Rat {
        return $.getDirective(Directive.evaluatingAsFloat) ? negOneAsFlt : negOne;
    }
    public static PI($: Pick<ExprContext, "getDirective">): Sym | Flt {
        return $.getDirective(Directive.evaluatingAsFloat) ? piAsFlt : MATH_PI;
    }
}
