import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util'; 

// `sycrpt` is callback based, so use `promisify` to turn it into promise based implmentation to fit with async await 
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = await scryptAsync(password, salt, 64) as Buffer; // hashed password
    return `${buf.toString('hex')}.${salt}`; // return hashed password concatenated with salt using '.'
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = await scryptAsync(suppliedPassword, salt, 64) as Buffer; // hashed supplied password
    return buf.toString('hex') === hashedPassword;
  } 
}