export interface MessageInterface {
  type: string;
  msg?: MessageInterface;
  msgs?: MessageInterface[];
}
