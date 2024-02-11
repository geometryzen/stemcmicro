import { U } from "math-expression-tree";

export interface ProgramStack {
    get length(): number;
    set length(length: number);
    concat(exprs: U[]): void;
    peek(): U;
    pop(): U;
    push(expr: U): void;
    getAt(i: number): U;
    setAt(i: number, expr: U): void;
    splice(start: number, deleteCount?: number): U[];
}