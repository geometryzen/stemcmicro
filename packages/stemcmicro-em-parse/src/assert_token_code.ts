import { TokenCode } from "./Token";

export function assert_token_code(actual: TokenCode, expect: TokenCode): TokenCode {
    if (actual === expect) {
        return actual;
    } else {
        throw new Error();
    }
}
