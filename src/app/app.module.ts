import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { NodeComponent } from './node/node.component';
import { WeightedSearchAlgorithmComponent } from './algorithms/weighted-search-algorithm/weighted-search-algorithm.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    NodeComponent,
    WeightedSearchAlgorithmComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
