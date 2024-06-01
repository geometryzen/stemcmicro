import { check } from "./check";

describe("rationalize", function () {
    it("001", function () {
        check("rationalize(1/a+1/b+1/2)", "(2*a+2*b+a*b)/(2*a*b)");
    });
});
