import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import passwordGenerator from 'password-generator';
import CryptoJS from 'crypto-js';
import {User} from '../models/user.model';
import {PersonRepository} from '../repositories';
import {repository} from '@loopback/repository';

// require('dotenv').config();
import * as dotenv from 'dotenv';
dotenv.config();

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  constructor(
    @repository(PersonRepository)
    public personRepository: PersonRepository,
  ) {}

  createPassword() {
    return passwordGenerator(12, false);
  }

  SECRET_KEY_AES = process.env.KEY_AES ?? '';

  encryptPassword(password: string) {
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

  login(email: string, password: string) {
    try {
      const person = this.personRepository.findOne({
        where: {email: email, password: password},
      });
      if (person != null) {
        return person;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
