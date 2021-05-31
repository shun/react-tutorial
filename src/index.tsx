import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

type Props = {
  value: string;
  onClick: () => void;
};

type BoardProps = {
  squares: string[];
  onClick: (i: number) => void;
};

type BoardState = {
  squares: string[];
  xIsNext: boolean;
};

type GameHistory = {
  squares: string[];
};

type GameState = {
  histories: GameHistory[];
  stepNumber: number;
  xIsNext: boolean;
};

function Square(props: Props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

function calculateWinner(squares: string[]): string {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return "";
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>

        <div>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component<{}, GameState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      histories: [{ squares: Array(9).fill("") }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i: number) {
    const histories = this.state.histories.slice(0, this.state.stepNumber + 1);
    const current = histories[histories.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      histories: histories.concat([{ squares: squares }]),
      stepNumber: histories.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(move: number) {
    this.setState({
      stepNumber: move,
      xIsNext: move % 2 === 0,
    });
  }

  render() {
    const histories = this.state.histories;
    const current = histories[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = histories.map((step: GameHistory, move: number) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>

        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
