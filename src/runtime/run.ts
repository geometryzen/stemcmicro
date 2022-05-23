import { to_code_string } from '../code/to_code_string';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { to_latex_string } from '../latex/to_latex_string';
import { is_sym } from '../operators/sym/is_sym';
import { scan } from '../scanner/scan';
import { simplifyForCodeGeneration } from '../operators/simplify/eval_simplify';
import { subst } from '../subst';
import { Sym } from '../tree/sym/Sym';
import { car, cdr, NIL, U } from '../tree/tree';
import { MIDDLE_DOT_REGEX_GLOBAL, predefinedSymbolsInGlobalScope_doNotTrackInDependencies, TRANSPOSE_REGEX_GLOBAL } from './constants';
import { defs, hard_reset } from './defs';
import { check_stack, top_level_transform } from './execute';
import { soft_reset } from './init';
import { normalize_unicode_dots } from './normalize_dots';
import { stack_pop, stack_push } from './stack';
import { collectUserSymbols } from './symbol';

export function findDependenciesInScript(stringToBeParsed: string, $: ExtensionEnv, dontGenerateCode = false): [string, string, string, string, string, string, { affectsVariables: string[]; affectedBy: string[] }] {
    defs.codeGen = true;
    defs.symbolsDependencies = {};
    defs.symbolsHavingReassignments = [];
    defs.symbolsInExpressionsWithoutAssignments = [];
    defs.patternHasBeenFound = false;
    let indexOfPartRemainingToBeParsed = 0;

    let n = 0;

    // we are going to store the dependencies _of the block as a whole_
    // so all affected variables in the whole block are lumped
    // together, and same for the variable that affect those, we
    // lump them all together.
    const dependencyInfo: { affectsVariables: string[], affectedBy: string[] } = { affectsVariables: [], affectedBy: [], };

    // parse the input. This collects the
    // dependency information
    // eslint-disable-next-line no-constant-condition
    while (true) {
        try {
            defs.errorMessage = '';
            check_stack();
            [n] = scan(stringToBeParsed.substring(indexOfPartRemainingToBeParsed), { useCaretForExponentiation: false });
            check_stack();
        }
        catch (error) {
            if (error instanceof Error) {
                // eslint-disable-next-line no-console
                console.log(error.stack);
            }
            defs.errorMessage = error + '';
            //breakpoint
            hard_reset();
            break;
        }

        if (n === 0) {
            break;
        }

        indexOfPartRemainingToBeParsed += n;
    }

    let testableString = '';

    // print out all local dependencies as collected by this
    // parsing pass
    testableString += 'All local dependencies: ';
    for (const key in defs.symbolsDependencies) {
        const value = defs.symbolsDependencies[key];
        dependencyInfo.affectsVariables.push(key);
        testableString += ' variable ' + key + ' depends on: ';
        for (const i of Array.from(value)) {
            if (i[0] !== "'") {
                dependencyInfo.affectedBy.push(i);
            }
            testableString += i + ', ';
        }
        testableString += '; ';
    }
    testableString += '. ';

    // print out the symbols with re-assignments:
    testableString += 'Symbols with reassignments: ';
    for (const key of Array.from(defs.symbolsHavingReassignments)) {
        if (dependencyInfo.affectedBy.indexOf(key) === -1) {
            dependencyInfo.affectedBy.push(key);
            testableString += key + ', ';
        }
    }
    testableString += '. ';

    // print out the symbols that appear in expressions without assignments
    testableString += 'Symbols in expressions without assignments: ';
    for (const key of Array.from(defs.symbolsInExpressionsWithoutAssignments)) {
        if (dependencyInfo.affectedBy.indexOf(key) === -1) {
            dependencyInfo.affectedBy.push(key);
            testableString += key + ', ';
        }
    }
    testableString += '. ';

    // ALL Algebrite code is affected by any pattern changing
    dependencyInfo.affectedBy.push('PATTERN_DEPENDENCY');

    if (defs.patternHasBeenFound) {
        dependencyInfo.affectsVariables.push('PATTERN_DEPENDENCY');
        testableString += ' - PATTERN_DEPENDENCY inserted - ';
    }

    // print out all global dependencies as collected by this
    // parsing pass
    testableString += 'All dependencies recursively: ';

    let scriptEvaluation: string | string[] = ['', ''];
    let generatedCode = '';
    let readableSummaryOfGeneratedCode = '';

    if (defs.errorMessage === '' && !dontGenerateCode) {
        try {
            scriptEvaluation = run(stringToBeParsed, $, true);
        }
        catch (error) {
            if (error instanceof Error) {
                // eslint-disable-next-line no-console
                console.log(error.stack);
            }
            defs.errorMessage = `${error}`;
        }

        if (defs.errorMessage === '') {
            for (const key in defs.symbolsDependencies) {
                defs.codeGen = true;
                defs.codeGen = false;
                testableString += ' variable ' + key + ' depends on: ';

                const recursedDependencies: string[] = [];
                const variablesWithCycles: string[] = [];
                const cyclesDescriptions: string[] = [];

                recursiveDependencies(
                    key,
                    recursedDependencies,
                    [],
                    variablesWithCycles,
                    [],
                    cyclesDescriptions
                );

                for (const i of Array.from(recursedDependencies)) {
                    testableString += i + ', ';
                }
                testableString += '; ';

                for (const i of Array.from(cyclesDescriptions)) {
                    testableString += ' ' + i + ', ';
                }

                // we really want to make an extra effort
                // to generate simplified code, so
                // run a "simplify" on the content of each
                // variable that we are generating code for.
                // Note that the variable
                // will still point to un-simplified structures,
                // we only simplify the generated code.
                stack_push($.getBinding($.defineKey(new Sym(key))));

                // Since we go and simplify all variables we meet,
                // we have to replace each variable passed as a parameter
                // with something entirely new, so that there is no chance
                // that it might evoke previous values in the external scope
                // as in this case:
                //  a = 2
                //  f(a) = a+1+b
                // we don't want 'a' in the body of f to be simplified to 2
                // There are two cases: 1) the variable actually was already in
                // the symbol table, in which case there is going to be this new
                // one prepended with AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE, and
                // we'll have to remove up this variable later.
                // OR 2) the variable wasn't already in the symbol table, in which
                // case we directly create this one, which means that we'll have
                // to rename it later to the correct name without the prepended
                // part.
                const replacementsFrom: Sym[] = [];
                const replacementsTo: Sym[] = [];

                for (const eachDependency of Array.from(recursedDependencies)) {
                    if (eachDependency[0] === "'") {
                        const deQuotedDep = eachDependency.substring(1);
                        const originalUserSymbol = $.defineKey(new Sym(deQuotedDep));
                        const newUserSymbol = $.defineKey(new Sym('AVOID_BINDING_TO_EXTERNAL_SCOPE_VALUE' + deQuotedDep));
                        replacementsFrom.push(originalUserSymbol);
                        replacementsTo.push(newUserSymbol);
                        stack_push(subst(stack_pop(), originalUserSymbol, newUserSymbol, $));
                    }
                }

                try {
                    stack_push(simplifyForCodeGeneration(stack_pop(), $));
                }
                catch (error) {
                    if (error instanceof Error) {
                        // eslint-disable-next-line no-console
                        console.log(error.stack);
                    }
                    defs.errorMessage = error + '';
                }

                for (
                    let indexOfEachReplacement = 0;
                    indexOfEachReplacement < replacementsFrom.length;
                    indexOfEachReplacement++
                ) {
                    stack_push(
                        subst(
                            stack_pop(),
                            replacementsTo[indexOfEachReplacement],
                            replacementsFrom[indexOfEachReplacement],
                            $
                        )
                    );
                }

                $.clearRenamed();

                if (defs.errorMessage === '') {
                    const toBePrinted = stack_pop();

                    // we have to get all the variables used on the right side
                    // here. I.e. to print the arguments it's better to look at the
                    // actual method body after simplification.
                    let userVariablesMentioned: Sym[] = [];
                    collectUserSymbols(toBePrinted, userVariablesMentioned, $);

                    const generatedBody = to_code_string(toBePrinted, $);

                    const bodyForReadableSummaryOfGeneratedCode = to_latex_string(toBePrinted, $);

                    if (variablesWithCycles.indexOf(key) !== -1) {
                        generatedCode +=
                            '// ' +
                            key +
                            ' is part of a cyclic dependency, no code generated.';
                        readableSummaryOfGeneratedCode +=
                            '#' + key + ' is part of a cyclic dependency, no code generated.';
                    }
                    else {
                        /*
                        * using this paragraph instead of the following one
                        * creates methods signatures that
                        * are slightly less efficient
                        * i.e. variables compare even if they are
                        * simplified away.
                        * In theory these signatures are more stable, but
                        * in practice signatures vary quite a bit anyways
                        * depending on previous assignments for example,
                        * so it's unclear whether going for stability
                        * is sensible at all..
                        if recursedDependencies.length != 0
                          parameters = "("
                          for i in recursedDependencies
                            if i.indexOf("'") != 0
                              parameters += i + ", "
                            else
                              if recursedDependencies.indexOf(i.substring(1)) == -1
                                parameters += i.substring(1) + ", "
                        */

                        // remove all native functions from the
                        // parameters as well.
                        userVariablesMentioned = userVariablesMentioned.filter(
                            (x) =>
                                predefinedSymbolsInGlobalScope_doNotTrackInDependencies.indexOf($.toInfixString(x)) === -1
                        );

                        // remove the variable that are not in the dependency list
                        // i.e. only allow the variables that are in the dependency list
                        userVariablesMentioned = userVariablesMentioned.filter(
                            (x) =>
                                recursedDependencies.indexOf($.toInfixString(x)) !== -1 ||
                                recursedDependencies.indexOf("'" + $.toInfixString(x)) !== -1
                        );

                        if (userVariablesMentioned.length !== 0) {
                            let parameters = '(';
                            for (const i of Array.from(userVariablesMentioned)) {
                                if (is_sym(i)) {
                                    const printname = i.key();
                                    if (printname !== key) {
                                        parameters += printname + ', ';
                                    }
                                }
                            }

                            // eliminate the last ", " for printout clarity
                            parameters = parameters.replace(/, $/gm, '');
                            parameters += ')';
                            generatedCode +=
                                key +
                                ' = function ' +
                                parameters +
                                ' { return ( ' +
                                generatedBody +
                                ' ); }';
                            readableSummaryOfGeneratedCode +=
                                key +
                                parameters +
                                ' = ' +
                                bodyForReadableSummaryOfGeneratedCode;
                        }
                        else {
                            generatedCode += key + ' = ' + generatedBody + ';';
                            readableSummaryOfGeneratedCode +=
                                key + ' = ' + bodyForReadableSummaryOfGeneratedCode;
                        }
                    }

                    generatedCode += '\n';
                    readableSummaryOfGeneratedCode += '\n';
                }
            }
        }
    }

    // eliminate the last new line
    generatedCode = generatedCode.replace(/\n$/gm, '');
    readableSummaryOfGeneratedCode = readableSummaryOfGeneratedCode.replace(
        /\n$/gm,
        ''
    );

    // cleanup
    defs.symbolsDependencies = {};
    defs.symbolsHavingReassignments = [];
    defs.patternHasBeenFound = false;
    defs.symbolsInExpressionsWithoutAssignments = [];

    return [
        testableString,
        scriptEvaluation[0],
        generatedCode,
        readableSummaryOfGeneratedCode,
        scriptEvaluation[1],
        defs.errorMessage,
        dependencyInfo,
    ];
}

