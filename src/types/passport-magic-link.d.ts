declare module 'passport-magic-link' {
  import { Strategy as PassportStrategy } from 'passport-strategy';

  export interface User {
    email: string;
  }

  export interface StrategyOptions {
    secret: string;
    userFields: string[];
    tokenField: string;
    verifyUserAfterToken: boolean;
    ttl: number;
  }

  export class Strategy extends PassportStrategy {
    constructor(
      options: StrategyOptions,
      sendToken: (user: User, token: string) => Promise<boolean>
    );

    validate(payload: any): Promise<any>;
  }
} 