import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toppingData: []
    }
  }

  componentDidMount() {
    fetch("http://files.olo.com/pizzas.json")
      .then(response => response.json())
      .then(pizzas => {
        var huffman = [];

        pizzas.forEach(pizza => {
          pizza.toppings.forEach(topping => {
            // build a huffman table from that data
            //var index = huffman.indexOf(i => i.topping === topping);
            var index = -1;  // this and the for loop because the indexOf should work but doesn't, might try every() just for fun
            for (var i = 0; i < huffman.length; i++) {  // for instead of forEach because break is no allowed in forEach
              if (huffman[i].topping === topping) {
                index = i;
                break;
              }
            }

            if (index >= 0) {
              huffman[index].timesOrdered++;
            }
            else {
              huffman.push({"topping": topping, "timesOrdered": 1});
            }
          })
        });

        // sort descending by number of times a topping has been ordered
        huffman.sort((a, b) => {
          return parseInt(b.timesOrdered) - parseInt(a.timesOrdered);
        });

        // only return number of requested items, 20 in this case
        var top = huffman.slice(0, 20);
        this.setState({"toppingData": top});
      })
      .catch(err => {
        console.log(err);
      });
  }

  renderRows() {
    return this.state.toppingData.map((toppingData, index) => {
      const { topping, timesOrdered } = toppingData;
      return (
         <tr key={index}>
            <td>{index + 1}</td>
            <td>{topping}</td>
            <td>{timesOrdered}</td>
         </tr>
      );
    })
  }

  render() {
    return (
      <div>
        <div>Hello OLO!</div>
        <hr/>
        <table>
          <tbody>
            <tr><th>Ranking</th><th>Topping</th><th>Times Ordered</th></tr>
            { this.renderRows() }
          </tbody>
        </table>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
