import { create_sym, Flt, Str } from 'math-expression-atoms';
import { Native, native_sym } from 'math-expression-native';
import { items_to_cons, pos_end_items_to_cons, U } from 'math-expression-tree';
import {
    BinaryExpression,
    createSourceFile,
    EndOfFileToken,
    ExpressionStatement,
    Identifier,
    Node,
    ScriptKind,
    ScriptTarget,
    SourceFile,
    StringLiteral,
    SyntaxKind,
    TypeReferenceNode,
    VariableDeclaration,
    VariableDeclarationList,
    visitNode,
    Visitor
} from 'typescript';
import { StackU } from '../env/StackU';
import { IntTokenParser } from '../operators/int/IntTokenParser';

const ASSIGN = native_sym(Native.assign);
const DEF = native_sym(Native.def);
const MATH_ADD = native_sym(Native.add);
const MATH_SUB = native_sym(Native.subtract);
const MATH_MUL = native_sym(Native.multiply);
const MATH_DIV = native_sym(Native.divide);
const MATH_POW = native_sym(Native.pow);
const MATH_OUTER = native_sym(Native.outer);
const MATH_INNER = native_sym(Native.inner);
const MATH_LCO = native_sym(Native.lco);
const MATH_RCO = native_sym(Native.rco);
/**
 * ':'
 */
const MATH_HAS_TYPE = create_sym(':');

export interface TsParseOptions {
    /**
     * Determines whether the parser makes associativity explicit or implicit in additive expressions.
     */
    explicitAssocAdd?: boolean;
    /**
     * Determines whether the parser makes associativity explicit or implicit in multiplicative expressions.
     */
    explicitAssocMul?: boolean;
}

