import { useState, useEffect } from 'react';
import axios from 'axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ConfirmationModal from "../components/ConfirmationModal";
import InformationModal from '../components/InformationModal';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SuccessModal from '../components/SuccessModal';
import LoadingOverlay from '../components/LoadingOverlay';
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; 

function EditUserById() {

  const query = new URLSearchParams(useLocation().search);
  const userIdGet = query.get("id"); 

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [username, setUsername] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [showInformationModal, setShowInformationModal] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [userData, setUserData] = useState({
    user_id: "",
    username: "",
    password: "",
    access: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    // Pengecekan apakah ada field yang kosong
    if (!userData.username) {
      setErrorMessage("Username is required!");
      setShowInformationModal(true);
      return;
    }
    
    if (!userData.password) {
      setErrorMessage("Password is required!");
      setShowInformationModal(true);
      return;
    }
    
    if (userData.access === "" || userData.access === null || userData.access === undefined) {
      setErrorMessage("Access is required!");
      setShowInformationModal(true);
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:8080/updateByUserId", 
        userData, 
        {
          headers: { 
            "Content-Type": "application/json" 
        },
      });

      if (response.status === 200) {
        setSuccessMessage("User updated successfully!");
        setShowSuccessModal(true);
        
        setTimeout(() => {
          navigate("/monitor");
        }, 2000);
      }

    } catch (error) {
      console.error("Error updating user:", error);
      setErrorMessage(`${error.response?.data?.error || error.response?.data?.message  || "Error updating user" }`);
      setShowInformationModal(true);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8080/user',
          {
            p_id: userIdGet
          }, 
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (response.data) {

          setUserData({
            user_id: response.data.user_id,
            username: response.data.username,
            password: response.data.password,
            access: response.data.access,
          });
        } else {
          console.warn("User not found!");
          setErrorMessage(`User not found`);
          setShowInformationModal(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setErrorMessage(`${error.response?.data?.error || error.response?.data?.message  || "Error fetching user" }`);
        setShowInformationModal(true);
      }
    };

    if (userIdGet) {
      fetchUser();
    }
  }, [userIdGet]);

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen gap-6 bg-gray-100">
  
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-lg rounded-2xl w-full max-w-xl p-6">
        <h2 className="text-3xl font-bold mb-2 tracking-wide drop-shadow-lg text-center">
          Edit User By ID
        </h2>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-gray-700">User ID</label>
            <input
              type="text"
              name="user_id"
              value={userData.user_id}
              className="w-full px-4 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
              disabled
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={userData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700">Access</label>
            <div className="flex mt-2 gap-2">
              <button
                type="button"
                onClick={() => setUserData({ ...userData, access: 0 })}
                className={`w-20 px-4 py-2 rounded-md transition-all ${
                  userData.access === 0 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setUserData({ ...userData, access: 1 })}
                className={`w-20 px-4 py-2 rounded-md transition-all ${
                  userData.access === 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center mt-4 gap-4">
            <button
              type="button"
              onClick={() => navigate("/monitor")}
              className="px-4 py-2 bg-gray-500 text-white rounded-md w-full md:w-32 text-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md w-full md:w-32 text-center hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>

        </form>
      </div>

      <InformationModal
        show={showInformationModal}
        onHide={() => setShowInformationModal(false)}
        icon={<AssignmentIcon style={{ fontSize: "3rem" }} />}
        header={""}
        item={errorMessage}
      />
      <SuccessModal
        show={showSuccessModal}
        onHide={() => {
          setShowSuccessModal(false);
        }}
        icon={
          <CheckCircleIcon style={{ fontSize: "3rem" }}/>
        }
        header={""}
        item={successMessage}
      />
      <LoadingOverlay isLoading={isLoading} />
    </div>
  );
}

export default EditUserById;