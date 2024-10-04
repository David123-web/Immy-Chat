import * as aws from 'aws-sdk';

const s3 = new aws.S3({
    accessKeyId: process.env.BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKET_SECRET_ACCESS_KEY,
});

export function replaceWithCDN(
    data: Record<string, any>,
    attributes: string[]
) {

    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[key];

        if (value && typeof value === 'object' && !Array.isArray(value)) {
            replaceWithCDN(value, attributes);
        }

        if (value && typeof value === 'object' && Array.isArray(value)) {
            value.forEach((item) => {
                replaceWithCDN(item, attributes);
            });
        }

        if (attributes.includes(key)) {
            // data[key] = data[key].replace(s3Url, cdnUrl);
            data[key] = replaceWithLinkCDN(data[key]);
        }
    }

    return data;
}

export function replaceWithLinkCDN(link: string) {
    const cdnUrl = process.env.AWS_CDN_URL;
    const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`;
    return link?.replace(s3Url, cdnUrl);
}

export default s3;
