var mine = {
  
  all : 5, 
  allHgt : 12, 
  allWdt : 6, 

  
  board : [],
  boardCell : 0, 
  miner : 0, 

  
  reset : function () {
  
    let wrapper = document.getElementById("wrapper");
    let cWdt = 100 / mine.allWdt;
    wrapper.innerHTML = "";
    mine.board = [];
    for (let row=0; row<mine.allHgt; row++) {
      mine.board.push([]); 

      for (let col=0; col<mine.allWdt; col++) {
  
        mine.board[row].push({ 
          r : false, 
          x : false, 
          m : false, 
          a : 0, 
          c : document.createElement("div") 
        });

        
        let cell = mine.board[row][col].c;
        cell.classList.add("cell");
        cell.id = "mine-" + row + "-" + col;
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.addEventListener("click", mine.open);
        cell.addEventListener("contextmenu", mine.mark);
        cell.style.width = cWdt + "%";
        cell.innerHTML = "&nbsp;";
        wrapper.appendChild(cell);
      }
    }

    mine.miner = mine.all;
    let mrow = mine.allHgt - 1;
    let mcol = mine.allWdt - 1;
    while (mine.miner > 0) {
      let row = Math.floor(Math.random() * mrow);
      let col = Math.floor(Math.random() * mcol);
      if (!mine.board[row][col].m) {
        mine.board[row][col].m = true;
        mine.miner--;
      }
    }


    for (let row=0; row<mine.allHgt; row++) {
      let lastRow = row - 1;
      let nextRow = row + 1;
      if (nextRow == mine.allHgt) { nextRow = -1; }

      for (let col=0; col<mine.allWdt; col++) {
        let lastCol = col - 1;
        let nextCol = col + 1;
        if (nextCol == mine.allWdt) { nextCol = -1; }
        
        if (!mine.board[row][col].m) {
          if (lastRow != -1) {
            if (lastCol != -1) { if (mine.board[lastRow][lastCol].m) { mine.board[row][col].a++; } }
            if (mine.board[lastRow][col].m) { mine.board[row][col].a++; }
            if (nextCol != -1) { if (mine.board[lastRow][nextCol].m) { mine.board[row][col].a++; } }
          }
          if (lastCol != -1) { if (mine.board[row][lastCol].m) { mine.board[row][col].a++; } }
          if (nextCol != -1) { if (mine.board[row][nextCol].m) { mine.board[row][col].a++; } }
          if (nextRow != -1) {
            if (lastCol != -1) { if (mine.board[nextRow][lastCol].m) { mine.board[row][col].a++; } }
            if (mine.board[nextRow][col].m) { mine.board[row][col].a++; }
            if (nextCol != -1) { if (mine.board[nextRow][nextCol].m) { mine.board[row][col].a++; } }
          }
        }
      }
    }

    mine.miner = mine.all;
    mine.boardCell = mine.allHgt * mine.allWdt;
  },

  mark : function (evt) {
    let row = this.dataset.row;
    let col = this.dataset.col;

    if (!mine.board[row][col].r) {
      this.classList.toggle("mark");
      mine.board[row][col].x = !mine.board[row][col].x;
    }

    evt.preventDefault();
  },

  open : function () {
    let row = this.dataset.row;
    let col = this.dataset.col;

    if (!mine.board[row][col].x && mine.board[row][col].m) {
      this.classList.add("boom");
      alert("Oops, you found the bomb!!! Game Over!!!");
      mine.reset();
    }

    else {
      let toReveal = []; 
      let toCheck = []; 
      let checked = []; 
      for (let i=0; i<mine.allHgt; i++) { checked.push({}); }


      toCheck.push([row, col]);
      while (toCheck.length>0) {

        let thisRow = parseInt(toCheck[0][0]);
        let thisCol = parseInt(toCheck[0][1]);


        if (mine.board[thisRow][thisCol].m || mine.board[thisRow][thisCol].r || mine.board[thisRow][thisCol].x) {}
        else {

          if (!checked[thisRow][thisCol]) { toReveal.push([thisRow, thisCol]); }


          if (mine.board[thisRow][thisCol].a == 0) {

            let lastRow = thisRow - 1;
            let nextRow = thisRow + 1;
            if (nextRow == mine.allHgt) { nextRow = -1; }
            let lastCol = thisCol - 1;
            let nextCol = thisCol + 1;
            if (nextCol == mine.allWdt) { nextCol = -1; }


            if (lastRow != -1) {
              if (lastCol != -1 && !checked[lastRow][lastCol]) { toCheck.push([lastRow, lastCol]); }
              if (!checked[lastRow][thisCol]) { toCheck.push([lastRow, thisCol]); }
              if (nextCol != -1 && !checked[lastRow][nextCol]) { toCheck.push([lastRow, nextCol]); }
            }


            if (lastCol != -1 && !checked[thisRow][lastCol]) { toCheck.push([thisRow, lastCol]); }
            if (nextCol != -1 && !checked[thisRow][nextCol]) { toCheck.push([thisRow, nextCol]); }


            if (nextRow != -1) {
              if (lastCol != -1 && !checked[nextRow][lastCol]) { toCheck.push([nextRow, lastCol]); }
              if (!checked[nextRow][thisCol]) { toCheck.push([nextRow, thisCol]); }
              if (nextCol != -1 && !checked[nextRow][nextCol]) { toCheck.push([nextRow, nextCol]); }
            }
          }
        }


        checked[thisRow][thisCol] = true;
        toCheck.shift();
      }


      if (toReveal.length > 0) {
        for (let cell of toReveal) {
          let thisRow = parseInt(cell[0]);
          let thisCol = parseInt(cell[1]);
          mine.board[thisRow][thisCol].r = true;
          if (mine.board[thisRow][thisCol].a != 0) { 
            mine.board[thisRow][thisCol].c.innerHTML = mine.board[thisRow][thisCol].a;
          }
          mine.board[thisRow][thisCol].c.classList.add("reveal");
          mine.boardCell = mine.boardCell - 1;
        }
      }


      if (mine.boardCell == mine.all) {
        alert("YOU WIN!");
        mine.reset();
      }
    }
  }
};

window.addEventListener("load", mine.reset);