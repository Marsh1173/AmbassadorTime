export type ReturnMsg = Success | FailureMsg;

export interface Success {
  success: true;
}

export interface FailureMsg {
  success: false;
  msg: string;
}

export const FORBIDDEN: FailureMsg = {
  success: false,
  msg: "You do not have permission to do that.",
};

export type BoolReturnMsg = BoolSuccess | FailureMsg;

export interface BoolSuccess extends Success {
  result: boolean;
}
