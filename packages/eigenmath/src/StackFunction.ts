import { ProgramStack } from "@stemcmicro/stack";
import { Cons } from "@stemcmicro/tree";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";

export interface StackFunction {
    (x: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void;
}
