import escape from 'escape-html';
import LZString from 'lz-string';
import CodeMirror from 'codemirror';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/hint/show-hint';
import { SHARE_QUERY_KEY, SNIPPETS } from '../constants';
import { Module } from '../module';
import { date2time } from './utils';
import './caescript-mode';
import { snippet } from './snippet';
import './share';

const source = document.getElementById('source');
const run = document.getElementById('run');
const outputContainer = document.getElementById('output-container');
const bytecodeContainer = document.getElementById('bytecode-container');
const output = document.getElementById('output');
const bytecode = document.getElementById('bytecode');
const lastUpdated = document.getElementById('last-updated');
const engine = document.getElementById('engine');
const loader = document.getElementById("loader");

const noop = () => {};

var keywords = ["let", "fn", "break", "continue", "for", "if", "true", "false", "return", "null",
    "len", "puts", "push", "first", "last", "rest"];

// register compltee function
CodeMirror.registerHelper("hint", "caescript", function(editor) {
  var cur = editor.getCursor();
  var token = editor.getTokenAt(cur);

  // filter by current token
  var list = keywords.filter(function(item) {
    return item.startsWith(token.string);
  });

  return {
    list: list,
    from: CodeMirror.Pos(cur.line, token.start),
    to: CodeMirror.Pos(cur.line, token.end)
  };
});

const editor = CodeMirror.fromTextArea(source, {
  mode: 'caescript',
  theme: 'caescript',
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: true,
  smartIndent: true,
  extraKeys: {
      "Ctrl-/": function(cm) {cm.execCommand("toggleComment")},
      "Cmd-/": function(cm) {cm.execCommand("toggleComment")},
  },
  hintOptions: { completeSingle: false }
});

// set trigger event
editor.on("inputRead", function(cm, event) {
  if (event.text.length === 1 || event.origin === '+delete') {
    cm.showHint({completeSingle: false});
  }
});

export const Command = {
  set: (value) => {
    editor.setValue(value);
  },

  run: () => {
    if (!Module.isReady()) {
      return;
    }

    const value = Command.getValue();

    Command.clear();
    if (engine.value === "vm") {
        Command.print_obj(value === '' ? null : Module.eval(Module.vm_eval, value));
    } else {
        Command.print_obj(value === '' ? null : Module.eval(Module.interpreter_eval, value));
    }
  },

  getValue: () => editor.getValue(),
  setValue: (value) => editor.setValue(value),

  print_obj: (obj) => {
    if (obj != null) {
        const now = new Date();
        const time = date2time(now);
        lastUpdated.textContent = `LAST UPDATE: ${time} | ELAPSE: ${obj.elapse}ms`;
        lastUpdated.dateTime = now.toISOString();
        lastUpdated.style.display = 'block';

        output.innerHTML += escape(`${obj.res}\n`);

        outputContainer.scrollTop = outputContainer.scrollHeight - outputContainer.clientHeight;
    }
  },

  print_bytecode: (str) => {
    bytecode.innerHTML += escape(`${str}\n`);
    bytecodeContainer.scrollTop = bytecodeContainer.scrollHeight - bytecodeContainer.clientHeight;
  },

  print: (str) => {
    const now = new Date();
    const time = date2time(now);
    lastUpdated.textContent = `LAST UPDATE: ${time}`;
    lastUpdated.dateTime = now.toISOString();
    lastUpdated.style.display = 'block';

    output.innerHTML += escape(`${str}\n`);

    outputContainer.scrollTop = outputContainer.scrollHeight - outputContainer.clientHeight;
  },

  clear: () => {
    lastUpdated.dateTime = '';
    lastUpdated.style.display = 'none';
    output.innerHTML = '';
    outputContainer.scrollTop = 0;
    bytecode.innerHTML = '';
    bytecodeContainer.scrollTop = 0;
  },

  format: () => {
  },
};

const query = new window.URLSearchParams(window.location.search);

if (query.has(SHARE_QUERY_KEY)) {
  Command.setValue(LZString.decompressFromEncodedURIComponent(query.get(SHARE_QUERY_KEY)));
  snippet.selectedIndex = 0;
} else {
  Command.setValue(SNIPPETS[0].value);
}

editor.addKeyMap({
  'Ctrl-Enter': noop,
  'Shift-Enter': noop,
  'Ctrl-L': noop,
});

document.addEventListener(
  'keydown',
  (e) => {
    const { ctrlKey, metaKey, shiftKey, key: raw } = e;
    const key = raw.toLowerCase();

    // Ctrl + Enter
    if (ctrlKey && key === 'enter') {
      Command.run();
    }

    // Shift + Enter
    if (shiftKey && key === 'enter') {
      Command.format();
    }

    // Ctrl + L
    if (ctrlKey && key === 'l') {
      Command.clear();
    }
  },
  false,
);

run.addEventListener(
  'click',
  (e) => {
    e.preventDefault();
    loader.style.display = "inline-block";

     setTimeout(() => {
         Command.run();
         loader.style.display = "none";
     }, 30);
  },
  false,
);
