import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    const token = localStorage.getItem('jwtToken');
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
        headers,
      });

      if (response.ok) {
        console.log("Image uploaded successfully!");
        navigate('/userProfile');
      } else {
        const data = await response.json();
        alert(`Upload failed: ${data}`);
        console.log(data)
      }
    } catch (error) {
      alert("An error occurred while uploading the image.");
      console.error(error);
    }
  };

  return (
      <div className="container mt-4">
        <h2>Image Upload</h2>
        <div className="form-group">
          <input type="file" accept="image/*" className="form-control-file" onChange={handleFileChange} />
        </div>
        <button onClick={handleUpload} className="btn btn-primary mt-3">Upload</button>
      </div>
  );
}

export default ImageUpload;
