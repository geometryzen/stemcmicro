import { create_sym } from "@stemcmicro/atoms";
import { nil } from "@stemcmicro/tree";
import { get_binding } from "./eigenmath";
import { iszero } from "./iszero";
import { ProgramEnv } from "./ProgramEnv";

const TTY = create_sym("tty");

export function should_render_svg(env: ProgramEnv): boolean {
    const tty = get_binding(TTY, nil, env);
    if (tty.equals(TTY) || iszero(tty, env)) {
        return true;
    } else {
        return false;
    }
}
