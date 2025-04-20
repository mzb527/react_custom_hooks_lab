import { fireEvent, render, renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import App from "../../components/App";

class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }
}

global.localStorage = new LocalStorageMock();

beforeEach(() => {
    localStorage.clear();
});

describe("Custom Hooks", () => {
    test("returns an initial state and a setter function", () => {
        const { result } = renderHook(() => useLocalStorage("test", "value"));
        expect(result.current).toMatchObject(["value", expect.any(Function)]);
    });

    test("has an initial value of null if no value is passed in as a second argument", () => {
        const { result } = renderHook(() => useLocalStorage("test"));
        expect(result.current).toMatchObject([null, expect.any(Function)]);
    });

    test("saves the value in localStorage when state is updated", async () => {
        const { result } = renderHook(() => useLocalStorage("name", "old value"));
        const [, setState] = result.current;

        act(() => {
            setState("New Value");
        });

        expect(localStorage.getItem("name")).toBe('"New Value"');
    });

    test("updates localStorage when interacting with the App component", async () => {
        const { findAllByTestId } = render(<App />);

        const input = await findAllByTestId("name");
        fireEvent.change(input[0], { target: { value: "Updated Name" } });

        expect(localStorage.getItem("name")).toBe('"Updated Name"');
    });
});