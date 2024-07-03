import { check } from "../src/check";

xdescribe("arctanh", function () {
    it("001", function () {
        check("arctanh(tanh(x))", "x");
    });
    it("002", function () {
        check("arctanh(0)", "0");
    });
    it("003", function () {
        check("arctanh(1)", "arctanh(1)");
    });
    it("004", function () {
        check("arctanh(0.0)", "0.0");
    });
});
