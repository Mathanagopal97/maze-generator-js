// ========== Maze Canvas Setup ==========
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Grid configuration
let rows = (cols = 10);
const cellSize = 40;

ctx.canvas.width = cols * cellSize;
ctx.canvas.height = rows * cellSize;
/**
 * Creates a Maze using Randomized depth-first search algorithm
 */
class Maze {
  rows;
  cols;
  grid = [];
  current;
  animationId;
  stack;
  cellSize;
  ctx;
  constructor(rows, cols, cellSize, ctx) {
    this.rows = rows;
    this.cols = cols;
    this.stack = [];
    this.cellSize = cellSize;
    this.ctx = ctx;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = new Cell(row, col);
        this.grid.push(cell);
      }
    }

    this.current = this.grid[0];
  }

  runStep() {
    Utility.drawGrid(this.grid);
    if (
      this.stack.length > 0 ||
      this.current.getUnvisitedNeighbors(this.grid).length > 0
    ) {
      const x = this.current.col * cellSize;
      const y = this.current.row * cellSize;

      this.ctx.fillStyle = "green";
      this.ctx.fillRect(x, y, cellSize, cellSize);
    }
    this.current.visited = true;

    const neighbors = this.current.getUnvisitedNeighbors(this.grid);

    if (neighbors.length > 0) {
      const next = Utility.randomElement(neighbors);
      this.stack.push(this.current);
      Utility.removeWalls(this.current, next);
      this.current = next;
    } else if (this.stack.length > 0) {
      this.current = this.stack.pop();
    } else {
      console.log("Maze generation complete!");
      this.startPlayer();
      cancelAnimationFrame(this.animationId);
      return;
    }

    this.animationId = requestAnimationFrame(() => this.runStep());
  }

  startAnimation() {
    this.runStep();
  }

  startPlayer() {
    const player = new Player(0, 0, "blue", this.ctx, this.cellSize, this.grid);
    player.draw();
  }

  initiateDijkstra() {
    const dijkstra = new DijkstraAlgorithm(
      this.ctx,
      this.grid,
      this.rows,
      this.cols,
      this.cellSize
    );
    dijkstra.startAnimation();
  }
}

const maze = new Maze(rows, cols, cellSize, ctx);

document.getElementById("solve").addEventListener("click", () => {
  maze.initiateDijkstra();
});

document.getElementById("generate").addEventListener("click", () => {
  maze.startAnimation();
});
