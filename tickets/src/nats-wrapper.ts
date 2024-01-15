import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // create a nats client as a class property 
  private _client?: Stan;

  get client() { // expose _client to public
    if (!this._client) {
      throw new Error('cannot access NATS client before connecting');
    }
    return this._client;
  }

  connect(clutserId: string, clientId: string, url: string) {
    this._client = nats.connect(clutserId, clientId, { url });

    // define callback function using promise
    return new Promise<void>((resolve, reject) => {
      this.client!.on('connect', () => {
        console.log('connect to NATS');
        resolve();
      });
      this.client!.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();