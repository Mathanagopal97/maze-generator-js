var Cell = /** @class */ (function () {
    function Cell(row, col, cellSize) {
        this.row = row;
        this.col = col;
        this.walls = { top: true, right: true, bottom: true, left: true };
        this.visited = false;
        this.cellSize = cellSize;
    }
    Cell.prototype.draw = function (ctx) {
        var x = this.col * this.cellSize;
        var y = this.row * this.cellSize;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        if (this.walls.top) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.cellSize, y);
            ctx.stroke();
        }
        if (this.walls.bottom) {
            ctx.beginPath();
            ctx.moveTo(x, y + this.cellSize);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
            ctx.stroke();
        }
        if (this.walls.left) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this.cellSize);
            ctx.stroke();
        }
        if (this.walls.right) {
            ctx.beginPath();
            ctx.moveTo(x + this.cellSize, y);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
            ctx.stroke();
        }
        if (this.visited) {
            ctx.fillStyle = "#eee";
            ctx.fillRect(x, y, this.cellSize, this.cellSize);
        }
    };
    Cell.prototype.getUnvisitedNeighbors = function (grid) {
        var neighbors = [];
        var top = grid[Utility.index(this.row - 1, this.col)];
        var right = grid[Utility.index(this.row, this.col + 1)];
        var bottom = grid[Utility.index(this.row + 1, this.col)];
        var left = grid[Utility.index(this.row, this.col - 1)];
        if (top && !top.visited)
            neighbors.push(top);
        if (right && !right.visited)
            neighbors.push(right);
        if (bottom && !bottom.visited)
            neighbors.push(bottom);
        if (left && !left.visited)
            neighbors.push(left);
        return neighbors;
    };
    Cell.prototype.getConnectedNeighbors = function (grid) {
        var neighbors = [];
        var top = grid[Utility.index(this.row - 1, this.col)];
        var right = grid[Utility.index(this.row, this.col + 1)];
        var bottom = grid[Utility.index(this.row + 1, this.col)];
        var left = grid[Utility.index(this.row, this.col - 1)];
        if (top && !this.walls.top)
            neighbors.push(top);
        if (right && !this.walls.right)
            neighbors.push(right);
        if (bottom && !this.walls.bottom)
            neighbors.push(bottom);
        if (left && !this.walls.left)
            neighbors.push(left);
        return neighbors;
    };
    return Cell;
}());
