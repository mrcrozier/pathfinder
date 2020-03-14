import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages = new Subject();
  messages$ = this.messages.asObservable();

  isMouseClicked = false;

  constructor() {}

  notify(message) {
    this.messages.next(message);
  }

  mouseClicked() {
    this.isMouseClicked = true;
  }

  mouseRelease() {
    this.isMouseClicked = false;
  }

  getMouseClicked() {
    return this.isMouseClicked;
  }
}
