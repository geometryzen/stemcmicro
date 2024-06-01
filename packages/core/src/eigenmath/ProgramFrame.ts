import { U } from "@stemcmicro/tree";

export interface ProgramFrame {
    get length(): number;
    splice(start: number): U[];
}
