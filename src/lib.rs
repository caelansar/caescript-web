use std::{cell::RefCell, rc::Rc};

use caescript::{
    ast::Program,
    compiler::Compiler,
    eval::{builtin, env::Environment, object::Object, Evaluator},
    lexer::Lexer,
    parser::Parser,
    vm::VM,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen(module = "/web/src/js/index.js")]
extern "C" {
    fn cae_print(input: &str);
}

#[wasm_bindgen(module = "/web/src/js/index.js")]
extern "C" {
    fn cae_print_bytecode(input: &str);
}

fn parse(input: &str) -> Result<Program, String> {
    let mut parser = Parser::new(Lexer::new(input));
    parser.parse_program()
}

#[wasm_bindgen]
pub fn cae_interpreter_eval(input: &str) -> String {
    let program = match parse(&input) {
        Ok(program) => program,
        Err(msg) => return msg,
    };

    let env = Environment::from_store(builtin::new_custom_builtins(|| {
        builtin::update_builtins("puts".to_string(), |args| {
            for arg in args {
                cae_print(&format!("{}", arg));
            }
            Object::Null
        })
    }));

    let mut evaluator = Evaluator::new(Rc::new(RefCell::new(env)));
    let evaluated = evaluator.eval(&program).unwrap_or(Object::Null);
    format!("{}", evaluated)
}

#[wasm_bindgen]
pub fn cae_vm_eval(input: &str) -> String {
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

    let ins = bytecode.instructions.to_string();
    cae_print_bytecode(&format!("{}", ins.to_string()));

    let mut vm = VM::new(bytecode);
    vm.run();

    let val = vm.last_popped().unwrap_or(Object::Null.into());

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
