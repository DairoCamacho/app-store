import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import passwordGenerator from 'password-generator';
import CryptoJS from 'crypto-js';
import {Person} from '../models';
import {PersonRepository} from '../repositories';
import {repository} from '@loopback/repository';
import jwt from 'jsonwebtoken';
import {environment} from '../config/environment';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthenticationService {
  constructor(
    @repository(PersonRepository)
    public personRepository: PersonRepository,
  ) {}

  createPassword() {
    return passwordGenerator(12, false);
  }

  encryptObject(data: {}) {
    if (environment.KEY_AES === undefined) {
      throw new Error('environment variable AES not found');
    } else {
      const encryptedObject = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        environment.KEY_AES,
      ).toString();
      return encryptedObject;
    }
  }

  decryptObject(data: string) {
    if (environment.KEY_AES === undefined) {
      throw new Error('environment variable AES not found');
    } else {
      const bytes = CryptoJS.AES.decrypt(data, environment.KEY_AES);
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
    if (environment.KEY_JWT === undefined) {
      throw new Error('environment variable JWT not found');
    } else {
      const payload = this.encryptObject({
        id: person.id,
        name: person.name,
        lastName: person.lastName,
      });

      const token = jwt.sign({payload}, environment.KEY_JWT, {
        expiresIn: '1h',
      });
      return token;
    }
  }
}
