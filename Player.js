// This class should contain logic behind the player
// All dependencies must be present in this class.
var Player = /** @class */ (function () {
    function Player(row, col, color, ctx, cellSize, grid) {
        var _this = this;
        this.row = row;
        this.col = col;
        this.color = color;
        this.ctx = ctx;
        this.cellSize = cellSize;
        this.grid = grid;
        document.addEventListener("keydown", function (e) { return _this.handleKeyPress(e); });
    }
    Player.prototype.draw = function () {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.col * this.cellSize + this.cellSize * 0.25, this.row * this.cellSize + this.cellSize * 0.25, this.cellSize * 0.5, this.cellSize * 0.5);
    };
    Player.prototype.handleKeyPress = function (e) {
        var cell = this.grid[Utility.index(this.row, this.col)];
        var isArrowKeysPressed = false;
        if (e.key === "ArrowUp" && !cell.walls.top) {
            this.row--;
            isArrowKeysPressed = true;
        }
        else if (e.key === "ArrowDown" && !cell.walls.bottom) {
            this.row++;
            isArrowKeysPressed = true;
        }
        else if (e.key === "ArrowLeft" && !cell.walls.left) {
            this.col--;
            isArrowKeysPressed = true;
        }
        else if (e.key === "ArrowRight" && !cell.walls.right) {
            this.col++;
            isArrowKeysPressed = true;
        }
        if (isArrowKeysPressed) {
            Utility.drawGrid(this.grid, this.ctx);
            this.draw();
        }
    };
    return Player;
}());
