import { HasId, Id } from "./Id";

export abstract class BufferedMessageReceiver<
  ObserverType extends HasId,
  MessageType
> {
  protected observers: Map<Id, ObserverType> = new Map();

  protected message_buffer: MessageType[] = [];
  protected is_processing: boolean = false;

  protected on_receive_message(msg: MessageType) {
    if (this.observers.size === 0 || this.is_processing) {
      this.message_buffer.push(msg);
    } else {
      this.process_message(msg);
    }
  }

  protected process_message(msg: MessageType) {
    this.is_processing = true;
    let observers: ObserverType[] = [];
    this.observers.forEach((observer) => {
      observers.push(observer);
    });
    this.send_message_to_observers(observers, msg);
    this.is_processing = false;

    this.process_message_buffer();
  }

  protected process_message_buffer() {
    if (this.message_buffer.length > 0 && !this.is_processing) {
      let msg: MessageType = this.message_buffer.shift()!;
      this.process_message(msg);
    }
  }

  protected abstract send_message_to_observers(
    observers: ObserverType[],
    msg: MessageType
  ): void;

  public add_observer(new_observer: ObserverType) {
    this.observers.set(new_observer.id, new_observer);

    this.process_message_buffer();
  }

  public remove_observer(id: Id) {
    this.observers.delete(id);
  }
}
