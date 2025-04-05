import { Cell } from "./Cell";
import { TOTAL_COLS, TOTAL_ROWS, cellSize } from "./Constants";
import { Utility } from "./Utility";

export class AStarAlgorithm {
  ctx: CanvasRenderingContext2D;
  grid: Array<Cell>;
  openSet: Array<Cell>;
  gScore: Array<number>;
  fScore: Array<number>;
  start: Cell;
  end: Cell;
  aStarInProgress: boolean;
  cameFrom: Map<number, Cell>;
  aStarVisited: Set<number>;
  animationId: number;

  constructor(ctx: CanvasRenderingContext2D, grid: Array<Cell>) {
    this.ctx = ctx;
    this.grid = grid;
    this.start = grid[0];
    this.end = grid[Utility.index(TOTAL_ROWS - 1, TOTAL_COLS - 1)];
    this.openSet = [this.start];
    this.gScore = [];
    this.fScore = [];
    this.cameFrom = new Map<number, Cell>();
    this.aStarVisited = new Set<number>();
    this.animationId = 0;

    for (let cell of this.grid) {
      const currentIndex = Utility.index(cell.row, cell.col);
      this.gScore[currentIndex] = Infinity;
      this.fScore[currentIndex] = Infinity;
    }

    const startIndex = Utility.index(this.start.row, this.start.col);

    this.gScore[startIndex] = 0;
    this.fScore[startIndex] = this.heuristic(this.start, this.end);
    this.aStarInProgress = true;
  }

  heuristic(start: Cell, end: Cell): number {
    // Calculate the heuristic value from the start and the end cell.
    // Using a simple Manhattan distance

    return Math.abs(start.row - end.row) + Math.abs(start.col - end.col);
  }

  runStep() {
    if (this.openSet.length === 0 || !this.aStarInProgress) {
      console.log("A star is not able to find a solution");
      cancelAnimationFrame(this.animationId);
      return;
    }
    // we have to get the node with shortest fScore value
    this.openSet.sort(
      (a, b) =>
        this.fScore[Utility.index(a.row, a.col)] -
        this.fScore[Utility.index(b.row, b.col)]
    );

    const current = this.openSet[0];
    this.openSet.shift();
    const currentIndex = Utility.index(current.row, current.col);

    // if (this.aStarVisited.has(currentIndex)) {
    //   this.animationId = requestAnimationFrame(() => this.runStep());
    // }

    this.ctx.fillStyle = "orange";
    this.ctx.fillRect(
      current.col * cellSize + cellSize * 0.25,
      current.row * cellSize + cellSize * 0.25,
      cellSize * 0.5,
      cellSize * 0.5
    );

    if (current === this.end) {
      this.aStarInProgress = false;
      console.log("A star is completed");
      console.log(this.cameFrom);
      this.drawSolution();
      cancelAnimationFrame(this.animationId);
      return;
    }

    const neighbors = current.getConnectedNeighbors(this.grid);
    for (let neighbor of neighbors) {
      const neighborIndex = Utility.index(neighbor.row, neighbor.col);
      const tempGScore = this.gScore[currentIndex] + 1;
      if (tempGScore < this.gScore[neighborIndex]) {
        this.cameFrom.set(neighborIndex, current);
        this.gScore[neighborIndex] = tempGScore;
        this.fScore[neighborIndex] =
          tempGScore + this.heuristic(neighbor, this.end);
        this.openSet.push(neighbor);
      }
    }

    this.animationId = requestAnimationFrame(() => this.runStep());
  }

  drawSolution() {
    let current = this.end,
      frame = 0,
      i = 0;
    const totalPath: Array<Cell> = new Array<Cell>();
    while (current && current !== this.start) {
      totalPath.push(current);
      const currentVal = this.cameFrom.get(
        Utility.index(current.row, current.col)
      );
      if (currentVal) {
        current = currentVal;
      }
    }

    let cell = totalPath[i];
    i++;

    const drawPathStep = () => {
      if (!cell) {
        return;
      }
      frame++;
      if (frame % 5 === 0) {
        this.ctx.fillStyle = "dodgerblue";
        this.ctx.fillRect(
          cell.col * cellSize + cellSize * 0.25,
          cell.row * cellSize + cellSize * 0.25,
          cellSize * 0.5,
          cellSize * 0.5
        );

        cell = totalPath[i];
        i++;
      }
      requestAnimationFrame(drawPathStep);
    };

    requestAnimationFrame(drawPathStep);
  }

  startAnimation() {
    this.runStep();
  }
}
