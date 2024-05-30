import { is_digit } from "./is_digit";

export interface CharStream {
    readonly curr: string;
    readonly next: string;
    consumeChars(n: number): void;
    currEquals(ch: string): boolean;
}

export interface NumHandler {
    flt(): void;
    int(): void;
}

export function consume_signed_num(stream: CharStream, handler: NumHandler): boolean {
    if (stream.curr === "-") {
        stream.consumeChars(1);
        return consume_unsigned_num(stream, handler);
    } else {
        return consume_unsigned_num(stream, handler);
    }
}

export function consume_unsigned_num(stream: CharStream, handler: NumHandler): boolean {
    if (is_digit(stream.curr) || stream.curr === ".") {
        while (is_digit(stream.curr)) {
            stream.consumeChars(1);
        }
        if (stream.curr === ".") {
            stream.consumeChars(1);
            while (is_digit(stream.curr)) {
                stream.consumeChars(1);
            }
            if (stream.currEquals("e") && (stream.next === "+" || stream.next === "-" || is_digit(stream.next))) {
                stream.consumeChars(2);
                while (is_digit(stream.curr)) {
                    stream.consumeChars(1);
                }
            }
            handler.flt();
            return true;
        } else {
            handler.int();
            return true;
        }
    }
    return false;
}
