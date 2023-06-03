import init, {cae_eval} from "./caescript_web";


export let Module = {};

init().then(()=> {
Module = {
  isReady: () => true,
  eval: cae_eval,
};
})
