import LZString from 'lz-string';
import { SHARE_QUERY_KEY } from '../constants';
import { Command } from './';

const share = document.getElementById('share');
const tooltip = share.querySelector('.tooltip');
let timerId = 0;

share.addEventListener(
  'click',
  (e) => {
    e.preventDefault();

    const { protocol, host, pathname } = window.location;
    const value = LZString.compressToEncodedURIComponent(Command.getValue());

    let url = `${protocol}//${host}${pathname}?${SHARE_QUERY_KEY}=${value}`;
    window.history.pushState({}, '', url);
    copyTextToClipboard(url);

    clearTimeout(timerId);

    tooltip.classList.add('tooltip--active');

    timerId = setTimeout(() => {
      tooltip.classList.remove('tooltip--active');
    }, 4000);
  },
  false,
);

function copyTextToClipboard(text) {
  navigator.clipboard.writeText(text).then(function() {
    console.log('Text successfully copied to clipboard');
  }).catch(function(err) {
    console.error('Could not copy text: ', err);
  });
}
