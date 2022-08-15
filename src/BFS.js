const ROW = 30;
const COL = 72;
var dRow = [-1, 0, 1, 0];
var dCol = [0, 1, 0, -1];

function printPath(destX, destY, pred, path) {
  var crawl = [destX, destY];
  path.push(crawl);
  while (pred[crawl[0]][crawl[1]][0] !== -1 && pred[crawl[0]][crawl[1]][1] !== -1) {
    path.push(pred[crawl[0]][crawl[1]]);
    crawl = pred[crawl[0]][crawl[1]];
  }
  path.reverse();
}

function isValid(row, col, vis, grid) {
  if (row < 0 || col < 0
    || row >= ROW || col >= COL)
    return false;

  if (vis[row][col] || grid[row][col] === 0)
    return false;
  return true;
}

//BFS
function BFS(row, col, vis, grid, pos, dist, pred, path, NODE_END_ROW, NODE_END_COL) {
  var q = [];

  q.push([row, col]);
  vis[row][col] = true;

  while (q.length !== 0) {

    var cell = q[0];
    var x = cell[0];
    var y = cell[1];
    pos.push([x, y]);
    q.shift();

    for (var i = 0; i < 4; i++) {

      var adjx = x + dRow[i];
      var adjy = y + dCol[i];

      if (isValid(adjx, adjy, vis, grid)) {
        q.push([adjx, adjy]);
        dist[adjx][adjy] = dist[x][y] + 1;
        pred[adjx][adjy] = [x, y];
        vis[adjx][adjy] = true;
      }
    }
  }
  printPath(NODE_END_ROW, NODE_END_COL, pred, path);
}

export default BFS;
