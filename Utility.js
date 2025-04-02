class Utility {
  static index(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols) {
      return -1; // invalid index
    }
    return row * cols + col;
  }

  static drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
      grid[i].draw(ctx);
    }
  }

  static randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  static removeWalls(a, b) {
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
}
