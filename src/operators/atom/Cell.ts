import { Atom } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";

export interface CellHost {
    reset(from: U, to: U, atom: Cell): void
    deref(value: U, atom: Cell): void
}

export class Cell extends Atom {
    #data: U = nil;
    #host: CellHost;
    #uuid: string;
    constructor(data: U, host: CellHost) {
        super("Atom");
        this.#data = data;
        this.#host = host;
        this.#uuid = `${JSON.stringify(Math.random()).substring(2)}`;
        this.#host.reset(nil, data, this);
    }
    get id(): string {
        return this.#uuid;
    }
    deref(): U {
        this.#data.addRef();
        this.#host.deref(this.#data, this);
        return this.#data;
    }
    reset(data: U): void {
        // console.lg(`${this.name} ${this.#inner} => ${to}`)
        const from = this.#data;
        this.#data = data;
        this.#data.addRef();
        this.#host.reset(from, data, this);
        from.release();
    }
    toString(): string {
        return `atom(${this.#data})`;
    }
}

export function is_atom(x: U): x is Cell {
    return x instanceof Cell;
}

export function assert_atom(x: U): Cell {
    if (is_atom(x)) {
        return x;
    }
    else {
        throw new Error(`Expecting Atom but got ${x}`);
    }
}
