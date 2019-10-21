import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { COLS, ROWS, BLOCK_SIZE } from './../constants';
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
