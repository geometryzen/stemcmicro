import { check } from "./check";

describe("algebra", function () {
    it("001", function () {
        check('algebra([1,1,1],["i","j","k"])', "[i,j,k]");
    });
});
