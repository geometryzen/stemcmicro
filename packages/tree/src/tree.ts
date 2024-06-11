export interface Shareable {
    addRef(): void;
    release(): void;
}

/**
 * The handle for any expression in the system.
 */
export interface U extends Shareable {
    /**
     * Contains the name of the type.
     */
    readonly name: string;
    contains(needle: U): boolean;
    equals(other: U): boolean;
    get iscons(): boolean;
    get isnil(): boolean;
    pos?: number;
    end?: number;
}

export interface Atom extends U {
    readonly type: string;
}

/**
 * Determines whether a Cons expression contains a single item.
 */
export function is_singleton(expr: Cons): boolean {
    if (expr.isnil) {
        // Nope, it's the empty list.
        return false;
    }
    const cdr_expr = expr.cdr;
    if (cdr_expr.isnil) {
        return true;
    } else {
        return false;
    }
}

/**
 * Symbolic expressions are built by connecting Cons structures.
 *
 * For example, (a * b + c) is built like this:
 *
 * The car links go downwards, the cdr links go to the right.
 *
 *           _______      _______                                            _______      _______
 *          |cons   |--->|cons   |----------------------------------------->|cons   |--->|nil    |
 *          |       |    |       |                                          |       |    |       |
 *          |_______|    |_______|                                          |_______|    |_______|
 *              |            |                                                  |
 *           ___v___      ___v___      _______      _______      _______     ___v___
 *          |   +   |    |cons   |--->|cons   |--->|cons   |--->|nil    |   |   c   |
 *          |       |    |       |    |       |    |       |    |       |   |       |
 *          |_______|    |_______|    |_______|    |_______|    |_______|   |_______|
 *                           |            |            |
 *                        ___v___      ___v___      ___v___
 *                       |   *   |    |   a   |    |   b   |
 *                       |       |    |       |    |       |
 *                       |_______|    |_______|    |_______|
 *
 * A nil is a special kind of Cons in which the iscons method returns false.
 * An atom is never in the cdr position. There will be a cons with a nil cdr and a car containing the atom.
 *
 */
