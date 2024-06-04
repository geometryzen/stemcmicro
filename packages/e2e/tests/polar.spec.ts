import { check } from "./check";

describe("polar", function () {
    it("001", function () {
        check("polar(x+sqrt(-1)*y)", "e**(i*arctan(y,x))*(x**2+y**2)**(1/2)");
    });
});
