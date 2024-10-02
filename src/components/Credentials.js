import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaMoon, FaSun, FaTrash, FaPen, FaSearch, FaUserCog } from "react-icons/fa";
import { FiEdit, FiTrash, FiLogOut, FiSearch } from "react-icons/fi";
// import { LuCopy } from "react-icons/lu";
// import { VscEye } from "react-icons/vsc";
// import { CgEye } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { ReactComponent as UserIcon } from "../usericon.svg";
import { FaPlus } from "react-icons/fa6";
import { IoCopy } from "react-icons/io5";
import { TbEyeClosed } from "react-icons/tb";
import { MdRemoveRedEye, MdOutlineClose } from "react-icons/md"; //filled eye
import greenCheckGif from "../greencheck.gif";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/joy/Input';

const style = {
  transform: "translate(-50%, -50%)",
  p: 4,
  width: '100%',
};


const Credentials = ({ token }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [password, setPassword] = useState("");
  let [credentials, setCredentials] = useState([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);  //for user icon button when clicked the logout and ip button will be seen.
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [toggleModalPassword, setToggleModalPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

   // State to track the input value and filtered credentials
   const [searchTerm, setSearchTerm] = useState(''); // Track search input
   const [filteredCredentials, setFilteredCredentials] = useState(credentials); // Store filtered credentials
   
   // Function to handle input change and filter the credentials
   const handleInputChange = (e) => {
     const value = e.target.value;
     setSearchTerm(value);
   
     if (value.length < 1) {
       // Reset credentials to original if search term is empty
       setFilteredCredentials(credentials);
     } else {
       // Filter credentials based on the input value
       const filtered = credentials.filter((cred) =>
         cred.name.toLowerCase().includes(value.toLowerCase())
       );
       setFilteredCredentials(filtered);
     }
   };
   
  
 
  const openSnackbar = () => {
    setSnackbarOpen(true);
  };

  const closeSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={closeSnackbar}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const handleModalPassword = () => {
    setToggleModalPassword(prevState => !prevState);
  }

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

  const goToGeneratePassword = () => {
    navigate("/generatepassword");
  }

  const fetchCredentials = async () => {
    try {
      const response = await axios.get(
        "http://3.86.112.165:3000/api/credentials",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCredentials(response.data.data);
      setFilteredCredentials(response.data.data)
      setError("");
    } catch (error) {
      console.error("Error fetching credentials:", error);
      setError("Failed to fetch credentials.");
      handleLogout();
    }
  };

  const handleAddOrUpdateCredential = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://3.86.112.165:3000/api/credentials/${editingId}`,
          {
            name,
            link,
            password,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        openSnackbar();
        setSnackbarMessage("Successfully Updated!");
      } else {
        await axios.post(
          "http://3.86.112.165:3000/api/credentials",
          {
            name,
            link,
            password,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        openSnackbar();
        setSnackbarMessage("Successfully Added!");
      }
      setName("");
      setLink("");
      setPassword("");
      setEditingId(null);
      fetchCredentials();
      setError("");
      handleClose();

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
      await axios.delete(`http://3.86.112.165:3000/api/credentials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCredentials();
      setError("");
      openSnackbar();
      setSnackbarMessage("Successfully Deleted!");
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
      return `https://japannetwork-test.s3.eu-north-1.amazonaws.com/internet.png`;
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
        openSnackbar();
        setSnackbarMessage("Copied");
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const toggleVisibility = () => {
    setIsVisible((prevState) => !prevState);
  };

  const [isFocused, setIsFocused] = useState(false);

  return (
    <>

  <style>
        {`
          .MuiSnackbarContent-root {
              background-color: darkgreen !important;
          }

          .MuiInput-root {
              background-color: rgba(255, 255, 255, 0.05); 
              color: white;
              border: 2px solid #374151;
              border-radius: 2rem;
              width: 12rem;
          }

          input::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }

          .MuiInput-root:focus {
              outline: 2px solid rgba(255, 255, 255, 1) !important;
          }


          .css-1hrwsh9-JoyInput-root:not([data-skip-inverted-colors]) {
              --_Input-focusedHighlight: white !important;
              --Input-focusedHighlight: black !important; 
              padding: 0 1rem;
          }


        `}
      </style>

    <Snackbar
        anchorOrigin={{ vertical:"bottom", horizontal:"center" }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={closeSnackbar}
        message={snackbarMessage}
        action={action}

    />

      <div className="backdrop-blur-lg flex justify-between items-center h-16 px-6 md:h-16 md:px-16 lg:h-20 lg:px-24 fixed top-0 w-screen z-50 pt-10 pb-8">
        <div className="w-[40px] h-[44px] bg-logo bg-cover"></div>

        <div className="flex items-center gap-4 md:gap-4 lg:gap-6 justify-center">
         <div className="absolute left-1/2 transform -translate-x-1/2 lg:relative lg:left-auto lg:right-0 lg:translate-x-0 md:relative md:left-auto md:right-0 md:translate-x-0">
         <Input
            color="success"
            disabled={false}
            placeholder={!searchTerm && !isFocused && "Search"}
            size="md"
            variant="plain"
            value={searchTerm}
            onChange={handleInputChange} // Track keystrokes
            onFocus={() => setIsFocused(true)} // Set focused to true
            onBlur={() => setIsFocused(false)} // Set focused to false
            startDecorator={!searchTerm && !isFocused &&  <FiSearch className="text-white text-opacity-50" />}
          />
         </div>
          <div className="hidden lg:inline-block">
          {darkMode && (
            <button onClick={handleToggle} title="dark theme">
              <FaMoon className="text-white" size={26} />
            </button>
          )}
          {!darkMode && (
            <button onClick={handleToggle} title="light theme">
              <FaSun className="text-white" size={26}/>
            </button>
          )}
          </div>
          <div className="relative flex items-center justify-center">
            <UserIcon onClick={toggleVisibility} className="w-10 cursor-pointer" />
            {isVisible && (
              <div className="absolute top-16 flex gap-2 flex-col items-center">
                <button
                  className="rounded-full border-2  border-gray-700 hover:border-gray-600 px-4 py-2 bg-[#0D0F27] text-white hover:scale-110 transition-transform duration-600 ease-in-out text-nowrap w-32"
                  title="Your Account"
                >
                  <FaUserCog className="text-white inline mr-1" size={20}/> Account
                </button>
                <button
                title="IP Manager"
                  className="rounded-full border-2 text-lg text-white border-gray-700 hover:border-gray-600  px-4 py-2 bg-[#0D0F27] text-nowrap hover:scale-110 transition-transform duration-600 ease-in-out w-32"
                  onClick={goToip}
                >
                  IP Manager
                </button>
                <button
                title="Generate Password"
                  className="rounded-full border-2 text-lg text-white border-gray-700 hover:border-gray-600  px-4 py-2 bg-[#0D0F27] text-nowrap hover:scale-110 transition-transform duration-600 ease-in-out w-32"
                  onClick={goToGeneratePassword}
                >
                  Generate
                </button>
                <button
                  className="rounded-full border-2  border-gray-700 hover:border-gray-600 p-3 text-white bg-[#0D0F27] hover:scale-110 transition-transform duration-600 ease-in-out w-32"
                  title="Logout"
                  onClick={handleLogout}
                >
                  <FiLogOut className="text-white inline mr-1" size={20}/> Logout
                </button>

              </div>
            )}
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-[#00021B] px-4 py-2 md:px-20 md:py-8 lg:px-40 lg:py-12 text-white max-w-full overflow-x-hidden" onClick={() => { setIsVisible(false)}}>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mx-auto text-center pt-24 pb-6 md:pt-12 md:pb-12 font-outfit z-50">
          Guard your passwords with <br></br>Unbreakable,{" "}
          <span className="text-[#63E400]">100%</span> End Encryption.
        </h1>
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6 justify-center items-center w-full">
            {/* modal */}
            <div className="h-full">
              <div
                onClick={() => {
                  handleOpen();
                  setName("");
                  setLink("");
                  setPassword("");
                  setEditingId(null);
                }}
                className="border-2 border-gray-600 border-dashed rounded-2xl cursor-pointer flex justify-center h-full hover:bg-white hover:bg-opacity-5 hover:border-gray-500 p-12 md:p-10 hover:scale-105 transition-transform duration-600 ease-in-out"
              >
                <div className="text-base md:text-2xl font-medium text-white text-nowrap flex flex-row items-center gap-4 font-outfit normal-case " title="add a new password" >
                  Add new <FaPlus />
                </div>
              </div>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="backdrop-blur-lg"
              >
                <Box
                  sx={style}
                  className="!bg-[#0D0F27] backdrop-blur-2xl border-slate-500 border-2 border-opacity-25 outline-none rounded-3xl absolute top-2/4 left-2/4 px-2 lg:px-0 max-w-[25rem] !overflow-hidden"
                >
                  <MdOutlineClose className="text-slate-400 hover:text-white absolute top-5 right-5 scale-110 hover:scale-150 transition-transform duration-600 ease-in-out cursor-pointer" onClick={handleClose}/>
                  
                  <div className="my-6 text-base sm:text-lg">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      className="!text-2xl !font-outfit !font-semibold !mb-8 text-white text-center"
                    >
                    
                      {editingId ? "Edit" : "Add"} {" "}<span className="text-[#63E400]">Credentials</span>
                    </Typography>
                    <form
                      onSubmit={handleAddOrUpdateCredential}
                      className="space-y-4"
                    >
                      <div className="flex flex-col gap-4 my-6">
                        <input
                          id="website name"
                          type="text"
                          placeholder="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          autoComplete="off"
                          className="block w-full rounded-md shadow-sm py-2 px-3 border-2 border-opacity-60 border-gray-700 focus:border-gray-500 sm:text-sm bg-[#00021B] text-white placeholder:text-slate-600"
                        />

                        <input
                          id="link"
                          type="text"
                          placeholder="link"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          required
                          autoComplete="one-time-code"
                          className="block w-full rounded-md shadow-sm py-2 px-3 border-2 border-opacity-60 border-gray-700 sm:text-sm bg-[#00021B] text-white placeholder:text-slate-600"
                        />
                        <div className="relative">
                        <input
                          id="password"
                          type={!toggleModalPassword ? "password" : "text"}
                          placeholder="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoComplete="one-time-code"
                          className="block w-full rounded-md py-2 pl-3 pr-10 border-2 border-opacity-60 border-gray-700 focus:border-gray-500 sm:text-sm bg-[#00021B] text-white placeholder:text-slate-600"
                        />
                        
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <button type="button" onClick={(e) => { e.preventDefault(); handleModalPassword(); }}>
  {!toggleModalPassword ? <MdRemoveRedEye size={18} className="text-slate-500" /> : <TbEyeClosed size={18} className="text-slate-500" />}
</button>

                        </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className=" w-full flex justify-center py-2 px-4  !text-white hover:!bg-[#1c6307] !bg-[#409400] !border-2 !border-gray-600 !font-semibold"
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
            {filteredCredentials.length > 0 ? (
              filteredCredentials.map((credential) => (
                <div
                  key={credential.id}
                  className="overflow-hidden rounded-2xl bg-white border-opacity-60 pl-5 pr-10 py-6 relative bg-opacity-5 border-2 border-gray-700 hover:border-gray-600 min-h-32 hover:scale-105 transition-transform duration-600 ease-in-out"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={getFaviconUrl(credential.link)}
                      alt="Favicon"
                      className="w-6 h-6 mr-2"
                    />
                    <h3 className="text-base lg:text-lg leading-6 font-medium whitespace-nowrap overflow-hidden text-ellipsis" style={{ display: "block" }}>
                    {credential.name.charAt(0).toUpperCase() + credential.name.slice(1)}
                    </h3>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm ">
                    <a
                      href={credential.link}
                      target="_blank"
                      title="click to open"
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
                    className="border-none bg-transparent mt-2 cursor-pointer outline-none"
                  />

                  <div className="absolute top-4 right-4">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => togglePasswordVisibility(credential.id)}
                        className="hover:text-white text-slate-600  hover:scale-125 transition-transform duration-600 ease-in-out"
                      >
                        {visiblePasswords[credential.id] ? (
                          <TbEyeClosed size={18} title="hide password"/>
                        ) : (
                          <MdRemoveRedEye size={18} title="show password"/>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(credential.id);
                          handleEdit(credential)
                          handleOpen();
                        }}
                        className="hover:text-white text-slate-600 hover:scale-125 transition-transform duration-600 ease-in-out"
                        title="Edit"
                      >
                        <FaPen size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(credential.id)}
                        className="hover:text-white text-slate-600 hover:scale-125 transition-transform duration-600 ease-in-out"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>

                      <button
                        onClick={() =>
                          copyToClipboard(credential.password, credential.id)
                        }
                        className="hover:text-white text-slate-600 hover:scale-125 transition-transform duration-600 ease-in-out"
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
