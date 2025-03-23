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

let player = {
  row: 0,
  col: 0,
  color: "blue",
};

// ========== Cell Class ==========
class Cell {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
    this.isSolution = false;
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

//Pick a random start and end cell
function pickStartAndEndCells() {
  const sides = ["top", "right", "bottom", "left"];

  const sideA = sides[Math.floor(Math.random() * sides.length)];

  let sideB;
  do {
    sideB = sides[Math.floor(Math.random() * sides.length)];
  } while (sideB === sideA); // Ensure different sides

  console.log(sideA, sideB);

  function randomCellOnSide(side) {
    if (side === "top") return grid[index(0, Math.floor(Math.random() * cols))];
    if (side === "bottom")
      return grid[index(rows - 1, Math.floor(Math.random() * cols))];
    if (side === "left")
      return grid[index(Math.floor(Math.random() * rows), 0)];
    if (side === "right")
      return grid[index(Math.floor(Math.random() * rows), cols - 1)];
  }

  startCell = randomCellOnSide(sideA);
  endCell = randomCellOnSide(sideB);

  console.log(startCell, endCell);

  return [startCell, endCell];
}

// Highlights the current cell in green
function highlightCurrentCell(cell) {
  const x = cell.col * cellSize;
  const y = cell.row * cellSize;

  ctx.fillStyle = "green";
  ctx.fillRect(x, y, cellSize, cellSize);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(
    player.col * cellSize + cellSize * 0.25,
    player.row * cellSize + cellSize * 0.25,
    cellSize * 0.5,
    cellSize * 0.5
  );
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

function drawStartAndEnd(startCell, endCell) {
  if (!startCell || !endCell) return;

  ctx.fillStyle = "limegreen"; // start
  ctx.fillRect(
    startCell.col * cellSize,
    startCell.row * cellSize,
    cellSize,
    cellSize
  );

  ctx.fillStyle = "crimson"; // end
  ctx.fillRect(
    endCell.col * cellSize,
    endCell.row * cellSize,
    cellSize,
    cellSize
  );
}

// ========== Maze Initialization ==========

// Create the grid with Cell instances
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const cell = new Cell(row, col);
    grid.push(cell);
  }
}

function drawSolution(path) {
  console.log(path);
  for (let i = 0; i < path.length; i++) {
    console.log(path[i]);
    ctx.fillStyle = "dodgerblue"; // start
    ctx.fillRect(
      path[i].col * cellSize,
      path[i].row * cellSize,
      cellSize,
      cellSize
    );
  }
}

// Start from the first cell
current = grid[0];
let allPaths = [];

function findAllPaths(startCell) {
  const visited = new Set();
  const path = [];

  function dfs(cell) {
    visited.add(index(cell.row, cell.col));
    path.push(cell);

    const neighbors = cell
      .getConnectedNeighbors()
      .filter((n) => !visited.has(index(n.row, n.col)));
    if (neighbors.length === 0) {
      // dead end reached
      allPaths.push([...path]);
    } else {
      for (const neighbor of neighbors) {
        dfs(neighbor);
      }
    }

    path.pop(); // backtrack
    visited.delete(index(cell.row, cell.col));
  }

  dfs(startCell);
}

// ========== Maze Generation Algorithm ==========

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
    drawPlayer();
    // drawStartAndEnd(...pickStartAndEndCells());

    // findAllPaths(grid[0]);
    // console.log(allPaths);

    cancelAnimationFrame(animationId); // stop animation

    return;
  }

  animationId = requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  const cell = grid[index(player.row, player.col)];

  if (e.key === "ArrowUp" && !cell.walls.top) {
    player.row--;
  } else if (e.key === "ArrowDown" && !cell.walls.bottom) {
    player.row++;
  } else if (e.key === "ArrowLeft" && !cell.walls.left) {
    player.col--;
  } else if (e.key === "ArrowRight" && !cell.walls.right) {
    player.col++;
  }

  drawGrid();
  drawPlayer();

  // Optional: Check if they reached the goal
  //   if (player.row === farthestCell.row && player.col === farthestCell.col) {
  //     setTimeout(() => {
  //       alert("🎉 You reached the goal!");
  //     }, 100);
  //   }
});

// update();
animationId = requestAnimationFrame(update);
