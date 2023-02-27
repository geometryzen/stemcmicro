import repl from 'node:repl';
import { create_script_engine } from './dist/commonjs/index.js';

const engine = create_script_engine({
    useDefinitions: true
});

function run(sourceText) {
    const { values, errors } = engine.executeScript(sourceText);
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
};

repl.start(options);