export class Cons implements U {
    #car: U | undefined;
    #cdr: Cons | undefined;
    #refCount = 1;
    constructor(
        car: U | undefined,
        cdr: Cons | undefined,
        public readonly pos?: number,
        public readonly end?: number
    ) {
        if (car) {
            car.addRef();
            this.#car = car;
        }
        if (cdr) {
            cdr.addRef();
            this.#cdr = cdr;
        }
    }
    #destructor(): void {
        if (this.#car) {
            this.#car.release();
            // this.#car = void 0;
        }
        if (this.#cdr) {
            this.#cdr.release();
            // this.#cdr = void 0;
        }
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount == 0) {
            this.#destructor();
        }
    }
    get name(): "Cons" | "Nil" {
        if (this.#car) {
            return "Cons";
        } else {
            return "Nil";
        }
    }
    /**
     * Returns the car property if it is defined, otherwise nil.
     * The returned item is reference counted.
     */
    get car(): U {
        if (this.#car) {
            this.#car.addRef();
            return this.#car;
        } else {
            return nil;
        }
    }
    /**
     * Returns the cdr property if it is defined, otherwise nil.
     * The returned item is reference counted.
     */
    get cdr(): Cons {
        if (this.#cdr) {
            const cdr = assert_cons_or_nil(this.#cdr);
            cdr.addRef();
            return cdr;
        } else {
            return nil;
        }
    }
    /**
     * Exactly the same as the cdr property. Used for code-as-documentation.
     * The returned item is reference counted.
     */
    get argList(): Cons {
        // The returned value is correctly reference counted because of the call through the external API.
        return this.cdr;
    }
    /**
     * An convenience for cdr.car for use with (power base expo) expressions.
     */
    get base(): U {
        const argList = this.argList;
        return argList.head;
    }
    /**
     * An convenience for cdr.cdr.car for use with (power base expo) expressions.
     */
    get expo(): U {
        return this.cdr.cdr.car;
    }
    contains(needle: U): boolean {
        if (this === needle || this.equals(needle)) {
            return true;
        }
        if (this.#car && this.#cdr) {
            return this.#car.contains(needle) || this.#cdr.contains(needle);
        }
        return false;
    }
    equals(other: U): boolean {
        if (this === other) {
            return true;
        }
        if (is_cons(other)) {
            return equal_cons_cons(this, other);
        } else if (is_atom(other)) {
            return false;
        } else if (other.isnil) {
            return this.isnil;
        } else {
            return false;
        }
    }
    get iscons(): boolean {
        if (this.#car) {
            return true;
        } else {
            return false;
        }
    }
    get isnil(): boolean {
        if (this.#car) {
            return false;
        } else {
            return true;
        }
    }
    public toString(): string {
        // If you call car or cdr you get an infinite loop because nil is a Cons.
        const head = this.#car;
        const tail = this.#cdr;
        if (head) {
            return `(${head} ${tail})`;
        } else {
            return "()";
        }
    }
    /**
     * Provides an iterator over the Cons, returning the items is the list.
     * The first element returned will be car(cons).
     * The subsequent elements are obtained from walking the cdr's.
     * Hint: Using the ... operator inside [] returns all the items in the list.
     */
    public *[Symbol.iterator]() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let u: U = this;
        while (is_cons(u)) {
            yield u.car;
            u = u.cdr;
        }
    }
    /**
     * Exactly the same as the car property. Used for code-as-documentation.
     * The returned item is reference counted.
     */
    get head(): U {
        return this.car;
    }
    /**
     * Exactly the same as the cdr property. Used for code-as-documentation.
     * The returned item is reference counted.
     */
    get rest(): Cons {
        return this.cdr;
    }
    /**
     * Return everything except the first item in the list as a JavaScript array.
     */
    tail(): U[] {
        if (this.isnil) {
            throw new Error("tail property is not allowed for the empty list.");
        } else {
            const cdr = this.#cdr;
            if (cdr && is_cons(cdr)) {
                return [...cdr];
            } else {
                return [];
            }
        }
    }
    /**
     * Maps the elements of the list using a mapping function.
     */
    map(f: (a: U) => U): Cons {
        if (this.isnil) {
            return this;
        } else {
            const a = this.car;
            const b = this.cdr;
            try {
                const car = f(a);
                const cdr = is_cons(b) ? b.map(f) : b; // in the case b is nil, no need to reference count.
                try {
                    return new Cons(car, cdr, this.pos, this.end);
                } finally {
                    car.release();
                    cdr.release();
                }
            } finally {
                a.release();
                b.release();
            }
        }
    }
    /**
     * Returns the length of the list.
     */
    get length(): number {
        if (this.isnil) {
            return 0;
        } else {
            const argList = this.argList;
            if (is_cons(argList)) {
                return argList.length + 1;
            } else {
                return 1;
            }
        }
    }
    /**
     * A convenience property for the method item(0).
     * A useful shortcut when working with operators.
     * The returned item is reference counted.
     */
    get opr(): U {
        return this.item(0);
    }
    /**
     * A convenience property for the method item(1).
     * A useful shortcut when working with unary operators.
     * The returned item is reference counted.
     */
    get arg(): U {
        return this.item(1);
    }
    /**
     * A convenience property for the method item(1).
     * A useful shortcut when working with binary operators.
     * The returned item is reference counted.
     */
    get lhs(): U {
        return this.item(1);
    }
    /**
     * A convenience property for the method item(2).
     * A useful shortcut when working with binary operators.
     * The returned item is reference counted.
     */
    get rhs(): U {
        return this.item(2);
    }
    /**
     * Returns the item at the specified (zero-based) index.
     * The returned item is reference counted.
     *
     * (item0 item1 item2 ...)
     */
    item(index: number): U {
        if (index >= 0 && !this.isnil) {
            if (index === 0) {
                return this.car;
            } else {
                const argList = this.argList;
                try {
                    if (is_cons(argList)) {
                        return argList.item(index - 1);
                    } else {
                        return nil;
                    }
                } finally {
                    argList.release();
                }
            }
        } else {
            return nil;
        }
        // throw new Error("index out of bounds.");
    }
    get item0(): U {
        return this.item(0);
    }
    get item1(): U {
        return this.item(1);
    }
    get item2(): U {
        return this.item(2);
    }
    get item3(): U {
        return this.item(3);
    }
    get item4(): U {
        return this.item(4);
    }
}

