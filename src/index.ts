import { generateKeyPair, encrypt, decrypt, KeyPair } from '@lib/rsa';
import prompts from 'prompts';
import fs from 'fs';

const KEY_PATH = './keys';

const main = async (): Promise<void> => {
  const { choice } = await prompts({
    type: 'select',
    name: 'choice',
    message: 'What do you want to do?',
    choices: [
      { title: 'Generate Key Pair', value: 'generate' },
      { title: 'Encrypt', value: 'encrypt' },
      { title: 'Decrypt', value: 'decrypt' },
      { title: 'Exit', value: 'exit' },
    ],
  });

  if (!choice) return main();

  switch (choice) {
    case 'generate': {
      const { privateKey, publicKey }: KeyPair = await generateKeyPair();

      try {
        if (!fs.existsSync(KEY_PATH)) {
          fs.mkdirSync(KEY_PATH);
        }

        fs.writeFileSync(`${KEY_PATH}/private.key`, privateKey);
        fs.writeFileSync(`${KEY_PATH}/public.key`, publicKey);
      } catch (e) {
        console.error(e);
      } finally {
        console.log(
          `Key pair generated successfully. Keys saved in ${KEY_PATH}`
        );
      }

      break;
    }
    case 'encrypt': {
      const { publicKeyFile, plainText } = await prompts([
        {
          type: 'text',
          name: 'publicKeyFile',
          message: 'Enter file path for the public key',
        },
        {
          type: 'text',
          name: 'plainText',
          message: 'Enter the plain text to encrypt',
        },
      ]);

      if (!publicKeyFile || !plainText) {
        console.log('Invalid input');
        return main();
      }

      const publicKey = fs.readFileSync(publicKeyFile, 'utf8');

      const encrypted = encrypt(plainText, publicKey);

      console.log(encrypted);
      break;
    }

    case 'decrypt': {
      const { privateKeyFile, cipherText } = await prompts([
        {
          type: 'text',
          name: 'privateKeyFile',
          message: 'Enter file path for the private key',
        },
        {
          type: 'text',
          name: 'cipherText',
          message: 'Enter the cipher text to decrypt',
        },
      ]);

      if (!privateKeyFile || !cipherText) {
        console.log('Invalid input');
        return main();
      }

      const privateKey = fs.readFileSync(privateKeyFile, 'utf8');

      const decrypted = decrypt(cipherText, privateKey);

      console.log(decrypted);
      break;
    }

    case 'exit': {
      process.exit(0);
      break;
    }
  }

  main();
};

main();
