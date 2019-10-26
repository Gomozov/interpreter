function Interpreter() {
  this.vars = {};
  this.functions = {};
}

Interpreter.prototype.toObject = function (arr) {
  let res = {};
  for (var i = 0; i < arr.length; i +=1) {
    if (res.hasOwnProperty(arr[i])) {
      throw new Error("ERROR: Double declaration.");
    }
    res[arr[i]] = undefined;
  } 
  return res;
}

Interpreter.prototype.tokenize = function (program) {
    if (program === "")
        return [];
    const regex = /([A-Za-z_][A-Za-z0-9_]*|(?<!\w)-[0-9]*\.?[0-9]+|[-+*\/\%=\(\)]|\s+)/g;
    return program.split(regex).filter(function (s) { return !s.match(/^\s*$/); });
};

Interpreter.prototype.input = function (expr) {
  //console.log("**********INPUT:", expr, "**********");
  //console.log("FUNCTION INPUT:", this.functions);
  //console.log("VARIABLES INPUT:", this.vars);
  let tkns = this.tokenize(expr);
  //console.log("TKNS:", tkns);
  if (tkns.length === 0) {
    return "";
  }
  //***** Add functions *****
  if (tkns[0] === "fn") {
    if (this.vars.hasOwnProperty(tkns[1])) {
      throw new Error("ERROR: Name conflict. \'" + tkns[1] + "\' is a variable.");
    }
    let dlm = tkns.findIndex((e,i,a) => (e === "=") ? true : false);
    let vrbls = this.toObject(tkns.slice(2, dlm));
    let expn = tkns.slice(dlm+2, tkns.length);
    for (let i = 0; i < expn.length; i += 1) {
      if (expn[i].match(/[A-Za-z][A-Za-z0-9_]*/)) {
        if (!vrbls.hasOwnProperty(expn[i])) {
          throw new Error("ERROR: Invalid identifier \'" + expn[i] + "\' in function body.");
        }
      }  
    }
    this.functions[tkns[1]] = {"variables": vrbls, "expression": expn};
    return "";
  }
    
  tkns = this.parenthesis(tkns);
  tkns = this.calculate(tkns);
       
  //console.log("FINAL:", tkns);
  if (isNaN(Number(tkns))) {
    throw new Error('Error! Result is NaN');
  }
  return Number(tkns);
}

Interpreter.prototype.parenthesis = function (tokens) {
  let pos = -1;
  let res;
  for (let i = 0; i < tokens.length; i = i + 1) {
    if (tokens[i].match(/\(/)) {
      pos = i; 
    }
    if ((tokens[i].match(/\)/))&&(pos >= 0)) {
      res = this.calculate(tokens.slice(pos+1, i));
      tokens.splice(pos, i-pos+1, res);
      pos = -1;
      i = -1;
    }
  }  
  return tokens;
}

Interpreter.prototype.calculateFunction = function (tokens) {
  //console.log("**********calculateFunction**********");
  //console.log("INPUT TOKENS: ", tokens);
  let f = tokens.splice(0,1)[0];
  let vrbl = Object.assign({}, this.functions[f]["variables"]);
  let cnt = 0;
  for (const [key] of Object.keys(vrbl)) {
    vrbl[key] = tokens[cnt];
    cnt += 1;
  }
  let exp = Object.assign([], this.functions[f]["expression"]);
  for (let i = 0; i < exp.length; i = i + 1) {
    if (exp[i].match(/[A-Za-z][A-Za-z0-9_]*/)) {
      if (vrbl.hasOwnProperty(exp[i])) {
        exp[i] = vrbl[exp[i]];
      }   
    }
  }
  //console.log("EXP result:", exp);
  exp = this.parenthesis(exp);
  exp = this.calculate(exp);
  //console.log("**********calculateFunction result:", exp, "**********");
  return exp;
}

Interpreter.prototype.calculate = function (tokens) {
  //console.log("**********calculate**********");
  //console.log("calculate INPUT:", tokens);
  //***** Add variables *****
    let res;
    for (let i=tokens.length-1; i > -1; i -= 1) {
      if (tokens[i] === "=") {
        if ((tokens[i-1].match(/[A-Za-z][A-Za-z0-9_]*/))&&(tokens[i+1])) {
          if (this.functions.hasOwnProperty(tokens[i-1])) {
            throw new Error("ERROR: Name conflict. \'" + tokens[i-1] + "\' is a function.");
          }
          res = this.calculate(tokens.slice(i+1));
          if (isNaN(Number(res))) {
            throw new Error('Error! Result is NaN');
          }
          this.vars[tokens[i-1]] = res;
          tokens.splice(i-1, tokens.length-i+1, res);
        }
      }
    }
  //*****Replace variables by numbers*****  
  for (let i = 0; i < tokens.length; i = i + 1) {
    if (tokens[i].match(/[A-Za-z][A-Za-z0-9_]*/)) {
      if (this.vars.hasOwnProperty(tokens[i])) {
        tokens[i] = this.vars[tokens[i]];
      }   
    }
  }
  //*****Calculate functions*****
  for (let i=tokens.length-1; i > -1; i -= 1) {
    if (tokens[i].match(/[A-Za-z][A-Za-z0-9_]*/)) {
      if (this.functions.hasOwnProperty(tokens[i])) {
        res = this.calculateFunction(tokens.splice(i, Object.keys(this.functions[tokens[i]]["variables"]).length+1));
        tokens.splice(i, 0, res);
      } else {
        throw new Error("ReferenceError: " + tokens[i] + " is not defined");
      }  
    }
  }
  
  for (let i = 0; i < tokens.length; i = i + 1) {
      if (tokens[i] === "*") {
        tokens.splice(i-1, 3, tokens[i-1]*tokens[i+1]); 
        i-=i;
      }
      if (tokens[i] === "/") {
        tokens.splice(i-1, 3, tokens[i-1]/tokens[i+1]); 
        i-=i;
      }
      if (tokens[i] === "%") {
        tokens.splice(i-1, 3, tokens[i-1]%tokens[i+1]); 
        i-=i;
      }
    }
  for (let i = 0; i < tokens.length; i = i + 1) {
    if (tokens[i] === "+") {
      tokens.splice(i-1, 3, Number(tokens[i-1])+Number(tokens[i+1])); 
      i-=i;
    }
    if (tokens[i] === "-") {
      tokens.splice(i-1, 3, Number(tokens[i-1])-Number(tokens[i+1])); 
      i-=i;
    }
  }
  //console.log("**********calculate result:", tokens, "**********");
  return Number(tokens)+"";
}

module.exports = Interpreter;
