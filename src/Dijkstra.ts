// This class should contain all the code related to Dijkstra algorithm.
// All dependencies must be present in this class
class DijkstraAlgorithm {
  dijkstraQueue = new Array<Cell>();
  dijkstraVisited = new Set();
  dijkstraDistances: Array<number> = [];
  dijkstraPrevious: Array<Cell> = [];
  dijkstraForward: Array<Cell> = []; // for next steps
  dijkstraStepInProgress = true;
  ctx: CanvasRenderingContext2D;
  end: Cell;
  animationFrame: number;
  grid;
  rows;
  cols;
  cellSize;

  constructor(
    ctx: CanvasRenderingContext2D,
    grid: Array<Cell>,
    cellSize: number
  ) {
    this.ctx = ctx;
    this.grid = grid;
    this.rows = TOTAL_ROWS;
    this.cols = TOTAL_COLS;
    this.cellSize = cellSize;

    for (let cell of this.grid) {
      this.dijkstraDistances[Utility.index(cell.row, cell.col)] = Infinity;
      //   this.dijkstraPrevious[Utility.index(cell.row, cell.col)] = null;
    }

    const start = this.grid[0]; // top-left corner
    this.dijkstraDistances[Utility.index(start.row, start.col)] = 0;
    this.dijkstraQueue.push(start);

    this.end = grid[Utility.index(rows - 1, cols - 1)];
    this.animationFrame = 0;
  }

  runStep() {
    if (this.dijkstraQueue.length === 0 || !this.dijkstraStepInProgress) {
      console.log("Dijkstra: no path found or already completed.");
      cancelAnimationFrame(this.animationFrame);
      return;
    }

    this.dijkstraQueue.sort((a, b) => {
      return (
        this.dijkstraDistances[Utility.index(a.row, a.col)] -
        this.dijkstraDistances[Utility.index(b.row, b.col)]
      );
    });

    const current = this.dijkstraQueue[0];
    this.dijkstraQueue.shift();
    const currentIndex = Utility.index(current.row, current.col);

    if (this.dijkstraVisited.has(currentIndex)) {
      this.animationFrame = requestAnimationFrame(() => this.runStep());
      return;
    }

    this.dijkstraVisited.add(currentIndex);

    this.ctx.fillStyle = "orange";
    this.ctx.fillRect(
      current.col * this.cellSize + this.cellSize * 0.25,
      current.row * this.cellSize + this.cellSize * 0.25,
      this.cellSize * 0.5,
      this.cellSize * 0.5
    );

    if (current === this.end) {
      this.dijkstraStepInProgress = false;
      console.log("Dijkstra: reached the goal!");
      cancelAnimationFrame(this.animationFrame);
      this.generateForwardPath();
      this.reconstructDijkstraPath();
      return;
    }

    const neighbors = current.getConnectedNeighbors(this.grid);
    for (let neighbor of neighbors) {
      const neighborIndex = Utility.index(neighbor.row, neighbor.col);

      if (!this.dijkstraVisited.has(neighborIndex)) {
        const tentativeDistance = this.dijkstraDistances[currentIndex] + 1;

        if (tentativeDistance < this.dijkstraDistances[neighborIndex]) {
          this.dijkstraDistances[neighborIndex] = tentativeDistance;
          this.dijkstraPrevious[neighborIndex] = current;
          this.dijkstraQueue.push(neighbor);
        }
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.runStep());
  }

  generateForwardPath() {
    let current = this.end;
    let prev = this.dijkstraPrevious[Utility.index(current.row, current.col)];
    while (prev) {
      const prevIndex = Utility.index(prev.row, prev.col);
      this.dijkstraForward[prevIndex] = current;

      current = prev;
      prev = this.dijkstraPrevious[Utility.index(current.row, current.col)];
    }
  }

  reconstructDijkstraPath(speed = 5) {
    let current = this.grid[0];
    let frame = 0;
    // Utility.drawGrid(this.grid);

    const drawPathStep = () => {
      if (!current) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      frame++;
      if (frame % speed === 0) {
        const i = Utility.index(current.row, current.col);

        this.ctx.fillStyle = "dodgerblue";
        this.ctx.fillRect(
          current.col * this.cellSize + this.cellSize * 0.25,
          current.row * this.cellSize + this.cellSize * 0.25,
          this.cellSize * 0.5,
          this.cellSize * 0.5
        );

        current = this.dijkstraForward[i];
      }

      this.animationFrame = requestAnimationFrame(drawPathStep);
    };

    this.animationFrame = requestAnimationFrame(drawPathStep);
  }

  startAnimation() {
    this.runStep();
  }
}
