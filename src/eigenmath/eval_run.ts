import { create_sym, is_str } from "math-expression-atoms";
import { is_nil, nil, U } from "math-expression-tree";
import { cadr } from "../tree/helpers";
import { EigenmathParseConfig, evaluate_expression, get_binding, scan_inbuf, ScriptVars, set_symbol, stopf, value_of } from "./eigenmath";
import { isimaginaryunit } from "./isimaginaryunit";
import { make_should_annotate } from "./make_should_annotate";
import { print_value_and_input_as_svg_or_infix } from "./print_value_and_input_as_svg_or_infix";
import { EmitContext } from "./render_svg";
import { should_render_svg } from "./should_eigenmath_render_svg";
/**
 * 'i'
 */
const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");
const LAST = create_sym("last");

/**
 * run("https://...")
 * @param expr 
 * @param $ 
 */
export function eval_run(expr: U, $: ScriptVars): void {

    $.stack.push(cadr(expr));
    value_of($);
    const url = $.stack.pop()!;

    if (!is_str(url))
        stopf("run: string expected");

    const f = new XMLHttpRequest();
    f.open("GET", url.str, false);
    f.onerror = function () {
        stopf("run: network error");
    };
    f.send();

    if (f.status === 404 || f.responseText.length === 0)
        stopf("run: file not found");

    const save_inbuf = $.inbuf;
    const save_trace1 = $.trace1;
    const save_trace2 = $.trace2;

    $.inbuf = f.responseText;

    let k = 0;

    for (; ;) {

        // This would have to come from an argument to run...
        const config: EigenmathParseConfig = { useCaretForExponentiation: true, useParenForTensors: true };

        k = scan_inbuf(k, $, config);

        if (k === 0)
            break; // end of input

        const input = $.stack.pop()!;
        const result = evaluate_expression(input, $);
        const ec: EmitContext = {
            useImaginaryI: isimaginaryunit(get_binding(I_LOWER, $)),
            useImaginaryJ: isimaginaryunit(get_binding(J_LOWER, $))
        };
        print_value_and_input_as_svg_or_infix(result, input, should_render_svg($), ec, $.listeners, make_should_annotate($));
        if (!is_nil(result)) {
            set_symbol(LAST, result, nil, $);
        }
    }

    $.inbuf = save_inbuf;
    $.trace1 = save_trace1;
    $.trace2 = save_trace2;

    $.stack.push(nil);
}
