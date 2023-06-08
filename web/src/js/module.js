import init, {cae_eval} from "./caescript_web";


export let Module = {};

init().then(()=> {
Module = {
  isReady: () => true,
  eval: (str) => {
      const now = Date.now();
      let res = cae_eval(str);
      const elapse = Date.now() - now;
      return {
          res: res,
          elapse: elapse
      }
  },
};
})
