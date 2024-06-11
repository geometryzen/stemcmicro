import { check } from "../src/check";

describe("draw", function () {
    it("001", function () {
        check("draw(sin(x)/x,x)", "()");
    });
});
