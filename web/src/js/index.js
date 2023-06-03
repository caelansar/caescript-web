import { Icon } from './custom-elements/x-icon';
import { Module } from './module';
import { Command } from './editor';
import '../css/style.css';

customElements.define('x-icon', Icon);

export function cae_print(str) {
  console.log(str);
  Command.print(str);
}
