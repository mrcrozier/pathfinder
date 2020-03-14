import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UserAction } from '../models/userAction';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionComponent implements OnInit {
  @Input() actions: Array<any> = [];
  @Output() taken: EventEmitter<UserAction> = new EventEmitter<UserAction>();

  constructor() {}

  ngOnInit() {}

  actionClick(action) {
    this.taken.emit(action);
  }

  drop(event: Event) {
    console.log('Dropped');
    event.preventDefault();
    // event.stopPropagation();
  }
}
