import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import passwordGenerator from 'password-generator';
import CryptoJS from 'crypto-js';
// require('dotenv').config();
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.ENCRYPTION_SECRET_KEY); // remove this after you've confirmed it is working

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  constructor(/* Add @inject to inject parameters */) {}

  createPassword() {
    return passwordGenerator(12, false);
  }

  SECRET_KEY_AES = process.env.ENCRYPTION_SECRET_KEY ?? 'sin dotenv';

  encryptPassword(password: string) {
    console.log(this.SECRET_KEY_AES);
    const encryptedPassword = CryptoJS.AES.encrypt(
      password,
      this.SECRET_KEY_AES,
    ).toString();
    return encryptedPassword;
  }

  decryptPassword(password: string) {
    const bytes = CryptoJS.AES.decrypt(password, this.SECRET_KEY_AES);
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword;
  }
}
