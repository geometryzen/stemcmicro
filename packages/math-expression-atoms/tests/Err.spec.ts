import { create_err } from "../src/err/Err";
import { Str } from "../src/str/Str";

test("cause", function () {
    const err = create_err(new Str("I'm sorry Dave, I'm afraid I can't do that."));
    try {
        expect(err.message).toBe("I'm sorry Dave, I'm afraid I can't do that.");
    } finally {
        err.release();
    }
});
