import CurrentAccountService from '@/services/CalculationsServices/CurrentAccountService/AccountService';

self.onmessage = async function (event) {
  const currentAccountService = new CurrentAccountService();
  const message = event.data;
  const payload = message.data;

  switch (message.type) {
    case 'recalculate':
      try {
        console.info(`recalculating... ${payload.type || ''}`);
        const {
          authorList: newAuthorList,
          views,
          feeFineList,
          summary,
        } = await currentAccountService.calculate(payload);
        postMessage({ type: 'recalculated', data: { authorList: newAuthorList, views, feeFineList, summary } });
      } catch (error) {
        postMessage({ type: 'error', data: error });
      }
      break;
  }
};
