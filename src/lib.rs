use std::{cell::RefCell, rc::Rc};

use caescript::{
    ast::Program,
    eval::{builtin::new_builtins, env::Environment, object::Object, Evaluator},
    lexer::Lexer,
    parser::Parser,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/web/src/js/index.js")]
extern "C" {
    fn cae_print(input: &str);
}

fn parse(input: &str) -> Result<Program, String> {
    let mut parser = Parser::new(Lexer::new(input));
    let program = parser.parse_program();
    let errors = parser.errors();

    if errors.len() > 0 {
        let msg = errors
            .into_iter()
            .map(|e| format!("{}\n", e))
            .collect::<String>();

        return Err(msg);
    }

    Ok(program)
}

#[wasm_bindgen]
pub fn cae_eval(input: &str) -> String {
    let program = match parse(&input) {
        Ok(program) => program,
        Err(msg) => return msg,
    };

    let mut env = Environment::from_store(new_builtins());

    env.set(
        String::from("puts"),
        Object::Builtin(|args| {
            for arg in args {
                cae_print(&format!("{}", arg));
            }
            Object::Null
        }),
    );

    let mut evaluator = Evaluator::new(Rc::new(RefCell::new(env)));
    let evaluated = evaluator.eval(&program).unwrap_or(Object::Null);
    format!("{}", evaluated)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_should_work() {
        let res = parse("let a = b;");
        println!("{:?}", res.unwrap())
    }
}
