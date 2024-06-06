import { check } from "./check";

describe("derivative", function () {
    it("001", function () {
        check("derivative(sin(x),x)", "cos(x)");
    });
});
