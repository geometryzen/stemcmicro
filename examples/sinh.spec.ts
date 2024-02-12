import { check } from "./check";

describe("sinh", function () {
    it("001", function () {
        check("sinh(x)", "sinh(x)");
        check("sinh(0)", "0");
        check("sinh(1)", "sinh(1)");
        check("sinh(-x)", "-sinh(x)");
        check("sinh(arcsinh(x))", "x");
        check("sinh(0.0)", "0.0");
        check("sinh(1.0)", "1.175201...");
    });
});
