import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { COLS, ROWS, BLOCK_SIZE, KEY } from './../constants';
import  { Piece, IPiece } from './../../piece.component'
import { GameService } from '../game.service'

@Component({
  selector: 'game-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  //Get reference to the canvas.
  @ViewChild('board', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  ctx: CanvasRenderingContext2D;
  points: number;
  lines: number;
  level: number;
  board: number[][];
  piece: Piece;
  moves = {
    [KEY.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1}),
    [KEY.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1}),
    [KEY.UP]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1}),
    [KEY.SPACE]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1})
  };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
      if (event.keyCode === KEY.ESC) {
         alert('Game over!')
        //this.gameOver()
      } else if (this.moves[event.keyCode]) {
        event.preventDefault();
        console.log(event.keyCode)
        // Get new state
        let p = this.moves[event.keyCode](this.piece);
        // Move the piece
        if (this.gameService.valid(p)) {
          console.log(this.gameService.valid(p));
          this.piece.move(p);
        }
        // Clear the old position before drawing
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        // Draw the new position
        this.piece.draw();
      }
  }

  constructor(
    private gameService: GameService
  ) {

  }

  ngOnInit() {
    this.initBoard()
  }

  initBoard() {
    // Get the 2D context that we draw on.
    this.ctx = this.canvas.nativeElement.getContext('2d');

    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));

  }

  play() {
    this.board = this.getEmptyBoard();
    this.piece = new Piece(this.ctx);
    this.piece.draw();
    //console.table(this.board);
  }



}
