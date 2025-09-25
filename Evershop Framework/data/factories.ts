import { log } from '../utils/logger.js';
import { appEnv } from 'config/env.js';

export interface TestUser {
  type: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  country?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  mobileNumber?: string;
}

export type UserType = 'default_user' | 'nonexisting_user' | 'wrong_password_user' | 'register_new';

export function getUser(testUserType: UserType = 'default_user'): TestUser {

  log.info(`Using default user from environment configuration ${testUserType}`);
  return {
    type: 'default_user',
    username: appEnv.defaultUser.username ?? '',
    email: appEnv.defaultUser.email,
    password: appEnv.defaultUser.password,
  };
}