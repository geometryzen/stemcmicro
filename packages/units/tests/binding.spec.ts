import { check } from "../src/check";

describe("binding", function () {
    xit("001", function () {
        check("binding(quote((x+1)))", "arctan(-3,2)");
    });
});
