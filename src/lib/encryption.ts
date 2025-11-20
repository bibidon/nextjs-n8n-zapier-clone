import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY!);

export function encrypt(text: string) {
  return cryptr.encrypt(text);
}

export function decrypt(text: string) {
  return cryptr.decrypt(text);
}
