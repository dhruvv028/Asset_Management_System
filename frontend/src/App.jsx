import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [assetName, setAssetName] = useState("");
const [serialNumber, setSerialNumber] = useState("");
const [status, setStatus] = useState("");
const [employeeId, setEmployeeId] = useState("");
  //Get Employee..
  const fetchEmployees = () => {
  axios
    .get("http://localhost:5000/employees")
    .then((response) => {
      setEmployees(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
const fetchAssets = () => {
  axios
    .get("http://localhost:5000/assets")
    .then((response) => {
      console.log(response.data);

      setAssets(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};
  useEffect(() => {
  fetchEmployees();
  fetchAssets();
}, []);

//Add employee..
  const addEmployee = () => {
  axios
    .post("http://localhost:5000/employees", {
      name,
      email,
      department,
    })
    .then((response) => {
  console.log(response.data);

  fetchEmployees();

  setName("");
  setEmail("");
  setDepartment("");
})
    .catch((error) => {
      console.log(error);
    });
};
//DELETE employee..
  const deleteEmployee = (id) => {
  axios
    .delete(`http://localhost:5000/employees/${id}`)
    .then((response) => {
      console.log(response.data);

      fetchEmployees();
    })
    .catch((error) => {
      console.log(error);
    });
};
//Update Employee
  const editEmployee = (employee) => {
  setEditingId(employee.id);

  setName(employee.name);
  setEmail(employee.email);
  setDepartment(employee.department);
};
const updateEmployee = () => {
  axios
    .put(
      `http://localhost:5000/employees/${editingId}`,
      {
        name,
        email,
        department,
      }
    )
    .then((response) => {
      console.log(response.data);

      fetchEmployees();

      setEditingId(null);
      setName("");
      setEmail("");
      setDepartment("");
    })
    .catch((error) => {
      console.log(error);
    });
};
  const addAsset = () => {

  if (status === "Assigned" && !employeeId) {
    alert("Please select an employee before assigning an asset");
    return;
  }

  axios
    .post("http://localhost:5000/assets", {
      asset_name: assetName,
      serial_number: serialNumber,
      purchase_date: "2025-06-01",
      status: status,
      employee_id: employeeId || null,
    })
    .then((response) => {
      console.log(response.data);

      fetchAssets();

      setAssetName("");
      setSerialNumber("");
      setStatus("");
      setEmployeeId("");
    })
    .catch((error) => {
      console.log(error);
    });
};
const deleteAsset = (id) => {
  axios
    .delete(`http://localhost:5000/assets/${id}`)
    .then((response) => {
      console.log(response.data);

      fetchAssets();
    })
    .catch((error) => {
      console.log(error);
    });
};
  return (
  <div className="container">
    <h1>Asset Registry</h1>

    <div className="section">
      <h2>Employees</h2>

      <div className="form-row">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        {editingId ? (
          <button onClick={updateEmployee}>
            Update Employee
          </button>
        ) : (
          <button onClick={addEmployee}>
            Add Employee
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>

              <td>
                <button
                  className="edit-btn"
                  onClick={() => editEmployee(employee)}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => deleteEmployee(employee.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="section">
      <h2>Assets</h2>

      <div className="form-row">
        <input
          type="text"
          placeholder="Asset Name"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Serial Number"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select Status</option>
          <option value="Available">Available</option>
          <option value="Assigned">Assigned</option>
          <option value="In Repair">In Repair</option>
        </select>

        <select
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          <option value="">Unassigned</option>

          {employees.map((employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.name}
            </option>
          ))}
        </select>

        <button onClick={addAsset}>
          Add Asset
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Asset Name</th>
            <th>Serial Number</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id}>
              <td>{asset.id}</td>
              <td>{asset.asset_name}</td>
              <td>{asset.serial_number}</td>
              <td>{asset.status}</td>
              <td>{asset.employee_name || "Unassigned"}</td>

              <td>
                <button
                  className="delete-btn"
                  onClick={() => deleteAsset(asset.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default App;