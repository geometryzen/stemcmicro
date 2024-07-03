import { check } from "../src/check";

xdescribe("iszero", function () {
    it("rational", function () {
        check("typeof(0)", "rational");
        check("iszero(0)", "true");
        check("iszero(1)", "false");
        check("iszero(-1)", "false");
    });
    it("number", function () {
        check("typeof(0.0)", "number");
        check("iszero(0.0)", "true");
        check("iszero(1.0)", "false");
        check("iszero(-1.0)", "false");
    });
    it("boolean", function () {
        check("typeof(true)", "boolean");
        check("typeof(false)", "boolean");
        check("iszero(true)", "false");
        check("iszero(false)", "false");
    });
    it("nil", function () {
        check("typeof(nil)", "symbol"); // TODO: Needs evaluation?
        check("iszero(nil)", "false");
    });
    it("string", function () {
        check('typeof("Hello")', "string");
        check('iszero("Hello")', "false");
    });
    it("uom", function () {
        check("typeof(second)", "uom");
        check("iszero(second)", "false");
    });
    it("blade", function () {
        check("typeof(ex)", "blade");
        check("iszero(ex)", "false");
    });
    it("tensor", function () {
        check("typeof([0])", "tensor");
        check("iszero([0])", "true");
        check("iszero([1])", "false");
        check("iszero([[0,0],[0,0]])", "true");
        check("iszero([[1,0],[0,1]])", "false");
    });
    it("hyperreal", function () {
        check('typeof(infinitesimal("dx"))', "hyperreal");
        check('iszero(infinitesimal("dx"))', "false");
    });
    it("map", function () {
        check("typeof({})", "map");
        check("iszero({})", "false");
    });
    it("imu", function () {
        check("typeof(sqrt(-1))", "imu");
        check("iszero(sqrt(-1))", "false");
    });
    it("cell", function () {
        check("typeof(atom(x))", "cell");
        check("iszero(atom(x))", "false");
        check("iszero(atom(0))", "true");
        check("iszero(atom(1))", "false");
    });
});
