import { Str } from "math-expression-atoms";

export function create_str(s: string): Str {
    return new Str(s);
}
