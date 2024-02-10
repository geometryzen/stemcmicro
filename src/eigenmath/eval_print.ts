import { create_sym } from "math-expression-atoms";
import { car, cdr, is_cons, nil, U } from "math-expression-tree";
import { is_imu } from "../operators/imu/is_imu";
import { get_binding, value_of } from "./eigenmath";
import { make_should_annotate } from "./make_should_annotate";
import { print_value_and_input_as_svg_or_infix } from "./print_value_and_input_as_svg_or_infix";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramIO } from "./ProgramIO";
import { ProgramStack } from "./ProgramStack";
import { SvgRenderConfig } from "./render_svg";
import { should_render_svg } from "./should_eigenmath_render_svg";

const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");

export function make_eval_print(io: ProgramIO) {
    return function (p1: U, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
        p1 = cdr(p1);
        while (is_cons(p1)) {
            $.push(car(p1));
            $.push(car(p1));
            value_of(env, ctrl, $);
            const result = $.pop();
            const input = $.pop();
            const ec: SvgRenderConfig = {
                useImaginaryI: is_imu(get_binding(I_LOWER, env)),
                useImaginaryJ: is_imu(get_binding(J_LOWER, env))
            };
            print_value_and_input_as_svg_or_infix(result, input, should_render_svg(env), ec, io.listeners, make_should_annotate(env));
            p1 = cdr(p1);
        }
        $.push(nil);
    };
}
