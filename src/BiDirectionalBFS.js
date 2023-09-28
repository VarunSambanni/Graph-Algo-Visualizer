const ROW = 22;
const COL = 58;
var dRow = [-1, 0, 1, 0];
var dCol = [0, 1, 0, -1];
var intersectingFlag = false;
var interX = -1, interY = -1;
var p1 = [], p2 = [];



function printPath(destX, destY, pred1, pred2, path) {

    var crawl = [interX, interY];
    try {
        while (pred2[crawl[0]][crawl[1]][0] !== -1 && pred2[crawl[0]][crawl[1]][1] !== -1) {
            path.push(pred2[crawl[0]][crawl[1]]);
            crawl = pred2[crawl[0]][crawl[1]];

        }
        path.reverse();
        path.push([interX, interY]);
        crawl = [interX, interY];

        while (pred1[crawl[0]][crawl[1]][0] !== -1 && pred1[crawl[0]][crawl[1]][1] !== -1) {
            path.push(pred1[crawl[0]][crawl[1]]);
            crawl = pred1[crawl[0]][crawl[1]];
        }
        path.reverse();
    }
    catch (err) {

    }
}

function isValid(row, col, vis, grid) {
    if (row < 0 || col < 0
        || row >= ROW || col >= COL)
        return false;

    if (vis[row][col] || grid[row][col] === 0)
        return false;
    return true;
}

async function isIntersecting(pos, vis1, vis2) {
    for (let i = 0; i < ROW; i++) {
        for (let j = 0; j < COL; j++) {
            if (vis1[i][j] && vis2[i][j]) {
                intersectingFlag = true;
                pos.push([i, j]);
                interX = i;
                interY = j;
                break;
            }
        }
    }

}

//BiDirectionalBFS
async function BiDirectionalBFS(row, col, vis1, vis2, grid, pos, dist, path, NODE_END_ROW, NODE_END_COL) {
    var pred1 = [];
    var pred2 = [];
    for (let i = 0; i < ROW; i++) {
        var temp = [];
        for (let j = 0; j < COL; j++) {
            temp.push([-1, -1]);
        }
        pred1.push(temp);
        pred2.push(temp);
    }
    var q1 = [], q2 = [];

    q1.push([row, col]);
    q2.push([NODE_END_ROW, NODE_END_COL]);
    vis1[row][col] = true;
    vis2[NODE_END_ROW][NODE_END_COL] = true;

    while (q1.length !== 0 && q2.length !== 0) {

        var cell1 = q1[0], cell2 = q2[0];
        var x1 = cell1[0];
        var y1 = cell1[1];
        var x2 = cell2[0];
        var y2 = cell2[1];
        pos.push([x1, y1]);
        pos.push([x2, y2]);
        q1.shift();
        q2.shift();
        for (var i = 0; i < 4; i++) {

            var adjx = x1 + dRow[i];
            var adjy = y1 + dCol[i];

            if (isValid(adjx, adjy, vis1, grid)) {
                q1.push([adjx, adjy]);
                // dist[adjx][adjy] = dist[x][y] + 1;
                p1.push([adjx, adjy, x1, y1]);
                vis1[adjx][adjy] = true;
            }
        }
        for (var i = 0; i < 4; i++) {

            var adjx = x2 + dRow[i];
            var adjy = y2 + dCol[i];

            if (isValid(adjx, adjy, vis2, grid)) {
                q2.push([adjx, adjy]);
                //dist[adjx][adjy] = dist[x2][y2] + 1;
                p2.push([adjx, adjy, x2, y2]);
                vis2[adjx][adjy] = true;
            }
        }
        intersectingFlag = false;
        isIntersecting(pos, vis1, vis2);


        if (intersectingFlag)
            break;
    }
    if (intersectingFlag === false) {
        path = [];
        return;
    }
    for (let x of p1) {
        pred1[x[0]][x[1]] = [x[2], x[3]];
        localStorage.setItem("pred1", JSON.stringify(pred1));
    }
    for (let x of p2) {
        pred2[x[0]][x[1]] = [x[2], x[3]];
    }
    pred1 = JSON.parse(localStorage.getItem("pred1"));
    printPath(NODE_END_ROW, NODE_END_COL, pred1, pred2, path);
}

export default BiDirectionalBFS;
