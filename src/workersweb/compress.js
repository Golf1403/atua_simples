import { LZstring } from './lz_scripts';

const workercode = function () {
  self.onmessage = function (event) {
    const message = event.data;
    const compress = message.data;

    switch (message.type) {
      case 'compress':
        console.info('compressing...');
        const compressed = LZString.compressToBase64(compress);
        console.info('compressed');
        postMessage({ type: 'compressed', data: compressed });
        break;

      case 'decompress':
        console.info('decompressing...');
        const decompressed = LZString.decompressFromBase64(compress);
        console.info('decompressed');
        postMessage({ type: 'decompressed', data: decompressed });
        break;
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([`const LZString = ${LZstring.toString()}; ${code}`], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
