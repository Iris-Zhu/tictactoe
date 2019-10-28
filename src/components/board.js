import React, { Component } from 'react';
import Square from './square';

class Board extends Component {

	constructor(props) {
        super(props);
        // delcare initial status of the game board
		this.state = {
            nextPlayer: 'X',
            status: Array(9).fill(null),
            winner: null
        };
        this.onClick = this.onClick.bind(this); 
        this.resetBoard = this.resetBoard.bind(this);
    }

    // computer 'O' will calculate best move based on max score that X can get (X will get lower score(nagative) if X is more likely to win)
    computerMove(currentStatus, currentPlayer, depth) {
        var bestMove = null;
        var bestScore = currentPlayer === 'X' ? (-Infinity) : Infinity;
        var currentScore;
        var nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        var generateNextMoves = this.generateMoves(currentStatus);
        var generatePotentialBoards = [];
        for(var i = 0; i < generateNextMoves.length; i++){
            generatePotentialBoards[generateNextMoves[i]] = this.generateBoard(currentStatus, generateNextMoves[i], nextPlayer);
        }        
        if(generatePotentialBoards.length === 0 || depth === 0 ){
            // when it reaches to depth = 0, which means no calculation anymore beyond this layer, or no PotentialBoards is provided, which means the (potential) board is full, calculate score based on 'current' board
            bestScore = this.evaluateScore(currentStatus);
        }else{
            for(var j = 0; j < generatePotentialBoards.length; j++){
                if(generatePotentialBoards[j]!= null){
                    if(currentPlayer === 'X'){
                        // when currentPlayer is human and computer is to calculate next move, choose best(highest) score that computer can get
                        currentScore = this.computerMove(generatePotentialBoards[j], 'O', depth-1)[1];
                        if(currentScore > bestScore){
                            bestScore = currentScore;
                            bestMove = j;
                        }
                    }else{
                        // when currentPlayer is computer and human will do next move, choose lowest possible score and return to parent layer - computer is trying to prevent human from winning the game and should take worst senario (e.g, human wins with 3 X in a line) into consideration 
                        currentScore = this.computerMove(generatePotentialBoards[j], 'X', depth-1)[1];
                        if(currentScore < bestScore){
                            bestScore = currentScore;
                            bestMove = j;
                        }
                    }
                }
            }
        }
        return([bestMove,bestScore]);
    }

    // generate all potential boards based on potential move
    generateBoard(currentStatus, move, targetPlayer) {
        var tempStatus = [...currentStatus];
        tempStatus[move] = targetPlayer;
        return tempStatus;
    }

    // generate all potential moves (not empty) based on a given board('current' status)
    generateMoves(currentStatus) {
        var potentialMoves = [];
        if (this.checkIfWin(currentStatus)) {
            return potentialMoves;
        }
        for (var i = 0; i < currentStatus.length; i++) {
            if (!currentStatus[i]){
                potentialMoves.push(i);
            }
        }        
        return potentialMoves;
    }

