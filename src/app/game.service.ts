import { Injectable } from '@angular/core';
import { IPiece } from './../piece.component'
import { COLS, ROWS } from  './constants'
@Injectable({
  providedIn: 'root'
})
export class GameService {
  valid(p: IPiece, board: number[][]):boolean {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return (
          this.isEmpty(value) || 
          (this.insideWalls(x) && this.aboveFloor(y))
        );
      });
    });
  }

  isEmpty(value: number):boolean {
   return value === 0
  }

  insideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  aboveFloor(y: number): boolean {
    return y <= ROWS
  }

  rotate(p: IPiece): IPiece {
    let clone: IPiece = JSON.parse(JSON.stringify(p));
    for (let y  = 0; y < p.shape.length; y++) {
      for (let x = 0; x < y; x++) {
        [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]]
      }
    }
    p.shape.forEach(row => row.reverse())
    return clone;
  }

}
