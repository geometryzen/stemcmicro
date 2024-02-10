import { check } from "./check";

describe("integral", function () {
    it("001", function () {
        check("integral(x**2,x)", "1/3*x**3");
    });
});
