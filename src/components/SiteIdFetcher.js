import React, { useState } from "react";
import axios from "axios";

export default function SiteIdFetcher() {
  const [username, setUsername] = useState("adrianaboghossian");
  const [siteId, setSiteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchSiteId = async () => {
    if (!username) {
      alert("Please enter a username.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch the site ID from your backend proxy server
      const response = await axios.get(`http://localhost:5000/fetch-site-id?username=${username}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "Connection": "keep-alive",
          },
        }
      );
      const { siteId } = response.data;
      
      if (siteId) {
        setSiteId(siteId);
      } else {
        throw new Error("siteId not found");
      }
    } catch (err) {
      setError("Error fetching the site ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Fetch VSCO Site ID</h2>
      <input
        type="text"
        placeholder="Enter VSCO Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleFetchSiteId} disabled={loading}>
        {loading ? "Loading..." : "Fetch Site ID"}
      </button>

      {siteId && (
        <div>
          <h3>Site ID: {siteId}</h3>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};