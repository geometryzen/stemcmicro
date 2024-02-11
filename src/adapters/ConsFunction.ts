import { Cons } from "math-expression-tree";
import { ProgramControl } from "../eigenmath/ProgramControl";
import { ProgramEnv } from "../eigenmath/ProgramEnv";
import { ProgramStack } from "../eigenmath/ProgramStack";

export interface ConsFunction {
    (x: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void
}
