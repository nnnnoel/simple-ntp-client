import {NTP_MODE, NTP_VERSION} from "./constants";

export function createNTPRequest() {
    const ntpData = Buffer.alloc(48, 0);
    ntpData[0] = NTP_MODE | (NTP_VERSION << 3);
    return ntpData;
}
