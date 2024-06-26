import { Stack } from "@stemcmicro/stack";
import { State } from "./State";

export type StepFunction = (stack: Stack<State>, state: State) => State | null;
