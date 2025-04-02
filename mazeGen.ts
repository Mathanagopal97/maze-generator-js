const canvas = document.getElementById("mazeCanvas");
const ctx = canvas.getContext("2d");

// Grid configuration
const rows = 30;
const cols = 30;
const cellSize = 30;

let grid = [];
let stack = [];
let current;
let animationId;

type Player = {
  row: number;
  col: number;
  color: string;
};

let player: Player = {
  row: 0,
  col: 0,
  color: "blue",
};

interface Walls {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

class Cell {
  row: number;
  col: number;
  walls: Walls;
  visited: boolean;

  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
  }
}
