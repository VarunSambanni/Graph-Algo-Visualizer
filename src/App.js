import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { BFS } from './BFS'
const ROW = 40;
const COL = 72;

const NODE_START_ROW = 10;
const NODE_START_COL = 10;
const NODE_END_ROW = ROW - 1;
const NODE_END_COL = COL - 1;


function App() {
  const [cnt, setCnt] = useState(0);
  const [clearGrid, setClearGrid] = useState(false);
  const [algo, setAlgo] = useState('BFS');
  const [tab, setTab] = useState('BFS');
  const minDist = useRef(null);

  var vis = Array.from(Array(ROW), () => Array(COL).fill(false));
  var dist = Array.from(Array(ROW), () => Array(COL).fill(0));
  var grid = Array.from(Array(ROW), () => Array(COL).fill(1));
  var pos = [];
  var dRow = [-1, 0, 1, 0];
  var dCol = [0, 1, 0, -1];

  function isValid(row, col) {
    if (row < 0 || col < 0
      || row >= ROW || col >= COL)
      return false;

    if (vis[row][col] || grid[row][col] === 0)
      return false;
    return true;
  }
  //BFS
  function BFS(row, col) {
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

        if (isValid(adjx, adjy)) {
          q.push([adjx, adjy]);
          dist[adjx][adjy] = dist[x][y] + 1;
          vis[adjx][adjy] = true;
        }
      }
    }
  }


  //DFS 
  function DFS(row, col) {
    vis[row][col] = true;
    pos.push([row, col]);
    for (var i = 0; i < 4; i++) {
      if (isValid(row + dRow[i], col + dCol[i]))
        DFS(row + dRow[i], col + dCol[i]);
    }
  }
  //GRID RANDOMIZER 
  if (clearGrid === false) {
    for (var i = 0; i < ROW; i++) {
      for (var j = 0; j < COL; j++) {
        if (i === NODE_START_ROW && j === NODE_START_COL) {
          continue;
        }
        if (i === NODE_END_ROW && j === NODE_END_COL) {
          continue;
        }
        if (Math.floor(Math.random() * 3.5) < 1) {
          grid[i][j] = 0;
        }
        else {
          grid[i][j] = 1;
        }

      }
    }
  }

  switch (algo) {
    case 'DFS': {
      DFS(NODE_START_ROW, NODE_START_COL);
    }
    case 'BFS': {
      BFS(NODE_START_ROW, NODE_START_COL);
    }
  }
  console.log("GRID: ")
  console.log(grid);
  console.log("AFTER BFS CALL, VIS: ")
  console.log(pos);
  const Node = ({ coords }) => {
    if (grid[coords[0]][coords[1]] === 0) {
      return <div className="block-0" id={`node-${coords[0]}-${coords[1]}`}></div>
    }
    else if (coords[0] === NODE_START_ROW && coords[1] === NODE_START_COL) {
      return <div className="block-start" id={`node-${coords[0]}-${coords[1]}`}></div>
    }
    else if (coords[0] === NODE_END_ROW && coords[1] === NODE_END_COL) {
      return <div className="block-end" id={`node-${coords[0]}-${coords[1]}`}></div>
    }
    else {
      return <div className="node" id={`node-${coords[0]}-${coords[1]}`}></div>
    }

  }
  const GridWithNodes = () => {

    return <>
      <div  >
        {
          grid.map((row, rowIndex) => {
            return <>{
              <div key={rowIndex} className="rowWrapper">
                {row.map((col, colIndex) => {
                  return <Node key={colIndex} coords={[rowIndex, colIndex]} />
                })}
              </div>
            }
            </>
          })
        }


      </div>
    </>
  }

  const startSim = () => {
    var frame;
    if (algo === 'BFS') {
      frame = 4;
    }
    else {
      frame = 6;
    }
    console.log("POS: ", pos);
    console.log("MIN DIST: ", dist[NODE_END_ROW][NODE_END_COL])
    document.getElementById(`start-button`).className = "empty";
    document.getElementById(`reset-button`).className = "empty";
    document.getElementById(`clear-grid-button`).className = "empty";
    for (let i = 0; i < pos.length; i++) {
      if (pos[i][0] === NODE_START_ROW && pos[i][1] === NODE_START_COL) {
        continue;
      }
      if (pos[i][0] === NODE_END_ROW && pos[i][1] === NODE_END_COL) {
        continue;
      }
      setTimeout(() => {
        document.getElementById(`node-${pos[i][0]}-${pos[i][1]}`).className = "path-node";
        console.log(i);
        console.log('POS.length: ', pos.length);
        if (i === pos.length - 3) {
          console.log("YEA DONE");
          document.getElementById(`start-button`).className = "button";
          document.getElementById(`reset-button`).className = "button";
          document.getElementById(`clear-grid-button`).className = "button";
          if (minDist === 0) {
            minDist.current.innerText = `Min Distance: -1`;
          }
          else {
            minDist.current.innerText = `Min Distance: ${dist[NODE_END_ROW][NODE_END_COL]}`;
          }
        }

      }, frame * i); //Frame Rate

    }
  }
  const renderPage = () => {
    setClearGrid(false);
    minDist.current.innerText = `Min Distance: `;
    setCnt(cnt => cnt + 1);
  }

  const clearGridHandler = () => {
    setClearGrid(true);
    minDist.current.innerText = `Min Distance: `;
    setCnt(cnt => cnt + 1);

  }


  return (<>
    <div className="container">
      <div className="navbar">
        <ul className="navbar-list">
          {algo === 'BFS' ? <li className={`navbar-component current-tab }`} onClick={() => setAlgo('BFS')}>BFS</li> : <li className={`navbar-component `} onClick={() => setAlgo('BFS')}>BFS</li>}
          {algo === 'DFS' ? <li className={`navbar-component current-tab }`} onClick={() => setAlgo('DFS')}>DFS</li> : <li className={`navbar-component `} onClick={() => setAlgo('DFS')} >DFS</li>}
        </ul>
      </div>
      <div>
        <ul className="header">
          <li><button className="button" id="start-button" onClick={() => { startSim() }}>Start</button></li>
          <li><button className="button" id="reset-button" onClick={() => { renderPage() }}>Randomize</button></li>
          <li> <button className="button" id="clear-grid-button" onClick={() => { clearGridHandler() }}>Clear Grid</button></li>
          <h2 ref={minDist} className="minDist">Min Distance: </h2>
        </ul>
      </div>
      <div className="App">
        <GridWithNodes />
      </div>
    </div>
  </>
  );

}

export default App;
