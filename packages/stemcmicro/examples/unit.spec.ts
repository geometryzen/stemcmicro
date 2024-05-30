import { check } from "./check";

describe("unit", function () {
    it("001", function () {
        check("unit(3)", "[[1,0,0],[0,1,0],[0,0,1]]");
    });
});
