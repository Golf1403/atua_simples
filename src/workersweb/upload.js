const workercode = function () {
  self.onmessage = function (event) {
    const message = event.data;
    const compress = message.data;

    switch (message.type) {
      case 'upload':
        console.info('uploading...');
        console.info('uploaded');
        postMessage({ type: 'uploaded', data: compress });
        break;
    }
  };
};

let code = workercode.toString();
code = code.substring(code.indexOf('{') + 1, code.lastIndexOf('}'));
const blob = new Blob([`${code}`], { type: 'application/javascript' });
const worker_script = URL.createObjectURL(blob);

export default worker_script;
