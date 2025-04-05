// Grid configuration
import { AStarAlgorithm } from "./AStar";
import { Cell } from "./Cell";
import { cellSize, TOTAL_COLS, TOTAL_ROWS } from "./Constants";
import { DijkstraAlgorithm } from "./Dijkstra";
import { Player } from "./Player";
import { Utility } from "./Utility";

// ========== Maze Canvas Setup ==========
let canvas: HTMLCanvasElement = document.getElementById(
  "mazeCanvas"
) as HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

class Maze {
  grid: Array<Cell>;
  current;
  animationId: number;
  stack: Array<any>;
  ctx;

  constructor(ctx: CanvasRenderingContext2D) {
    this.stack = [];
    this.ctx = ctx;
    this.animationId = 0;
    this.grid = new Array<Cell>();

    for (let row = 0; row < TOTAL_ROWS; row++) {
      for (let col = 0; col < TOTAL_COLS; col++) {
        const cell = new Cell(row, col, cellSize);
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
    const player = new Player(0, 0, "blue", this.ctx, this.grid);
    player.draw();
  }

  initiateDijkstra() {
    Utility.drawGrid(this.grid, this.ctx);
    const dijkstra = new DijkstraAlgorithm(this.ctx, this.grid);
    dijkstra.startAnimation();
  }

  initiateAStar() {
    Utility.drawGrid(this.grid, this.ctx);
    const aStar = new AStarAlgorithm(this.ctx, this.grid);
    aStar.startAnimation();
  }
}

if (ctx) {
  ctx.canvas.width = TOTAL_COLS * cellSize;
  ctx.canvas.height = TOTAL_ROWS * cellSize;
  let maze = new Maze(ctx);

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

  document.getElementById("regenerate")?.addEventListener("click", () => {
    maze = new Maze(ctx);
    maze.startAnimation();
  });
}