function recursiveDependencies(
    variableToBeChecked: string,
    arrayWhereDependenciesWillBeAdded: string[],
    variablesAlreadyFleshedOut: string[],
    variablesWithCycles: string[],
    chainBeingChecked: string[],
    cyclesDescriptions: string[]
) {
    variablesAlreadyFleshedOut.push(variableToBeChecked);

    // recursive dependencies can only be descended if the variable is not bound to a parameter
    if (
        defs.symbolsDependencies[chainBeingChecked[chainBeingChecked.length - 1]] !=
        null
    ) {
        if (
            defs.symbolsDependencies[
                chainBeingChecked[chainBeingChecked.length - 1]
            ].indexOf("'" + variableToBeChecked) !== -1
        ) {
            if (
                arrayWhereDependenciesWillBeAdded.indexOf("'" + variableToBeChecked) ===
                -1 &&
                arrayWhereDependenciesWillBeAdded.indexOf(variableToBeChecked) === -1
            ) {
                arrayWhereDependenciesWillBeAdded.push(variableToBeChecked);
            }
            arrayWhereDependenciesWillBeAdded;
            return;
        }
    }

    chainBeingChecked.push(variableToBeChecked);

    if (defs.symbolsDependencies[variableToBeChecked] == null) {
        // end case: the passed variable has no dependencies
        // so there is nothing else to do
        if (arrayWhereDependenciesWillBeAdded.indexOf(variableToBeChecked) === -1) {
            arrayWhereDependenciesWillBeAdded.push(variableToBeChecked);
        }
        arrayWhereDependenciesWillBeAdded;
    }
    else {
        // recursion case: we have to dig deeper
        for (const i of Array.from(defs.symbolsDependencies[variableToBeChecked])) {
            // check that there is no recursion in dependencies
            // we do that by keeping a list of variables that
            // have already been "fleshed-out". If we encounter
            // any of those "fleshed-out" variables while
            // fleshing out, then there is a cycle
            if (chainBeingChecked.indexOf(i) !== -1) {
                let cyclesDescription = '';
                for (const k of Array.from(chainBeingChecked)) {
                    if (variablesWithCycles.indexOf(k) === -1) {
                        variablesWithCycles.push(k);
                    }
                    cyclesDescription += k + ' --> ';
                }
                cyclesDescription += ' ... then ' + i + ' again';
                cyclesDescriptions.push(cyclesDescription);
                // we want to flesh-out i but it's already been
                // fleshed-out, just add it to the variables
                // with cycles and move on
                // todo refactor this, there are two copies of these two lines
                if (variablesWithCycles.indexOf(i) === -1) {
                    variablesWithCycles.push(i);
                }
            }
            else {
                // flesh-out i recursively
                recursiveDependencies(
                    i,
                    arrayWhereDependenciesWillBeAdded,
                    variablesAlreadyFleshedOut,
                    variablesWithCycles,
                    chainBeingChecked,
                    cyclesDescriptions
                );
                chainBeingChecked.pop();
            }
        }
        //variablesAlreadyFleshedOut.pop()

        arrayWhereDependenciesWillBeAdded;
    }
}

