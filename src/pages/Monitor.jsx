import { useState, useEffect } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ConfirmationModal from "../components/ConfirmationModal";
import InformationModal from '../components/InformationModal';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SuccessModal from '../components/SuccessModal';
import LoadingOverlay from '../components/LoadingOverlay';
import BasicTable from '../components/BasicTable';
import EditUserById from './EditUserById';
import { useNavigate } from 'react-router-dom';

function Monitor() {
  const userId = localStorage.getItem('userId');
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [date, setDate] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [showInformationModal, setShowInformationModal] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [openRow, setOpenRow] = useState(null);
  const [filtering, setFiltering] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.post(
          'http://localhost:8080/user',
          {
            p_id: userId
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
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/users'
        );

        if (response.data) {
          setData(response.data);
        } else {
          console.warn("data not found!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

  }, []);

  const columns = [
    {
      header: "user id",
      accessorKey: "user_id",
    }, {
      header: "username",
      accessorKey: "username",
    },
    {
      header: "password",
      accessorKey: "password",
    },
    {
      header: "Access",
      accessorKey: "access",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-md text-white ${row.original.access === 1 ? "bg-blue-600" : "bg-gray-500"}`}>
          {row.original.access === 1 ? "Admin" : "User"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
      <div className="relative">
        <button
          className="bg-gray-300 px-4 py-2 rounded"
          onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
        >
          ⋮
        </button>
        {openRow === row.id && (
          <div className="absolute right-0 mt-2 w-32 bg-white border shadow-md rounded-md p-2 z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                navigate(`/editUserById?id=${row.original.user_id}`);
              }}
            >
              Edit User
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                navigate(`/attendaceByUser?id=${row.original.user_id}`);
              }}
            >
              View Attendance
            </button>
          </div>
        )}
      </div>

      ),
    },
  ];

  return (
    <div>
      <Header />
     
      <div className="flex flex-col items-start justify-start p-6 h-[calc(100vh-4rem)] gap-6 bg-gray-100 ">
        
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-700 text-white shadow-lg rounded-2xl w-full p-6">
          <h2 className="text-3xl font-bold mb-2 tracking-wide drop-shadow-lg">Monitor Page</h2>
          <p className="text-lg font-medium bg-white text-orange-600 px-4 py-2 rounded-xl shadow-md">
            Welcome to the monitor system, <span className="font-bold">{username}</span>!
          </p>
        </div>

        <div className="items-center justify-center bg-white shadow-md rounded-lg py-6 px-[10%] w-full">
          
          <div className="text-xl font-semibold mb-2">{date}</div>

          {/* <input
            className="mb-4 p-2 border rounded w-full"
            placeholder="Search username..."
            value={filtering}
            onChange={(e) => setFiltering(e.target.value)}
          /> */}
          <div className="flex items-center gap-4 mb-4">
            <input
              className="p-2 border rounded w-full"
              placeholder="Search username..."
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
            />
            
            <button
              onClick={() => {
                navigate(`/createUser`);
              }} 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all 
                        hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              Create
            </button>
          </div>

          <BasicTable data={data} columns={columns} filtering={filtering} setFiltering={setFiltering} />

        </div>
      
      </div>

      {/* <ConfirmationModal
        isOpen={showCheckinModal}
        onClose={() => setShowCheckinModal(false)}
        onConfirm={() => {
          handleCheckin();
          setShowCheckinModal(false);
        }}
        title="Check-in Confirmation"
        message="Are you sure you want to check in with this picture?"
        imagePreview={imagePreview}
      /> */}
      {/* <ConfirmationModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={() => {
          handleCheckout();
          setShowCheckoutModal(false);
        }}
        title="Check-out Confirmation"
        message="Are you sure you want to check out?"
      /> */}
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

export default Monitor;