import React, { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
      e.preventDefault();

      setError(""); // Clear any previous error
      setProfileImageUrl(""); // Clear any previous URL

      try {
          const response = await fetch("https://1e05-2603-8000-e800-14ff-31c1-d155-3d5a-37ba.ngrok-free.app/api/fetch-profile-image", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ url: `https://vsco.co/${url}` }),
          });
          console.log("works")

          if (!response.ok) {
              const errorData = await response.json();
              setError(errorData.error || "Something went wrong");
              return;
          }

          const data = await response.json();
          setProfileImageUrl(data.profile_image_url);
      } catch (err) {
          setError("Failed to fetch data");
          console.error(err);
      }
  };

  

  return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h2>Fetch VSCO Profile Image</h2>
          <form onSubmit={handleSubmit}>
              <input
                  type="text"
                  placeholder="VSCO Username"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
              />
              <button type="submit">Fetch Profile Image</button>
          </form>

          {profileImageUrl && (
              <div className="w-96 h-192 overflow-hidden relative">
                  <img src={`https://${profileImageUrl}`} alt="VSCO Profile Image" />
              </div>
          )}

          {error && (
              <div style={{ color: "red" }}>
                  <h3>Error:</h3>
                  <p>{error}</p>
              </div>
          )}
      </div>
  );
}