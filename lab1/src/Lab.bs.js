// Generated by ReScript, PLEASE EDIT WITH CARE

import * as List from "rescript/lib/es6/list.js";
import * as Belt_List from "rescript/lib/es6/belt_List.js";
import * as Belt_Array from "rescript/lib/es6/belt_Array.js";
import * as Belt_Option from "rescript/lib/es6/belt_Option.js";

function assoc(variable, env) {
  return Belt_Option.getExn(Belt_List.getAssoc(env, variable, (function (k, item) {
                    return k === item;
                  })));
}

function $$eval(_expr, _env) {
  while(true) {
    var env = _env;
    var expr = _expr;
    switch (expr.TAG | 0) {
      case /* Add */0 :
          return $$eval(expr._0, env) + $$eval(expr._1, env) | 0;
      case /* Mul */1 :
          return Math.imul($$eval(expr._0, env), $$eval(expr._1, env));
      case /* Cst */2 :
          return expr._0;
      case /* Var */3 :
          return assoc(expr._0, env);
      case /* Let */4 :
          _env = {
            hd: [
              expr._0,
              $$eval(expr._1, env)
            ],
            tl: env
          };
          _expr = expr._2;
          continue ;
      
    }
  };
}

function tostring(expr) {
  switch (expr.TAG | 0) {
    case /* Add */0 :
        var s1 = tostring(expr._0);
        var s2 = tostring(expr._1);
        return "Ir0.Add(" + s1 + ", " + s2 + ")";
    case /* Mul */1 :
        var s1$1 = tostring(expr._0);
        var s2$1 = tostring(expr._1);
        return "Ir0.Mul(" + s1$1 + ", " + s2$1 + ")";
    case /* Cst */2 :
        return "Ir0.Cst(" + expr._0 + ")";
    case /* Var */3 :
        return "Ir0.Var(\"" + expr._0 + "\")";
    case /* Let */4 :
        var s1$2 = tostring(expr._1);
        var s2$2 = tostring(expr._2);
        return "Ir0.Let(\"" + expr._0 + "\", " + s1$2 + ", " + s2$2 + ")";
    
  }
}

var Ir0 = {
  assoc: assoc,
  $$eval: $$eval,
  tostring: tostring
};

function $$eval$1(_expr, _env) {
  while(true) {
    var env = _env;
    var expr = _expr;
    switch (expr.TAG | 0) {
      case /* Add */0 :
          return $$eval$1(expr._0, env) + $$eval$1(expr._1, env) | 0;
      case /* Mul */1 :
          return Math.imul($$eval$1(expr._0, env), $$eval$1(expr._1, env));
      case /* Cst */2 :
          return expr._0;
      case /* Var */3 :
          return List.nth(env, expr._0);
      case /* Let */4 :
          _env = {
            hd: $$eval$1(expr._0, env),
            tl: env
          };
          _expr = expr._1;
          continue ;
      
    }
  };
}

function tostring$1(expr) {
  switch (expr.TAG | 0) {
    case /* Add */0 :
        var s1 = tostring$1(expr._0);
        var s2 = tostring$1(expr._1);
        return "Ir1.Add(" + s1 + ", " + s2 + ")";
    case /* Mul */1 :
        var s1$1 = tostring$1(expr._0);
        var s2$1 = tostring$1(expr._1);
        return "Ir1.Mul(" + s1$1 + ", " + s2$1 + ")";
    case /* Cst */2 :
        return "Ir1.Cst(" + expr._0 + ")";
    case /* Var */3 :
        return "Var(" + expr._0 + ")";
    case /* Let */4 :
        var s1$2 = tostring$1(expr._0);
        var s2$2 = tostring$1(expr._1);
        return "Ir1.Let(" + s1$2 + ", " + s2$2 + ")";
    
  }
}

var Ir1 = {
  $$eval: $$eval$1,
  tostring: tostring$1
};

