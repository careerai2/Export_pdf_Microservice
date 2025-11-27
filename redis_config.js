import { createClient } from 'redis';
import { USERNAME, PASSWORD, HOST, PORT } from './secrets.js';

const client = createClient({
    username: USERNAME,
    password: PASSWORD,
    socket: {
        host: HOST,
        port: PORT
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

export default client;
