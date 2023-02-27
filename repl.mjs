import process from 'node:process';
import repl from 'node:repl';
import console from 'node:console';
import { create_script_engine } from './dist/commonjs/index.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function isRecoverableError(error) {
    if (error.name === 'SyntaxError') {
        return /^(Unexpected end of input|Unexpected token)/.test(error.message);
    }
    return false;
}

const engine = create_script_engine({
    useCaretForExponentiation: false,
    useDefinitions: false
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function run(cmd, context, filename, callback) {
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
    const { values, errors } = engine.executeScript(cmd);
    for (const error of errors) {
        return `${error}`;
    }
    for (const value of values) {
        return engine.renderAsInfix(value);
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
    engine.clearBindings();
});

// r.write("");

// r.close();

process.on('beforeExit', (code) => {
    console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
    engine.release();
    if (code !== 0) {
        console.log('Process exit event with code: ', code);
    }
});
