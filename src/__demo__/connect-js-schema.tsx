import getBicycle from './js-schema';
import startServer from './shared/startServer';

startServer(getBicycle(), __dirname + '/connect/client.js');
