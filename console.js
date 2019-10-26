const pjson = require('./package.json');
const mc = require('./interpretator.js');
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'INTERPRETER> '
});
const get_help = function () {
  console.log(pjson.name+", version: "+pjson.version+".\n",
"Grammar for the interpreter language in EBNF syntax:\n",
"function        ::= fn-keyword fn-name { identifier } fn-operator expression\n",
"fn-name         ::= identifier\n",
"fn-operator     ::= '=>'\n",
"fn-keyword      ::= 'fn'\n",
"\n",
"expression      ::= factor | expression operator expression\n",
"factor          ::= number | identifier | assignment | '(' expression ')' | function-call\n",
"assignment      ::= identifier '=' expression\n",
"function-call   ::= fn-name { expression }\n",
"\n",
"operator        ::= '+' | '-' | '*' | '/' | '%'\n",
"\n",
"identifier      ::= letter | '_' { identifier-char }\n",
"identifier-char ::= '_' | letter | digit\n",
"\n",
"number          ::= { digit } [ '.' digit { digit } ]\n",
"\n",
"letter          ::= 'a' | 'b' | ... | 'y' | 'z' | 'A' | 'B' | ... | 'Y' | 'Z'\n",
"digit           ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'\n");
}
let intr = new mc();
get_help();
rl.prompt();
rl.on('line', (line) => {
  switch (line.trim()) {
    case "help":
      get_help();
      break;
    default:
      console.log(intr.input(line.trim()));
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Exit');
  process.exit(0);
});
