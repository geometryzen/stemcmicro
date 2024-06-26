export class Stack<T> {
    tos = 0;
    readonly #elements: T[] = [];
    constructor(elements: T[] = []) {
        this.#elements = elements;
        this.tos = elements.length;
    }
    get elements(): T[] {
        return this.#elements;
    }
    get length(): number {
        return this.#elements.length;
    }
    set length(length: number) {
        this.#elements.length = length;
    }
    /**
     * Returns the entry at the top of the stack.
     */
    get top(): T {
        if (this.#elements.length > 0) {
            return this.#elements[this.#elements.length - 1];
        } else {
            throw new Error();
        }
    }
    getAt(i: number): T {
        return this.#elements[i];
    }
    setAt(i: number, element: T): void {
        this.#elements[i] = element;
    }
    peek(offset = 0): T {
        return this.#elements[this.#elements.length - 1 - offset];
    }
    push(element: T): void {
        this.tos++;
        this.#elements.push(element);
    }
    pushItems(items: T[]): void {
        while (items.length > 0) {
            this.push(items.shift() as T);
        }
    }
    pop(): T {
        this.tos--;
        const element = this.#elements.pop();
        if (element) {
            return element;
        } else {
            throw new Error();
        }
    }
    popItems(n: number): T[] {
        const items: T[] = [];
        for (let i = 0; i < n; i++) {
            items.push(this.pop());
        }
        return items;
    }
    /**
     * [a,b,c,d,e] => [a,b,d,e,c] (n=3)
     */
    rotateL(n: number): void {
        const temp = new Stack<T>();
        for (let i = 0; i < n; i++) {
            const x = this.pop();
            temp.push(x); // this => [a,b], temp => [e,d,c]
        }
        const c = temp.pop(); // this => [a,b], temp => [e,d]
        const k = n - 1;
        for (let i = 0; i < k; i++) {
            const x = temp.pop();
            this.push(x); // this => [a,b,d,e], temp => []
        }
        this.push(c); // this => [a,b,d,e,c]
    }
    /**
     * [a,b,c,d,e] => [a,b,e,c,d] (n=3)
     */
    rotateR(n: number): void {
        const temp = new Stack<T>();
        const e = this.pop();
        const k = n - 1;
        for (let i = 0; i < k; i++) {
            const x = this.pop();
            temp.push(x); // this => [a,b], temp => [d,c]
        }
        temp.push(e); // this => [a,b], temp => [d,c,e]
        for (let i = 0; i < n; i++) {
            const x = temp.pop();
            this.push(x); // this => [a,b,e,c,d]
        }
    }
    copy(): Stack<T> {
        const elements = this.#elements.slice();
        return new Stack<T>(elements);
    }
    some(predicate: (value: T, index: number, array: T[]) => boolean): boolean {
        return this.#elements.some(predicate);
    }
    splice(start: number, deleteCount?: number): T[] {
        if (typeof deleteCount === "number") {
            return this.#elements.splice(start, deleteCount);
        } else {
            return this.#elements.splice(start);
        }
    }
    /**
     * [..., a, b] => [..., b, a]
     * Changes the order of the top two elements on the stack.
     */
    swap(): void {
        const b = this.pop();
        const a = this.pop();
        this.push(b);
        this.push(a);
    }
}
