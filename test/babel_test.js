const fs = require('fs');
const babylon = require('babylon');
const traverse = require('@babel/traverse').default;

const code = `function square(n) {
    return n * n;
  }`;

const ast = babylon.parse(code);
const str = JSON.stringify(ast, null, '\t');
fs.writeFile('./babylon_parse.json', str, 'utf8', (err) => {
    if (err) {
        console.log('babylon解析错误:', err);
        throw err;
    }
    console.log('babylon解析完毕');
});

traverse(ast, {
    enter(path) {
        if (
            path.node.type === "Identifier" &&
            path.node.name === "n"
        ) {
            path.node.name = "x";
        }
    }
});
