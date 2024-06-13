import { Shareable, U } from "@stemcmicro/tree";

export interface ProgramStack extends Shareable {
    get length(): number;
    set length(length: number);
    concat(exprs: U[]): void;
    get isatom(): boolean;
    get iscons(): boolean;
    get istrue(): boolean;
    /**
     * [... , a, b] => [..., (a, b)]
     *
     * b must be cons or nil.
     */
    cons(): void;
    dupl(): void;
    peek(): U;
    /**
     * [..., expr] => [...]
     */
    pop(): U;
    /**
     * [...] => [..., expr]
     */
    push(expr: U): void;
    /**
     * [... , (head, rest)] => [..., head]
     */
    head(): void;
    /**
     * [... , (head, rest)] => [..., rest]
     */
    rest(): void;
    rotateL(n: number): void;
    rotateR(n: number): void;
    swap(): void;
    getAt(i: number): U;
    setAt(i: number, expr: U): void;
    splice(start: number, deleteCount?: number): U[];
}
