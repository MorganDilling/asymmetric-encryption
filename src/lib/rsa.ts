import crypto from 'crypto';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export const generateKeyPair = async (keySize = 2048): Promise<KeyPair> => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair(
      'rsa',
      {
        modulusLength: keySize,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      },
      (err: Error | null, publicKey: string, privateKey: string) => {
        if (err) {
          reject(err);
        } else {
          resolve({ publicKey, privateKey });
        }
      }
    );
  });
};

export const encrypt = (plainText: string, publicKey: string): string => {
  const buffer = Buffer.from(plainText);
  const encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString('base64');
};

export const decrypt = (cipherText: string, privateKey: string) => {
  const buffer = Buffer.from(cipherText, 'base64');
  const decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString('utf8');
};