    // calculate how many scores each move can get from human's ('X') perspective
    evaluateScore(currentStatus) {
        var sumScore = 0;
        var lineScore = 0;
        // declare all lines need to be calculated (row, column and diagonal)
        // add all lineScore from each line 
        const evaluateLines = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]        
        ];
        for(var i = 0; i < evaluateLines.length; i++){
            if(currentStatus[evaluateLines[i][0]] === currentStatus[evaluateLines[i][1]] && currentStatus[evaluateLines[i][1]] === currentStatus[evaluateLines[i][2]] && currentStatus[evaluateLines[i][2]] === 'X'){
                // 3 'X' in a line
                lineScore = -100;
                sumScore = sumScore + lineScore;
            }else if((currentStatus[evaluateLines[i][0]] === 'X' && currentStatus[evaluateLines[i][1]] === 'X' && currentStatus[evaluateLines[i][2]] === null)||(currentStatus[evaluateLines[i][0]] === 'X' && currentStatus[evaluateLines[i][2]] === 'X' && currentStatus[evaluateLines[i][1]] === null)||(currentStatus[evaluateLines[i][2]] === 'X' && currentStatus[evaluateLines[i][1]] === 'X' && currentStatus[evaluateLines[i][0]] === null)){
                // 2 'X' in a line, others empty 
                lineScore = -10;
                sumScore = sumScore + lineScore;
            }else if((currentStatus[evaluateLines[i][0]] === 'X' && currentStatus[evaluateLines[i][1]] === null && currentStatus[evaluateLines[i][2]] === null)||(currentStatus[evaluateLines[i][0]] === null && currentStatus[evaluateLines[i][1]] === 'X' && currentStatus[evaluateLines[i][2]] === null)||(currentStatus[evaluateLines[i][0]] === null && currentStatus[evaluateLines[i][1]] === null && currentStatus[evaluateLines[i][2]] === 'X')){
                // 1 'X' in a line, others empty 
                lineScore = -1;
                sumScore = sumScore + lineScore;
            }else{
                lineScore = 0;
                sumScore = sumScore + lineScore;                
            }
        }
        return sumScore;
    }

    // reset game status
    resetBoard() {
        this.setState(
            {
                nextPlayer: 'X',
                status: Array(9).fill(null),
                winner: null                
            }
        );
    }

    // human move
    onClick(i) {
        this.onNewMove(i);
    }

    // once there is a new move from human or computer, update this.state, change player and check if anyone wins 
    onNewMove(i) {
        if (this.state.status[i] != null || this.state.winner) {
            return false;
        }
        const newStatus = [...this.state.status];
        const currentPlayer = this.state.nextPlayer === 'X' ? 'X' : 'O';
        const nextPlayer = this.state.nextPlayer === 'X' ? 'O' : 'X';
        newStatus[i] = currentPlayer;
        this.setState(
            {
                status: newStatus,
                nextPlayer: nextPlayer
            },
            () => {
                // using callback to make sure checkIfWin and computerMove are execuated after state update
                if(!this.checkIfWin(this.state.status) && currentPlayer!== "O") {
                    this.onNewMove(this.computerMove(this.state.status, "X", 2)[0]);
                }else if(this.checkIfWin(this.state.status)){
                    this.setState({winner: currentPlayer});
                }
            }
        );
    }

    // based on current board, check if anyone wins the game
    checkIfWin(currentStatus) {
        const winMode = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];
        for(var i = 0; i < winMode.length; i++) {
            if (currentStatus[winMode[i][0]] === currentStatus[winMode[i][1]] && currentStatus[winMode[i][1]] === currentStatus[winMode[i][2]] && currentStatus[winMode[i][2]]) {
                return true;
            }
        }
        return false;
    }

    render() {    
        return (
            <div>
                <div className = "headerContainer">
                    <h1>
                        Tic Tac Toe
                    </h1>
                    <button className = "resetButton" onClick = {this.resetBoard}>
                        reset 
                    </button>
                </div>
                <div className = "boardContainer">
                    <div className = "row">
                        <Square value = {this.state.status[0]} onClick = {() => this.onClick(0)} />
                        <Square value = {this.state.status[1]} onClick = {() => this.onClick(1)} />
                        <Square value = {this.state.status[2]} onClick = {() => this.onClick(2)} />
                    </div>
                    <div className = "row">
                        <Square value = {this.state.status[3]} onClick = {() => this.onClick(3)} />
                        <Square value = {this.state.status[4]} onClick = {() => this.onClick(4)} />
                        <Square value = {this.state.status[5]} onClick = {() => this.onClick(5)} />
                    </div>
                    <div className = "row">
                        <Square value = {this.state.status[6]} onClick = {() => this.onClick(6)} />
                        <Square value = {this.state.status[7]} onClick = {() => this.onClick(7)} />
                        <Square value = {this.state.status[8]} onClick = {() => this.onClick(8)} />
                    </div>
                </div>
                {
                    this.state.winner ?  (<h2>Winner is {this.state.winner} </h2>)  : null
                }
            </div>
        );
    }
}

export default Board;
