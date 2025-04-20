import './test_suites/CustomHooks.test'
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Component Tests", () => {
  // Test for Display Transactions
  it("should display transactions on startup", async () => {
    render(<App />);
    const transactions = await screen.findAllByTestId("transaction-item");
    expect(transactions.length).toBeGreaterThan(0); // Transactions should appear
  });

  // Test for Adding Transactions
  it("should add a new transaction to the list", async () => {
    render(<App />);
    const inputField = screen.getByPlaceholderText("Enter transaction details");
    const addButton = screen.getByText("Add Transaction");

    fireEvent.change(inputField, { target: { value: "New Transaction" } });
    fireEvent.click(addButton);

    const transactions = await screen.findAllByTestId("transaction-item");
    expect(transactions.some((item) => item.textContent.includes("New Transaction"))).toBe(true);
  });

  it("should make a POST request to add the transaction", async () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ id: 123, name: "New Transaction" }) })
    );
    global.fetch = mockFetch;

    render(<App />);
    const inputField = screen.getByPlaceholderText("Enter transaction details");
    const addButton = screen.getByText("Add Transaction");

    fireEvent.change(inputField, { target: { value: "New Transaction" } });
    fireEvent.click(addButton);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:4000/transactions",
      expect.objectContaining({ method: "POST" })
    );
  });

  // Test for Search Transactions
  it("should filter transactions based on search input", async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText("Search transactions");

    fireEvent.change(searchInput, { target: { value: "Rent" } });
    const transactions = await screen.findAllByTestId("transaction-item");
    expect(transactions.every((item) => item.textContent.includes("Rent"))).toBe(true);
  });

  // Test for Sorting Transactions
  it("should sort transactions correctly", async () => {
    render(<App />);
    const sortButton = screen.getByText("Sort Transactions");

    fireEvent.click(sortButton);
    const transactions = await screen.findAllByTestId("transaction-item");

    const times = transactions.map((item) => parseFloat(item.dataset.time));
    const isSorted = times.every((val, i, arr) => !i || arr[i - 1] <= val);
    expect(isSorted).toBe(true);
  });
});