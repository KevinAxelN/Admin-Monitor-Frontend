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

function AttendaceByUser() {

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
  const [data, setData] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          'http://localhost:8080/getAttendancesByUserId',
          {
            p_userId: userIdGet
          }, 
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );

        if (response.data) {
          setData(response.data);
        } else {
          console.warn("data not found!");
          setIsLoading(false);
          setErrorMessage("data not found!");
          setShowInformationModal(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
        setErrorMessage("Error fetching data");
        setShowInformationModal(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);

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
          setUsername(response.data.username);
        } else {
          console.warn("User not found!");
          setErrorMessage("User not found!");
          setShowInformationModal(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setErrorMessage("Error fetching user!");
        setShowInformationModal(true);
      }
    };

    if (userIdGet) {
      fetchUser();
    }
  }, [userId]);

  const handleViewProof = async (id) => {
    try {
      const response = await axios.post("http://localhost:8080/getPictureById", { p_id: id });
  
      if (response.data.picture) {
        setSelectedImage(response.data.picture); 
      } else {
        alert("Attendance Picture not found!");
      }
    } catch (error) {
      console.error("Error fetching picture:", error);
      alert("Something went wrong when fetching picture!");
    }
  };

  return (
    
    <div className="flex flex-col items-center justify-center p-6 min-h-screen gap-6 bg-gray-100">
  
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg">
            <img src={selectedImage} alt="Attendance Proof" className="max-w-full rounded" />
            <button 
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={() => setSelectedImage(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-lg rounded-2xl w-full max-w-xl p-6">
        <h2 className="text-3xl font-bold mb-2 tracking-wide drop-shadow-lg text-center">
          Attendance user {userId} : {username}
        </h2>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl mx-auto">


        <h2 className="text-2xl font-bold mb-4 text-center">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Check-in Time</th>
                <th className="px-4 py-2 border">Check-out Time</th>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Bukti Absen</th>
              </tr>
            </thead>
            <tbody>
              {data.map((attendance) => (
                <tr key={attendance.id} className="border text-center">
                  <td className="px-4 py-2 border">{attendance.checkin_date}</td>
                  <td className="px-4 py-2 border">{attendance.checkin_time}</td>
                  <td className="px-4 py-2 border">{attendance.checkout_time || "-"}</td>
                  <td className="px-4 py-2 border">{attendance.id}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      onClick={() => handleViewProof(attendance.id)}
                    >
                      See
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex justify-center mt-2'>
          <button
            type="button"
            onClick={() => navigate("/monitor")}
            className=" px-4 py-2 bg-gray-500 text-white rounded-md w-full md:w-32 text-center hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Back
          </button>
        </div>

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

export default AttendaceByUser;