const latexErrorSign =
    '\\rlap{\\large\\color{red}\\bigtriangleup}{\\ \\ \\tiny\\color{red}!}';

function msg_to_LaTeX(msg: string): string {
    let latex = msg;
    latex = latex.replace(/\n/g, '');
    latex = latex.replace(/_/g, '} \\_ \\text{');
    latex = latex.replace(TRANSPOSE_REGEX_GLOBAL, '}{}^{T}\\text{');
    latex = latex.replace(MIDDLE_DOT_REGEX_GLOBAL, '}\\cdot \\text{');
    latex = latex.replace('Stop:', '}  \\quad \\text{Stop:');
    latex = latex.replace('->', '}  \\rightarrow \\text{');
    latex = latex.replace('?', '}\\enspace ' + latexErrorSign + ' \\enspace  \\text{');
    latex = '$$\\text{' + latex.replace(/\n/g, '') + '}$$';
    return latex;
}

/**
 * @deprecated Use execute instead.
 * @param stringToBeRun 
 * @param generateLatex 
 * @returns 
 */
export function run(stringToBeRun: string, $: ExtensionEnv, generateLatex = false): string | string[] {
    let p1: U, p2: U;

    let stringToBeReturned: string | string[];

    //stringToBeRun = stringToBeRun + "\n"
    stringToBeRun = normalize_unicode_dots(stringToBeRun);

    let n = 0;
    let indexOfPartRemainingToBeParsed = 0;

    let allReturnedPlainStrings = '';
    let allReturnedLatexStrings = '';

    let collectedLatexResult = '';
    let collectedPlainResult = '';
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // while we can keep scanning commands out of the
        // passed input AND we can execute them...
        try {
            defs.errorMessage = '';
            check_stack();
            [n, p1] = scan(stringToBeRun.substring(indexOfPartRemainingToBeParsed), { useCaretForExponentiation: false });
            check_stack();
        }
        catch (error) {
            if (error instanceof Error) {
                // eslint-disable-next-line no-console
                console.log(error.stack);
                allReturnedPlainStrings += error.message;
            }
            if (generateLatex) {
                if (error instanceof Error) {
                    const theErrorMessage = msg_to_LaTeX(error.message);
                    allReturnedLatexStrings += theErrorMessage;
                }
            }
            hard_reset();

            break;
        }

        if (n === 0) {
            break;
        }

        indexOfPartRemainingToBeParsed += n;

        try {
            defs.prints.length = 0;

            p2 = top_level_transform(p1, $);

            // if the return value is NIL there isn't much point
            // in adding "NIL" to the printout
            if (NIL === p2) {
                //collectedPlainResult = stringsEmittedByUserPrintouts
                collectedPlainResult = defs.prints.join('');
                if (generateLatex) {
                    collectedLatexResult =
                        '$$' + defs.prints.join('') + '$$';
                }
            }
            else {
                collectedPlainResult = $.toInfixString(p2);
                collectedPlainResult += '\n';
                if (generateLatex) {
                    collectedLatexResult =
                        '$$' + to_latex_string(p2, $) + '$$';
                }
            }

            allReturnedPlainStrings += collectedPlainResult;
            if (generateLatex) {
                allReturnedLatexStrings += collectedLatexResult;
            }

            if (generateLatex) {
                allReturnedLatexStrings += '\n';
            }
        }
        catch (error) {
            if (error instanceof Error) {
                // eslint-disable-next-line no-console
                console.log(error.stack);
                collectedPlainResult = error.message;
                if (generateLatex) {
                    collectedLatexResult = msg_to_LaTeX(error.message);
                }
            }

            allReturnedPlainStrings += collectedPlainResult;
            if (collectedPlainResult !== '') {
                allReturnedPlainStrings += '\n';
            }

            if (generateLatex) {
                allReturnedLatexStrings += collectedLatexResult;
                allReturnedLatexStrings += '\n';
            }
        }
    }

    if (allReturnedPlainStrings[allReturnedPlainStrings.length - 1] === '\n') {
        allReturnedPlainStrings = allReturnedPlainStrings.substring(
            0,
            allReturnedPlainStrings.length - 1
        );
    }

    if (generateLatex) {
        if (allReturnedLatexStrings[allReturnedLatexStrings.length - 1] === '\n') {
            allReturnedLatexStrings = allReturnedLatexStrings.substring(
                0,
                allReturnedLatexStrings.length - 1
            );
        }
    }

    if (generateLatex) {
        stringToBeReturned = [allReturnedPlainStrings, allReturnedLatexStrings];
    }
    else {
        stringToBeReturned = allReturnedPlainStrings;
    }

    allReturnedPlainStrings = '';
    allReturnedLatexStrings = '';
    return stringToBeReturned;
}

