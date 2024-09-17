import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaCopy, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ReactComponent as UserIcon } from "../usericon.svg";
import { ReactComponent as ThemeToggle } from "../themetoggle.svg";
import { FaPlus } from "react-icons/fa6";
import { FiLogOut } from "react-icons/fi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
};

const Credentials = ({ token }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      name: "Google",
      link: "https://www.google.com",
      password: "password123",
    },
    {
      id: 2,
      name: "Facebook",
      link: "https://www.facebook.com",
      password: "mysecretpass",
    },
    {
      id: 3,
      name: "GitHub",
      link: "https://www.github.com",
      password: "gitpass456",
    },
    {
      id: 4,
      name: "Figma",
      link: "https://www.figma.com",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://react-icons.github.io/react-icons/search/#q=",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://react-icons.github.io/react-icons/search/#q=",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://react-icons.github.io/react-icons/search/#q=",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://react-icons.github.io/react-icons/search/#q=",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://react-icons.github.io/react-icons/search/#q=",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://react-icons.github.io/react-icons/search/#q=",
      password: "gitpass456",
    },
  ]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (token) {
      fetchCredentials();
    }
  }, [token]);

  const navigate = useNavigate();

  const goToip = () => {
    navigate("/ip"); // This will navigate to the root route
  };
  const fetchCredentials = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/credentials",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCredentials(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching credentials:", error);
      setError("Failed to fetch credentials.");
    }
  };

  const handleAddOrUpdateCredential = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3000/api/credentials/${editingId}`,
          {
            name,
            link,
            password,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          "http://localhost:3000/api/credentials",
          {
            name,
            link,
            password,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      setName("");
      setLink("");
      setPassword("");
      setEditingId(null);
      fetchCredentials();
      setError("");
    } catch (error) {
      console.error("Error adding/updating credential:", error);
      setError("Failed to add/update credential.");
    }
  };

  const handleEdit = (credential) => {
    setName(credential.name);
    setLink(credential.link);
    setPassword(credential.password);
    setEditingId(credential.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/credentials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCredentials();
      setError("");
    } catch (error) {
      console.error("Error deleting credential:", error);
      setError("Failed to delete credential.");
    }
  };

  const getFaviconUrl = (link) => {
    try {
      const url = new URL(link);
      return `https://www.google.com/s2/favicons?domain=${url.hostname}`;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  };

  const handleLogout = () => {
    navigate("/");
    window.location.reload();
    localStorage.removeItem("authToken"); // Remove token from localStorage
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0A0B16] px-4 md:px-32 py-2 md:py-8 text-white max-w-full overflow-x-hidden">
        <div className="flex justify-between items-center w-full">
          <div className="w-[45px] h-[49px] bg-logo bg-cover"></div>
          <div className="flex items-center gap-8 justify-center">
            <ThemeToggle />
            <div className="relative flex items-center justify-center">
              <UserIcon onClick={toggleVisibility} className="w-11" />
              {isVisible && (
                <div className="absolute top-16 flex gap-4 flex-col items-center">
                  <button
                    className="rounded-full border-2 border-gray-400 p-4 bg-black"
                    onClick={handleLogout}
                  >
                    <FiLogOut />
                  </button>
                  <button
                    className="rounded-full border-2 border-gray-400 px-4 py-3 bg-black text-nowrap"
                    onClick={goToip}
                  >
                    I P
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mx-auto text-center pt-12 pb-20 font-outfit z-50 ">
          We gaurd your passwords with <br></br>Unbreakable{" "}
          <span className="text-[#63E400]">100%</span> , End-to-End Encryption.
        </h1>
      <div className="flex justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 justify-center items-center">

            {/* modal */}
            <div className="h-full">
              <div onClick={handleOpen} className="border-2 border-gray-400 border-dashed rounded-2xl cursor-pointer flex justify-center h-full">
                <div className="text-lg sm:text-xl md:text-2xl font-medium  text-white text-nowrap flex flex-row items-center gap-4 font-outfit normal-case">
                  Add new <FaPlus />
                </div>
              </div>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="shadow-custom">
                  <div className="py-8 text-base leading-6 space-y-4  sm:text-lg sm:leading-7">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      className="text-xl font-bold mb-4"
                    >
                      {editingId ? "Edit" : "Add"} Credentials
                    </Typography>

                    <form
                      onSubmit={handleAddOrUpdateCredential}
                      className="space-y-4"
                    >
                      <div className="flex flex-col">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          autoComplete="off"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="link"
                          className="text-sm font-medium text-gray-700"
                        >
                          Link
                        </label>
                        <input
                          id="link"
                          type="text"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          required
                          autoComplete="one-time-code"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium "
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="one-time-code"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {editingId ? "Update" : "Add"}
                      </Button>
                    </form>
                  </div>
                </Box>
              </Modal>
            </div>

              {error && <p className="mt-4 text-red-500 absolute top-10 left-2/4">{error}</p>}
                {credentials.length > 0 ? (
                  credentials.map((credential) => (
                    <div key={credential.id} className="overflow-hidden rounded-2xl border-[1px] border-white border-opacity-60 px-6 py-8">
                        <div className="flex items-center gap-2">
                          <img
                            src={getFaviconUrl(credential.link)}
                            alt="Favicon"
                            className="w-6 h-6 mr-2"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://www.google.com/s2/favicons?domain=example.com";
                            }}
                          />
                          <h3 className="text-lg leading-6 font-medium ">
                            {credential.name}
                          </h3>
                        </div>
                        <p className="mt-2 max-w-2xl text-sm ">
                          <a
                            href={credential.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-words text-nowrap"
                          >
                            {credential.link}
                          </a>
                        </p>


                          <div className="flex flex-col">
                            <input
                              type={
                                visiblePasswords[credential.id]
                                  ? "text"
                                  : "password"
                              }
                              value={credential.password}
                              readOnly
                              className="border-none bg-transparent"
                            />
                            <div className="flex flex-row gap-2 justify-end">
                            <button
                              onClick={() =>
                                togglePasswordVisibility(credential.id)
                              }
                              className="ml-2 text-gray-600 hover:text-gray-900"
                            >
                              {visiblePasswords[credential.id] ? (
                                <FaEyeSlash size={16} />
                              ) : (
                                <FaEye size={16} />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  credential.password,
                                  credential.id
                                )
                              }
                              className="text-indigo-600 hover:text-indigo-900"
                              title={
                                copiedId === credential.id ? "Copied!" : "Copy"
                              }
                            >
                              <FaCopy size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setEditingId("update");
                                handleOpen()
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(credential.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                            </div>
                          </div>
                      </div>
                  ))
                ) : (
                  <p>No credentials found.</p>
                )}
        </div>
        </div>
      </div>
    </>
  );
};

export default Credentials;
