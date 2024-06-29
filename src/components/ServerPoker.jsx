import { useState } from "react";

const ServerPoker = () => {
  const [isConnected, setIsConnected] = useState("");
  const [isHidden, setIsHidden] = useState(false);

  const handleTest = async () => {
    setIsConnected("waiting...");

    console.log(process.env.REACT_APP_API_URL);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/hi`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      setIsConnected("Connected!");
    } else {
      setIsConnected("Not connected");
    }
  };

  return (
    <section style={{ display: "flex" }}>
      {isHidden ? null : (
        <>
          {isConnected === "Connected!" ? (
            <button onClick={() => setIsHidden(true)}>Hide</button>
          ) : (
            <button onClick={handleTest}>Test API Connection</button>
          )}
          <p className="status-box">{isConnected}</p>
        </>
      )}
    </section>
  );
};

export default ServerPoker;
