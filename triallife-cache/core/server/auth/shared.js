import { encryptData, getPublicKey } from '../utility/encryption';
export async function generatePosterFormat(data) {
    const posterData = { gumroad_key: process.env.GUMROAD, email: process.env.EMAIL, data };
    const encryption = await encryptData(JSON.stringify(posterData));
    const posterFormat = { public_key: getPublicKey(), encryption };
    return posterFormat;
}
