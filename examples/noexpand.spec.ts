import { check } from "./check";

describe("noexpand", function () {
    xit("001", function () {
        check("noexpand((x+1)**2/(x+1))", "x+1");
    });
});
