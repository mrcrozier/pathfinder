import { Component, OnInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import Node from '../models/node';
import { UserAction } from '../models/userAction';
import Point from '../models/point';
import { MessageService } from '../service/message.service';
import { NodeComponent } from '../node/node.component';
import Djikstras from '../algos/Djikstras';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  rows = 50;
  cols = 100;
  isClicked = false;

  actions: Array<UserAction> = [
    {
      name: 'Start',
      action: () => {
        this.start();
      },
    },
    {
      name: 'Reset',
      action: () => {
        this.reset();
      },
    },
  ];

  nodes: Array<Array<Node>> = [];
  startNode: Point = { row: 10, col: 14 };
  endNode: Point = { row: 8, col: 44 };

  @ViewChildren('node') myComponents: QueryList<any>;

  constructor(private messageService: MessageService, private ref: ChangeDetectorRef) {
    this.createNodes();
    this.initializeStartEndNodes();
  }

  ngOnInit() {}

  /**
   * CORE Of the component
   * this is the main part it runs the selected algorithm on the nodes currently only
   * works for djikstra wthis function will evolve as application evolves.
   * Currently it does following things
   * 1. Run the algo and obtain the final result which will be a set of nodes that will be visited.
   * 2. Once we have obtained the nodes which need to be modified we go through all the node components
   * which we have stored in the mycomponents and run the change detector on them. We also use setTimeout function
   * so to create a aesthetic effect.
   * 3. Then we iterate over again and try to contruct the path by looking at the previousNode Property. We use set
   * timeout to animate this also.
   */
  start() {
    // this.RunChangeDetector();

    // initialize the algorithm
    const dj = new Djikstras();

    // run algorithm and get visited nodes
    const visitedNodes = dj.start(this.nodes, this.startNode, this.endNode);

    // run change detection to create animated effect
    for (let i = 0; i < visitedNodes.length; i++) {
      this.myComponents.forEach((cmp: NodeComponent) => {
        if (cmp.node == visitedNodes[i]) {
          setTimeout(() => {
            if (cmp.node.isEndNode) {
              this.updateShortestPath(visitedNodes);
            }
            cmp.runChangeDetector();
          }, 5 * i);
        }
      });
    }
  }

  updateShortestPath(visitedNodes: Node[]) {
    // visitedNodes.reverse();
    let lastNode = visitedNodes[visitedNodes.length - 1];
    let delay = 0;
    while (lastNode != null) {
      lastNode.inPath = true;
      this.myComponents.find((n, index) => {
        if (lastNode.equals(n.node)) {
          this.updateIndividualNode(n, delay);
          delay++;
          return true;
        }
        return false;
      });
      lastNode = lastNode.previousNode;
    }
    // setTimeout(() => {
    //   let i = 0;
    //   this.myComponents.forEach((cmp: NodeComponent) => {
    //     // console.log(cmp);
    //     setTimeout(() => {
    //       cmp.runChangeDetector();
    //     }, 5 * i);
    //     i += 1;
    //   });
    // });
  }

  updateIndividualNode(node: NodeComponent, delay: number) {
    console.log('in update individual');
    setTimeout(() => {
      node.runChangeDetector();
    }, 50 * delay);
  }

  /**
   * Resets the Board and restore it to its inital position;
   */
  reset() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.nodes[i][j].reset();
      }
    }
    this.initializeStartEndNodes();

    const newNodes = [];
    for (let i = 0; i < this.rows; i++) {
      newNodes.push([...this.nodes[i]]);
    }
    this.nodes = newNodes;

    // run change detector to update the nodes
    this.runChangeDetector();
  }

  // runs the change detection over all the node components to update them.
  // or on a given index.
  runChangeDetector(type = 'all', index?) {
    if (type == 'all') {
      console.log('her');
      const toRun = [];
      this.myComponents.forEach((cmp: NodeComponent) => {
        toRun.push(cmp.runChangeDetector());
      });
      Promise.all(toRun);
    }
  }

  createNodes() {
    for (let i = 0; i < this.rows; i++) {
      const cols: Array<Node> = [];
      for (let j = 0; j < this.cols; j++) {
        cols.push(new Node(i, j, false, false, this.startNode, this.endNode));
      }
      this.nodes.push(cols);
    }
  }

  initializeStartEndNodes() {
    this.startNode = { row: 10, col: 14 };
    this.endNode = { row: 8, col: 44 };
    const startNode: Node = this.getNode(this.startNode);
    startNode.isStartNode = true;
    this.startNode = startNode;
    const endNode = this.getNode(this.endNode);
    endNode.isEndNode = true;
    this.endNode = endNode;
  }

  getNode(point): Node {
    for (const row of this.nodes) {
      for (const node of row) {
        if (node.row === point.row && node.col === point.col) {
          return node;
        }
      }
    }
  }

  mouseUp(event: Event) {
    this.messageService.mouseRelease();
    event.preventDefault();
    event.stopPropagation();
  }

  mouseDown(event: Event) {
    this.messageService.mouseClicked();
    event.preventDefault();
    event.stopPropagation();
  }

  drop(event) {
    const previousNode: Node = event.previousNode;
    const newNode: Node = event.newNode;
    console.log(previousNode, this.endNode);
    if (previousNode.isStartNode && !newNode.isEndNode) {
      console.log(previousNode, this.endNode);
      const { row, col } = previousNode;
      this.nodes[row][col].isStartNode = false;
      previousNode.isStartNode = false;
      this.nodes[newNode.row][newNode.col].isStartNode = true;
      this.startNode = this.nodes[newNode.row][newNode.col];
    } else if (previousNode.isEndNode && !newNode.isStartNode) {
      const { row, col } = previousNode;
      this.nodes[row][col].isEndNode = false;
      previousNode.isEndNode = false;
      this.nodes[newNode.row][newNode.col].isEndNode = true;
      this.endNode = this.nodes[newNode.row][newNode.col];
    }

    // [2D => 1D] -> index =  row * totalelemsInRow + Col;
    // this.RunChangeDetector('single' , previousNode.row * this.cols + previousNode.col  );
    // this.RunChangeDetector('single' , newNode.row * this.cols + newNode.col  );
    console.log('inside dropped');
    this.runChangeDetector();
  }

  /**
   * This handler invokes the action on an actions object
   * @param action the action object depending on which we will take action.
   */
  actionTakenHandler(action: UserAction) {
    action.action();
  }
}
