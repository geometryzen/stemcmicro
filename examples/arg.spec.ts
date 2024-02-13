import { check } from "./check";

describe("arg", function () {
    it("001", function () {
        check("arg(2-3*sqrt(-1))", "-arctan(3,2)");
    });
});
