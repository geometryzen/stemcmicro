import { check } from "../src/check";

describe("roots", function () {
    it("001", function () {
        check("roots((x+1)*(x-2))", "[-1,2]");
    });
});
