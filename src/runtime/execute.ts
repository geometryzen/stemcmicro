import { bake } from "../bake";
import { ExtensionEnv, PHASE_COSMETICS, PHASE_EXPANDING, PHASE_EXPLICATE, PHASE_FACTORING, PHASE_IMPLICATE } from "../env/ExtensionEnv";
import { imu } from '../env/imu';
import { is_imu } from '../predicates/is_imu';
import { create_source_trees } from '../scanner/create_source_tree';
import { ScanOptions } from '../scanner/scan';
import { subst } from '../subst';
import { is_rat } from "../tree/rat/is_rat";
import { Sym } from "../tree/sym/Sym";
import { is_nil, NIL, U } from '../tree/tree';
import { AUTOEXPAND, AUTOFACTOR, BAKE, EXPLICATE, IMPLICATE, PRETTYFMT, SYMBOL_I, SYMBOL_J } from './constants';
import { defs, halt, TOS } from './defs';
import { NAME_SCRIPT_LAST } from './ns_script';

function scan_options($: ExtensionEnv): ScanOptions {
    return {
        useCaretForExponentiation: $.useCaretForExponentiation
    };
}

/**
 * Scans the sourceText into a tree expression then evaluates the expression. 
 * @param sourceText The source text to be scanned.
 * @param $ The environment that defines the operators.
 * @returns The return values, print outputs, and errors.
 */
export function execute_script(sourceText: string, $: ExtensionEnv): { values: U[], prints: string[], errors: Error[] } {
    const { trees, errors } = create_source_trees(sourceText, scan_options($));
    if (errors.length > 0) {
        return { values: [], prints: [], errors };
    }
    const values: U[] = [];
    const prints: string[] = [];
    // console.lg(`trees.length = ${trees.length}`);
    for (const tree of trees) {
        const data = transform_tree(tree, $);
        if (data.value) {
            if (!is_nil(data.value)) {
                // console.lg(`value = ${value}`);
                values.push(data.value);
            }
        }
        for (const p of data.prints) {
            prints.push(p);
        }
        for (const e of data.errors) {
            errors.push(e);
        }
    }
    return { values, prints, errors };
}

/**
 * Evaluates the parse tree using the operators defined in the environment.
 * @param tree The parse tree.
 * @param $ The environment defining the operators.
 * @returns The return values (zero or one), print outputs, and errors.
 */
export function transform_tree(tree: U, $: ExtensionEnv): { value: U, prints: string[], errors: Error[] } {
    /**
     * The outputs from print satements for each pass of the scanner.
     */
    const prints: string[] = [];
    const errors: Error[] = [];

    defs.prints.length = 0;

    const value = top_level_transform(tree, $);
    // const value = top_level_basic_transform(tree, $);

    prints.push(...defs.prints);

    return { value, prints, errors };
}

export function check_stack() {
    if (defs.tos !== 0) {
        halt('stack error');
    }
    if (defs.frame !== TOS) {
        halt(`frame error defs.frame = ${defs.frame} TOS = ${TOS}`);
    }
    if (defs.chainOfUserSymbolsNotFunctionsBeingEvaluated.length !== 0) {
        halt('symbols evaluation still ongoing?');
    }
    if (defs.evaluatingAsFloats) {
        halt('numeric evaluation still ongoing?');
    }
    if (defs.evaluatingPolar) {
        halt('evaluation of polar still ongoing?');
    }
}

/**
 * 
 */
function isNotDisabled(sym: Sym, $: ExtensionEnv): boolean {
    const binding = $.getBinding(sym);
    if (is_nil(binding)) {
        return true;
    }
    if (is_rat(binding)) {
        return !binding.isZero();
    }
    return true;
}

/**
 *
 */
export function top_level_transform(scanned: U, $: ExtensionEnv): U {

    const stack: U[] = [];

    defs.trigmode = 0;

    // console.lg();
    // console.lg(`scanned : ${scanned}`);
    // console.log(`scanned : ${print_expr(scanned, $)}`);
    // console.lg(`scanned : ${print_list(scanned, $)}`);

    // $.setAssocL(MATH_ADD, true);
    // $.setAssocL(MATH_MUL, true);
    stack.push(scanned);

    if (isNotDisabled(EXPLICATE, $)) {
        // console.log("Explicating...");
        let expr = stack.pop() as U;
        expr = explicate(expr, $);
        // console.log(`explicated : ${print_expr(expr, $)}`);
        stack.push(expr);
    }

    // The normal start is defs.expanding => true.
    // AUTOEXPAND, by default is unbound. i.e. only bound to it's own symbol.
    // isZero operating on Sym returns false. Therefore expanding will be true.
    // i.e. the default value of AUTOEXPAND is true!
    if (isNotDisabled(AUTOEXPAND, $)) {
        $.setPhase(PHASE_EXPANDING);
        // console.lg("Expanding...");
        stack.push(transform(stack.pop() as U, $));
    }

    if (isNotDisabled(AUTOFACTOR, $)) {
        $.setPhase(PHASE_FACTORING);
        // console.lg("Factoring...");
        stack.push(transform(stack.pop() as U, $));
        // console.lg(`tranned (L) : ${print_expr(stack[0], $)}`);
    }

    const transformed = stack.pop() as U;
    // console.lg();
    // console.lg(`tranned : ${transformed}`);
    // console.lg(`tranned : ${print_list(transformed, $)}`);

    // TODO: Does it make sense to remove this condition?
    // We should not have to treat NIL as something special.
    if (NIL !== transformed) {
        // console.lg(`tranned   : ${print_expr(transformed, $)}`);
        // It's curious that we bind SCRIPT_LAST to the transform output and not the baked output. Why?
        stack.push(transformed);
        if ($.isOne($.getBinding(BAKE))) {
            // console.lg("Baking...");
            let expr = bake(stack.pop() as U, $);
            // Hopefully a temporary fix for bake creating a non-normalized expression.
            expr = transform(expr, $);
            // console.lg(`baked     : ${print_list(expr, $)}`);
            stack.push(expr);
        }

        if (isNotDisabled(PRETTYFMT, $)) {
            // console.lg("Prettying...");
            const expr = prettyfmt(stack.pop() as U, $);
            // console.lg(`prettyfmt : ${print_expr(expr, $)}`);
            stack.push(expr);
        }

        if (isNotDisabled(IMPLICATE, $)) {
            // console.lg("Implicating...");
            let expr = stack.pop() as U;
            expr = implicate(expr, $);
            // console.lg(`implicated : ${print_expr(expr, $)}`);
            stack.push(expr);
        }
        post_processing(scanned, stack[0], stack, $);
    }
    else {
        stack.push(NIL);
    }
    store_in_script_last(stack[0], $);
    return stack.pop() as U;
}

