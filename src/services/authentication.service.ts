import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import passwordGenerator from 'password-generator';
import CryptoJS from 'crypto-js';
import {Person} from '../models';
import {PersonRepository} from '../repositories';
import {repository} from '@loopback/repository';
import jwt from 'jsonwebtoken';

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

  SECRET_KEY_AES = process.env.KEY_AES;
  SECRET_KEY_JWT = process.env.KEY_JWT;

  encryptObject(data: {}) {
    if (this.SECRET_KEY_AES === undefined) {
      throw new Error('environment variable AES not found');
    } else {
      const encryptedObject = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.SECRET_KEY_AES,
      ).toString();
      return encryptedObject;
    }
  }

  decryptObject(data: string) {
    if (this.SECRET_KEY_AES === undefined) {
      throw new Error('environment variable AES not found');
    } else {
      const bytes = CryptoJS.AES.decrypt(data, this.SECRET_KEY_AES);
      const decryptedObject = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedObject;
    }
  }

  async login(email: string, password: string) {
    try {
      const person = await this.personRepository.findOne({
        where: {email: email},
      });
      if (person != null) {
        const decryptedPassword = this.decryptObject(person.password);

        // eslint-disable-next-line eqeqeq
        if (decryptedPassword == password) {
          return person;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  generateTokenJWT(person: Person) {
    if (this.SECRET_KEY_JWT === undefined) {
      throw new Error('environment variable JWT not found');
    } else {
      const payload = this.encryptObject({
        id: person.id,
        name: person.name,
        lastName: person.lastName,
      });

      const token = jwt.sign({payload}, this.SECRET_KEY_JWT, {
        expiresIn: '1h',
      });
      return token;
    }
  }
}
