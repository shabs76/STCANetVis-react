import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? 'https://scanet.api.brentles.co.tz' : 'https://scanet.api.brentles.co.tz';
const URL = process.env.NODE_ENV === 'production' ? 'http://localhost:390' : 'http://localhost:390';

export const socket = io(URL);