import { create_sym, is_imu } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { ProgramIO, ProgramStack } from "@stemcmicro/stack";
import { car, cdr, is_cons, nil, U } from "@stemcmicro/tree";
import { get_binding, value_of } from "./eigenmath";
import { make_should_annotate } from "./make_should_annotate";
import { print_value_and_input_as_svg_or_infix } from "./print_value_and_input_as_svg_or_infix";
import { SvgRenderConfig } from "./render_svg";
import { should_render_svg } from "./should_eigenmath_render_svg";

const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");

export function make_stack_print(io: ProgramIO) {
    return function (p1: U, env: ExprContext, _: ProgramStack): void {
        p1 = cdr(p1);
        while (is_cons(p1)) {
            _.push(car(p1));
            _.push(car(p1));
            value_of(env, _);
            const result = _.pop();
            const input = _.pop();
            const ec: SvgRenderConfig = {
                useImaginaryI: is_imu(get_binding(I_LOWER, nil, env)),
                useImaginaryJ: is_imu(get_binding(J_LOWER, nil, env))
            };
            print_value_and_input_as_svg_or_infix(result, input, should_render_svg(env), env, ec, io.listeners, make_should_annotate(env));
            p1 = cdr(p1);
        }
        _.push(nil);
    };
}
