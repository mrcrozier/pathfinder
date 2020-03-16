import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import Node from '../models/node';
import { MessageService } from '../service/message.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NodeComponent implements OnInit {
  @Input() node: Node;
  @Input() isClicked: boolean;
  @Output() dropped: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('nodeStatic', { static: true }) nodeStatic;

  isStartNode = false;
  isEndNode = false;
  mouseClickedOnNode = false;

  constructor(private ref: ChangeDetectorRef, private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.messages$.subscribe(
      (message: Node) => {
        console.log('M', message);
        // if (message.row == this.node.row && message.col == this.node.col) {

        // }
      },
      err => {
        console.log(err);
      },
    );
  }

  runChangeDetector() {
    this.ref.markForCheck();
  }

  mouseUp(event: Event) {
    this.mouseClickedOnNode = false;
    console.log(event);
    try {
      const data = (event as any).dataTransfer.getData('text');
      console.log(data, (event as any).data);
      this.dropped.emit({
        previousNode: JSON.parse(data),
        newNode: this.node,
      });
    } catch (err) {
      console.error(err);
    }
  }

  mouseDown(event: Event) {
    // if (this.node.isStartNode || this.node.isEndNode) {
    //   console.log('node mouse down');
    //   this.messageService.mouseRelease();
    //   this.mouseClickedOnNode = true;
    //   // event.preventDefault();
    //   event.stopPropagation();

    //   return;
    // }
    // this.node.isWall = !this.node.isWall;
    this.messageService.updateCurrentNode(this.node, 'mouseDown');
  }

  createWall() {
    console.log('createWall');
    if (
      this.messageService.getMouseClicked() &&
      !this.node.isEndNode &&
      !this.node.isStartNode &&
      !this.mouseClickedOnNode
    ) {
      this.messageService.updateCurrentNode(this.node, 'createWall');
      this.node.isWall = !this.node.isWall;
    }
  }

  dragCancel(event: Event) {
    console.log('dragCancel');
    if (this.node.isEndNode) {
      this.messageService.isEndNodeClicked = false;
    }
    event.preventDefault();
  }

  dragOver(event: Event) {
    // event.preventDefault();
    // console.log('dragOver');
    // console.log(this.node);
    this.messageService.updateCurrentNode(this.node, 'dragOver');
  }

  dragStart(event) {
    console.log('drag start');
    if (this.node.isEndNode) {
      this.messageService.isEndNodeClicked = true;
    }
    event.dataTransfer.setData('text/plain', JSON.stringify(this.node));
    event.data = this.node;
  }
}
