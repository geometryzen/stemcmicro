import { U } from "math-expression-tree";

export interface ProgramFrame {
    get length(): number;
    splice(start: number): U[];
}
