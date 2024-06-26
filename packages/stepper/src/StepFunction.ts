import { Stack } from "@stemcmicro/stack";
import { Cons } from "@stemcmicro/tree";
import { State } from "./Stepper";

export type StepFunction = (node: Cons, stack: Stack<State>, state: State) => State | undefined;
