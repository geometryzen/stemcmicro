
export class Stack<T> {
    tos = 0;
    readonly #elements: T[] = [];
    constructor(elements: T[] = []) {
        this.#elements = elements;
        this.tos = elements.length;
    }
    get length(): number {
        return this.#elements.length;
    }
    get top(): T {
        return this.#elements[this.#elements.length - 1];
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
        }
        else {
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
    copy(): Stack<T> {
        const elements = this.#elements.slice();
        return new Stack<T>(elements);
    }
    /**
     * Changes the order of the top two elements on the stack.
     */
    swap(): void {
        const p = this.pop();
        const q = this.pop();
        this.push(p);
        this.push(q);
    }
}
