import { check } from "./check";

describe("rationalize", function () {
    it("001", function () {
        check("rationalize(1/a+1/b+1/2)", "(a+b+1/2*a*b)/(a*b)");
    });
});