export function cons(car: U, cdr: Cons, pos?: number, end?: number): Cons {
    return new Cons(car, cdr, pos, end);
}

export function pos_end_items_to_cons(pos: number | undefined, end: number | undefined, ...items: U[]): Cons {
    if (items.length > 0) {
        let node: Cons = nil;
        node.addRef();
        // Iterate in reverse order so that we build up a nil-terminated list from the right (nil).
        for (let i = items.length - 1; i > 0; i--) {
            const temp = node;
            try {
                node = new Cons(items[i], node, void 0, void 0);
            } finally {
                temp.release();
            }
        }
        const temp = node;
        try {
            return new Cons(items[0], node, pos, end);
        } finally {
            temp.release();
        }
    } else {
        if (typeof pos === "number" || typeof end === "number") {
            return new Cons(void 0, void 0, pos, end);
        } else {
            return nil;
        }
    }
}

export function items_to_cons(...items: U[]): Cons {
    return pos_end_items_to_cons(void 0, void 0, ...items);
}

/**
 * The empty list.
 */
export const nil = new Cons(void 0, void 0, void 0, void 0);

export function is_atom(expr: U): expr is Atom {
    if (is_cons_or_nil(expr)) {
        return false;
    } else {
        // eslint-disable-next-line no-prototype-builtins
        return expr.hasOwnProperty("type");
    }
}

export function assert_atom(expr: U): Atom {
    if (is_atom(expr)) {
        return expr;
    } else {
        throw new Error();
    }
}

export function is_cons_or_nil(expr: U): expr is Cons {
    /*
    if (expr.hasOwnProperty("iscons") && expr.hasOwnProperty("isnil")) {
        return expr.iscons || expr.isnil;
    }
    else {
        return false;
    }
    */
    return expr instanceof Cons;
}

export function assert_cons_or_nil(expr: U): Cons {
    if (is_cons_or_nil(expr)) {
        return expr;
    } else {
        throw new Error();
    }
}

export function assert_cons(expr: U): Cons {
    if (is_cons(expr)) {
        return expr;
    } else {
        throw new Error();
    }
}

/**
 * Returns true if arg is a Cons and is not nil.
 * For nil testing, test for identical equality to nil.
 */
export function is_cons(expr: U): expr is Cons {
    if (is_cons_or_nil(expr)) {
        return !expr.isnil;
    } else {
        return false;
    }
}

export function assert_U(expr: U): U {
    if (is_cons_or_nil(expr) || is_atom(expr)) {
        return expr;
    } else {
        throw new Error(`${expr} ${expr.name} ${expr.iscons}`);
    }
}

/**
 *
 */
export function is_nil(expr: U): boolean {
    return expr.isnil;
}

function equal_cons_cons(lhs: Cons, rhs: Cons): boolean {
    let p1: U = lhs;
    let p2: U = rhs;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (is_cons(p1) && is_cons(p2)) {
            if (p1.car.equals(p2.car)) {
                p1 = p1.cdr;
                p2 = p2.cdr;
                continue;
            } else {
                return false;
            }
        }
        if (is_cons(p1)) {
            return false;
        }
        if (is_cons(p2)) {
            return false;
        }
        if (p1.equals(p2)) {
            // They are equal if there is nowhere else to go.
            return true;
        } else {
            return false;
        }
    }
}
