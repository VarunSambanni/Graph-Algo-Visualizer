const ROW = 30;
const COL = 72;

var dRow = [-1, 0, 1, 0];
var dCol = [0, 1, 0, -1];

var positions = [];
var predBfs = [];

for (let i = 0; i < ROW; i++) {
  var temp = [];
  for (let j = 0; j < COL; j++) {
    temp.push([-1, -1]);
  }
  predBfs.push(temp);
}


function printPath(destX, destY) {
  var crawl = [destX, destY];
  positions.push(crawl);
  while (predBfs[crawl[0]][crawl[1]][0] !== -1 && predBfs[crawl[0]][crawl[1]][1] !== -1) {
    positions.push(predBfs[crawl[0]][crawl[1]]);
    crawl = predBfs[crawl[0]][crawl[1]];
  }
  positions.reverse();
}

function isValid(row, col, visBfs, grid) {
  if (row < 0 || col < 0
    || row >= ROW || col >= COL)
    return false;

  if (visBfs[row][col] || grid[row][col] === 0)
    return false;
  return true;
}



function BFS(row, col, visBfs, grid, distBfs, NODE_END_ROW, NODE_END_COL) {
  var q = [];
  q.push([row, col]);
  visBfs[row][col] = true;

  while (q.length !== 0) {

    var cell = q[0];
    var x = cell[0];
    var y = cell[1];
    q.shift();

    for (var i = 0; i < 4; i++) {

      var adjx = x + dRow[i];
      var adjy = y + dCol[i];

      if (isValid(adjx, adjy, visBfs, grid)) {
        q.push([adjx, adjy]);
        distBfs[adjx][adjy] = distBfs[x][y] + 1;
        predBfs[adjx][adjy] = [x, y];
        visBfs[adjx][adjy] = true;
      }
    }
  }
  printPath(NODE_END_ROW, NODE_END_COL);
}

//DFS
function DFS_Util(row, col, vis, grid, pos) {
  vis[row][col] = true;
  pos.push([row, col]);
  for (var i = 0; i < 4; i++) {
    if (isValid(row + dRow[i], col + dCol[i], vis, grid) && vis[row + dRow[i]][col + dCol[i]] === false) {
      DFS_Util(row + dRow[i], col + dCol[i], vis, grid, pos);
    }
  }
}

function DFS(row, col, vis, grid, pos, NODE_END_ROW, NODE_END_COL) {
  NODE_END_ROW = parseInt(NODE_END_ROW);
  NODE_END_COL = parseInt(NODE_END_COL);
  positions = [];
  var visBfs = Array.from(Array(ROW), () => Array(COL).fill(false));
  var distBfs = Array.from(Array(ROW), () => Array(COL).fill(0));
  BFS(row, col, visBfs, grid, distBfs, NODE_END_ROW, NODE_END_COL);
  positions.push([distBfs[NODE_END_ROW][NODE_END_COL], distBfs[NODE_END_ROW][NODE_END_COL]]);
  DFS_Util(row, col, vis, grid, pos);
  return positions;
}

export default DFS;
