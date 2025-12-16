import { createClient } from 'redis';

const client = createClient();
client.connect().then(() => {});

export default client