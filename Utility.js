var Utility = /** @class */ (function () {
    function Utility() {
    }
    Utility.index = function (row, col) {
        if (row < 0 || col < 0 || row >= TOTAL_ROWS || col >= TOTAL_COLS) {
            return -1; // invalid index
        }
        return row * cols + col;
    };
    Utility.drawGrid = function (grid, ctx) {
        for (var i = 0; i < grid.length; i++) {
            grid[i].draw(ctx);
        }
    };
    Utility.randomElement = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };
    Utility.removeWalls = function (a, b) {
        var x = a.col - b.col;
        var y = a.row - b.row;
        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        }
        else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }
        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        }
        else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    };
    return Utility;
}());
