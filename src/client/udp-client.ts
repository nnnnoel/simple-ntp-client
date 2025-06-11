import {createSocket} from "node:dgram";

export class DisposableUDPClient implements Disposable {
    #client = createSocket('udp4');
    readonly #host: string;
    readonly #port: number;

    public constructor(host: string, port: number) {
        this.#host = host;
        this.#port = port;
    }

    send(data: Buffer) {
        return new Promise<Buffer<ArrayBufferLike>>((resolve, reject) => {
            this.#client.send(data, 0, data.length, this.#port, this.#host, (err) => {
                if (err) return reject(err);
                this.#client.once('message', resolve);
            });
        })
    }

    [Symbol.dispose](): void {
        this.#client.close();
    }
}