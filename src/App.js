import React, { Component } from "react";
import "./App.css";

async function randomIntFromInterval(min, max) {
  const num = await fetch(
    `https://www.random.org/integers/?num=3&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`
  ).then(r => r.text());
  return num;
}

const buildQuestion = async () => {
  const q = await randomIntFromInterval(0, 11);
  const qs = q.split("\n");
  let q1 = parseInt(qs[0]);
  let q2 = parseInt(qs[1]);
  const add = parseInt(qs[2]) % 2 === 0;
  if (!add && q1 < q2) {
    const qStash = q1;
    q1 = q2;
    q2 = qStash;
  }

  return {
    q1,
    q2,
    add
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q1: 0,
      q2: 0,
      add: true,
      isCorrect: null,
      answer: "",
      isLoading: false
    };
  }
  componentDidMount() {
    this.next();
  }
  checkResult = e => {
    e.preventDefault();
    const { q1, q2, add, answer, isCorrect } = this.state;
    if (isCorrect) {
      this.next();
    }
    let ans = add ? q1 + q2 : q1 - q2;
    const right = ans === parseInt(answer, 10);
    if (right) {
      this.setState({
        isCorrect: true
      });
    } else {
      this.setState({
        isCorrect: false
      });
    }
  };
  onChange = e => {
    const answer = document.getElementById("answerField").value;
    this.setState({
      answer,
      isCorrect: null
    });
  };
  next = async () => {
    this.setState(
      {
        isLoading: true
      },
      async () => {
        const q = await buildQuestion();
        this.setState({
          ...q,
          isCorrect: null,
          answer: "",
          isLoading: false
        });
        document.getElementById("answerField").focus();
      }
    );
  };
  render() {
    const { q1, q2, add, answer, isLoading, isCorrect } = this.state;
    if (isLoading) {
      return <h1 className="loading">Loading</h1>;
    }
    return (
      <div className="App">
        <h1>{q1}</h1>
        <h1>{add ? "+" : "-"}</h1>
        <h1>{q2}</h1>
        <form onSubmit={this.checkResult}>
          <input
            value={answer}
            onChange={this.onChange}
            type="number"
            autoComplete="off"
            id="answerField"
          />
          <button type="submit">✔</button>
        </form>
        <h1>{isCorrect !== null ? (isCorrect ? "Yep!" : "Try Again!") : ""}</h1>
        {isCorrect !== null && isCorrect && (
          <button onClick={this.next}>NEXT</button>
        )}
      </div>
    );
  }
}

export default App;