export function top_level_basic_transform(input: U, $: ExtensionEnv): U {
    const output = transform(input, $);
    store_in_script_last(output, $);
    return output;
}

function store_in_script_last(expr: U, $: ExtensionEnv): void {
    // console.lg(`store_in_script_last ${expr}`);
    $.setBinding(NAME_SCRIPT_LAST, expr);
}

/**
 * Runs in a loop until the output becomes stable.
 * This behavior allows top-level expressions to be transformed.
 * @param input 
 * @param $ 
 * @returns 
 */
function transform(input: U, $: ExtensionEnv): U {
    // console.lg(`transform ${input}`);
    const MAX_LOOPS = 10;
    const seens: U[] = [];
    let inExpr: U = input;
    let done = false;
    let loops = 0;
    while (!done) {
        const outExpr = $.valueOf(inExpr);
        loops++;
        const is_stable = $.equals(outExpr, inExpr);
        if (is_stable) {
            done = true;
        }
        else {
            const seenIndex = seens.findIndex(function (seen) {
                return equals_tree_tree(outExpr, seen, $);
            });
            if (seenIndex >= 0) {
                throw new Error(`looping back to expression at index ${seenIndex}`);
            }
            else {
                if (loops > MAX_LOOPS) {
                    throw new Error(`Exceeded MAX_LOOPS ${MAX_LOOPS}`);
                }
            }
        }
        inExpr = outExpr;
        seens.push(inExpr);
    }
    const output = inExpr;
    return output;
}

/**
 * Determines whether two trees are the same.
 * Also detects when two trees are reported
 * @param lhs 
 * @param rhs 
 * @param $ 
 * @returns 
 */
function equals_tree_tree(lhs: U, rhs: U, $: ExtensionEnv): boolean {
    if ($.equals(lhs, rhs)) {
        return true;
    }
    else {
        // return false;
        // pow_sym_rat(e, 5) and exp_rat(5) are printed the same, exp(5).
        const str_lhs = `${lhs}`;
        const str_rhs = `${rhs}`;
        if (str_lhs === str_rhs) {
            throw new Error(`toString(lhs) = ${str_lhs} and toString(rhs) = ${str_rhs} are the same but $.equals(lhs, rhs) reports false. lhs = ${lhs} rhs = ${rhs}`);
        }
    }
    return false;
}

/**
 * 
 * @param input The parse tree.
 * @param output May be the result of Eval() or the out_tree after it has been bake(d).
 * @param $ The extension environment.
 */
function post_processing(input: U, output: U, stack: U[], $: ExtensionEnv): void {
    // If user asked explicitly asked to evaluate "i" or "j" and
    // they represent the imaginary unit (-1)^(1/2), then
    // show (-1)^(1/2).
    const userWantsToEvaluateIorJ = SYMBOL_I.equals(input) || SYMBOL_J.equals(input);
    if (userWantsToEvaluateIorJ && is_imu(output)) {
        // Do nothing.
        return;
    }
    // In all other cases, replace all instances of (-1)^(1/2) in the result
    // with the symbol "i" or "j" depending on which one
    // represents the imaginary unit
    const entries = $.getBindings();
    for (const entry of entries) {
        const sym = entry.sym;
        const binding = entry.binding;
        if (binding && is_imu(binding)) {
            const A = stack.pop() as U;
            const B = subst(A, imu, sym, $);
            stack.push(B);
            return;
        }
    }
}

function explicate(input: U, $: ExtensionEnv): U {
    const phase = $.getPhase();
    $.setPhase(PHASE_EXPLICATE);
    try {
        return transform(input, $);
    }
    finally {
        $.setPhase(phase);
    }
}

function implicate(input: U, $: ExtensionEnv): U {
    const phase = $.getPhase();
    $.setPhase(PHASE_IMPLICATE);
    try {
        return transform(input, $);
    }
    finally {
        $.setPhase(phase);
    }
}

function prettyfmt(input: U, $: ExtensionEnv): U {
    const phase = $.getPhase();
    $.setPhase(PHASE_COSMETICS);
    try {
        return transform(input, $);
    }
    finally {
        $.setPhase(phase);
    }
}
