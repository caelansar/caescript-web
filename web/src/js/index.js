import '../css/style.css';
import { Icon } from './custom-elements/x-icon';
import { Module } from './module';
import { Command } from './editor';

customElements.define('x-icon', Icon);

export function cae_print(str) {
  console.log(str);
  Command.print(str);
}

export function cae_print_bytecode(str) {
  Command.print_bytecode(str);
}
