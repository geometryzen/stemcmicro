import { is_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramIOListener } from "@stemcmicro/stack";
import { is_nil, items_to_cons, U } from "@stemcmicro/tree";
import { infix_config_from_options } from "./format_infix";
import { render_as_html_infix } from "./render_as_html_infix";
import { render_svg, SvgRenderConfig } from "./render_svg";

const ASSIGN = native_sym(Native.assign);

export type ShouldAnnotateFunction = (sym: Sym, value: U) => boolean;

/**
 * This function is used by...
 *
 * PrintScriptHandler
 *
 * eval_print       (Eigenmath)
 *
 * eval_run         (Eigenmath)
 *
 * handler.spec.ts
 *
 * runscript.spec.ts
 *
 * FIXME: A possible problem with this function is that it has access to module level variables.
 * This makes it unsuitable as a pure function.
 * @param value
 * @param x
 * @param svg
 * @param options
 * @param listeners The destination for the rendering.
 * @param should_annotate_symbol A callback function that determines whether a symbol should be annotated.
 * @returns
 */
export function print_value_and_input_as_svg_or_infix(value: U, x: U, svg: boolean, env: ExprContext, options: SvgRenderConfig, listeners: ProgramIOListener[], should_annotate_symbol: ShouldAnnotateFunction): void {
    if (is_nil(value)) {
        return;
    }

    if (is_sym(x) && should_annotate_symbol(x, value)) {
        // console.lg("The result WILL be annotated.");
        value = annotate(x, value);
    } else {
        // console.lg("The result will NOT be annotated.");
    }

    if (svg) {
        for (const listener of listeners) {
            listener.output(render_svg(value, env, options));
        }
    } else {
        const config = infix_config_from_options({});
        for (const listener of listeners) {
            listener.output(render_as_html_infix(value, env, config));
        }
    }
}

function annotate(input: U, result: U): U {
    return items_to_cons(ASSIGN, input, result);
}
