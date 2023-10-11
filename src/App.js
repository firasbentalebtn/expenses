import "./App.css";
import { useEffect, useState } from "react";
function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then((transactions) => {
      setTransactions(transactions);
    });
  }, []);
  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + "/transactions";

    const response = await fetch(url);
    return await response.json();
  }
  function handleSubmit(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        price,
        name: name.substring(price.length + 1),
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setDescription("");
        setDatetime("");
        console.log("result", json);
        window.location.reload();

      });
    });
  }
  let balance =0
  for (const transaction of transactions){
    balance= balance+ transaction.price;
  }
  balance =balance.toFixed(2);
  const fraction  =balance.split('.')[1]
  balance=balance.split('.')[0]
  return (
    <main>
      <h1> ${balance} <span>{fraction}</span> eur</h1>
      <form onSubmit={handleSubmit}>
        <div className="info">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Your Expenses"
          />
          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            type="text"
            placeholder="Description"
          />
        </div>
        <button type="submit"> Add new transaction</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div key={transaction.id} className="transaction">
              <div className="left">
                <div className="name"> {transaction.name} </div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div 
                className={`price ${transaction.price < 0 ? 'red' : 'green'}`}>
                  {transaction.price}</div>
                <div className="datetime">{transaction.datetime }</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
