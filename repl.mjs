import process from 'node:process';
import repl from 'node:repl';
import { create_script_context, ScriptKind } from './dist/commonjs/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
}

const ctxt = create_script_context({
    scriptKind: ScriptKind.BRITE,
    useCaretForExponentiation: false,
    useDefinitions: false
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function run(cmd, unusedContext, filename, callback) {
    /*
    let result;
    try {
        result = vm.runInThisContext(cmd);
    }
    catch (e) {
        if (isRecoverableError(e)) {
            return callback(new repl.Recoverable(e));
        }
    }
    callback(null, result);
    */
    const { values, errors } = ctxt.executeScript(cmd);
    for (const error of errors) {
        return `${error}`;
    }
    for (const value of values) {
        return ctxt.renderAsInfix(value);
    }
}

const options = {
    prompt: 'symbolic-math> ',
    eval: (input, context, filename, callback) => {
        callback(null, run(input));
    },
    ignoreUndefined: true,
    useColors: true
};

const r = new repl.REPLServer(options);

//
// Handle the .exit command
//
r.on('exit', () => {
    process.exit();
});

//
// Handle the .clear command.
//
r.on('reset', () => {
    ctxt.clearBindings();
});

// r.write("");

// r.close();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
process.on('beforeExit', (code) => {
    // console.lg('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
    ctxt.release();
    if (code !== 0) {
        // console.lg('Process exit event with code: ', code);
    }
});
