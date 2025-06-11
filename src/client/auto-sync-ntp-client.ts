import {getNTPDate} from "../utils/date";

const INTERVAL_PERIOD = 1_000;
export class AutoSyncNTPClient {
    public static readonly DEFAULT_HOST = 'time.google.com';
    public static readonly DEFAULT_PORT = 123;

    #ntpNow: Date | undefined;
    #lastUpdateTime: Date = new Date();
    #intervalID: NodeJS.Timeout | undefined;

    public constructor(
        public ntpServerHost = AutoSyncNTPClient.DEFAULT_HOST,
        public ntpServerPort = AutoSyncNTPClient.DEFAULT_PORT,
        public syncPeriodInMilliseconds = 1_000 * 60
    ) {
        void this.#scheduleSyncTime();
    }

    public get now() {
        if (!this.#ntpNow) return undefined;

        const updatedOffsetMilliseconds = Date.now() - this.#lastUpdateTime.getTime();
        return this.#ntpNow.getTime() + updatedOffsetMilliseconds;
    }

    get #shouldSyncTime() {
        const now = new Date();
        return now.getTime() > this.#lastUpdateTime.getTime() + this.syncPeriodInMilliseconds;
    }

    public async syncTime() {
        try {
            this.#ntpNow = await getNTPDate(this.ntpServerHost, this.ntpServerPort);
            this.#lastUpdateTime = new Date();
        } catch {
            // do nothing
        }
    }

    async #scheduleSyncTime() {
        if (this.#intervalID) clearInterval(this.#intervalID);
        await this.syncTime();
        this.#intervalID = setInterval(async () => {
            if (!this.#shouldSyncTime) return;
            await this.syncTime();
        }, INTERVAL_PERIOD);
    }
}