export function computeDependenciesFromAlgebra(codeFromAlgebraBlock: string, $: ExtensionEnv) {
    // return findDependenciesInScript(codeFromAlgebraBlock, true)[6]

    // TODO this part below is duplicated from computeResultsAndJavaScriptFromAlgebra
    //      ...should refactor.
    const keepState = true;

    codeFromAlgebraBlock = normalize_unicode_dots(codeFromAlgebraBlock);

    if (!keepState) {
        defs.userSimplificationsInListForm = [];
        let userSimplificationsInProgramForm = '';
        for (const i of Array.from(defs.userSimplificationsInListForm) as U[]) {
            userSimplificationsInProgramForm +=
                'silentpattern(' +
                car(i) +
                ',' +
                car(cdr(i)) +
                ',' +
                car(cdr(cdr(i))) +
                ')\n';
        }

        soft_reset($);

        codeFromAlgebraBlock =
            userSimplificationsInProgramForm + codeFromAlgebraBlock;
    }

    return findDependenciesInScript(codeFromAlgebraBlock, $, true)[6];
}

export function computeResultsAndJavaScriptFromAlgebra(codeFromAlgebraBlock: string, $: ExtensionEnv) {

    let code,
        dependencyInfo,
        i,
        latexResult,
        readableSummaryOfCode,
        result,
        testableStringIsIgnoredHere;
    const keepState = true;

    // we start "clean" each time:
    // clear all the symbols and then re-define
    // the "starting" symbols.

    codeFromAlgebraBlock = normalize_unicode_dots(codeFromAlgebraBlock);

    if (!keepState) {
        defs.userSimplificationsInListForm = [];
        let userSimplificationsInProgramForm = '';
        for (i of Array.from(defs.userSimplificationsInListForm)) {
            userSimplificationsInProgramForm +=
                'silentpattern(' +
                car(i) +
                ',' +
                car(cdr(i)) +
                ',' +
                car(cdr(cdr(i))) +
                ')\n';
        }

        soft_reset($);

        codeFromAlgebraBlock = userSimplificationsInProgramForm + codeFromAlgebraBlock;
    }

    //breakpoint
    [
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        testableStringIsIgnoredHere,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        result,
        code,
        readableSummaryOfCode,
        latexResult,
        defs.errorMessage,
        dependencyInfo,
    ] = findDependenciesInScript(codeFromAlgebraBlock, $, false);

    if (readableSummaryOfCode !== '' || defs.errorMessage !== '') {
        latexResult += '\n$$' + readableSummaryOfCode + '$$';
        if (defs.errorMessage !== '') {
            latexResult += msg_to_LaTeX(defs.errorMessage);
        }
        latexResult = latexResult.replace(/\n/g, '\n\n');
    }

    // remove empty results altogether from latex output, which happens
    // for example for assignments to variables or
    // functions definitions
    latexResult = latexResult.replace(/\n*/, '');
    latexResult = latexResult.replace(/\$\$\$\$\n*/g, '');

    code = code.replace(/Math\./g, '');
    code = code.replace(/\n/g, '\n\n');

    return {
        code,
        // TODO temporarily pass latex in place of standard result too
        result: latexResult,
        latexResult,
        dependencyInfo,
    };
}
