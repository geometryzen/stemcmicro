import { create_sym, is_imu, is_str } from "@stemcmicro/atoms";
import { cadr, is_nil, nil, U } from "@stemcmicro/tree";
import { EigenmathParseConfig, evaluate_expression, get_binding, scan_inbuf, set_symbol, stopf, value_of } from "./eigenmath";
import { make_should_annotate } from "./make_should_annotate";
import { print_value_and_input_as_svg_or_infix } from "./print_value_and_input_as_svg_or_infix";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramIO } from "./ProgramIO";
import { ProgramStack } from "./ProgramStack";
import { SvgRenderConfig } from "./render_svg";
import { should_render_svg } from "./should_eigenmath_render_svg";
/**
 * 'i'
 */
const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");
const LAST = create_sym("last");

export function make_stack_run(io: ProgramIO) {
    /**
     * run("https://...")
     * @param expr
     * @param $
     */
    return function (expr: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
        $.push(cadr(expr));
        value_of(env, ctrl, $);
        const url = $.pop();

        if (!is_str(url)) stopf("run: string expected");

        const f = new XMLHttpRequest();
        f.open("GET", url.str, false);
        f.onerror = function () {
            stopf("run: network error");
        };
        f.send();

        if (f.status === 404 || f.responseText.length === 0) stopf("run: file not found");

        const save_inbuf = io.inbuf;
        const save_trace1 = io.trace1;
        const save_trace2 = io.trace2;

        io.inbuf = f.responseText;

        let k = 0;

        for (;;) {
            // This would have to come from an argument to run...
            const config: EigenmathParseConfig = { useCaretForExponentiation: true, useParenForTensors: true };

            k = scan_inbuf(k, env, ctrl, $, io, config);

            if (k === 0) break; // end of input

            const input = $.pop();
            const result = evaluate_expression(input, env, ctrl, $);
            const ec: SvgRenderConfig = {
                useImaginaryI: is_imu(get_binding(I_LOWER, nil, env)),
                useImaginaryJ: is_imu(get_binding(J_LOWER, nil, env))
            };
            print_value_and_input_as_svg_or_infix(result, input, should_render_svg(env), env, ctrl, ec, io.listeners, make_should_annotate(env));
            if (!is_nil(result)) {
                set_symbol(LAST, result, nil, env);
            }
        }

        io.inbuf = save_inbuf;
        io.trace1 = save_trace1;
        io.trace2 = save_trace2;

        $.push(nil);
    };
}
