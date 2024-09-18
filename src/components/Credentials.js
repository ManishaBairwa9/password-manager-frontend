import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaTrash, FaPen } from "react-icons/fa";
import { FiEdit, FiTrash, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ReactComponent as UserIcon } from "../usericon.svg";
import { ReactComponent as ThemeToggle } from "../themetoggle.svg";
import { FaPlus } from "react-icons/fa6";
import { LuCopy } from "react-icons/lu";
import { IoCopy } from "react-icons/io5";
import { TbEyeClosed } from "react-icons/tb";
import { VscEye } from "react-icons/vsc";
import { CgEye } from "react-icons/cg";
import { MdRemoveRedEye } from "react-icons/md"; //filled eye
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
      link: "https://www.figma.com",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://www.figma.com",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://www.figma.com",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://www.figma.com",
      password: "gitpass456",
    },
    {
      id: 5,
      name: "React",
      link: "https://www.figma.com",
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

  const [darkMode, setDarkMode] = useState(false);

  const handleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const handleToggle = () => {
    setDarkMode((prevState) => !prevState);
  };

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
      <div className="backdrop-blur-lg flex justify-between items-center h-16 px-6 md:h-16 md:px-16 lg:h-20 lg:px-24 fixed top-0 w-screen z-50">
        <div className="w-[40px] h-[44px] bg-logo bg-cover"></div>

        <div className="flex items-center gap-2 md:gap-8 justify-center">
          {/* <div>
            <input
              type="checkbox"
              id="checkbox"
              className="hidden"
              checked={darkMode}
              onChange={handleTheme}
            />
            <label
              htmlFor="checkbox"
              className="w-12 h-6 bg-black flex items-center justify-between p-1 rounded-full relative transform scale-150"
            >
              <FaMoon className="text-pink-500" />
              <FaSun className="text-yellow-500" />
              <div
                className={`absolute w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  darkMode ? "transform translate-x-6" : ""
                }`}
              ></div>
            </label>
          </div> */}

          {darkMode && (
            <button onClick={handleToggle}>
              <FaMoon className="text-white" size={26} />
            </button>
          )}
          {!darkMode && (
            <button onClick={handleToggle}>
              <FaSun className="text-white" size={26} />
            </button>
          )}

          <div className="relative flex items-center justify-center">
            <UserIcon onClick={toggleVisibility} className="w-10" />
            {isVisible && (
              <div className="absolute top-16 flex gap-4 flex-col items-center">
                <button
                  className="rounded-full border-2 border-gray-400 p-3 bg-white bg-opacity-10"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-white" />
                </button>
                <button
                  className="rounded-full border-2 text-white border-gray-400 px-3 py-2 bg-white bg-opacity-10 text-nowrap"
                  onClick={goToip}
                >
                  I P
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-[#00021B] px-4 md:px-32 py-2 md:py-8 text-white max-w-full overflow-x-hidden">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mx-auto text-center pt-12 pb-20 font-outfit z-50 ">
          We gaurd your passwords with <br></br>Unbreakable{" "}
          <span className="text-[#63E400]">100%</span>, End-to-End Encryption.
        </h1>
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 justify-center items-center">
            {/* modal */}
            <div className="h-full">
              <div
                onClick={handleOpen}
                className="border-2 border-gray-600 border-dashed rounded-2xl cursor-pointer flex justify-center h-full hover:bg-white hover:bg-opacity-5 p-12 md:p-10"
              >
                <div className="text-base md:text-2xl font-medium text-white text-nowrap flex flex-row items-center gap-4 font-outfit normal-case">
                  Add new <FaPlus />
                </div>
              </div>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={style}
                  className="shadow-custom !bg-white backdrop-blur-lg !bg-opacity-20 !border-none !outline-none"
                >
                  <div className="py-8 text-base leading-6 space-y-4  sm:text-lg sm:leading-7">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      className="text-xl font-bold mb-4 text-white text-center"
                    >
                      {editingId ? "Edit" : "Add"} Credentials
                    </Typography>

                    <form
                      onSubmit={handleAddOrUpdateCredential}
                      className="space-y-4"
                    >
                      <div className="flex flex-col">
                        <input
                          id="website name"
                          type="text"
                          placeholder="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          autoComplete="off"
                          className="mt-2 block w-full rounded-md shadow-sm py-2 px-3 focus:outline-gray-700 sm:text-sm bg-white bg-opacity-10 text-white"
                        />
                      </div>

                      <div className="flex flex-col">
                        <input
                          id="link"
                          type="text"
                          placeholder="link"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          required
                          autoComplete="one-time-code"
                          className="mt-2 block w-full rounded-md shadow-sm py-2 px-3 focus:border-gray-300 sm:text-sm bg-white bg-opacity-10 text-white"
                        />
                      </div>

                      <div className="flex flex-col">
                        <input
                          id="password"
                          type="password"
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="one-time-code"
                          className="my-2 block w-full rounded-md shadow-sm py-2 px-3 focus:border-gray-300 sm:text-sm bg-none bg-white bg-opacity-10 text-white"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4  !text-white !bg-[#63E400] !bg-opacity-50"
                      >
                        {editingId ? "Update" : "Add"}
                      </Button>
                    </form>
                  </div>
                </Box>
              </Modal>
            </div>

            {error && (
              <p className="mt-4 text-red-500 absolute top-10 left-2/4">
                {error}
              </p>
            )}
            {credentials.length > 0 ? (
              credentials.map((credential) => (
                <div
                  key={credential.id}
                  className="overflow-hidden rounded-2xl bg-white hover:bg-opacity-10 border-opacity-60 px-6 py-5 relative bg-opacity-5 border-2 border-gray-600 hover:border-gray-400"
                >
                  <div className="flex items-center gap-2 mb-2">
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
                      className="text-[#71CDFF] hover:underline whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ display: "block" }}
                    >
                      {credential.link}
                    </a>
                  </p>

                  <input
                    type={visiblePasswords[credential.id] ? "text" : "password"}
                    value={credential.password}
                    readOnly
                    className="border-none bg-transparent mt-2"
                  />

                  <div className="absolute top-4 right-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => togglePasswordVisibility(credential.id)}
                        className="hover:text-white text-slate-600"
                      >
                        {visiblePasswords[credential.id] ? (
                          <TbEyeClosed size={18} />
                        ) : (
                          <MdRemoveRedEye size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId("update");
                          handleOpen();
                        }}
                        className="hover:text-white text-slate-600  "
                        title="Edit"
                      >
                        <FaPen size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(credential.id)}
                        className="hover:text-white text-slate-600 "
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>

                      <button
                        onClick={() =>
                          copyToClipboard(credential.password, credential.id)
                        }
                        className="hover:text-white text-slate-600"
                        title={copiedId === credential.id ? "Copied!" : "Copy"}
                      >
                        <IoCopy size={16} />
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
