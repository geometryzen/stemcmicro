export class Stack<T> {
    readonly #elements: T[] = [];
    peek(): T {
        const length = this.#elements.length;
        const last = length - 1;
        return this.#elements[last];
    }
    push(element: T): void {
        this.#elements.push(element);
    }
    pop(): T {
        const element = this.#elements.pop();
        if (element) {
            return element;
        }
        else {
            throw new Error();
        }
    }
}