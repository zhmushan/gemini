export enum ResponseCode {
  UNKNOWN = -1,
  SUCCESS = 1,
  LOGIN_FAILED = 100,
  TOKEN_EXPIRED = 101,
  USERNAME_EXISIT = 102,
  EMAIL_SEND_FAILED = 103,
  CAPTCHA_ERROR = 104,
  NOT_EXISIT = 105
}

export const response = (code: ResponseCode, data?: any) => ({ code, msg: ResponseCode[code], data });

export const success = (data?: any) => response(ResponseCode.SUCCESS, data);
