import { bake } from "../bake";
import { ExtensionEnv, PHASE_EXPANDING, PHASE_EXPLICATE, PHASE_FACTORING, PHASE_IMPLICATE, TFLAG_DIFF, TFLAG_HALT } from "../env/ExtensionEnv";
import { imu } from '../env/imu';
import { useCaretForExponentiation } from "../modes/modes";
import { is_imu } from '../operators/imu/is_imu';
import { is_rat } from "../operators/rat/is_rat";
import { subst } from '../operators/subst/subst';
import { parseScript } from '../scanner/parse_script';
import { ScanOptions } from '../scanner/scan';
import { Sym } from "../tree/sym/Sym";
import { is_nil, nil, U } from '../tree/tree';
import { AUTOEXPAND, AUTOFACTOR, BAKE, EXPLICATE, IMPLICATE, SYMBOL_I, SYMBOL_J } from './constants';
import { defs, halt, move_top_of_stack, TOS } from './defs';
import { NAME_SCRIPT_LAST } from './ns_script';

function scan_options($: ExtensionEnv): ScanOptions {
    return {
        useCaretForExponentiation: $.getModeFlag(useCaretForExponentiation)
    };
}

/**
 * Scans the sourceText into a tree expression then evaluates the expression. 
 * @param sourceText The source text to be scanned.
 * @param $ The environment that defines the operators.
 * @returns The return values, print outputs, and errors.
 */
export function execute_script(sourceText: string, $: ExtensionEnv): { values: U[], prints: string[], errors: Error[] } {
    const { trees, errors } = parseScript(sourceText, scan_options($));
    if (errors.length > 0) {
        return { values: [], prints: [], errors };
    }
    const values: U[] = [];
    const prints: string[] = [];
    // console.lg(`trees.length = ${trees.length}`);
    for (const tree of trees) {
        //  console.lg(`tree = ${render_as_infix(tree, $)}`);
        const data = transform_tree(tree, $);
        if (data.value) {
            if (!is_nil(data.value)) {
                // console.lg(`value = ${data.value}`);
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

    const value = multi_phase_transform(tree, $);

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
export function multi_phase_transform(tree: U, $: ExtensionEnv): U {

    move_top_of_stack(0);
    defs.frame = TOS;

    const stack: U[] = [];

    defs.trigmode = 0;

    // console.lg();
    // console.lg(`scanned : ${scanned}`);
    // // console.lg(`scanned : ${print_expr(scanned, $)}`);
    // console.lg(`scanned : ${print_list(scanned, $)}`);

    // $.setAssocL(MATH_ADD, true);
    // $.setAssocL(MATH_MUL, true);
    stack.push(tree);

    if (isNotDisabled(EXPLICATE, $)) {
        // // console.lg("Explicating...");
        let expr = stack.pop() as U;
        expr = explicate(expr, $);
        // // console.lg(`explicated : ${print_expr(expr, $)}`);
        stack.push(expr);
    }

    // The normal start is defs.expanding => true.
    // AUTOEXPAND, by default is unbound. i.e. only bound to it's own symbol.
    // isZero operating on Sym returns false. Therefore expanding will be true.
    // i.e. the default value of AUTOEXPAND is true!
    if (isNotDisabled(AUTOEXPAND, $)) {
        $.setFocus(PHASE_EXPANDING);
        // console.lg("Expanding...");
        stack.push(transform_with_reason(stack.pop() as U, $, 'expanding'));
    }

    if ($.canFactorize()) {
        if (isNotDisabled(AUTOFACTOR, $)) {
            $.setFocus(PHASE_FACTORING);
            // console.lg("Factoring...");
            stack.push(transform_with_reason(stack.pop() as U, $, 'factoring'));
            // console.lg(`tranned (L) : ${print_expr(stack[0], $)}`);
        }
    }

    const transformed = stack.pop() as U;
    // console.lg();
    // console.lg(`tranned : ${transformed}`);
    // console.lg(`tranned : ${print_list(transformed, $)}`);

    // TODO: Does it make sense to remove this condition?
    // We should not have to treat NIL as something special.
    if (nil !== transformed) {
        // console.lg(`tranned   : ${print_expr(transformed, $)}`);
        // It's curious that we bind SCRIPT_LAST to the transform output and not the baked output. Why?
        stack.push(transformed);
        if ($.isOne($.getBinding(BAKE))) {
            // console.lg("Baking...");
            let expr = bake(stack.pop() as U, $);
            // Hopefully a temporary fix for bake creating a non-normalized expression.
            expr = transform_with_reason(expr, $, 'bake     ');
            // console.lg(`baked     : ${print_list(expr, $)}`);
            stack.push(expr);
        }

        if ($.canImplicate()) {
            if (isNotDisabled(IMPLICATE, $)) {
                // console.lg("Implicating...");
                let expr = stack.pop() as U;
                expr = implicate(expr, $);
                // console.lg(`implicated : ${print_expr(expr, $)}`);
                stack.push(expr);
            }
        }
        post_processing(tree, stack[0], stack, $);
    }
    else {
        stack.push(nil);
    }
    store_in_script_last(stack[0], $);
    return stack.pop() as U;
}

function store_in_script_last(expr: U, $: ExtensionEnv): void {
    // console.lg(`store_in_script_last ${expr}`);
    $.setBinding(NAME_SCRIPT_LAST, expr);
}

/**
 * Runs in a loop until the output becomes stable.
 * This behavior allows top-level expressions to be transformed.
 * @param inExpr 
 * @param $ 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transform_with_reason(inExpr: U, $: ExtensionEnv, reason: 'expanding' | 'factoring' | 'explicate' | 'implicate' | 'bake     ' | 'cosmetics'): U {
    // console.lg(`Entering ${reason.toUpperCase()} ${render_as_infix(inExpr, $)}`);

    const outExpr = transform(inExpr, $);

    // console.lg(`Leaving ${reason.toUpperCase()} ${render_as_infix(outExpr, $)}`);

    return outExpr;
}

/**
 * 
 * @param expr 
 * @param $ 
 * @returns 
 */
export function transform(expr: U, $: ExtensionEnv): U {
    expr.reset(TFLAG_DIFF);
    expr.reset(TFLAG_HALT);
    const [, outExpr] = $.transform(expr);
    return outExpr;
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
    const phase = $.getFocus();
    $.setFocus(PHASE_EXPLICATE);
    try {
        return transform_with_reason(input, $, 'explicate');
    }
    finally {
        $.setFocus(phase);
    }
}

export function implicate(input: U, $: ExtensionEnv): U {
    const phase = $.getFocus();
    $.setFocus(PHASE_IMPLICATE);
    try {
        return transform_with_reason(input, $, 'implicate');
    }
    finally {
        $.setFocus(phase);
    }
}
