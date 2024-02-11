import { check } from "./check";

describe("mag", function () {
    it("001", function () {
        // check("mag(x+sqrt(-1)*y)", "(x**2+y**2)**(1/2)");
    });
    it("002", function () {
        
        // check("sqrt(-1)", "i");

        check("mag(sqrt(-1))", "1");

        // check("mag(sqrt(-1)**0)", "1");
        // check("mag(sqrt(-1)**1)", "1");
    });
});
