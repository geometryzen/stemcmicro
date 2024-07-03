import { check } from "../src/check";

xdescribe("for", function () {
    xit("001", function () {
        check("for(k,1,3,A=k,print(A))", "1");
    });
});
