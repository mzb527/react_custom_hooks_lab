import { useLocalStorage } from "../hooks/useLocalStorage";

function Form() {
  const [name, setName] = useLocalStorage("name", ""); // Initialize name state with local storage value
  const [service, setService] = useLocalStorage("service", ""); // Initialize service state with local storage value

  return (
    <>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          data-testid="name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Update name state and localStorage
        />
        <label htmlFor="service">Service Number:</label>
        <input
          type="text"
          id="service"
          data-testid="service"
          value={service}
          onChange={(e) => setService(e.target.value)} // Update service state and localStorage
        />
      </form>
      <h4>{name ? `Welcome, ${name}!` : "Enter your name"}</h4>
    </>
  );
}

export default Form;