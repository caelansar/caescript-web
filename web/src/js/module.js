import init, {cae_vm_eval, cae_interpreter_eval} from "./caescript_web";


export let Module = {};

init().then(()=> {
Module = {
  isReady: () => true,
  eval: (fn, str) => {
      const now = Date.now();
      let res = fn(str);
      const elapse = Date.now() - now;
      return {
          res: res,
          elapse: elapse
      }
  },
  vm_eval: (str) => {
      return cae_vm_eval(str);
  },
  interpreter_eval: (str) => {
      return cae_interpreter_eval(str);
  },
};
})
