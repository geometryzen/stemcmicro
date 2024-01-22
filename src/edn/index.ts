function assert_defined<T>(x: T | undefined): T {
    if (typeof x === 'undefined') {
        throw new Error();
    }
    else {
        return x;
    }
}

class Stack<T> {
    readonly #elements: T[] = [];
    constructor(elements: T[] = []) {
        this.#elements = elements;
    }
    get length(): number {
        return this.#elements.length;
    }
    get top(): T {
        return this.#elements[this.#elements.length - 1];
    }
    push(element: T): void {
        this.#elements.push(element);
    }
    pop(): T {
        return assert_defined(this.#elements.pop());
    }
}

export interface ParseConfig<T> {
    bigIntAs: (value: string, pos: number, end: number) => T;
    booAs: (value: boolean, pos: number, end: number) => T;
    charAs: (ch: string, pos: number, end: number) => T;
    fltAs: (value: number, pos: number, end: number) => T;
    intAs: (value: number, pos: number, end: number) => T;
    keywordAs: (localName: string, namespace: string, pos: number, end: number) => T;
    listAs: (values: T[], pos: number, end: number) => T;
    mapAs: (entries: [key: T, value: T][], pos: number, end: number) => T;
    nilAs: (pos: number, end: number) => T;
    setAs: (members: T[], pos: number, end: number) => T;
    strAs: (value: string, pos: number, end: number) => T;
    symAs: (value: string, pos: number, end: number) => T;
    tagAs: (tag: string, value: T, pos: number, end: number) => T;
    vectorAs: (values: T[], pos: number, end: number) => T;
    tagHandlers: { [tag: string]: (value: T) => T };
}

enum StackMode {
    idle = 0,
    string = 1,
    escape = 2,
    comment = 3,
    vector = 4,
    list = 5,
    map = 6,
    set = 7,
    tag = 8,
}
/*
function decodeMode(mode: StackMode): string {
    switch (mode) {
        case StackMode.idle: return "idle";
        default: return `unknown mode is ${mode}`;
    }
}
*/


const stringEscapeMap: { [char: string]: string } = {
    t: '\t',
    r: '\r',
    n: '\n',
    '\\': '\\',
    '"': '"',
};
const spaceChars = [',', ' ', '\t', '\n', '\r'];
const intRegex = /^[-+]?(0|[1-9][0-9]*)$/;
const bigintRegex = /^[-+]?(0|[1-9][0-9]*)N$/;
const floatRegex = /^[-+]?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][+-]?(0|[1-9][0-9]*))?M?$/;

type MapEntry<T> = [key: T, value: T];
type MapEntries<T> = MapEntry<T>[];
type MapState<T> = { entries: MapEntries<T>, buffer: Stack<T> };

type State<T> = string | T | MapState<T> | T[];

function assert_string_state<T>(state: State<T>) {
    if (is_map_state(state)) {
        throw new Error();
    }
    else {
        if (typeof state === 'string') {
            return state;
        }
        else {
            throw new Error();
        }
    }
}

function assert_vector_state<T>(state: State<T>): T[] {
    if (Array.isArray(state)) {
        return state;
    }
    else {
        throw new Error();
    }
}

function assert_list_state<T>(state: State<T>): T[] {
    if (Array.isArray(state)) {
        return state;
    }
    else {
        throw new Error();
    }
}

function assert_stack_mode(actual: StackMode, expected: StackMode): StackMode | never {
    if (actual === expected) {
        return expected;
    }
    else {
        throw new Error();
    }
}

function assert_set_state<T>(state: State<T>): T[] {
    if (Array.isArray(state)) {
        return state;
    }
    else {
        throw new Error();
    }
}

function assert_map_state<T>(state: State<T>): MapState<T> {
    if (is_map_state(state)) {
        return state;
    }
    else {
        throw new Error();
    }
}

function is_map_state<T>(state: State<T>): state is MapState<T> {
    if (Array.isArray(state)) {
        return false;
    }
    else if (typeof state === 'string') {
        return false;
    }
    else {
        const duck: MapState<T> = state as MapState<T>;
        if (Array.isArray(duck.entries) && duck.buffer instanceof Stack) {
            return true;
        }
        else {
            return false;
        }
    }
}

export class EDNListParser<T> {
    #stack: Stack<[stackMode: StackMode, prevState: State<T>, pos: number]> = new Stack();
    #mode = StackMode.idle;
    #state: string = '';
    #result: T | undefined = void 0;
    #started = false;
    #pos = 0;
    #done = false;

    #bigIntAs: ParseConfig<T>['bigIntAs'];
    #booAs: ParseConfig<T>['booAs'];
    #charAs: ParseConfig<T>['charAs'];
    #fltAs: ParseConfig<T>['fltAs'];
    #intAs: ParseConfig<T>['intAs'];
    #keywordAs: ParseConfig<T>['keywordAs'];
    #listAs: ParseConfig<T>['listAs'];
    #mapAs: ParseConfig<T>['mapAs'];
    #nilAs: ParseConfig<T>['nilAs'];
    #setAs: ParseConfig<T>['setAs'];
    #strAs: ParseConfig<T>['strAs'];
    #symAs: ParseConfig<T>['symAs'];
    #tagAs: ParseConfig<T>['tagAs'];
    #vectorAs: ParseConfig<T>['vectorAs'];
    #tagHandlers: ParseConfig<T>['tagHandlers'];

