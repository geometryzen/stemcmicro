import { check } from "../src/check";

/**
 * condense acts on additive expressions, otherwise it is a noop.
 */
xdescribe("condense", function () {
    it("001", function () {
        check("(a*b)/b", "a");
        check("condense((a*b)/b)", "a");
    });
    it("002", function () {
        check("(a+b)/(a+b)", "a/(a+b)+b/(a+b)", { traceLevel: 0 });
    });
    xit("003", function () {
        check("a/(a+b)+b/(a+b)", "a/(a+b)+b/(a+b)");
        check("condense(a/(a+b)+b/(a+b))", "1");
    });
});
