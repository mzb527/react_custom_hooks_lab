import React, { useState, useEffect } from "react";
import Form from "./Form";

function App() {
  const [transactions, setTransactions] = useState([]); // State for transactions
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [sorted, setSorted] = useState(false); // State to track sorting

  // Fetch transactions on load
  useEffect(() => {
    fetch("http://localhost:4000/transactions")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then(setTransactions) // Update transactions state
      .catch(console.error); // Log errors
  }, []);

  // Add a new transaction
  const handleAddTransaction = (name) => {
    const newTransaction = { id: Date.now(), name, time: Math.random() * 100 };

    fetch("http://localhost:4000/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add transaction");
        return res.json();
      })
      .then((transaction) => setTransactions((prev) => [...prev, transaction]))
      .catch(console.error); // Log errors
  };

  // Handle search input
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update search term
  };

  // Handle sorting transactions
  const handleSort = () => {
    const sortedTransactions = [...transactions].sort((a, b) => a.time - b.time); // Sort transactions
    setTransactions(sortedTransactions);
    setSorted(true); // Update sorted state
  };

  // Filter transactions by search term
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Service Form</h2>
      <Form
        onAddTransaction={handleAddTransaction} // Pass add transaction handler to Form
        onSearch={handleSearch} // Pass search handler to Form
        onSort={handleSort} // Pass sort handler to Form
      />
      <h3>Transactions</h3>
      <ul>
        {filteredTransactions.map((transaction) => (
          <li key={transaction.id} data-time={transaction.time} data-testid="transaction-item">
            {transaction.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;