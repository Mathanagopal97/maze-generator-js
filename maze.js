var _a, _b, _c, _d;
// Grid configuration
var rows = 30;
var cols = 30;
var cellSize = 40;
var TOTAL_ROWS = 30;
var TOTAL_COLS = 30;
// ========== Maze Canvas Setup ==========
var canvas = document.getElementById("mazeCanvas");
var ctx = canvas.getContext("2d");
var Maze = /** @class */ (function () {
    function Maze(rows, cols, cellSize, ctx) {
        this.rows = rows;
        this.cols = cols;
        this.stack = [];
        this.cellSize = cellSize;
        this.ctx = ctx;
        this.animationId = 0;
        this.grid = new Array();
        for (var row = 0; row < rows; row++) {
            for (var col = 0; col < cols; col++) {
                var cell = new Cell(row, col, this.cellSize);
                this.grid.push(cell);
            }
        }
        this.current = this.grid[0];
    }
    Maze.prototype.runStep = function () {
        var _this = this;
        Utility.drawGrid(this.grid, this.ctx);
        if (this.stack.length > 0 ||
            this.current.getUnvisitedNeighbors(this.grid).length > 0) {
            var x = this.current.col * this.cellSize;
            var y = this.current.row * this.cellSize;
            this.ctx.fillStyle = "green";
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        }
        this.current.visited = true;
        var neighbors = this.current.getUnvisitedNeighbors(this.grid);
        if (neighbors.length > 0) {
            var next = Utility.randomElement(neighbors);
            this.stack.push(this.current);
            Utility.removeWalls(this.current, next);
            this.current = next;
        }
        else if (this.stack.length > 0) {
            this.current = this.stack.pop();
        }
        else {
            console.log("Maze generation complete!");
            this.startPlayer();
            cancelAnimationFrame(this.animationId);
            return;
        }
        this.animationId = requestAnimationFrame(function () { return _this.runStep(); });
    };
    Maze.prototype.startAnimation = function () {
        this.runStep();
    };
    Maze.prototype.startPlayer = function () {
        var player = new Player(0, 0, "blue", this.ctx, this.cellSize, this.grid);
        player.draw();
    };
    Maze.prototype.initiateDijkstra = function () {
        Utility.drawGrid(this.grid, this.ctx);
        var dijkstra = new DijkstraAlgorithm(this.ctx, this.grid, this.cellSize);
        dijkstra.startAnimation();
    };
    Maze.prototype.initiateAStar = function () {
        Utility.drawGrid(this.grid, this.ctx);
        var aStar = new AStarAlgorithm(this.ctx, this.grid, this.cellSize);
        aStar.startAnimation();
    };
    return Maze;
}());
if (ctx) {
    ctx.canvas.width = cols * cellSize;
    ctx.canvas.height = rows * cellSize;
    var maze_1 = new Maze(rows, cols, cellSize, ctx);
    (_a = document.getElementById("solve_dijkstra")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", function () {
        maze_1.initiateDijkstra();
    });
    (_b = document.getElementById("solve_astar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
        maze_1.initiateAStar();
    });
    (_c = document.getElementById("generate")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
        maze_1.startAnimation();
    });
    (_d = document.getElementById("reset")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () {
        // Resets all the orange and blue cells.
        // Redraws the Grid.
        // adds the player
        Utility.drawGrid(maze_1.grid, maze_1.ctx);
        maze_1.startPlayer();
    });
    //   document.getElementById("regenerate")?.addEventListener("click", () => {
    //       maze = new Maze(rows, cols, cellSize, ctx);
    //   });
}
