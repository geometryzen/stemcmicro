import { check } from "./check";

describe("simplify", function () {
    it("001", function () {
        check("simplify(cos(x)**2+sin(x)**2)", "1");
    });
});
