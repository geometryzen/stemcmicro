import { check } from "./check";

describe("quote", function () {
    it("001", function () {
        check("quote((x+1)**2)", "(x+1)**2");
    });
});
