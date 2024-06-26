import { Node } from "@geometryzen/esprima";
import { U } from "@stemcmicro/tree";
import { Scope } from "./Scope";

export class State {
    firstTime = true;
    done: boolean[];
    parts: U[];
    value: U;
    constructor(
        readonly node: Node,
        readonly scope: Scope
    ) {}
}
