export type ReturnMsg = Success | FailureMsg;

export interface Success {
  success: true;
}

export interface FailureMsg {
  success: false;
  msg: string;
}
