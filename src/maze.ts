// Grid configuration
let rows = 30;
let cols = 30;
const cellSize = 40;
const TOTAL_ROWS = 30;
const TOTAL_COLS = 30;
// ========== Maze Canvas Setup ==========
let canvas: HTMLCanvasElement = document.getElementById(
  "mazeCanvas"
) as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

class Maze {
  rows;
  cols;
  grid: Array<Cell>;
  current;
  animationId: number;
  stack: Array<any>;
  cellSize;
  ctx;

  constructor(
    rows: number,
    cols: number,
    cellSize: number,
    ctx: CanvasRenderingContext2D
  ) {
    this.rows = rows;
    this.cols = cols;
    this.stack = [];
    this.cellSize = cellSize;
    this.ctx = ctx;
    this.animationId = 0;
    this.grid = new Array<Cell>();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = new Cell(row, col, this.cellSize);
        this.grid.push(cell);
      }
    }

    this.current = this.grid[0];
  }

  runStep() {
    Utility.drawGrid(this.grid, this.ctx);
    if (
      this.stack.length > 0 ||
      this.current.getUnvisitedNeighbors(this.grid).length > 0
    ) {
      const x = this.current.col * this.cellSize;
      const y = this.current.row * this.cellSize;

      this.ctx.fillStyle = "green";
      this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
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
    Utility.drawGrid(this.grid, this.ctx);
    const dijkstra = new DijkstraAlgorithm(this.ctx, this.grid, this.cellSize);
    dijkstra.startAnimation();
  }

  initiateAStar() {
    Utility.drawGrid(this.grid, this.ctx);
    const aStar = new AStarAlgorithm(this.ctx, this.grid, this.cellSize);
    aStar.startAnimation();
  }
}

if (ctx) {
  ctx.canvas.width = cols * cellSize;
  ctx.canvas.height = rows * cellSize;
  let maze = new Maze(rows, cols, cellSize, ctx);

  document.getElementById("solve_dijkstra")?.addEventListener("click", () => {
    maze.initiateDijkstra();
  });

  document.getElementById("solve_astar")?.addEventListener("click", () => {
    maze.initiateAStar();
  });

  document.getElementById("generate")?.addEventListener("click", () => {
    maze.startAnimation();
  });

  document.getElementById("reset")?.addEventListener("click", () => {
    // Resets all the orange and blue cells.
    // Redraws the Grid.
    // adds the player
    Utility.drawGrid(maze.grid, maze.ctx);
    maze.startPlayer();
  });

  //   document.getElementById("regenerate")?.addEventListener("click", () => {
  //       maze = new Maze(rows, cols, cellSize, ctx);
  //   });
}
