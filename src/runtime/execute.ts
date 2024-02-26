import { imu, is_imu, is_sym, Sym } from 'math-expression-atoms';
import { Native, native_sym } from "math-expression-native";
import { Cons, is_cons, is_nil, items_to_cons, nil, U } from 'math-expression-tree';
import { ScanOptions } from '../algebrite/scan';
import { eval_bake } from "../bake";
import { Directive, directive_from_flag, ExtensionEnv, flag_from_directive } from "../env/ExtensionEnv";
import { subst } from '../operators/subst/subst';
import { delegate_parse_script } from "../parser/parser";
import { TreeTransformer } from '../transform/Transformer';
import { Box } from "./Box";
import { BAKE, SYMBOL_I, SYMBOL_J } from './constants';
import { DefaultPrintHandler } from "./DefaultPrintHandler";
import { move_top_of_stack } from './defs';
import { RESERVED_KEYWORD_LAST } from './ns_script';
import { ExprTransformOptions, ScriptExecuteOptions } from "./script_engine";

const CIRCEXP = native_sym(Native.circexp);
const CLOCK = native_sym(Native.clock);
const EXPAND = native_sym(Native.expand);
const FACTOR = native_sym(Native.factor);
const POLAR = native_sym(Native.polar);
const RATIONALIZE = native_sym(Native.rationalize);
const RECT = native_sym(Native.rect);

function scan_options($: ExtensionEnv): ScanOptions {
    return {
        useCaretForExponentiation: flag_from_directive($.getDirective(Directive.useCaretForExponentiation)),
        useParenForTensors: flag_from_directive($.getDirective(Directive.useParenForTensors)),
        explicitAssocAdd: false,
        explicitAssocMul: false,
        explicitAssocExt: false
    };
}

/**
 * Scans the sourceText into a tree expression then evaluates the expression.
 * @param sourceText The source text to be scanned.
 * @param options scan_options($)
 * @param $ The environment that defines the operators.
 * @returns The return values, print outputs, and errors.
 */
export function execute_script(sourceText: string, options: ScriptExecuteOptions, $: ExtensionEnv): { values: U[], prints: string[], errors: Error[] } {
    // console.lg("execute_script", JSON.stringify(sourceText), JSON.stringify(options));
    const { trees, errors } = delegate_parse_script(sourceText, options);
    if (errors.length > 0) {
        return { values: [], prints: [], errors };
    }
    const values: U[] = [];
    const prints: string[] = [];
    // console.lg(`trees.length = ${trees.length}`);
    // console.lg("catchExceptions", options.catchExceptions);
    if (options.catchExceptions) {
        try {
            transform_trees(trees, values, prints, errors, options, $);
        }
        catch (e) {
            if (e instanceof Error) {
                errors.push(e);
            }
            else {
                errors.push(new Error(`${e}`));
            }
        }
    }
    else {
        transform_trees(trees, values, prints, errors, options, $);
    }
    return { values, prints, errors };
}