/**
 * Constructs a source tree using the TypeScript parser.
 * @param fileName The name of the file containing the source text. 
 * @param sourceText The source text.
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ts_parse(fileName: string, sourceText: string, options?: TsParseOptions): U {
    // console.lg("ts_parse", sourceText);
    const languageVersion = ScriptTarget.Latest;
    const setParentNodes = true;
    const scriptKind = ScriptKind.TS;
    const stack = new StackU();
    try {
        /**
         * The sourceFile is itself a Node, meaning that the sourceText has been parsed.
         */
        const sourceFile: SourceFile = createSourceFile(fileName, sourceText, languageVersion, setParentNodes, scriptKind);
        /**
         * The visitor callback must return something that extends Node.
         */
        const visitor: Visitor = function (node: Node) {
            switch (node.kind) {
                case SyntaxKind.AsteriskAsteriskToken: {
                    stack.push(MATH_POW.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.AsteriskToken: {
                    stack.push(MATH_MUL.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.BarToken: {
                    stack.push(MATH_INNER.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.CaretToken: {
                    stack.push(MATH_OUTER.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.BinaryExpression: {
                    const bin = node as BinaryExpression;
                    visitNode(bin.operatorToken, visitor);
                    visitNode(bin.left, visitor);
                    visitNode(bin.right, visitor);
                    const rhs = stack.pop();
                    const lhs = stack.pop();
                    const opr = stack.pop();
                    stack.push(items_to_cons(opr, lhs, rhs));
                    break;
                }
                case SyntaxKind.EndOfFileToken: {
                    const eof = node as EndOfFileToken;
                    eof.forEachChild(function (child) {
                        visitNode(child, visitor);
                    });
                    break;
                }
                case SyntaxKind.ExpressionStatement: {
                    const stmt = node as ExpressionStatement;
                    stmt.forEachChild(function (child) {
                        visitNode(child, visitor);
                    });
                    break;
                }
                case SyntaxKind.FirstAssignment: {
                    stack.push(ASSIGN.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.FirstLiteralToken: {
                    const text = node.getText(sourceFile);
                    if (text.indexOf('.') > 0) {
                        stack.push(new Flt(parseFloat(text), node.pos, node.end));
                    }
                    else {
                        // TODO: Inject this as part of the configuration...
                        const parser = new IntTokenParser();
                        const value = parser.parse(text, node.pos, node.end);
                        stack.push(value);
                    }

                    // There don't appear to be any children.
                    node.forEachChild(function (child) {
                        visitNode(child, visitor);
                    });
                    break;
                }
                case SyntaxKind.FirstStatement: {
                    node.forEachChild(function (child) {
                        visitNode(child, visitor);
                    });
                    break;
                }
                case SyntaxKind.GreaterThanGreaterThanToken: {
                    stack.push(MATH_RCO.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.Identifier: {
                    const ident = node as Identifier;
                    // The sourceFile argument to getText() does not seem to be needed, but we provide it anyway.
                    const printname = ident.getText(sourceFile);
                    // console.lg(`Identifier => escapedText: ${ident.escapedText} text: ${ident.getText(sourceFile)} pos: ${ident.pos} end: ${ident.end}`);
                    // TODO: We could use range {pos, end}?
                    // eslint-disable-next-line no-console
                    // console.lg(`push_usr_symbol(${text})`);
                    stack.push(create_sym(printname));
                    ident.forEachChild(function (child) {
                        visitNode(child, visitor);
                    });
                    break;
                }
                case SyntaxKind.LessThanLessThanToken: {
                    stack.push(MATH_LCO.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.MinusToken: {
                    stack.push(MATH_SUB.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.PlusToken: {
                    stack.push(MATH_ADD.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.SlashToken: {
                    stack.push(MATH_DIV.clone(node.pos, node.end));
                    break;
                }
                case SyntaxKind.StringLiteral: {
                    const str = node as StringLiteral;
                    const text = str.getText(sourceFile);
                    // TODO: Need to remove delimiters and escaping (robustly).
                    const parsedText = text.substring(1, text.length - 1);
                    stack.push(new Str(parsedText, node.pos, node.end));
                    break;
                }
                case SyntaxKind.SourceFile: {
                    const sourceFile = node as SourceFile;
                    sourceFile.forEachChild(function (child) {
                        visitNode(child, visitor);
                    });
                    break;
                }
                case SyntaxKind.TypeReference: {
                    const tref = node as TypeReferenceNode;
                    visitNode(tref.typeName, visitor);
                    break;
                }
                case SyntaxKind.VariableDeclaration: {
                    const decl = node as VariableDeclaration;
                    // console.lg("decl.flags", `${decl.flags}`);
                    // console.lg("decl.name", `${decl.name}`);
                    // console.lg("decl.type", `${decl.type}`);
                    // console.lg("decl.init", `${decl.initializer}`);
                    // console.lg("decl.tokn", `${decl.exclamationToken}`);
                    visitNode(decl.name, visitor);
                    if (decl.type) {
                        visitNode(decl.type, visitor);
                        if (decl.initializer) {
                            visitNode(decl.initializer, visitor);
                            const init = stack.pop();
                            const type = stack.pop();
                            const name = stack.pop();
                            const X = items_to_cons(MATH_HAS_TYPE, name, type);
                            stack.push(pos_end_items_to_cons(node.pos, node.end, DEF, X, init));
                        }
                        else {
                            const type = stack.pop();
                            const name = stack.pop();
                            const X = items_to_cons(MATH_HAS_TYPE, name, type);
                            stack.push(pos_end_items_to_cons(node.pos, node.end, DEF, X));
                        }
                    }
                    else {
                        if (decl.initializer) {
                            visitNode(decl.initializer, visitor);
                            const init = stack.pop();
                            const name = stack.pop();
                            stack.push(pos_end_items_to_cons(node.pos, node.end, DEF, name, init));
                        }
                        else {
                            const name = stack.pop();
                            stack.push(name);
                        }
                    }
                    break;
                }
                case SyntaxKind.VariableDeclarationList: {
                    const decls = node as VariableDeclarationList;
                    // This is how we tell that the declaration is const or let
                    // console.lg("decls.flags Let  ", `${decls.flags & NodeFlags.Let}`);
                    // console.lg("decls.flags Const", `${decls.flags & NodeFlags.Const}`);
                    decls.forEachChild(function (decl) {
                        visitNode(decl, visitor);
                    });
                    break;
                }
                default: {
                    // eslint-disable-next-line no-console
                    console.warn(`Unhandled: ${SyntaxKind[node.kind]}`);
                }
            }
            return node;
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const test = function (node: Node): boolean {
            throw new Error();
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const lift = function (node: readonly Node[]): Node {
            throw new Error();
        };
        // Note that test and lift are only called when producing Node(s) with the visitor, which we do not do.
        visitNode(sourceFile, visitor, test, lift);
        return stack.pop();
    }
    finally {
        stack.release();
    }
}