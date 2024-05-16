import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Store } from "../Store";

function ImageUpload() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${userInfo.token}`);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        var u = userInfo.user;
        u.picture = data.imageUrl;
        ctxDispatch({ type: "UPDATE_PICTURE", payload: u });
      } else {
        const data = await response.json();
        alert(`Upload failed: ${data}`);
        console.log(data);
      }
    } catch (error) {
      alert("An error occurred while uploading the image.");
      console.error(error);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    handleUpload();
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setShowConfirmation(false);
  };

  return (
    <div className="container-fluid customBackground addProfilePicture">
      <Navbar />
      <div className="imageChangeContainer">
        <div className="changeImageBox">
          <h2>Image Upload</h2>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              className="form-control-file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {selectedFile && (
          <div className="changedImage">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              style={{ maxWidth: "100%", maxHeight: "300px" }}
            />
            <div>
              {showConfirmation ? (
                <div className="changeImgButtons">
                  <p>Are you sure you want to upload this image?</p>
                  <button onClick={handleConfirm} className="btn btn-primary">
                    Save and Proceed
                  </button>
                  <button onClick={handleCancel} className="btn btn-secondary">
                    Pick Another
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirmation(true)}
                  className="btn btn-primary mt-3"
                >
                  Upload
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
