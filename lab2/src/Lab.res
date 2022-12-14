// HomeWork1:
// - Ir0 => Ir1（将 Ir0 解释为 Ir1）

// 存在的相关问题（Ir0、Ir1）:
// 1. 过度捕获环境，思考:
//   - `let z = 2 in let y = 1 in fun(x) -> x + y`
//   - `let z = 2 in fun(x,y) -> x + y`
//   - #TODO 思考如何避免过度捕获环境

module Ir0 = {
  type rec expr =
    | Cst(int)
    | Var(string)
    | Add(expr, expr)
    | Mul(expr, expr)
    // 函数定义: 参数列表, 函数体
    | Fn(list<string>, expr)
    // 函数调用: 函数名, 参数列表
    | Call(expr, list<expr>)
    | Let(string, expr, expr)

  type rec value =
    | Vint(int)
    // 捕获的环境, 参数列表, 闭包体
    | Vclosure(env, list<string>, expr)
  and env = list<(string, value)>

  let vadd = (v1, v2): value => {
    switch (v1, v2) {
    | (Vint(v1), Vint(v2)) => Vint(v1 + v2)
    | _ => assert false
    }
  }

  let vmul = (v1, v2): value => {
    switch (v1, v2) {
    | (Vint(v1), Vint(v2)) => Vint(v1 * v2)
    | _ => assert false
    }
  }

  let interpret = expr => {
    let rec eval = (expr, env): value => {
      switch expr {
      | Cst(i) => Vint(i)
      | Var(variable) => List.assoc(variable, env)
      | Add(expr1, expr2) => vadd(eval(expr1, env), eval(expr2, env))
      | Mul(expr1, expr2) => vmul(eval(expr1, env), eval(expr2, env))
      | Fn(pars, body) => Vclosure(env, pars, body)
      | Call(name, args) => {
          let Vclosure(env_closure, pars_closure, body) = eval(name, env)
          let args_value = Belt.List.map(args, arg => eval(arg, env))
          // 将函数调用的实参与形参绑定
          let fun_env = Belt.List.concat(Belt.List.zip(pars_closure, args_value), env_closure)
          eval(body, fun_env)
        }

      | Let(variable, expr1, expr2) => eval(expr2, list{(variable, eval(expr1, env)), ...env})
      }
    }

    let eval_vint = vint => {
      switch vint {
      | Vint(i) => i
      | _ => assert false
      }
    }

    eval_vint(eval(expr, list{}))
  }
}

// fn(x) -> x
// ==> Ir0
// Fn(list{Var("x")}, Var("x"))
// ==> Ir1
// Fn(Var(0))
module Ir1 = {
  type rec expr =
    | Cst(int)
    | Var(int)
    | Add(expr, expr)
    | Mul(expr, expr)
    | Fn(expr) //no need to store the arity, precompute the index of parameters
    | Call(expr, list<expr>) // we need semantics checking!
    | Let(expr, expr)

  type rec value =
    | Vint(int)
    | Vclosure(env, expr)
  and env = list<value>

  let vadd = (v1, v2): value => {
    switch (v1, v2) {
    | (Vint(v1), Vint(v2)) => Vint(v1 + v2)
    | _ => assert false
    }
  }

  let vmul = (v1, v2): value => {
    switch (v1, v2) {
    | (Vint(v1), Vint(v2)) => Vint(v1 * v2)
    | _ => assert false
    }
  }

  let interpret = expr => {
    let rec eval = (expr, env): value => {
      switch expr {
      | Cst(i) => Vint(i)
      | Var(n) => List.nth(env, n)
      | Add(expr1, expr2) => vadd(eval(expr1, env), eval(expr2, env))
      | Mul(expr1, expr2) => vmul(eval(expr1, env), eval(expr2, env))
      | Fn(body) => Vclosure(env, body)
      | Call(name, args) => {
          let Vclosure(env_closure, body) = eval(name, env)
          let args_value = Belt.List.map(args, arg => eval(arg, env))
          let fun_env = Belt.List.concat(args_value, env_closure)
          eval(body, fun_env)
        }

      | Let(expr1, expr2) => eval(expr2, list{eval(expr1, env), ...env})
      }
    }

    let eval_vint = vint => {
      switch vint {
      | Vint(i) => i
      | _ => assert false
      }
    }

    eval_vint(eval(expr, list{}))
  }
}

module Compiler = {
  type env = list<string>

  let rec index = (l, s) => {
    switch l {
    | list{item, ...rest} =>
      if item == s {
        0
      } else {
        1 + index(rest, s)
      }
    | _ => assert false
    }
  }

  let convert = expr => {
    let rec compile = (expr, env) => {
      switch expr {
      | Ir0.Cst(i) => Ir1.Cst(i)
      | Add(expr1, expr2) => Add(compile(expr1, env), compile(expr2, env))
      | Mul(expr1, expr2) => Mul(compile(expr1, env), compile(expr2, env))
      | Let(variable, expr1, expr2) =>
        Let(compile(expr1, env), compile(expr2, list{variable, ...env}))
      | Var(variable) => Var(index(env, variable))
      | Fn(args, body) => Fn(compile(body, Belt.List.concat(args, env)))
      | Call(expr1, expr2) => Call(compile(expr1, env), List.map(ex => compile(ex, env), expr2))
      }
    }
    compile(expr, list{})
  }
}

// Ir0: fn(x) => x+x, fn(1)
let exprIr0 = Ir0.Call(Fn(list{"x"}, Add(Var("x"), Var("x"))), list{Cst(1)})
let result = Ir0.interpret(exprIr0)
Js.log(result)

// Ir1: Call( Fn(Add(Var(0), Var(0))), list{Cst(1)} )
let exprIr1 = Ir1.Call(Fn(Add(Var(0), Var(0))), list{Cst(1)})
let result = Ir1.interpret(exprIr1)
Js.log(result)

assert (Compiler.convert(exprIr0) == exprIr1)
