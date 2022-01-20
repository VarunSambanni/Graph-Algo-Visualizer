import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import BFS from './BFS'
import DFS from './DFS'
const ROW = 30;
const COL = 72;

const NODE_START_ROW = 10;
const NODE_START_COL = 10;
const NODE_END_ROW = ROW - 1;
const NODE_END_COL = COL - 1;

function App() {
  const [cnt, setCnt] = useState(0);
  const [clearGrid, setClearGrid] = useState(false);
  const [algo, setAlgo] = useState('BFS');
  const minDist = useRef(null);

  var AddedBlocks = false ;
  var enableClickEvents = true ;
  var vis = Array.from(Array(ROW), () => Array(COL).fill(false));
  var dist = Array.from(Array(ROW), () => Array(COL).fill(0));
  var grid = Array.from(Array(ROW), () => Array(COL).fill(1));
  var pos = [];
  var dRow = [-1, 0, 1, 0];
  var dCol = [0, 1, 0, -1];
  var pred = [] ;
  var path = [] ; 
  for(let i = 0 ; i < ROW; i++)
  {
    var temp = [] ; 
    for(let j = 0 ; j < COL; j++)
    {
      temp.push([-1, -1]) ; 
    }
    pred.push(temp) ; 
  }
  //BFS
  /*
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
  */
  //DFS 
  /*
  function DFS(row, col) {
    vis[row][col] = true;
    pos.push([row, col]);
    for (var i = 0; i < 4; i++) {
      if (isValid(row + dRow[i], col + dCol[i]))
        DFS(row + dRow[i], col + dCol[i]);
    }
  }*/

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
      path = DFS(NODE_START_ROW, NODE_START_COL, vis, grid, pos);
    }
    case 'BFS': {
      BFS(NODE_START_ROW, NODE_START_COL, vis, grid, pos, dist, pred, path);
    }
  }

  const Node = ({ coords }) => {
    if (grid[coords[0]][coords[1]] === 0) {
      return <div className="block-0" id={`node-${coords[0]}-${coords[1]}`} ></div>
    }
    else if (coords[0] === NODE_START_ROW && coords[1] === NODE_START_COL) {
      return <div className="block-start" id={`node-${coords[0]}-${coords[1]}`}></div>
    }
    else if (coords[0] === NODE_END_ROW && coords[1] === NODE_END_COL) {
      return <div className="block-end" id={`node-${coords[0]}-${coords[1]}`} ></div>
    }
    else {
      return <div className="node" id={`node-${coords[0]}-${coords[1]}`} ></div>
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
                  return <Node key={colIndex} coords={[rowIndex, colIndex] }  />
                })}
              </div>
            }
            </>
          })
        }


      </div>
    </>
  }
  var clickFlag = 0 ;
  var keyFlag = 0 ; 
  // document.addEventListener('keydown', ()=>keyFlag=1);
  // document.addEventListener('keyup', ()=>keyFlag=0);
  document.addEventListener('click', () => {
    if (keyFlag === 1) {
      keyFlag = 0 ;
    }
    else{
      keyFlag = 1 ;
    }
  })
  const addBlocksHandler = (e) =>{
      if (e.target.id[0] === 'n' && keyFlag === 1){
        var x ='', y ='' ;
        var string = e.target.id ;
        var count = 0 ;
        for (let i = 0; i < string.length; i++){
          if (string[i] === '-'){
            count += 1 ; 
          }
          if(48 <= string.charCodeAt(i) <= 58){
            if (count === 1 && string[i] !== '-')
              x += string[i] ;
            }
            if (count === 2 && string[i] !== '-'){
              y += string[i] ;
            }
        }

        if (clickFlag === 0){
          if ( e.target.className === 'node')
            e.target.className = 'node';
          else if (e.target.className === ' block-start')
            e.target.className = ' block-start';
          else if (e.target.className === ' block-end') {
            e.target.className = ' block-end';
          }
        }
        else{
          grid[Number(x)][Number(y)] = 0 ; 
            if (e.target.className === 'node'){
            e.target.className = 'added-block';
          }
        }
      }
  }
  const AddBlocks = useCallback(() => {
    keyFlag = 1 ;
    AddedBlocks = true ;
    if (clickFlag === 0){
      document.getElementById('add-blocks-button').className = 'button selected' ;
      document.querySelector("#grid").addEventListener("mouseover", (e) =>addBlocksHandler(e)) ;
      document.querySelector("#grid").addEventListener("click", (e) => addBlocksHandler(e)) ;
      clickFlag = 1 ;
    }else{
        document.getElementById('add-blocks-button').className = 'button' ;
        clickFlag = 0 ; 
    }
    }
  )

  
  const startSim = () => {
  enableClickEvents = false ;
  if(AddedBlocks === true){
      pos = [] ;
      path = [] ;

      pred = [] ;
      for(let i = 0 ; i < ROW; i++)
      {
        var temp = [] ; 
        for(let j = 0 ; j < COL; j++)
        {
          temp.push([-1, -1]) ; 
        }
        pred.push(temp) ; 
      }
      vis = Array.from(Array(ROW), () => Array(COL).fill(false));
      dist = Array.from(Array(ROW), () => Array(COL).fill(0));
      if (algo === 'BFS'){
        BFS(NODE_START_ROW, NODE_START_COL, vis, grid, pos, dist, pred, path);
      }
      else{   
        path = DFS(NODE_START_ROW, NODE_START_COL, vis, grid, pos);
      }
  }
  var frame;
  if (algo === 'BFS') {
    frame = 4;
  }
  else {
    frame = 5;
  }
  var distance = -1 ; 
  if (algo === 'DFS' && path[path.length-1][0]  === 0 && path[path.length-1][1] === 0)
  {
    console.log("NOT REACHABLE ---DFS",path) ;
    path = [] ; 
  }
  else if (algo === 'DFS')
  {
    distance = path[path.length-1][0] ; 
  }
  else 
  {
    if (dist[NODE_END_ROW][NODE_END_COL] !== 0)
    {
      distance = dist[NODE_END_ROW][NODE_END_COL] ; 
    }
  }
  for (let i = 0; i < pos.length; i++) {
    if (pos[i][0] === NODE_START_ROW && pos[i][1] === NODE_START_COL) {
      continue;
    }
    if (pos[i][0] === NODE_END_ROW && pos[i][1] === NODE_END_COL) {
      continue;
    }

    setTimeout(() => { 
      document.getElementById(`node-${pos[i][0]}-${pos[i][1]}`).className = "path-node";
      if (i === pos.length - 3) {
        document.getElementById(`start-button`).className = "button";
        document.getElementById(`reset-button`).className = "button";
        document.getElementById(`clear-grid-button`).className = "button";
        document.getElementById(`add-blocks-button`).className = "button";
        enableClickEvents = true ;
        console.log('MIN DIST: ', minDist);
        minDist.current.innerText = `Min Distance: ${distance}`;
      }

    }, frame * i) // Frame rate
  }
  let c = 1 ;
  let d = 350 ;
  if (algo === 'DFS')
  {
    d = 0.000001; 
  }
  var x = 1 ; 
  for(let i = 0; i < path.length-1; i++)
  {
    if (algo === 'BFS')
    {
      x = (d/c) *(i) ; 
    }
    else 
    {
      x = 12000 ; 
    }
    if (path[i][0] === NODE_START_ROW && path[i][1] === NODE_START_COL) {
      continue;
    }
    if (path[i][0] === NODE_END_ROW && path[i][1] === NODE_END_COL) {
      continue;
    }
    setTimeout(() => {
      if (path[i][0] === NODE_END_ROW && path[i][1] === NODE_END_COL)
      {
        
      }
      document.getElementById(`node-${path[i][0]}-${path[i][1]}`).className = "PATH-path-node";
    }, (x)) ;//
    c += 0.0225 ;
  }
}
  const renderPage = () => {
    setClearGrid(false);
    minDist.current.innerText = `Min Distance: `;
    setCnt(cnt => cnt + 1);
  }

  const clearGridHandler = () => {
    AddedBlocks = false ;
    keyFlag = 0 ;
    clickFlag = 0 ;
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
          <li><button className="button" id="start-button" onClick={() => { enableClickEvents && startSim() }}>Start</button></li>
          <li><button className="button" id="reset-button" onClick={() => { enableClickEvents && renderPage() }}>Randomize</button></li>
          <li> <button className="button" id="clear-grid-button" onClick={() => { enableClickEvents && clearGridHandler() }}>Clear Grid</button></li>
          <li> <button className="button" id="add-blocks-button" onClick={() => {AddBlocks()}}>AddBlocks</button></li>

          <h2 ref={minDist} className="minDist">Min Distance: </h2>
        </ul>
      </div>
      <div id = "grid" className="App">
        <GridWithNodes  />
      </div>
    </div>
    
  </>
  );

}

export default App;
