import React, { useEffect, useState } from "react";
import axios from "axios";

const SingleWithMultple = () => {

  let [employeeObj, setEmployeeObj] = useState({
    empId: 0,
    name: "",
    contactNo: "",
    email: "",
    city: "",
    state: "",
    pinCode: "",
    designation: "",
    mockEmpRelatives: [],
  });

  let [relativeObj, setRelativeObj] = useState({
    relativeId: 0,
    name: "",
    relation: "",
    age: 0,
    empId: 0,
  });
  // List to store multiple relatives
  let [relativeList, setRelativeList] = useState([]);
  let [empList, setEmpList] = useState([]);
  let [isNewView, setIsNewView] = useState(false);
  let [searchTerm, setSearchTerm] = useState("");
  let [currentPage, setCurrentPage] = useState(1);
  let [itemsPerPage] = useState(5);
  let [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  useEffect(() => {
    getAllEmployee();
  }, []);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when the search term changes
  }, [searchTerm]);

  // Get all employees
  const getAllEmployee = async () => {
    try {
      const result = await axios.get("http://localhost:4500/employees");
      if (result.status === 200 && Array.isArray(result.data)) {
        setEmpList(result.data);
      } else {
        setEmpList([]); // Ensure empList is always an array
        alert("Failed to fetch employees.");
      }
    } catch (error) {
      setEmpList([]); // Set empList to an empty array on error
      alert("Error fetching employee list: " + error.message);
    }
  };

  // Update form values for Employee (individual field)
  const updateEmpFormValues = (event, key) => {
    setEmployeeObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
  };

  // Update form values for Relative (individual field)
  const updateRelativeFormValues = (event, key) => {
    setRelativeObj((relativeObj) => ({ ...relativeObj, [key]: event.target.value }));
  };

  // Add a new relative to employee
  const addRelative = () => {
    if (relativeObj.name && relativeObj.age && relativeObj.relation) {
      // Add new relative to the list
      setRelativeList([...relativeList, relativeObj]);
    // Reset relative form and clear the relative list
  setRelativeObj({ relativeId: 0, name: '', relation: '', age: '', empId: 0 });
    // setRelativeList([]);  // Clear the list of relatives if necessary

    } else {
      alert('Please fill in all the relative details');
    }
  };

  // Add a new employee
  const createEmployee = async () => {
  // First, update the state to include the relatives
  const updatedEmployeeObj = {
    ...employeeObj,
    mockEmpRelatives: [...employeeObj.mockEmpRelatives, ...relativeList],  // Spread the current relatives + new ones
  };
    console.log(updatedEmployeeObj,'updatedEmployeeObj');

    const response = await axios.post(
      "http://localhost:4500/employees",
      updatedEmployeeObj
    );
    if (response.data) {
      alert("Employee Creation Success");
      setRelativeList([]);
      getAllEmployee();
      initialData();
    } else {
      alert("Failed to create employee");
    }
  };

  // Change view
  const changeView = () => {
    setIsNewView(!isNewView);
  };

  // Update an existing employee
  const updateEmp = async () => {
    // if (employeeObj.empId === 0) {
    //   alert("Please select an employee to update");
    //   return;
    // }

    try {
      console.log(relativeList,'relativeList');
      console.log(employeeObj.mockEmpRelatives,'mockEmpRelatives');
     // Filter out relatives in relativeList that are already in mockEmpRelatives
     const uniqueRelatives = relativeList.filter(
      (newRelative) =>
        !employeeObj.mockEmpRelatives.some(
          (existingRelative) => existingRelative.name === newRelative.name // You can change this condition based on your use case
        )
    );

    // Update the employee object by adding only new relatives
    const updatedEmployeeObj = {
      ...employeeObj,
      mockEmpRelatives: [
        ...employeeObj.mockEmpRelatives,
        ...uniqueRelatives,
      ],
    };

    console.log(updatedEmployeeObj, 'updatedEmployeeObj');

      const response = await axios.put(
        `http://localhost:4500/employees/${updatedEmployeeObj.id}`,
        updatedEmployeeObj
      );
      if (response.status === 200) {
        alert("Employee Update Success");
        getAllEmployee();
        setRelativeList([]);
        initialData();
      }
    } catch (error) {
      alert("Failed to update employee: " + error.message);
    }
  };

  // Delete an employee
  const deleteEmp = async (id) => {
    const isDelete = window.confirm("Are you sure you want to delete?");
    if (isDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:4500/employees/${id}`
        );
        if (response.status === 200) {
          alert("Employee Deleted Successfully");
          getAllEmployee();
        }
      } catch (error) {
        alert("Failed to delete employee: " + error.message);
      }
    }
  };

  const getEmployeeById = async (id) => {
    try {
      const result = await axios.get(
        `http://localhost:4500/employees?id=${id}`
      );
      if (
        result.status === 200 &&
        Array.isArray(result.data) &&
        result.data.length > 0
      ) {
        setEmployeeObj(result.data[0]); // Ensure you're selecting the first item in case of array
        setRelativeList(result.data[0].mockEmpRelatives);
        changeView();
      } else {
        alert("Failed to fetch employee details. Please try again.");
      }
    } catch (error) {
      alert(
        "An error occurred while fetching employee details: " + error.message
      );
    }
  };

  const initialData = async () => {
    setEmployeeObj({
      empId: 0,
      name: "",
      contactNo: "",
      email: "",
      city: "",
      state: "",
      pinCode: "",
      designation: "",
      mockEmpRelatives: [],
    });
    setRelativeObj({
      relativeId: 0,
      name: "",
      relation: "",
      age: 0,
      empId: 0,
    });
  };

  // Search filter
  const filteredList = empList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sorting logic
  const sortedList = [...currentItems].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container-fluid">
      <div className="mt-2 p-3 bg-primary text-white rounded text-center">
        <h1>Single With Multiple Entity</h1>
        <h5>Employee With Multiple Family Relative Scenario </h5>
      </div>
      {isNewView && (
 <div className="row pt-2">
      <div className="col-12">
        <div className="card">
          <div className="card-header bg-success text-white">
            <div className="row">
              <div className="col-6">New Employee</div>
              <div className="col-6 text-end">
                <button className="btn btn-sm btn-primary" onClick={changeView}>
                  List
                </button>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-7">
                <div className="row">
                  <div className="col-6">
                    <label>
                      <b>Name</b>
                    </label>
                    <input
                      type="text"
                      value={employeeObj.name || ""}
                      onChange={(event) => updateEmpFormValues(event, "name")}
                      className="form-control"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <label>
                      <b>Contact No</b>
                    </label>
                    <input
                      type="text"
                      value={employeeObj.contactNo}
                      onChange={(event) => updateEmpFormValues(event, "contactNo")}
                      className="form-control"
                      placeholder="Enter Contact No"
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      <b>Email</b>
                    </label>
                    <input
                      type="text"
                      value={employeeObj.email}
                      onChange={(event) => updateEmpFormValues(event, "email")}
                      className="form-control"
                      placeholder="Enter Email"
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      <b>City</b>
                    </label>
                    <input
                      type="text"
                      value={employeeObj.city}
                      onChange={(event) => updateEmpFormValues(event, "city")}
                      className="form-control"
                      placeholder="Enter City"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <label>
                      <b>State</b>
                    </label>
                    <input
                      type="text"
                      value={employeeObj.state}
                      onChange={(event) => updateEmpFormValues(event, "state")}
                      className="form-control"
                      placeholder="Enter State"
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      <b>Pincode</b>
                    </label>
                    <input
                      type="text"
                      value={employeeObj.pinCode}
                      onChange={(event) => updateEmpFormValues(event, "pinCode")}
                      className="form-control"
                      placeholder="Enter Pincode"
                    />
                  </div>
                  <div className="col-4">
                    <label>
                      <b>Designation</b>
                    </label>
                    <select
                      value={employeeObj.designation}
                      className="form-control"
                      onChange={(event) => updateEmpFormValues(event, "designation")}
                    >
                      <option value="">Select</option>
                      <option value="Jr Developer">Jr Developer</option>
                      <option value="Sr Developer">Sr Developer</option>
                      <option value="Team Leader">Team Leader</option>
                    </select>
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-6 text-end">
                    <button className="btn text-white btn-sm bg-secondary" onClick={initialData}>
                      Reset
                    </button>
                  </div>
                  <div className="col-6">
                    {/* {employeeObj.empId === 0 ? (
                      <button className="btn text-white btn-sm bg-success" onClick={createEmployee}>
                        Save Employee
                      </button>
                    ) : (
                      <button className="btn text-white btn-sm bg-info" onClick={updateEmp}>
                        Update Employee
                      </button>
                    )} */}
                      <button className="btn text-white btn-sm bg-success" onClick={createEmployee}>
                        Save Employee
                      </button>
                      <button className="btn text-white btn-sm bg-info" onClick={updateEmp}>
                        Update Employee
                      </button>
                  </div>
                </div>
              </div>

              <div className="col-5">
                <h6 className="card-title">Add Family Relatives</h6>
                <div className="row">
                  <div className="col-6">
                    <label>
                      <b>Name</b>
                    </label>
                    <input
                      type="text"
                      value={relativeObj.name || ""}
                      onChange={(event) => updateRelativeFormValues(event, "name")}
                      className="form-control"
                      placeholder="Enter Relative Name"
                    />
                  </div>
                  <div className="col-6">
                    <label>
                      <b>Age</b>
                    </label>
                    <input
                      type="text"
                      value={relativeObj.age || ""}
                      onChange={(event) => updateRelativeFormValues(event, "age")}
                      className="form-control"
                      placeholder="Enter Relative Age"
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <div className="col-6">
                    <label>
                      <b>Relation</b>
                    </label>
                    <input
                      type="text"
                      value={relativeObj.relation || ""}
                      onChange={(event) => updateRelativeFormValues(event, "relation")}
                      className="form-control"
                      placeholder="Enter Relation"
                    />
                  </div>
                  <div className="col-6 pt-3">
                    <button className="btn btn-sm btn-primary" onClick={addRelative}>
                      Add Relative
                    </button>
                  </div>
                </div>

                {/* Display added relatives */}
                <div className="mt-3">
                  <h6>Family Relatives Added:</h6>
                  <ul>
                    {relativeList.map((relative, index) => (
                      <li key={index}>
                        {relative.name} ({relative.age} years) - {relative.relation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}

      {/* List View (Table of employees) */}
      {!isNewView && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-warning text-white">
                <div className="row">
                  <div className="col-6"> Employee List</div>
                  <div className="col-6 text-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={changeView}
                    >
                      Add New
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Search by name or designation"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Table for displaying employees */}
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th
                        onClick={() => requestSort("name")}
                        style={{ cursor: "pointer" }}
                      >
                        Name
                      </th>
                      <th
                        onClick={() => requestSort("contactNo")}
                        style={{ cursor: "pointer" }}
                      >
                        Contact No
                      </th>
                      <th
                        onClick={() => requestSort("email")}
                        style={{ cursor: "pointer" }}
                      >
                        Email
                      </th>
                      <th
                        onClick={() => requestSort("designation")}
                        style={{ cursor: "pointer" }}
                      >
                        Designation
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedList.map((emp) => (
                      <tr key={emp.empId}>
                        <td>{emp.name}</td>
                        <td>{emp.contactNo}</td>
                        <td>{emp.email}</td>
                        <td>{emp.designation}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => getEmployeeById(emp.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteEmp(emp.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-center">
                  {Array.from(
                    { length: Math.ceil(filteredList.length / itemsPerPage) },
                    (_, i) => (
                      <button
                        key={i}
                        className={`btn btn-sm ${
                          currentPage === i + 1 ? "btn-primary" : "btn-light"
                        }`}
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleWithMultple;
