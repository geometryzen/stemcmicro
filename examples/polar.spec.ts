import { check } from "./check";

describe("polar", function () {
    xit("001", function () {
        check("polar(x+sqrt(-1)*y)", "(x**2+y**2)**(1/2)*exp(i*arctan(-y,x))");
    });
});
