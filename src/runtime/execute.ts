import { bake } from "../bake";
import { ExtensionEnv, MODE_EXPANDING, TFLAG_DIFF, TFLAG_HALT } from "../env/ExtensionEnv";
import { imu } from '../env/imu';
import { useCaretForExponentiation } from "../modes/modes";
import { is_imu } from '../operators/imu/is_imu';
import { is_rat } from "../operators/rat/is_rat";
import { subst } from '../operators/subst/subst';
import { parse_script } from '../scanner/parse_script';
import { ScanOptions } from '../scanner/scan';
import { TreeTransformer } from '../transform/Transformer';
import { Sym } from "../tree/sym/Sym";
import { is_nil, nil, U } from '../tree/tree';
import { Box } from "./Box";
import { AUTOEXPAND, BAKE, SYMBOL_I, SYMBOL_J } from './constants';
import { DefaultPrintHandler } from "./DefaultPrintHandler";
import { defs, move_top_of_stack } from './defs';
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
    const { trees, errors } = parse_script(sourceText, scan_options($));
    if (errors.length > 0) {
        return { values: [], prints: [], errors };
    }
    const values: U[] = [];
    const prints: string[] = [];
    // console.lg(`trees.length = ${trees.length}`);
    for (const tree of trees) {
        // console.lg("tree", render_as_sexpr(tree, $));
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

export function transform_script(sourceText: string, transformer: TreeTransformer, $: ExtensionEnv): { values: U[], prints: string[], errors: Error[] } {
    const { trees, errors } = parse_script(sourceText, scan_options($));
    if (errors.length > 0) {
        return { values: [], prints: [], errors };
    }
    const values: U[] = [];
    const prints: string[] = [];
    // console.lg(`trees.length = ${trees.length}`);
    for (const tree of trees) {
        // console.lg(`tree = ${render_as_sexpr(tree, $)}`);
        values.push(transformer.transform(tree, $));
        // prints must be collected by setting a PrintHandler.
        // errors must be collected from exceptions?
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
    /**
     * errors aren't currently provided but could be if we caught exceptions. 
     */
    const errors: Error[] = [];

    const originalPrintHandler = $.getPrintHandler();
    const printHandler = new DefaultPrintHandler();
    $.setPrintHandler(printHandler);
    try {
        const value = multi_phase_transform(tree, $);

        prints.push(...printHandler.prints);

        return { value, prints, errors };
    }
    finally {
        $.setPrintHandler(originalPrintHandler);
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
 * This should not be needed when we can define our own transformer pipelines.
 */
export function multi_phase_transform(tree: U, $: ExtensionEnv): U {

    move_top_of_stack(0);

    const box = new Box(tree);

    defs.trigmode = 0;

    // AUTOEXPAND, by default is unbound. i.e. only bound to it's own symbol.
    // isZero operating on Sym returns false. Therefore expanding will be true.
    // i.e. the default value of AUTOEXPAND is true!
    if (isNotDisabled(AUTOEXPAND, $)) {
        const mode = $.getMode();
        try {
            $.setMode(MODE_EXPANDING);
            // console.lg("Expanding...");
            box.push(transform_with_reason(box.pop(), $, 'expanding'));
        }
        finally {
            $.setMode(mode);
        }
    }

    const transformed = box.pop();
    // console.lg();
    // console.lg(`tranned : ${transformed}`);
    // console.lg(`tranned : ${print_list(transformed, $)}`);

    // TODO: Does it make sense to remove this condition?
    // We should not have to treat NIL as something special.
    if (nil !== transformed) {
        // console.lg(`tranned   : ${print_expr(transformed, $)}`);
        // It's curious that we bind SCRIPT_LAST to the transform output and not the baked output. Why?
        box.push(transformed);
        if ($.isOne($.getBinding(BAKE))) {
            // console.lg("Baking...");
            let expr = bake(box.pop(), $);
            // Hopefully a temporary fix for bake creating a non-normalized expression.
            expr = transform_with_reason(expr, $, 'bake     ');
            // console.lg(`baked     : ${print_list(expr, $)}`);
            box.push(expr);
        }

        post_processing_complex_numbers(tree, box.peek(), box, $);
    }
    else {
        box.push(nil);
    }
    store_in_script_last(box.peek(), $);
    return box.pop();
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
function transform_with_reason(inExpr: U, $: ExtensionEnv, reason: 'expanding' | 'factoring' | 'explicate' | 'bake     ' | 'cosmetics'): U {
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
 * Determines how instances of sqrt(-1) are represented.
 * @param input The parse tree.
 * @param output May be the result of Eval() or the out_tree after it has been bake(d).
 * @param $ The extension environment.
 */
function post_processing_complex_numbers(input: U, output: U, box: Box<U>, $: ExtensionEnv): void {
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
            const A = box.pop();
            const B = subst(A, imu, sym, $);
            box.push(B);
            return;
        }
    }
}
