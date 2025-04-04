(()=>{"use strict";var t,i,e,s,r=function(){function t(){}return t.index=function(t,i){return t<0||i<0||t>=30||i>=30?-1:30*t+i},t.drawGrid=function(t,i){for(var e=0;e<t.length;e++)t[e].draw(i)},t.randomElement=function(t){return t[Math.floor(Math.random()*t.length)]},t.removeWalls=function(t,i){var e=t.col-i.col,s=t.row-i.row;1===e?(t.walls.left=!1,i.walls.right=!1):-1===e&&(t.walls.right=!1,i.walls.left=!1),1===s?(t.walls.top=!1,i.walls.bottom=!1):-1===s&&(t.walls.bottom=!1,i.walls.top=!1)},t}(),n=function(){function t(t,i,e){this.ctx=t,this.grid=i,this.cellSize=e,this.start=i[0],this.end=i[r.index(29,29)],this.openSet=[this.start],this.gScore=[],this.fScore=[],this.cameFrom=new Map,this.aStarVisited=new Set,this.animationId=0;for(var s=0,n=this.grid;s<n.length;s++){var o=n[s],l=r.index(o.row,o.col);this.gScore[l]=1/0,this.fScore[l]=1/0}var h=r.index(this.start.row,this.start.col);this.gScore[h]=0,this.fScore[h]=this.heuristic(this.start,this.end),this.aStarInProgress=!0}return t.prototype.heuristic=function(t,i){return Math.abs(t.row-i.row)+Math.abs(t.col-i.col)},t.prototype.runStep=function(){var t=this;if(0===this.openSet.length||!this.aStarInProgress)return console.log("A star is not able to find a solution"),void cancelAnimationFrame(this.animationId);this.openSet.sort((function(i,e){return t.fScore[r.index(i.row,i.col)]-t.fScore[r.index(e.row,e.col)]}));var i=this.openSet[0];this.openSet.shift();var e=r.index(i.row,i.col);if(this.ctx.fillStyle="orange",this.ctx.fillRect(i.col*this.cellSize+.25*this.cellSize,i.row*this.cellSize+.25*this.cellSize,.5*this.cellSize,.5*this.cellSize),i===this.end)return this.aStarInProgress=!1,console.log("A star is completed"),console.log(this.cameFrom),this.drawSolution(),void cancelAnimationFrame(this.animationId);for(var s=0,n=i.getConnectedNeighbors(this.grid);s<n.length;s++){var o=n[s],l=r.index(o.row,o.col),h=this.gScore[e]+1;h<this.gScore[l]&&(this.cameFrom.set(l,i),this.gScore[l]=h,this.fScore[l]=h+this.heuristic(o,this.end),this.openSet.push(o))}this.animationId=requestAnimationFrame((function(){return t.runStep()}))},t.prototype.drawSolution=function(){for(var t=this,i=this.end,e=0,s=0,n=new Array;i&&i!==this.start;){n.push(i);var o=this.cameFrom.get(r.index(i.row,i.col));o&&(i=o)}var l=n[s];s++;var h=function(){l&&(++e%5==0&&(t.ctx.fillStyle="dodgerblue",t.ctx.fillRect(l.col*t.cellSize+.25*t.cellSize,l.row*t.cellSize+.25*t.cellSize,.5*t.cellSize,.5*t.cellSize),l=n[s],s++),requestAnimationFrame(h))};requestAnimationFrame(h)},t.prototype.startAnimation=function(){this.runStep()},t}(),o=function(){function t(t,i,e){this.row=t,this.col=i,this.walls={top:!0,right:!0,bottom:!0,left:!0},this.visited=!1,this.cellSize=e}return t.prototype.draw=function(t){var i=this.col*this.cellSize,e=this.row*this.cellSize;t.strokeStyle="black",t.lineWidth=2,this.walls.top&&(t.beginPath(),t.moveTo(i,e),t.lineTo(i+this.cellSize,e),t.stroke()),this.walls.bottom&&(t.beginPath(),t.moveTo(i,e+this.cellSize),t.lineTo(i+this.cellSize,e+this.cellSize),t.stroke()),this.walls.left&&(t.beginPath(),t.moveTo(i,e),t.lineTo(i,e+this.cellSize),t.stroke()),this.walls.right&&(t.beginPath(),t.moveTo(i+this.cellSize,e),t.lineTo(i+this.cellSize,e+this.cellSize),t.stroke()),this.visited&&(t.fillStyle="#eee",t.fillRect(i,e,this.cellSize,this.cellSize))},t.prototype.getUnvisitedNeighbors=function(t){var i=[],e=t[r.index(this.row-1,this.col)],s=t[r.index(this.row,this.col+1)],n=t[r.index(this.row+1,this.col)],o=t[r.index(this.row,this.col-1)];return e&&!e.visited&&i.push(e),s&&!s.visited&&i.push(s),n&&!n.visited&&i.push(n),o&&!o.visited&&i.push(o),i},t.prototype.getConnectedNeighbors=function(t){var i=[],e=t[r.index(this.row-1,this.col)],s=t[r.index(this.row,this.col+1)],n=t[r.index(this.row+1,this.col)],o=t[r.index(this.row,this.col-1)];return e&&!this.walls.top&&i.push(e),s&&!this.walls.right&&i.push(s),n&&!this.walls.bottom&&i.push(n),o&&!this.walls.left&&i.push(o),i},t}(),l=function(){function t(t,i,e){this.dijkstraQueue=new Array,this.dijkstraVisited=new Set,this.dijkstraDistances=[],this.dijkstraPrevious=[],this.dijkstraForward=[],this.dijkstraStepInProgress=!0,this.ctx=t,this.grid=i,this.rows=30,this.cols=30,this.cellSize=e;for(var s=0,n=this.grid;s<n.length;s++){var o=n[s];this.dijkstraDistances[r.index(o.row,o.col)]=1/0}var l=this.grid[0];this.dijkstraDistances[r.index(l.row,l.col)]=0,this.dijkstraQueue.push(l),this.end=i[r.index(29,29)],this.animationFrame=0}return t.prototype.runStep=function(){var t=this;if(0===this.dijkstraQueue.length||!this.dijkstraStepInProgress)return console.log("Dijkstra: no path found or already completed."),void cancelAnimationFrame(this.animationFrame);this.dijkstraQueue.sort((function(i,e){return t.dijkstraDistances[r.index(i.row,i.col)]-t.dijkstraDistances[r.index(e.row,e.col)]}));var i=this.dijkstraQueue[0];this.dijkstraQueue.shift();var e=r.index(i.row,i.col);if(this.dijkstraVisited.has(e))this.animationFrame=requestAnimationFrame((function(){return t.runStep()}));else{if(this.dijkstraVisited.add(e),this.ctx.fillStyle="orange",this.ctx.fillRect(i.col*this.cellSize+.25*this.cellSize,i.row*this.cellSize+.25*this.cellSize,.5*this.cellSize,.5*this.cellSize),i===this.end)return this.dijkstraStepInProgress=!1,console.log("Dijkstra: reached the goal!"),cancelAnimationFrame(this.animationFrame),this.generateForwardPath(),void this.reconstructDijkstraPath();for(var s=0,n=i.getConnectedNeighbors(this.grid);s<n.length;s++){var o=n[s],l=r.index(o.row,o.col);if(!this.dijkstraVisited.has(l)){var h=this.dijkstraDistances[e]+1;h<this.dijkstraDistances[l]&&(this.dijkstraDistances[l]=h,this.dijkstraPrevious[l]=i,this.dijkstraQueue.push(o))}}this.animationFrame=requestAnimationFrame((function(){return t.runStep()}))}},t.prototype.generateForwardPath=function(){for(var t=this.end,i=this.dijkstraPrevious[r.index(t.row,t.col)];i;){var e=r.index(i.row,i.col);this.dijkstraForward[e]=t,t=i,i=this.dijkstraPrevious[r.index(t.row,t.col)]}},t.prototype.reconstructDijkstraPath=function(t){var i=this;void 0===t&&(t=5);var e=this.grid[0],s=0,n=function(){if(e){if(++s%t==0){var o=r.index(e.row,e.col);i.ctx.fillStyle="dodgerblue",i.ctx.fillRect(e.col*i.cellSize+.25*i.cellSize,e.row*i.cellSize+.25*i.cellSize,.5*i.cellSize,.5*i.cellSize),e=i.dijkstraForward[o]}i.animationFrame=requestAnimationFrame(n)}else cancelAnimationFrame(i.animationFrame)};this.animationFrame=requestAnimationFrame(n)},t.prototype.startAnimation=function(){this.runStep()},t}(),h=function(){function t(t,i,e,s,r,n){var o=this;this.row=t,this.col=i,this.color=e,this.ctx=s,this.cellSize=r,this.grid=n,document.addEventListener("keydown",(function(t){return o.handleKeyPress(t)}))}return t.prototype.draw=function(){this.ctx.fillStyle=this.color,this.ctx.fillRect(this.col*this.cellSize+.25*this.cellSize,this.row*this.cellSize+.25*this.cellSize,.5*this.cellSize,.5*this.cellSize)},t.prototype.handleKeyPress=function(t){var i=this.grid[r.index(this.row,this.col)],e=!1;"ArrowUp"!==t.key||i.walls.top?"ArrowDown"!==t.key||i.walls.bottom?"ArrowLeft"!==t.key||i.walls.left?"ArrowRight"!==t.key||i.walls.right||(this.col++,e=!0):(this.col--,e=!0):(this.row++,e=!0):(this.row--,e=!0),e&&(r.drawGrid(this.grid,this.ctx),this.draw())},t}(),a=document.getElementById("mazeCanvas").getContext("2d"),c=function(){function t(t,i,e,s){this.rows=t,this.cols=i,this.stack=[],this.cellSize=e,this.ctx=s,this.animationId=0,this.grid=new Array;for(var r=0;r<t;r++)for(var n=0;n<i;n++){var l=new o(r,n,this.cellSize);this.grid.push(l)}this.current=this.grid[0]}return t.prototype.runStep=function(){var t=this;if(r.drawGrid(this.grid,this.ctx),this.stack.length>0||this.current.getUnvisitedNeighbors(this.grid).length>0){var i=this.current.col*this.cellSize,e=this.current.row*this.cellSize;this.ctx.fillStyle="green",this.ctx.fillRect(i,e,this.cellSize,this.cellSize)}this.current.visited=!0;var s=this.current.getUnvisitedNeighbors(this.grid);if(s.length>0){var n=r.randomElement(s);this.stack.push(this.current),r.removeWalls(this.current,n),this.current=n}else{if(!(this.stack.length>0))return console.log("Maze generation complete!"),this.startPlayer(),void cancelAnimationFrame(this.animationId);this.current=this.stack.pop()}this.animationId=requestAnimationFrame((function(){return t.runStep()}))},t.prototype.startAnimation=function(){this.runStep()},t.prototype.startPlayer=function(){new h(0,0,"blue",this.ctx,this.cellSize,this.grid).draw()},t.prototype.initiateDijkstra=function(){r.drawGrid(this.grid,this.ctx),new l(this.ctx,this.grid,this.cellSize).startAnimation()},t.prototype.initiateAStar=function(){r.drawGrid(this.grid,this.ctx),new n(this.ctx,this.grid,this.cellSize).startAnimation()},t}();if(a){a.canvas.width=1200,a.canvas.height=1200;var d=new c(30,30,40,a);null===(t=document.getElementById("solve_dijkstra"))||void 0===t||t.addEventListener("click",(function(){d.initiateDijkstra()})),null===(i=document.getElementById("solve_astar"))||void 0===i||i.addEventListener("click",(function(){d.initiateAStar()})),null===(e=document.getElementById("generate"))||void 0===e||e.addEventListener("click",(function(){d.startAnimation()})),null===(s=document.getElementById("reset"))||void 0===s||s.addEventListener("click",(function(){r.drawGrid(d.grid,d.ctx),d.startPlayer()}))}})();