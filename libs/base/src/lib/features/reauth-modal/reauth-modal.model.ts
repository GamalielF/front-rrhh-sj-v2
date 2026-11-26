export type ReauthStep = 'password' | 'totp' | 'totp-setup';

export interface ActiveUserInfo {
  username: string;
  name?: string;
}
