// This class should contain all the code related to Dijkstra algorithm.
// All dependencies must be present in this class
var DijkstraAlgorithm = /** @class */ (function () {
    function DijkstraAlgorithm(ctx, grid, cellSize) {
        this.dijkstraQueue = new Array();
        this.dijkstraVisited = new Set();
        this.dijkstraDistances = [];
        this.dijkstraPrevious = [];
        this.dijkstraForward = []; // for next steps
        this.dijkstraStepInProgress = true;
        this.ctx = ctx;
        this.grid = grid;
        this.rows = TOTAL_ROWS;
        this.cols = TOTAL_COLS;
        this.cellSize = cellSize;
        for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
            var cell = _a[_i];
            this.dijkstraDistances[Utility.index(cell.row, cell.col)] = Infinity;
            //   this.dijkstraPrevious[Utility.index(cell.row, cell.col)] = null;
        }
        var start = this.grid[0]; // top-left corner
        this.dijkstraDistances[Utility.index(start.row, start.col)] = 0;
        this.dijkstraQueue.push(start);
        this.end = grid[Utility.index(rows - 1, cols - 1)];
        this.animationFrame = 0;
    }
    DijkstraAlgorithm.prototype.runStep = function () {
        var _this = this;
        if (this.dijkstraQueue.length === 0 || !this.dijkstraStepInProgress) {
            console.log("Dijkstra: no path found or already completed.");
            cancelAnimationFrame(this.animationFrame);
            return;
        }
        this.dijkstraQueue.sort(function (a, b) {
            return (_this.dijkstraDistances[Utility.index(a.row, a.col)] -
                _this.dijkstraDistances[Utility.index(b.row, b.col)]);
        });
        var current = this.dijkstraQueue[0];
        this.dijkstraQueue.shift();
        var currentIndex = Utility.index(current.row, current.col);
        if (this.dijkstraVisited.has(currentIndex)) {
            this.animationFrame = requestAnimationFrame(function () { return _this.runStep(); });
            return;
        }
        this.dijkstraVisited.add(currentIndex);
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(current.col * this.cellSize + this.cellSize * 0.25, current.row * this.cellSize + this.cellSize * 0.25, this.cellSize * 0.5, this.cellSize * 0.5);
        if (current === this.end) {
            this.dijkstraStepInProgress = false;
            console.log("Dijkstra: reached the goal!");
            cancelAnimationFrame(this.animationFrame);
            this.generateForwardPath();
            this.reconstructDijkstraPath();
            return;
        }
        var neighbors = current.getConnectedNeighbors(this.grid);
        for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
            var neighbor = neighbors_1[_i];
            var neighborIndex = Utility.index(neighbor.row, neighbor.col);
            if (!this.dijkstraVisited.has(neighborIndex)) {
                var tentativeDistance = this.dijkstraDistances[currentIndex] + 1;
                if (tentativeDistance < this.dijkstraDistances[neighborIndex]) {
                    this.dijkstraDistances[neighborIndex] = tentativeDistance;
                    this.dijkstraPrevious[neighborIndex] = current;
                    this.dijkstraQueue.push(neighbor);
                }
            }
        }
        this.animationFrame = requestAnimationFrame(function () { return _this.runStep(); });
    };
    DijkstraAlgorithm.prototype.generateForwardPath = function () {
        var current = this.end;
        var prev = this.dijkstraPrevious[Utility.index(current.row, current.col)];
        while (prev) {
            var prevIndex = Utility.index(prev.row, prev.col);
            this.dijkstraForward[prevIndex] = current;
            current = prev;
            prev = this.dijkstraPrevious[Utility.index(current.row, current.col)];
        }
    };
    DijkstraAlgorithm.prototype.reconstructDijkstraPath = function (speed) {
        var _this = this;
        if (speed === void 0) { speed = 5; }
        var current = this.grid[0];
        var frame = 0;
        // Utility.drawGrid(this.grid);
        var drawPathStep = function () {
            if (!current) {
                cancelAnimationFrame(_this.animationFrame);
                return;
            }
            frame++;
            if (frame % speed === 0) {
                var i = Utility.index(current.row, current.col);
                _this.ctx.fillStyle = "dodgerblue";
                _this.ctx.fillRect(current.col * _this.cellSize + _this.cellSize * 0.25, current.row * _this.cellSize + _this.cellSize * 0.25, _this.cellSize * 0.5, _this.cellSize * 0.5);
                current = _this.dijkstraForward[i];
            }
            _this.animationFrame = requestAnimationFrame(drawPathStep);
        };
        this.animationFrame = requestAnimationFrame(drawPathStep);
    };
    DijkstraAlgorithm.prototype.startAnimation = function () {
        this.runStep();
    };
    return DijkstraAlgorithm;
}());