    constructor(options: ParseConfig<T>) {
        this.#bigIntAs = options.bigIntAs;
        this.#booAs = options.booAs;
        this.#charAs = options.charAs;
        this.#fltAs = options.fltAs;
        this.#intAs = options.intAs;
        this.#keywordAs = options.keywordAs;
        this.#listAs = options.listAs;
        this.#mapAs = options.mapAs;
        this.#nilAs = options.nilAs;
        this.#setAs = options.setAs;
        this.#strAs = options.strAs;
        this.#symAs = options.symAs;
        this.#tagAs = options.tagAs;
        this.#vectorAs = options.vectorAs;
        this.#tagHandlers = options.tagHandlers;
    }
    #updateStack(): void {
        if (this.#stack.length === 0 || this.#result === void 0) {
            return;
        }
        const [stackMode, prevState, pos] = this.#stack.top;
        if (stackMode === StackMode.vector) {
            assert_vector_state(prevState).push(this.#result);
        }
        else if (stackMode === StackMode.list) {
            assert_list_state(prevState).push(this.#result);
        }
        else if (stackMode === StackMode.set) {
            assert_set_state(prevState).push(this.#result);
        }
        else if (stackMode === StackMode.map) {
            // In the Map state the keys and values arrive one at a time.
            const state = assert_map_state(prevState);
            const entries: MapEntries<T> = state.entries;
            const buffer: Stack<T> = state.buffer;
            if (buffer.length > 0) {
                entries.push([buffer.pop(), this.#result]);
            }
            else {
                buffer.push(this.#result);
            }
        }
        else if (stackMode === StackMode.tag) {
            // Why don't have to keep the return value because we already peeked at the top. 
            this.#stack.pop();
            if (prevState === '_') {
                this.#result = void 0;
            }
            else {
                const ps = assert_string_state(prevState);
                const tagHandler = this.#tagHandlers[ps];
                if (tagHandler) {
                    this.#result = tagHandler(this.#result);
                }
                else {
                    const tag = ps;
                    const value = this.#result;
                    this.#result = this.#tagAs(tag, value, pos, 0);//this.#absolutize(i));
                }
            }
            this.#updateStack();
            return;
        }
        // TODO: Else error
        this.#result = void 0;
    }
    /**
     * 
     * @param i The index over the '(' sourceText ')'.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #match(i: number, reason: '"' | 'spaceChar' | '[' | ']' | '(' | ')' | '{' | '}' | '#{'): void {
        // console.log("match", JSON.stringify(this.#state), reason);
        const end = this.#absolutize(i);
        if (this.#state === 'nil') {
            this.#result = this.#nilAs(this.#pos, end);
        }
        else if (this.#state === 'true') {
            this.#result = this.#booAs(true, this.#pos, end);
        }
        else if (this.#state === 'false') {
            this.#result = this.#booAs(false, this.#pos, end);
        }
        else if (this.#state[0] === ':') {
            const qualifiedName = this.#state.substring(1);
            const slashIdx = qualifiedName.indexOf('/');
            const localName = slashIdx >= 0 ? qualifiedName.substring(slashIdx + 1) : qualifiedName;
            const namespace = slashIdx >= 0 ? qualifiedName.substring(0, slashIdx) : '';
            this.#result = this.#keywordAs(localName, namespace, this.#pos, end);
        }
        else if (this.#state[0] === '#') {
            // Tag
            this.#stack.push([StackMode.tag, this.#state.substring(1), this.#absolutize(i)]);
            this.#result = void 0;
        }
        else if (intRegex.test(this.#state)) {
            this.#result = this.#intAs(parseInt(this.#state, 10), this.#pos, end);
        }
        else if (floatRegex.test(this.#state)) {
            this.#result = this.#fltAs(parseFloat(this.#state), this.#pos, end);
        }
        else if (bigintRegex.test(this.#state)) {
            const text = this.#state.substring(0, this.#state.length - 1);
            this.#result = this.#bigIntAs(text, this.#pos, end);
        }
        else if (this.#state[0] === '\\') {
            let c: string;
            if (this.#state === '\\space') {
                c = ' ';
            }
            else if (this.#state === '\\newline') {
                c = '\n';
            }
            else if (this.#state === '\\return') {
                c = '\r';
            }
            else if (this.#state === '\\tab') {
                c = '	';
            }
            else if (this.#state === '\\\\') {
                c = '\\';
            }
            else {
                c = this.#state.substring(1);
            }

            this.#result = this.#charAs(c, this.#pos, end);
        }
        else if (this.#state !== '') {
            this.#result = this.#symAs(this.#state, this.#pos, end);
        }
        this.#state = '';
        // this.#stack.top[2] = end + 1;
        this.#pos = end + 1; // length of the reason character?
    }
    #absolutize(i: number): number {
        // -1 becuase we prefix with '('.
        return i - 1;
    }
    next(sourceText: string): T[] {

        const str = `(${sourceText})`;

        const values: T[] = [];
        for (let i = 0; i < str.length; i++) {
            if (this.#stack.length === 0 && this.#result !== void 0) {
                values.push(this.#result);
                this.#result = void 0;
            }

            /**
             * str[i]
             */
            const char = str[i];

            // console.log(i, JSON.stringify(char), "mode:", JSON.stringify(decodeMode(this.#mode)));

            if (this.#mode === StackMode.idle) {
                if (char === '"') {
                    this.#match(i, '"');
                    this.#updateStack();
                    this.#mode = StackMode.string;
                    // TODO: Redundant?
                    this.#state = '';
                    continue;
                }
                if (char === ';') {
                    this.#mode = StackMode.comment;
                    continue;
                }
                if (spaceChars.includes(char)) {
                    this.#match(i, 'spaceChar');
                    this.#updateStack();
                    continue;
                }
                if (char === '}') {
                    this.#match(i, '}');
                    this.#updateStack();
                    if (this.#stack.length !== 0) {
                        const [stackMode, prevState, pos] = this.#stack.pop();
                        const end = this.#absolutize(i) + 1;
                        if (stackMode === StackMode.map) {
                            const entries = assert_map_state(prevState).entries;
                            this.#result = this.#mapAs(entries, pos, end);
                        }
                        else {
                            assert_stack_mode(stackMode, StackMode.set);
                            const members: T[] = assert_set_state(prevState);
                            this.#result = this.#setAs(members, pos, end);
                        }
                    }
                    this.#updateStack();
                    continue;
                }
                if (char === ']') {
                    this.#match(i, ']');
                    this.#updateStack();
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [stackMode, prevState, pos] = this.#stack.pop();
                    const elements = assert_vector_state(prevState);
                    const end = this.#absolutize(i) + 1;
                    this.#result = this.#vectorAs(elements, pos, end);
                    this.#updateStack();
                    continue;
                }
                if (char === ')') {
                    this.#match(i, ')');
                    this.#updateStack();
                    if (this.#stack.length === 0) {
                        if (this.#result !== void 0) {
                            values.push(this.#result);
                        }
                        this.#done = true;
                        return values;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const [stackMode, prevState, pos] = this.#stack.pop();
                    const end = this.#absolutize(i) + 1;
                    const items = assert_list_state(prevState);
                    this.#result = this.#listAs(items, pos, end);
                    this.#updateStack();
                    continue;
                }
                if (char === '[') {
                    this.#match(i, '[');
                    this.#updateStack();
                    this.#stack.push([StackMode.vector, [], this.#absolutize(i)]);
                    continue;
                }
                else if (char === '(') {
                    if (this.#started) {
                        this.#match(i, '(');
                        this.#updateStack();
                        this.#stack.push([StackMode.list, [], this.#absolutize(i)]);
                    }
                    else {
                        // Ignoring the opening '(' in the idle state.
                        this.#started = true;
                    }
                    continue;
                }
                const statePlusChar = `${this.#state}${char}`;
                if (statePlusChar === '#_') {
                    this.#stack.push([StackMode.tag, char, this.#absolutize(i)]);
                    this.#result = void 0;
                    this.#state = '';
                    continue;
                }
                if (statePlusChar.endsWith('#{')) {
                    this.#state = this.#state.slice(0, -1);
                    this.#match(i, '#{');
                    this.#updateStack();
                    this.#stack.push([StackMode.set, [], this.#absolutize(i)]);
                    this.#state = '';
                    continue;
                }
                if (char === '{') {
                    this.#match(i, '{');
                    this.#updateStack();
                    const pos = this.#absolutize(i);
                    this.#stack.push([StackMode.map, { entries: [], buffer: new Stack() }, pos]);
                    this.#state = '';
                    continue;
                }
                this.#state += char;
                continue;
            }
            else if (this.#mode === StackMode.string) {
                if (char === '\\') {
                    this.#stack.push([this.#mode, this.#state, this.#absolutize(i)]);
                    this.#mode = StackMode.escape;
                    this.#state = '';
                    continue;
                }
                if (char === '"') {
                    this.#mode = StackMode.idle;
                    // Adjusting pos and end to include delimiters. 
                    this.#result = this.#strAs(this.#state, this.#pos - 1, this.#absolutize(i) + 1);
                    this.#updateStack();
                    this.#state = '';
                    continue;
                }
                this.#state += char;
            }
            else if (this.#mode === StackMode.escape) {
                const escapedChar = stringEscapeMap[char];
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const [stackMode, prevState, pos] = this.#stack.pop();
                this.#mode = stackMode;
                this.#state = prevState + escapedChar;
            }
            else if (this.#mode === StackMode.comment) {
                if (char === '\n') {
                    this.#mode = StackMode.idle;
                }
            }
        }
        return values;
    }

    isDone(): boolean {
        return this.#done;
    }
}
