export function parseNTPToDate(data: Buffer<ArrayBufferLike>) {
    const intPart = data.readUInt32BE(40);
    const fractionPart = data.readUInt32BE(44);
    const milliseconds = intPart * 1_000 + (fractionPart * 1_000) / 0x100000000;

    const date = new Date('Jan 01 1900 GMT');
    date.setUTCMilliseconds(date.getUTCMilliseconds() + milliseconds);

    return date;
}