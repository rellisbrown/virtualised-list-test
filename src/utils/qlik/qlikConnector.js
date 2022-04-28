/* eslint-disable prefer-promise-reject-errors */
import enigma from 'enigma.js';
import schema from 'enigma.js/schemas/12.20.0.json';
// const SenseUtilities = require('enigma.js/sense-utilities');

const getQlikTicket = () => window.location.search || '';
let qlikTicket = '';

const QlikConnector = async (qlikConfig) => {
  qlikTicket = getQlikTicket();

  const qlikTicketString = qlikTicket ? `&QlikTicket=${qlikTicket}` : '';
  const session = enigma.create({
    schema,
    url: `${qlikConfig.qsHost}/app/${qlikConfig.id}?reloadURI=${qlikConfig.reloadURI}${qlikTicketString}`,
    createSocket: (url) => new WebSocket(url),
  });

  /* session.on('traffic:sent', (data) => console.log('sent:', data));
  session.on('traffic:received', (data) => console.log('received:', data)); */
  const openSession = async () => {
    let tempGlobal;
    let tempDoc;
    try {
      const qGlobal = await session.open();
      if (qGlobal.loginUri && !qlikTicket) {
        /* console.log('hit', qlikTicket); */
        window.location.href = global.loginUri;
      }
      tempGlobal = qGlobal;
      try {
        const qDoc = await qGlobal.openDoc(qlikConfig.id);
        tempDoc = qDoc;
      } catch {
        Error('Qlik-Enigma Error: unable to openDoc');
      }
    } catch {
      Error('Qlik-Enigma Error: unable to open session');
    }
    return { tempGlobal, tempDoc };
  };

  const qlik = await openSession();

  return {
    qGlobal: qlik.tempGlobal,
    qDoc: qlik.tempDoc,
  };
};

export default QlikConnector;
