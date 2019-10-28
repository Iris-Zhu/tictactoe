This project(tictactoe) was created with React Framework and bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Description

This tictactoe game includes:
- A 3*3 Game Board
- As a player(human), you can click on the game board to make a move 
- As a computer player, AI will calculate and make next move after human's move, in order to prevent human from winning the game
- If anyone wins the game, winner will be displayed under the game board and game will be terminated
- A reset button to reset game to initial status 

## Explanation to tictactoe algorithm

Based on every move by human, AI will evaluate current state by giving a score from human's perspective. 
The score will be lower if the human is more likely to win.
From all possible next moves, AI will find the best move for itself to prevent human from winning as much as possible.
More details will be included in the comments from actual code.

Main logic of the program will be included in /src/components/board.js

## Available Scripts

In the project directory, you can run:

### `npm install`

Install dependencies listed in package.json 

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


