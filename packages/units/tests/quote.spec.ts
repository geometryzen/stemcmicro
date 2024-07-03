import { check } from "../src/check";

xdescribe("quote", function () {
    it("001", function () {
        check("quote((x+1)**2)", "(x+1)**2");
    });
});
