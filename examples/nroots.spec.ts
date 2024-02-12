import { check } from "./check";

describe("nroots", function () {
    xit("001", function () {
        check("nroots(x**5-1,x)", "[1.000000...,-0.809017...+0.587785...*i,-0.809017...-0.587785...*i,0.309017...-0.951057...*i,0.309017...+0.951057...*i]");
    });
});
