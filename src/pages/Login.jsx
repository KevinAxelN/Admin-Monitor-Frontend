import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InformationModal from '../components/InformationModal';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SuccessModal from '../components/SuccessModal';
import LoadingOverlay from '../components/LoadingOverlay';

function Login({ setIsAuthenticated, setUserId }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showInformationModal, setShowInformationModal] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);

    if (!username || !password ) {
      setErrorMessage(`Username and Password are required`);
      setIsLoading(false);
      setShowInformationModal(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/loginAdmin', { username, password });
      const data = response.data;
      
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('userId', data.user.user_id);
        navigate('/monitor');
      } else {
        setErrorMessage(`Username or password is incorrect!`);
        setIsLoading(false);
        setShowInformationModal(true);
      }
      setIsLoading(false);

    } catch (error) {
      setIsLoading(false);

      console.error('Login error:', error);
      setErrorMessage(`${error.response?.data?.error || error.response?.data?.message  || "An error occurred!"}`);
      setIsLoading(false);
      setShowInformationModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700">
      
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Admin Portal
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Manage Employees Easily
        </p>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <button
          onClick={handleLogin}
          className="font-semibold py-2 transition w-full inline-flex justify-center rounded-lg border bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:text-sm"
        >
          Login
        </button>
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

export default Login;
