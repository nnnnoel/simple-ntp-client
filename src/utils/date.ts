import {DisposableUDPClient} from "../client/udp-client";
import {parseNTPToDate} from "../protocol/response";
import {createNTPRequest} from "../protocol/request";

export async function getNTPDate(host: string, port: number = 123) {
    using client = new DisposableUDPClient(host, port);
    const request = createNTPRequest();
    const response = await client.send(request);

    return parseNTPToDate(response);
}

export async function getNTPTime(host: string, port: number = 123) {
    const date = await getNTPDate(host, port);
    return date.getTime();
}
