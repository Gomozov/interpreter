Grammar for the interpreter language in EBNF syntax:

function        ::= fn-keyword fn-name { identifier } fn-operator expression

fn-name         ::= identifier

fn-operator     ::= '=>'

fn-keyword      ::= 'fn'


expression      ::= factor | expression operator expression

factor          ::= number | identifier | assignment | '(' expression ')' | function-call

assignment      ::= identifier '=' expression

function-call   ::= fn-name { expression }


operator        ::= '+' | '-' | '*' |  '/' | '%'


identifier      ::= letter | '_' { identifier-char }

identifier-char ::= '_' | letter | digit


number          ::= { digit } [ '.' digit { digit } ]


letter          ::= 'a' | 'b' | ... | 'y' | 'z' | 'A' | 'B' | ... | 'Y' | 'Z'

digit           ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
