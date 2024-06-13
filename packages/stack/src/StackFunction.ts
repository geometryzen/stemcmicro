import { Cons } from "@stemcmicro/tree";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramStack } from "./ProgramStack";

export interface StackFunction {
    (expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void;
}
