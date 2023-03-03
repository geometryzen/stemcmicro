/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    AnnAssign,
    Assign,
    astFromParse,
    Attribute,
    BinOp,
    Call,
    ClassDef,
    Compare,
    Dict,
    ExpressionStatement,
    ForStatement,
    FunctionDef,
    IfStatement,
    ImportFrom,
    List,
    Module,
    Name,
    Num,
    parse,
    Print, ReturnStatement,
    SourceKind,
    Statement,
    Str,
    UnaryOp,
    Visitor
} from "typhon-lang";
import { nil, U } from "../tree/tree";

export interface TyphonParseOptions {
    /**
     * Determines whether the parser makes associativity explicit or implicit in additive expressions.
     */
    explicitAssocAdd?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in multiplicative expressions.
     */
    explicitAssocMul?: boolean;
}

class PythonVisitor implements Visitor {
    annAssign(annassign: AnnAssign): void {
        throw new Error("Method not implemented.");
    }
    assign(assign: Assign): void {
        assign.targets.forEach((target) => {
            target.accept(this);
        });
        assign.value.accept(this);
    }
    attribute(attribute: Attribute): void {
        throw new Error("Method not implemented.");
    }
    binOp(be: BinOp): void {
        throw new Error("Method not implemented.");
    }
    callExpression(ce: Call): void {
        throw new Error("Method not implemented.");
    }
    classDef(classDef: ClassDef): void {
        throw new Error("Method not implemented.");
    }
    compareExpression(ce: Compare): void {
        throw new Error("Method not implemented.");
    }
    dict(dict: Dict): void {
        throw new Error("Method not implemented.");
    }
    expressionStatement(es: ExpressionStatement): void {
        es.value.accept(this);
    }
    functionDef(functionDef: FunctionDef): void {
        throw new Error("Method not implemented.");
    }
    ifStatement(ifs: IfStatement): void {
        throw new Error("Method not implemented.");
    }
    importFrom(importFrom: ImportFrom): void {
        throw new Error("Method not implemented.");
    }
    list(list: List): void {
        throw new Error("Method not implemented.");
    }
    module(module: Module): void {
        // eslint-disable-next-line no-console
        console.log("Begin Python module");
        module.body.forEach((stmt: Statement) => {
            stmt.accept(this);
        });
        // eslint-disable-next-line no-console
        console.log("End Python module");
    }
    name(name: Name): void {
        // eslint-disable-next-line no-console
        console.log(`Python name ${name.id.value}`);
    }
    num(num: Num): void {
        // eslint-disable-next-line no-console
        console.log(`Python num ${num.n.value}`);
    }
    print(print: Print): void {
        throw new Error("Method not implemented.");
    }
    returnStatement(rs: ReturnStatement): void {
        throw new Error("Method not implemented.");
    }
    str(str: Str): void {
        throw new Error("Method not implemented.");
    }
    unaryOp(unaryExpr: UnaryOp): void {
        throw new Error("Method not implemented.");
    }
    forStatement(fs: ForStatement): void {
        throw new Error("Method not implemented.");
    }

}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function typhon_parse(fileName: string, sourceText: string, options?: TyphonParseOptions): U {
    const node = parse(sourceText, SourceKind.File);
    if (typeof node === 'object') {
        const stmts: Statement[] = astFromParse(node);
        const mod = new Module(stmts);
        const visitor: Visitor = new PythonVisitor();
        mod.accept(visitor);
        return nil;
    }
    else {
        throw new Error();
    }
}