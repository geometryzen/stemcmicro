import { check } from "./check";

describe("mag", function () {
    xit("001", function () {
        check("mag(x+sqrt(-1)*y)", "(x**2+y**2)**1/2");
    });
});
