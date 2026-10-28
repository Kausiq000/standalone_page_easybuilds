const path = require('path');
const ts = require('c:/Users/Kausiq/AppData/Local/Programs/Antigravity IDE/resources/app/extensions/node_modules/typescript/lib/typescript.js');

const filePath = path.resolve(__dirname, '../src/components/ContactStudio.jsx');

// Let's test what options VS Code uses for an implicit JS/JSX project
// In VS Code, when opening a .jsx file without jsconfig:
// compilerOptions: { allowJs: true, maxNodeModuleJsDepth: 2, allowSyntheticDefaultImports: true, skipLibCheck: true, noEmit: true, checkJs: false or true }
const testOptions = [
  { name: 'implicit default (checkJs: false)', options: { allowJs: true, checkJs: false, target: ts.ScriptTarget.ES2020 } },
  { name: 'implicit default (checkJs: true)', options: { allowJs: true, checkJs: true, target: ts.ScriptTarget.ES2020 } },
  { name: 'implicit + jsx preserve', options: { allowJs: true, checkJs: true, jsx: ts.JsxEmit.Preserve } },
  { name: 'implicit + jsx react', options: { allowJs: true, checkJs: true, jsx: ts.JsxEmit.React } },
  { name: 'implicit + jsx react-jsx', options: { allowJs: true, checkJs: true, jsx: ts.JsxEmit.ReactJSX } },
  { name: 'checkJs: false, jsx: undefined', options: { allowJs: true, checkJs: false } },
  { name: 'no allowJs', options: {} },
];

testOptions.forEach(t => {
  const host = ts.createCompilerHost(t.options);
  const program = ts.createProgram([filePath], t.options, host);
  const diags = ts.getPreEmitDiagnostics(program).filter(d => d.file && d.file.fileName.includes('ContactStudio.jsx'));
  console.log(t.name + ' -> diags count: ' + diags.length);
  const codes = {};
  diags.forEach(d => {
    codes[d.code] = (codes[d.code] || 0) + 1;
  });
  console.log('  Codes:', codes);
});

