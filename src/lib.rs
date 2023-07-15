use std::{cell::RefCell, rc::Rc};

use caescript::{
    ast::Program,
    compiler::Compiler,
    eval::{
        builtin::{self},
        env::Environment,
        object::Object,
        Evaluator,
    },
    lexer::Lexer,
    parser::Parser,
    vm::VM,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/web/src/js/index.js")]
extern "C" {
    fn cae_print(input: &str);
}

fn parse(input: &str) -> Result<Program, String> {
    let mut parser = Parser::new(Lexer::new(input));
    let program = parser.parse_program().unwrap();
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

    let mut compiler = Compiler::new_with_builtins(|| {
        builtin::update_builtins("puts".to_string(), |args| {
            for arg in args {
                cae_print(&format!("{}", arg));
            }
            Object::Null
        })
    });
    let bytecode = match compiler.compile(&program) {
        Ok(bytecode) => bytecode,
        Err(err) => return err.to_string(),
    };

    let mut vm = VM::new(bytecode);
    vm.run();

    let val = vm.last_popped().unwrap_or(Object::Null);

    format!("{}", val)
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
