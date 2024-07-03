import { check } from "../src/check";

xdescribe("prime", function () {
    it("001", function () {
        check("prime(1)", "2");
        check("prime(2)", "3");
        check("prime(3)", "5");
        check("prime(4)", "7");
        check("prime(5)", "11");
    });
});