function transform_trees(trees: U[], values: U[], prints: string[], errors: Error[], options: ExprTransformOptions, $: ExtensionEnv) {
    // console.lg("transform_trees", JSON.stringify(options));
    for (const tree of trees) {
        // console.lg("tree", render_as_sexpr(tree, $));
        // console.lg("tree", $.toInfixString(tree));
        const data = transform_tree(tree, options, $);
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
}

export function transform_script(fileName: string, sourceText: string, transformer: TreeTransformer, $: ExtensionEnv): { values: U[], prints: string[], errors: Error[] } {
    const { trees, errors } = delegate_parse_script(sourceText, scan_options($));
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
 * @param options The opti
 * @param $ The environment defining the operators.
 * @returns The return values (zero or one), print outputs, and errors.
 */
export function transform_tree(tree: U, options: ExprTransformOptions, $: ExtensionEnv): { value: U, prints: string[], errors: Error[] } {
    // console.lg("transform_tree", "tree", `${tree}`, JSON.stringify(options));
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
        const value = multi_pass_transform(tree, options, $);

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
/*
function isNotDisabled(sym: Sym, $: ExtensionEnv): boolean {
    const binding = $.getSymbolValue(sym);
    if (is_nil(binding)) {
        return true;
    }
    if (is_rat(binding)) {
        return !binding.isZero();
    }
    return true;
}
*/
/**
 * This should not be needed when we can define our own transformer pipelines.
 */
export function multi_pass_transform(tree: U, options: ExprTransformOptions, $: ExtensionEnv,): U {
    // console.lg("multi_pass_transform", JSON.stringify(options));
    $.pushDirective(Directive.useIntegersForPredicates, directive_from_flag(options.useIntegersForPredicates));
    try {
        const wrappers: Sym[] = detect_wrappers(tree);
        wrappers.reverse();

        tree = remove_wrappers(tree);

        move_top_of_stack(0);

        const box = new Box(tree);

        if (options.autoExpand) {
            $.pushDirective(Directive.expanding, 1);
            try {
                box.push(transform(apply_wrappers(box.pop(), wrappers), $));
            }
            finally {
                $.popDirective();
            }
        }
        else {
            box.push(transform(apply_wrappers(box.pop(), wrappers), $));
        }

        if (options.autoFactor) {
            $.pushDirective(Directive.factoring, 1);
            try {
                box.push(transform(apply_wrappers(box.pop(), wrappers), $));
            }
            finally {
                $.popDirective();
            }
        }

        const transformed = box.pop();
        // TODO: Does it make sense to remove this condition?
        // We should not have to treat NIL as something special.
        if (nil !== transformed) {
            // It's curious that we bind SCRIPT_LAST to the transform output and not the baked output. Why?
            box.push(transformed);
            if ($.hasBinding(BAKE, nil) && $.isone($.getBinding(BAKE, nil))) {
                // console.lg("Baking...");
                let expr = eval_bake(box.pop(), $);
                // Hopefully a temporary fix for bake creating a non-normalized expression.
                expr = transform(expr, $);
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
    finally {
        $.popDirective();
    }
}

/**
 * FIXME: This only needs to detect the topmost wrapper in order to preserve the output in a multipass transformation.
 */
function detect_wrappers(tree: U): Sym[] {
    const wrappers: Sym[] = [];
    if (is_cons(tree)) {
        let expr: Cons = tree;
        while (is_cons(expr)) {
            const opr = expr.opr;
            if (is_sym(opr)) {
                if (is_wrapper_opr(opr)) {
                    wrappers.push(opr);
                    const innerExpr = expr.argList.head;
                    if (is_cons(innerExpr)) {
                        expr = innerExpr;
                        continue;
                    }
                }
            }
            break;
        }
    }
    return wrappers;
}

function remove_wrappers(tree: U): U {
    if (is_cons(tree)) {
        let expr: Cons = tree;
        while (is_cons(expr)) {
            const opr = expr.opr;
            if (is_sym(opr)) {
                if (is_wrapper_opr(opr)) {
                    const innerExpr = expr.argList.head;
                    if (is_cons(innerExpr)) {
                        expr = innerExpr;
                        continue;
                    }
                }
            }
            break;
        }
        return expr;
    }
    else {
        return tree;
    }
}

function is_wrapper_opr(sym: Sym): boolean {
    if (CIRCEXP.equalsSym(sym)) {
        return true;
    }
    else if (CLOCK.equalsSym(sym)) {
        return true;
    }
    else if (EXPAND.equalsSym(sym)) {
        return true;
    }
    else if (FACTOR.equalsSym(sym)) {
        return true;
    }
    else if (POLAR.equalsSym(sym)) {
        return true;
    }
    else if (RATIONALIZE.equalsSym(sym)) {
        return true;
    }
    else if (RECT.equalsSym(sym)) {
        return true;
    }
    else {
        return false;
    }
}

function apply_wrappers(tree: U, wrappers: Sym[]): U {
    let expr = tree;
    for (const wrapper of wrappers) {
        expr = items_to_cons(wrapper, expr);
    }
    return expr;
}


function store_in_script_last(expr: U, $: ExtensionEnv): void {
    // This feels like a bit of a hack.
    if (!is_nil(expr)) {
        // console.lg(`store_in_script_last ${render_as_human(expr, $)}`);
        $.setBinding(RESERVED_KEYWORD_LAST, expr);
    }
}

/**
 * 
 * @param expr 
 * @param $ 
 * @returns 
 */
export function transform(expr: U, $: ExtensionEnv): U {
    const [, outExpr] = $.transform(expr);
    return outExpr;
}

/**
 * Determines how instances of sqrt(-1) are represented.
 * @param input The parse tree.
 * @param output May be the result of Eval() or the out_tree after it has been bake(d).
 * @param $ The extension environment.
 */
function post_processing_complex_numbers(input: U, output: U, box: Box, $: ExtensionEnv): void {
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
    const entries = $.getSymbolsInfo();
    for (const entry of entries) {
        const sym = entry.sym;
        const value = entry.value;
        if (is_imu(value)) {
            const A = box.pop();
            const B = subst(A, imu, sym, $);
            box.push(B);
            return;
        }
    }
}
