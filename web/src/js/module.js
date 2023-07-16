import init, {cae_vm_eval, cae_interpreter_eval} from "./caescript_web";


export let Module = {};

init().then(()=> {
Module = {
  isReady: () => true,
  vm_eval: (str) => {
      const now = Date.now();
      let res = cae_vm_eval(str);
      const elapse = Date.now() - now;
      return {
          res: res,
          elapse: elapse
      }
  },
  interpreter_eval: (str) => {
      const now = Date.now();
      let res = cae_interpreter_eval(str);
      const elapse = Date.now() - now;
      return {
          res: res,
          elapse: elapse
      }
  },
};
})
