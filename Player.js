// This class should contain logic behind the player
// All dependencies must be present in this class.
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
    const cell = this.grid[Utility.index(this.row, this.col)];

    if (e.key === "ArrowUp" && !cell.walls.top) {
      this.row--;
    } else if (e.key === "ArrowDown" && !cell.walls.bottom) {
      this.row++;
    } else if (e.key === "ArrowLeft" && !cell.walls.left) {
      this.col--;
    } else if (e.key === "ArrowRight" && !cell.walls.right) {
      this.col++;
    }

    Utility.drawGrid(this.grid);
    this.draw();
  }
}
