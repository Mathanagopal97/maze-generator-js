import { Cell } from "./Cell";
import { Utility } from "./Utility";
// This class should contain logic behind the player
// All dependencies must be present in this class.
export class Player {
  row;
  col;
  color;
  ctx;
  cellSize;
  grid;

  constructor(
    row: number,
    col: number,
    color: string,
    ctx: CanvasRenderingContext2D,
    cellSize: number,
    grid: Array<Cell>
  ) {
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

  handleKeyPress(e: KeyboardEvent) {
    const cell = this.grid[Utility.index(this.row, this.col)];
    let isArrowKeysPressed = false;

    if (e.key === "ArrowUp" && !cell.walls.top) {
      this.row--;
      isArrowKeysPressed = true;
    } else if (e.key === "ArrowDown" && !cell.walls.bottom) {
      this.row++;
      isArrowKeysPressed = true;
    } else if (e.key === "ArrowLeft" && !cell.walls.left) {
      this.col--;
      isArrowKeysPressed = true;
    } else if (e.key === "ArrowRight" && !cell.walls.right) {
      this.col++;
      isArrowKeysPressed = true;
    }

    if (isArrowKeysPressed) {
      Utility.drawGrid(this.grid, this.ctx);
      this.draw();
    }
  }
}
