import { check } from "./check";

describe("imag", function () {
    it("001", function () {
        check("im(2-3*sqrt(-1))", "-3");
    });
});
