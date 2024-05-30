import { check } from "./check";

describe("do", function () {
    it("001", function () {
        check("do(a=1,b=2,a+b)", "3");
    });
});
