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
  getUnvisitedNeighbors(grid) {
    const neighbors = [];

    const top = grid[Utility.index(this.row - 1, this.col)];
    const right = grid[Utility.index(this.row, this.col + 1)];
    const bottom = grid[Utility.index(this.row + 1, this.col)];
    const left = grid[Utility.index(this.row, this.col - 1)];

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    return neighbors;
  }

  getConnectedNeighbors(grid) {
    const neighbors = [];

    const top = grid[Utility.index(this.row - 1, this.col)];
    const right = grid[Utility.index(this.row, this.col + 1)];
    const bottom = grid[Utility.index(this.row + 1, this.col)];
    const left = grid[Utility.index(this.row, this.col - 1)];

    if (top && !this.walls.top) neighbors.push(top);
    if (right && !this.walls.right) neighbors.push(right);
    if (bottom && !this.walls.bottom) neighbors.push(bottom);
    if (left && !this.walls.left) neighbors.push(left);

    return neighbors;
  }
}
