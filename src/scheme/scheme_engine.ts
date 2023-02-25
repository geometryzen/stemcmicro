import { free_vars } from "../calculators/compare/free_vars";
import { create_env, EnvOptions } from "../env/env";
import { TFLAG_DIFF, TFLAG_HALT } from "../env/ExtensionEnv";
import { render_as_infix } from "../print/print";
import { render_as_latex } from "../print/render_as_latex";
import { render_as_sexpr } from "../print/render_as_sexpr";
import { transform_script, transform_tree } from "../runtime/execute";
import { execute_std_definitions } from "../runtime/init";
import { env_options_from_engine_options, env_term, init_env, ScriptEngine } from "../runtime/script_engine";
import { TreeTransformer } from "../transform/Transformer";
import { Sym } from "../tree/sym/Sym";
import { is_nil, U } from "../tree/tree";
import { parse_scheme } from "./parser";

export function createSchemeEngine(): ScriptEngine {
    let ref_count = 1;
    const envOptions: EnvOptions = env_options_from_engine_options({});
    const $ = create_env(envOptions);
    init_env($, {});
    const theEngine: ScriptEngine = {
        clearBindings(): void {
            $.clearBindings();
        },
        evaluate(tree: U): { value: U, prints: string[], errors: Error[] } {
            // This is like a fixed pipeline.
            return transform_tree(tree, $);
        },
        useStandardDefinitions(): void {
            execute_std_definitions($);
        },
        executeScript(sourceText: string): { values: U[], prints: string[], errors: Error[] } {
            const trees = parse_scheme(sourceText);
            const errors: Error[] = [];
            if (errors.length > 0) {
                return { values: [], prints: [], errors };
            }
            const values: U[] = [];
            const prints: string[] = [];
            // console.lg(`trees.length = ${trees.length}`);
            for (const tree of trees) {
                // console.lg(tree.toString());
                // console.lg(`tree = ${render_as_sexpr(tree, $)}`);
                // console.lg(`tree = ${render_as_infix(tree, $)}`);
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
        },
        freeVariables(expr: U): Sym[] {
            return free_vars(expr, $);
        },
        renderAsInfix(expr: U): string {
            return render_as_infix(expr, $);
        },
        renderAsLaTeX(expr: U): string {
            return render_as_latex(expr, $);
        },
        renderAsSExpr(expr: U): string {
            return render_as_sexpr(expr, $);
        },
        setAssocL(opr: Sym, value: boolean): void {
            $.setAssocL(opr, value);
        },
        setAssocR(opr: Sym, value: boolean): void {
            $.setAssocR(opr, value);
        },
        setSymbolToken(sym: Sym, token: string): void {
            $.setSymbolToken(sym, token);
        },
        transform(expr: U): U {
            // This suggests that we should have a transformer here.
            expr.reset(TFLAG_DIFF);
            expr.reset(TFLAG_HALT);
            // TODO
            const [, outExpr] = $.transform(expr);
            return outExpr;
        },
        transformScript(sourceText: string, transformer: TreeTransformer): { values: U[], prints: string[], errors: Error[] } {
            return transform_script(sourceText, transformer, $);
        },
        valueOf(expr: U): U {
            // What is the proposition for this API?
            return $.transform(expr)[1];
        },
        addRef(): void {
            ref_count++;
        },
        release(): void {
            ref_count--;
            if (ref_count === 0) {
                env_term($);
            }
        }
    };
    return theEngine;
}
