import { useState } from "react";

const ServerPoker = ({ setIsConnected }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState("");

  const handleTest = async () => {
    setConnectionMessage("waiting...");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/hi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      setConnectionMessage("Connected!");
      setIsConnected(true);
    } else {
      setConnectionMessage("Not connected");
      setIsConnected(false);
    }
  };

  return (
    <section style={{ display: "flex" }}>
      {isHidden ? null : (
        <>
          {connectionMessage === "Connected!" ? (
            <button onClick={() => setIsHidden(true)}>Hide</button>
          ) : (
            <button onClick={handleTest}>Test API Connection</button>
          )}
          <p className="status-box">{connectionMessage}</p>
        </>
      )}
    </section>
  );
};

export default ServerPoker;
