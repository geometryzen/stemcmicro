import { check } from "../src/check";

describe("imag", function () {
    it("001", function () {
        check("imag(2-3*sqrt(-1))", "-3");
    });
});
