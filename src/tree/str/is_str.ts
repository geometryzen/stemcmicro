import { Str } from "./Str";

export function is_str(p: unknown): p is Str {
    return p instanceof Str;
}
