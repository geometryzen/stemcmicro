import { create_sym } from "math-expression-atoms";
import { nil } from "math-expression-tree";
import { get_binding } from "./eigenmath";
import { iszero } from "./iszero";
import { ProgramEnv } from "./ProgramEnv";

const TTY = create_sym("tty");

export function should_render_svg(env: ProgramEnv): boolean {
    const tty = get_binding(TTY, nil, env);
    if (tty.equals(TTY) || iszero(tty, env)) {
        return true;
    }
    else {
        return false;
    }
}
