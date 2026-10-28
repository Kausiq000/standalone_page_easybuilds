const path = require('path');
const ts = require('../../node_modules/typescript');

const filePath = path.resolve(__dirname, '../src/components/ContactStudio.jsx');

const testConfigs = [
  { name: 'default checkJs', options: { allowJs: true, checkJs: true, target: ts.ScriptTarget.ESNext, jsx: ts.JsxEmit.ReactJSX } },
  { name: 'strict checkJs', options: { allowJs: true, checkJs: true, strict: true, target: ts.ScriptTarget.ESNext, jsx: ts.JsxEmit.ReactJSX } },
  { name: 'noUnusedLocals', options: { allowJs: true, checkJs: true, noUnusedLocals: true, noUnusedParameters: true, target: ts.ScriptTarget.ESNext, jsx: ts.JsxEmit.ReactJSX } },
  { name: 'target ES5', options: { allowJs: true, checkJs: true, target: ts.ScriptTarget.ES5, jsx: ts.JsxEmit.ReactJSX } },
  { name: 'no jsx flag (preserve)', options: { allowJs: true, checkJs: true, target: ts.ScriptTarget.ESNext, jsx: ts.JsxEmit.Preserve } },
  { name: 'no jsx flag (none)', options: { allowJs: true, checkJs: true, target: ts.ScriptTarget.ESNext, jsx: ts.JsxEmit.None } },
  { name: 'implicit project default (target ES2020)', options: { allowJs: true, checkJs: true, target: ts.ScriptTarget.ES2020 } },
];

testConfigs.forEach(cfg => {
  const program = ts.createProgram([filePath], cfg.options);
  const diags = ts.getPreEmitDiagnostics(program).filter(d => d.file && d.file.fileName.includes('ContactStudio.jsx'));
  console.log(cfg.name + ' -> count: ' + diags.length);
  if (diags.length > 50) {
    console.log('Sample errors from ' + cfg.name + ':');
    diags.slice(0, 10).forEach(d => {
      const pos = d.file.getLineAndCharacterOfPosition(d.start);
      console.log('  ' + (pos.line + 1) + ':' + (pos.character + 1) + ' [' + d.code + '] ' + ts.flattenDiagnosticMessageText(d.messageText, '\n'));
    });
  }
});
