import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Node from '../models/node';
import Point from '../models/point';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages = new Subject();
  messages$ = this.messages.asObservable();
  startPointPosition = new Subject();
  isEndNodeClicked = false;

  currentNode = new Subject<Node>();
  nodeAction: string;

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

  updateCurrentNode(node: Node, action: string) {
    console.log('in update current node message service');
    this.nodeAction = action;
    this.currentNode.next(node);
  }

  getEndNodeClicked() {
    return this.isEndNodeClicked;
  }
}
