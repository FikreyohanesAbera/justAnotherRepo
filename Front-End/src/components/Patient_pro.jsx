import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

export const Patient_pro = () => {
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [data, setData] = useState([]);
  const [filename, setFileName] = useState('');
  const [isempty, setIsEmpty] = useState(true);

  const fetchMyApplications = () => {
    console.log("fetching user apps")
    fetch("http://localhost:3001/application/user", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        console.log("fetched", data);
        setData(data)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetch(`http://localhost:3001/users/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        console.log("user profile", data);
        setEmail(data.email)
        setFirstname(data.firstName)
        setPhone(data.phone)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    fetchMyApplications();
  }

    , []); // Empty dependency array to run the effect only once when the component mounts
  const [reached, setReached] = useState(false);
  const [info, setInfo] = useState([]);

  useEffect(() => {
    const token = document.cookie;

    fetch("http://localhost:3001/patient", {
      method: 'POST',
      body: JSON.stringify({
        token: token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        console.log(response.checkups);
        setInfo(response.checkups);
        setReached(true);
      })
  }, [])
  useEffect(() => {
    const token = document.cookie;
    fetch("http://localhost:3001/labresult", {
      method: 'POST',
      body: JSON.stringify({
        token: token
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(response => {
        if (response.filePath) {
          setFileName(response.filePath);
          setIsEmpty(false);

        }

      })

  }, [])
  const handleDownload = () => {
    window.open(`http://localhost:3001/download/${filename}`, '_blank');
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-800">
              Patient Profile
            </h2>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
              className="w-32 h-32 rounded-full"
            />
            <h3 className="text-xl font-bold">{firstName}</h3>
            <p>Email: {email}</p>
            <p>Phone: {phone}</p>
          </div>
          <div className="flex gap-5">
            <Link to="/medicalhistory">
              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  View Medical Records
                </button>

              </div>
            </Link>

            <Link to="/Privilage_doc">
              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Apply for privileged account
                </button>
              </div>
            </Link>

            <Link to="/visithistory">
              <div className="flex justify-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Visit History
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {data.map((application) => (
        <div key={application.userId}
          className="bg-white p-6 min-w-full rounded-md shadow-md"
        >
          <h3 className="text-xl font-semibold mb-2">User Id : {application.userId}</h3>
          <p className="text-gray-700 mb-4">Department: {application.department}</p>
          <p className="text-gray-800 mb-4">Status: {application.status}</p>
          <p className="text-gray-800 mb-4">Privilege: {application.privilege}</p>


        </div>
      ))}
      <h1 className="text-center text-3xl font-bold text-gray-800"> Checkups </h1>
      {(reached) ?
        <div class="max-w-4xl mx-auto my-4">

          <table class="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th class="py-2 px-4 border-b">Doctor Name</th>
                <th class="py-2 px-4 border-b">Description</th>
                <th class="py-2 px-4 border-b">Date</th>
              </tr>

            </thead>

            <tbody>

              {info.map((elt) => (

                <tr>
                  <td class="py-2 px-4 border-b">{elt.docName}</td>
                  <td class="py-2 px-4 border-b">{elt.data.description}</td>
                  <td class="py-2 px-4 border-b">{elt.data.date}</td>
                </tr>


              ))}
            </tbody>
          </table>
          {(!isempty) ?
            <div className="text-center mt-5">
              <h2 className="text-center text-3xl font-bold text-gray-800">LabResults</h2>
              <button className="bg-blue-500 my-3 m-auto text-center hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleDownload}>
                Download File
              </button> </div> : null}
        </div>

        : null}

      {/* <div className="App"> <h2>Checkup Recommendations</h2><span> {info.checkup.docName}  </span><h3> {info.checkup.data.description}  </h3><h3> {info.checkup.data.date}  </h3></div> : null} */}

    </div>

  );
};