import { check } from "./check";

describe("inv", function () {
    it("001", function () {
        check("inv([[1,2],[3,4]])", "[[-2,1],[3/2,-1/2]]");
    });
});
