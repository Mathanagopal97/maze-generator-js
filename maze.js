// ========== Maze Canvas Setup ==========
const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Grid configuration
const rows = 30;
const cols = 30;
const cellSize = 30;

// Grid and algorithm tracking
let grid = [];
let stack = [];
let current;
let animationId;

// ========== Cell Class ==========
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
  }

  // Draws the cell and its walls
  draw(ctx) {
    const x = this.col * cellSize;
    const y = this.row * cellSize;

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    if (this.walls.top) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (this.walls.bottom) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (this.walls.left) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
    if (this.walls.right) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }

    if (this.visited) {
      ctx.fillStyle = "#eee";
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }

  // Returns a list of unvisited neighboring cells
  getUnvisitedNeighbors() {
    const neighbors = [];

    const top = grid[index(this.row - 1, this.col)];
    const right = grid[index(this.row, this.col + 1)];
    const bottom = grid[index(this.row + 1, this.col)];
    const left = grid[index(this.row, this.col - 1)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    return neighbors;
  }

  getConnectedNeighbors() {
    const neighbors = [];

    const top = grid[index(this.row - 1, this.col)];
    const right = grid[index(this.row, this.col + 1)];
    const bottom = grid[index(this.row + 1, this.col)];
    const left = grid[index(this.row, this.col - 1)];

    if (top && !this.walls.top) neighbors.push(top);
    if (right && !this.walls.right) neighbors.push(right);
    if (bottom && !this.walls.bottom) neighbors.push(bottom);
    if (left && !this.walls.left) neighbors.push(left);

    return neighbors;
  }
}

// ========== Utility Functions ==========

// Converts 2D grid coordinates to 1D index
function index(row, col) {
  if (row < 0 || col < 0 || row >= rows || col >= cols) {
    return -1; // invalid index
  }
  return row * cols + col;
}

// Removes walls between two adjacent cells
function removeWalls(a, b) {
  const x = a.col - b.col;
  const y = a.row - b.row;

  if (x === 1) {
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    a.walls.right = false;
    b.walls.left = false;
  }

  if (y === 1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

// Returns a random element from an array
function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Highlights the current cell in green
function highlightCurrentCell(cell) {
  const x = cell.col * cellSize;
  const y = cell.row * cellSize;

  ctx.fillStyle = "green";
  ctx.fillRect(x, y, cellSize, cellSize);
}

class Player {
  row;
  col;
  color;
  ctx;
  cellSize;

  constructor(row, col, color, ctx, cellSize, grid) {
    this.row = row;
    this.col = col;
    this.color = color;
    this.ctx = ctx;
    this.cellSize = cellSize;
    this.grid = grid;

    document.addEventListener("keydown", (e) => this.handleKeyPress(e));
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.col * this.cellSize + this.cellSize * 0.25,
      this.row * this.cellSize + this.cellSize * 0.25,
      this.cellSize * 0.5,
      this.cellSize * 0.5
    );
  }

  handleKeyPress(e) {
    console.log(e);
    const cell = this.grid[index(this.row, this.col)];

    if (e.key === "ArrowUp" && !cell.walls.top) {
      this.row--;
    } else if (e.key === "ArrowDown" && !cell.walls.bottom) {
      this.row++;
    } else if (e.key === "ArrowLeft" && !cell.walls.left) {
      this.col--;
    } else if (e.key === "ArrowRight" && !cell.walls.right) {
      this.col++;
    }

    drawGrid();
    this.draw();
  }
}

// Draws the entire grid and highlights the current cell
function drawGrid() {
  for (let i = 0; i < grid.length; i++) {
    grid[i].draw(ctx);
  }

  if (stack.length > 0 || current.getUnvisitedNeighbors().length > 0) {
    highlightCurrentCell(current);
  }
}

// ========== Maze Initialization ==========

// Create the grid with Cell instances
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const cell = new Cell(row, col);
    grid.push(cell);
  }
}

// Start from the first cell
current = grid[0];

class DijkstraAlgorithm {
  dijkstraQueue = [];
  dijkstraVisited = new Set();
  dijkstraDistances = {};
  dijkstraPrevious = {};
  dijkstraForward = {}; // for next steps
  dijkstraStepInProgress = true;
  ctx = undefined;
  end = null;
  animationFrame = null;

  constructor(ctx, grid, indexFn, rows, cols, cellSize) {
    this.ctx = ctx;
    this.grid = grid;
    this.index = indexFn;
    this.rows = rows;
    this.cols = cols;
    this.cellSize = cellSize;

    for (let cell of grid) {
      this.dijkstraDistances[this.index(cell.row, cell.col)] = Infinity;
      this.dijkstraPrevious[this.index(cell.row, cell.col)] = null;
    }

    const start = grid[0]; // top-left corner
    this.dijkstraDistances[this.index(start.row, start.col)] = 0;
    this.dijkstraQueue.push(start);

    this.end = grid[this.index(rows - 1, cols - 1)];
  }

  runStep() {
    if (this.dijkstraQueue.length === 0 || !this.dijkstraStepInProgress) {
      console.log("Dijkstra: no path found or already completed.");
      cancelAnimationFrame(this.animationFrame);
      return;
    }

    this.dijkstraQueue.sort((a, b) => {
      return (
        this.dijkstraDistances[this.index(a.row, a.col)] -
        this.dijkstraDistances[this.index(b.row, b.col)]
      );
    });

    const current = this.dijkstraQueue.shift();
    const currentIndex = this.index(current.row, current.col);

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
      this.generateForwardPath(this.end);
      this.reconstructDijkstraPath();
      return;
    }

    const neighbors = current.getConnectedNeighbors();
    for (let neighbor of neighbors) {
      const neighborIndex = this.index(neighbor.row, neighbor.col);

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

  generateForwardPath(end) {
    let current = end;
    let prev = this.dijkstraPrevious[this.index(current.row, current.col)];
    while (prev) {
      const prevIndex = this.index(prev.row, prev.col);
      this.dijkstraForward[prevIndex] = current;

      current = prev;
      prev = this.dijkstraPrevious[this.index(current.row, current.col)];
    }
  }

  reconstructDijkstraPath(speed = 5) {
    let current = grid[0];
    let frame = 0;
    drawGrid();

    const drawPathStep = () => {
      if (!current) {
        cancelAnimationFrame(this.animationFrame);
        return;
      }

      frame++;
      if (frame % speed === 0) {
        const i = this.index(current.row, current.col);

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
function update() {
  drawGrid();
  current.visited = true;

  const neighbors = current.getUnvisitedNeighbors();

  if (neighbors.length > 0) {
    const next = randomElement(neighbors);
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  } else {
    console.log("Maze generation complete!");
    const player = new Player(0, 0, "blue", ctx, cellSize, grid);
    player.draw();
    const dijkstra = new DijkstraAlgorithm(
      ctx,
      grid,
      index,
      rows,
      cols,
      cellSize
    );
    dijkstra.startAnimation();

    cancelAnimationFrame(animationId); // stop animation

    return;
  }

  animationId = requestAnimationFrame(update);
}
animationId = requestAnimationFrame(update);
