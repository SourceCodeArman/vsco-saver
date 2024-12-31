import React, { useState } from 'react';

const DownloadContent = () => {
  const [username, setUsername] = useState('');
  const [pages, setPages] = useState(1);
  const [contentType, setContentType] = useState('CONTENT');
  const [downloadStatus, setDownloadStatus] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchAndDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus('Fetching data...');

    try {
      // Loop through each page
      for (let page = 1; page <= pages; page++) {
        const url = `https://vsco.co/${username}/images/${page}`;
        
        // Fetch the page HTML
        const response = await fetch(url);
        const html = await response.text();
        
        if (response.status === 404) {
          setDownloadStatus('Invalid username');
          setIsDownloading(false);
          return;
        }

        setDownloadStatus(`Fetched data for page ${page}`);

        // Extract the JSON data from the page's HTML
        const dataMatch = html.match(/window\.__PRELOADED_STATE__ = (.*?)<\/script>/);
        if (dataMatch) {
          const data = JSON.parse(dataMatch[1]);
          const array = data.medias.byId;

          // Loop through the media items
          for (const content in array) {
            const media = array[content].media;
            let fileUrl = media.videoUrl || media.responsiveUrl;
            if (fileUrl) {
              fileUrl = "https://" + fileUrl;

              const fileName = `${Math.random().toString(36).substring(2, 8)}_${fileUrl.split("/").pop()}`;
              const dirName = username + "/";

              // Only download files that match the content type
              if (
                (fileName.includes('mp4') && contentType === 'video') ||
                (fileName.includes('jpg') && contentType === 'photo') ||
                contentType === 'CONTENT'
              ) {
                downloadFile(fileUrl, dirName + fileName);
              }
            }
          }
        }

        setDownloadStatus(`Page ${page} download complete`);
      }

      setDownloadStatus('Download complete');
    } catch (error) {
      console.error('Error:', error);
      setDownloadStatus('Error downloading content');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadFile = (url, fileName) => {
    // Initiating the file download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <h1>VSCO Content Downloader</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="number"
        placeholder="Number of pages"
        value={pages}
        onChange={(e) => setPages(Number(e.target.value))}
      />
      <select
        value={contentType}
        onChange={(e) => setContentType(e.target.value)}
      >
        <option value="CONTENT">Both videos and photos</option>
        <option value="video">Videos</option>
        <option value="photo">Photos</option>
      </select>
      <button onClick={fetchAndDownload} disabled={isDownloading}>
        {isDownloading ? 'Downloading...' : 'Start Download'}
      </button>
      <p>{downloadStatus}</p>
    </div>
  );
};

export default DownloadContent;
