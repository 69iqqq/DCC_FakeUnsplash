import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGES_PER_PAGE = 20;

function FrontPages() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg("");
        setLoading(true);
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
        setLoading(false);
      }
    } catch (error) {
      setErrorMsg("Error fetching images. Try again later.");
      console.log(error);
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const resetSearch = () => {
    setPage(1);
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    resetSearch();
  };

  const handleView = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <div className='container' style={{ padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Image Search
        </h1>
        {errorMsg && (
          <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>
        )}
        <div style={{ marginBottom: "20px" }}>
          <Form
            style={{ width: "500px", margin: "auto" }}
            onSubmit={handleSearch}
          >
            <Form.Control
              type='search'
              placeholder='Type something to search...'
              ref={searchInput}
            />
          </Form>
        </div>
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading...</p>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {images.map((image) => (
                <div
                  key={image.id}
                  style={{ position: "relative", width: "200px" }}
                >
                  <img
                    src={image.urls.small}
                    alt={image.alt_description}
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      transition: "transform 0.2s",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "10px", // Gap between the image and buttons
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#83a598",
                        borderColor: "#83a598",
                      }}
                      onClick={() => handleView(image)}
                    >
                      View
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#d3869b",
                        borderColor: "#d3869b",
                      }}
                      onClick={() => window.open(image.urls.full, "_blank")}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {page > 1 && (
                <Button onClick={() => setPage(page - 1)}>Previous</Button>
              )}
              {page < totalPages && (
                <Button
                  style={{
                    backgroundColor: "#3c3836",
                    borderColor: "#3c3836",
                  }}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          </>
        )}

        {selectedImage && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>
                {selectedImage.alt_description || "Image Details"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img
                src={selectedImage.urls.regular}
                alt={selectedImage.alt_description}
                style={{ width: "100%" }}
              />
              <p>
                <strong>Description:</strong>{" "}
                {selectedImage.description || "No description available."}
              </p>
              <p>
                <strong>Likes:</strong> {selectedImage.likes}
              </p>
              <p>
                <strong>Downloads:</strong> {selectedImage.downloads}
              </p>
              <p>
                <strong>Photographer:</strong> {selectedImage.user.name}
              </p>
              <p>
                <strong>Portfolio:</strong>{" "}
                <a
                  href={selectedImage.user.portfolio_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {selectedImage.user.portfolio_url}
                </a>
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{
                  backgroundColor: "#d3869b",
                  borderColor: "#d3869b",
                }}
                onClick={handleCloseModal}
              >
                Close
              </Button>
              <Button
                style={{
                  backgroundColor: "#3c3836",
                  borderColor: "#3c3836",
                }}
                onClick={() => window.open(selectedImage.urls.full, "_blank")}
              >
                Download
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}

export default FrontPages;
