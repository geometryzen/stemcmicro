import { check } from "../src/check";

describe("circexp", function () {
    xit("001", function () {
        check("circexp(cos(x) + i*sin(x))", "exp(i*x)");
    });
});
