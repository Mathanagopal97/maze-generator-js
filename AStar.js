var AStarAlgorithm = /** @class */ (function () {
    function AStarAlgorithm(ctx, grid, cellSize) {
        this.ctx = ctx;
        this.grid = grid;
        this.cellSize = cellSize;
        this.start = grid[0];
        this.end = grid[Utility.index(rows - 1, cols - 1)];
        this.openSet = [this.start];
        this.gScore = [];
        this.fScore = [];
        this.cameFrom = new Map();
        this.aStarVisited = new Set();
        this.animationId = 0;
        for (var _i = 0, _a = this.grid; _i < _a.length; _i++) {
            var cell = _a[_i];
            var currentIndex = Utility.index(cell.row, cell.col);
            this.gScore[currentIndex] = Infinity;
            this.fScore[currentIndex] = Infinity;
        }
        var startIndex = Utility.index(this.start.row, this.start.col);
        this.gScore[startIndex] = 0;
        this.fScore[startIndex] = this.heuristic(this.start, this.end);
        this.aStarInProgress = true;
    }
    AStarAlgorithm.prototype.heuristic = function (start, end) {
        // Calculate the heuristic value from the start and the end cell.
        // Using a simple Manhattan distance
        return Math.abs(start.row - end.row) + Math.abs(start.col - end.col);
    };
    AStarAlgorithm.prototype.runStep = function () {
        var _this = this;
        if (this.openSet.length === 0 || !this.aStarInProgress) {
            console.log("A star is not able to find a solution");
            cancelAnimationFrame(this.animationId);
            return;
        }
        // we have to get the node with shortest fScore value
        this.openSet.sort(function (a, b) {
            return _this.fScore[Utility.index(a.row, a.col)] -
                _this.fScore[Utility.index(b.row, b.col)];
        });
        var current = this.openSet[0];
        this.openSet.shift();
        var currentIndex = Utility.index(current.row, current.col);
        // if (this.aStarVisited.has(currentIndex)) {
        //   this.animationId = requestAnimationFrame(() => this.runStep());
        // }
        this.ctx.fillStyle = "orange";
        this.ctx.fillRect(current.col * this.cellSize + this.cellSize * 0.25, current.row * this.cellSize + this.cellSize * 0.25, this.cellSize * 0.5, this.cellSize * 0.5);
        if (current === this.end) {
            this.aStarInProgress = false;
            console.log("A star is completed");
            console.log(this.cameFrom);
            this.drawSolution();
            cancelAnimationFrame(this.animationId);
            return;
        }
        var neighbors = current.getConnectedNeighbors(this.grid);
        for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
            var neighbor = neighbors_1[_i];
            var neighborIndex = Utility.index(neighbor.row, neighbor.col);
            var tempGScore = this.gScore[currentIndex] + 1;
            if (tempGScore < this.gScore[neighborIndex]) {
                this.cameFrom.set(neighborIndex, current);
                this.gScore[neighborIndex] = tempGScore;
                this.fScore[neighborIndex] =
                    tempGScore + this.heuristic(neighbor, this.end);
                this.openSet.push(neighbor);
            }
        }
        this.animationId = requestAnimationFrame(function () { return _this.runStep(); });
    };
    AStarAlgorithm.prototype.drawSolution = function () {
        var _this = this;
        var current = this.end, frame = 0, i = 0;
        var totalPath = new Array();
        while (current && current !== this.start) {
            totalPath.push(current);
            var currentVal = this.cameFrom.get(Utility.index(current.row, current.col));
            if (currentVal) {
                current = currentVal;
            }
        }
        var cell = totalPath[i];
        i++;
        var drawPathStep = function () {
            if (!cell) {
                return;
            }
            frame++;
            if (frame % 5 === 0) {
                _this.ctx.fillStyle = "dodgerblue";
                _this.ctx.fillRect(cell.col * _this.cellSize + _this.cellSize * 0.25, cell.row * _this.cellSize + _this.cellSize * 0.25, _this.cellSize * 0.5, _this.cellSize * 0.5);
                cell = totalPath[i];
                i++;
            }
            requestAnimationFrame(drawPathStep);
        };
        requestAnimationFrame(drawPathStep);
    };
    AStarAlgorithm.prototype.startAnimation = function () {
        this.runStep();
    };
    return AStarAlgorithm;
}());
