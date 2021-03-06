import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { COLS, ROWS, BLOCK_SIZE, KEY, COLORS, POINTS, LEVEL, LINES_PER_LEVEL } from './../constants';
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
  @ViewChild('next', { static: true })
  canvasNext: ElementRef<HTMLCanvasElement>

  ctx: CanvasRenderingContext2D;
  ctxNext: CanvasRenderingContext2D;
  points: number;
  lines: number;
  level: number;
  board: number[][];
  piece: Piece;
  next: Piece;
  time: { start: number; elapsed: number; level: number };
  requestId: number;
  moves = {
    [KEY.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1}),
    [KEY.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1}),
    [KEY.DOWN]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1}),
    [KEY.SPACE]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1}),
    [KEY.UP]: (p: IPiece): IPiece => this.gameService.rotate(p)
  };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
      if (event.keyCode === KEY.ESC) {
        this.gameOver();
      } else if (this.moves[event.keyCode]) {
        event.preventDefault();
        // Get new state
        let p = this.moves[event.keyCode](this.piece);
        if (event.keyCode === KEY.SPACE) {
          while (this.gameService.valid(p, this.board)) {
            this.points += POINTS.HARD_DROP;
            //console.log(this.points);
            this.piece.move(p);
            p = this.moves[KEY.DOWN](this.piece);
          }
        } else if (this.gameService.valid(p, this.board)) {
          this.piece.move(p);
          if (event.keyCode === KEY.DOWN) {
            this.points += POINTS.SOFT_DROP;
          }
        }
      }
  }

  constructor(
    private gameService: GameService
  ) {

  }

  ngOnInit() {
    this.initBoard();
    this.initNext();
  }

  initBoard() {
    // Get the 2D context that we draw on.
    this.ctx = this.canvas.nativeElement.getContext('2d');

    // Calculate size of canvas from constants.
    this.ctx.canvas.width = COLS * BLOCK_SIZE;
    this.ctx.canvas.height = ROWS * BLOCK_SIZE;
    this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  initNext() {
    this.ctxNext = this.canvasNext.nativeElement.getContext('2d');
    this.ctxNext.canvas.width = 4 * BLOCK_SIZE;
    this.ctxNext.canvas.height = 4 * BLOCK_SIZE;
    this.ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
  }

  getEmptyBoard(): number[][] {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  animate(now = 0) {
    // Update elapsed time.
    this.time.elapsed = now - this.time.start;
    //console.log(this.time.elapsed)
    // If elapsed time has passed time for current level
    if (this.time.elapsed > this.time.level) {

      // Reset start time
      this.time.start = now;
      if (!this.drop()){
        this.gameOver();
        return;
      }
    }
    this.draw();
    this.requestId = requestAnimationFrame(this.animate.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece.draw();
    this.drawBoard();
  }

  drawBoard(){
    this.board.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0){
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  drop(): boolean {
    let p = this.moves[KEY.DOWN](this.piece);
    if (this.gameService.valid(p, this.board)){
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();
      if (this.piece.y === 0) {
        //Game over
        return false;
      }
      this.piece = this.next;
      this.next = new Piece(this.ctx);
      this.next.drawNext(this.ctxNext);
    }
    return true;
  }

  freeze(){
    this.piece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  clearLines() {
    let lines = 0;
    this.board.forEach((row, y) => {
      //If every value is greater then 0.
      if (row.every(value => value > 0)){
        // Increase for cleared line.
        lines++;
        // Remove the row.
        this.board.splice(y, 1);
        // Add zero filled at the top.
        this.board.unshift(Array(COLS).fill(0));
      }
    });
    if (lines > 0) {
      //Add points if we cleared some lines.
      this.points += this.gameService.getLinesClearedPoints(lines, this.level);
      this.lines += lines;
      if (this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.lines -= LINES_PER_LEVEL;
        this.time.level = LEVEL[this.level];
      }
    }
  }

  gameOver() {
    cancelAnimationFrame(this.requestId);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = '1px Arial';
    this.ctx.fillStyle = 'red';
    this.ctx.fillText('GAME OVER', 1.8, 4)
  }
  play() {
    this.resetGame();
    this.next = new Piece(this.ctx);
    this.piece = new Piece(this.ctx);
    this.next.drawNext(this.ctxNext);
    this.time.start = performance.now();
    //console.log(this.time.start);
    if (this.requestId) {
      cancelAnimationFrame(this.requestId)
    }
    this.animate();
    //console.log(this.board.length)
    //console.table(this.board);
  }

  resetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this.getEmptyBoard();
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
  }


}