function index(s, list) {
  var count = 0;
  for(var i = 0 ,i_finish = Belt_List.length(list); i < i_finish; ++i){
    if (s !== Belt_Option.getExn(Belt_List.get(list, i))) {
      count = i;
    }
    
  }
  return count;
}

function convert(expr, env) {
  switch (expr.TAG | 0) {
    case /* Add */0 :
        return {
                TAG: /* Add */0,
                _0: convert(expr._0, env),
                _1: convert(expr._1, env)
              };
    case /* Mul */1 :
        return {
                TAG: /* Mul */1,
                _0: convert(expr._0, env),
                _1: convert(expr._1, env)
              };
    case /* Cst */2 :
        return {
                TAG: /* Cst */2,
                _0: expr._0
              };
    case /* Var */3 :
        return {
                TAG: /* Var */3,
                _0: index(expr._0, env)
              };
    case /* Let */4 :
        return {
                TAG: /* Let */4,
                _0: convert(expr._1, env),
                _1: convert(expr._2, {
                      hd: expr._0,
                      tl: env
                    })
              };
    
  }
}

var ConvertIr0 = {
  index: index,
  convert: convert
};

function check_convert(expr) {
  var ir0_result = $$eval(expr, /* [] */0);
  var ir1_expr = convert(expr, /* [] */0);
  var ir1_result = $$eval$1(ir1_expr, /* [] */0);
  if (ir0_result === ir1_result) {
    return ;
  }
  throw {
        RE_EXN_ID: "Assert_failure",
        _1: [
          "Lab.res",
          135,
          4
        ],
        Error: new Error()
      };
}

function test1(param) {
  var expr_array = [
    {
      TAG: /* Cst */2,
      _0: 10
    },
    {
      TAG: /* Add */0,
      _0: {
        TAG: /* Cst */2,
        _0: 10
      },
      _1: {
        TAG: /* Let */4,
        _0: "x",
        _1: {
          TAG: /* Cst */2,
          _0: 20
        },
        _2: {
          TAG: /* Add */0,
          _0: {
            TAG: /* Var */3,
            _0: "x"
          },
          _1: {
            TAG: /* Cst */2,
            _0: 50
          }
        }
      }
    },
    {
      TAG: /* Mul */1,
      _0: {
        TAG: /* Cst */2,
        _0: 10
      },
      _1: {
        TAG: /* Let */4,
        _0: "x",
        _1: {
          TAG: /* Cst */2,
          _0: 20
        },
        _2: {
          TAG: /* Add */0,
          _0: {
            TAG: /* Var */3,
            _0: "x"
          },
          _1: {
            TAG: /* Cst */2,
            _0: 50
          }
        }
      }
    },
    {
      TAG: /* Let */4,
      _0: "x",
      _1: {
        TAG: /* Let */4,
        _0: "x",
        _1: {
          TAG: /* Cst */2,
          _0: 1
        },
        _2: {
          TAG: /* Add */0,
          _0: {
            TAG: /* Var */3,
            _0: "x"
          },
          _1: {
            TAG: /* Var */3,
            _0: "x"
          }
        }
      },
      _2: {
        TAG: /* Var */3,
        _0: "x"
      }
    },
    {
      TAG: /* Let */4,
      _0: "x",
      _1: {
        TAG: /* Cst */2,
        _0: 10
      },
      _2: {
        TAG: /* Let */4,
        _0: "x",
        _1: {
          TAG: /* Add */0,
          _0: {
            TAG: /* Var */3,
            _0: "x"
          },
          _1: {
            TAG: /* Var */3,
            _0: "x"
          }
        },
        _2: {
          TAG: /* Var */3,
          _0: "x"
        }
      }
    }
  ];
  Belt_Array.forEachWithIndex(expr_array, (function (index, expr) {
          check_convert(expr);
          console.log("Test " + index + ": Ir0 convert to Ir1 is passed!");
        }));
}

var Test = {
  check_convert: check_convert,
  test1: test1
};

test1(undefined);

export {
  Ir0 ,
  Ir1 ,
  ConvertIr0 ,
  Test ,
}
/*  Not a pure module */