import { check } from "./check";

xdescribe("sandbox", function () {
    it("001", function () {
        check("arg(0)", "undefined");
        check("arg(0.0)", "undefined");
        check("arg((-1)**a)", "a*pi");
        check("arg(1)", "0");
        check("arg(1+sqrt(-1))", "0");  // Issues because of definition of imaginary unit?

    });
});
