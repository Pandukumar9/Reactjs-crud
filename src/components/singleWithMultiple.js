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
    id: 0,
    relativeId: 0,
    name: "",
    relation: "",
    age: 0,
    empId: 0,
  });

  let [empList, setEmpList] = useState([]);
  let [isNewView, setIsNewView] = useState(false);

  useEffect(() => {
    getAllEmployee();
  }, []);

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

  // Update form values for Employee (indivdual each field)
  const updateEmpFormValues = (event, key) => {
    setEmployeeObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
  };

  // Update form values for Relative (indivdual each field)
  const updateRelativeFormValues = (event, key) => {
    setRelativeObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
  };

  // Add a new relative to employee
  const addRelative = () => {
    setEmployeeObj((prevObj) => ({
      ...prevObj,
      mockEmpRelatives: [...prevObj.mockEmpRelatives, relativeObj],
    }));
  };

  // Add a new employee
  const createEmployee = async () => {
    const response = await axios.post(
      "http://localhost:4500/employees",
      employeeObj
    );
    if (response.data) {
      alert("Employee Creation Success");
      getAllEmployee();
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
        id: 0,
        relativeId: 0,
        name: "",
        relation: "",
        age: 0,
        empId: 0,
      });
    } else {
      // alert(response.data);
      alert("Failed to create employee");
    }
  };

  // Change view
  const changeView = () => {
    setIsNewView(!isNewView);
  };

  // Update an existing employee
  const updateEmp = async () => {
    if (employeeObj.id === 0) {
      // Corrected this to `empId`
      alert("Please select an employee to update");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4500/employees/${employeeObj.id}`,
        employeeObj
      );
      if (response.status === 200) {
        alert("Employee Update Success");
        getAllEmployee();
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
            id: 0,
            relativeId: 0,
            name: "",
            relation: "",
            age: 0,
            empId: 0,
          });
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

  return (
    <div className="container-fluid">
      <div className="mt-2 p-3 bg-primary text-white rounded text-center">
        <h1>Single With Multiple Entity</h1>
        <h5>Employee With Multple Family Relative Scenario </h5>
      </div>
      {isNewView && (
        <div className="row pt-2">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-success text-white">
                <div className="row">
                  <div className="col-6"> New Employee</div>
                  <div className="col-6 text-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={changeView}
                    >
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
                          onChange={(event) => {
                            updateEmpFormValues(event, "name");
                          }}
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
                          onChange={(event) => {
                            updateEmpFormValues(event, "contactNo");
                          }}
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
                          onChange={(event) => {
                            updateEmpFormValues(event, "email");
                          }}
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
                          onChange={(event) => {
                            updateEmpFormValues(event, "city");
                          }}
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
                          onChange={(event) => {
                            updateEmpFormValues(event, "state");
                          }}
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
                          onChange={(event) => {
                            updateEmpFormValues(event, "pinCode");
                          }}
                          className="form-control"
                          placeholder="Enter Pincode"
                        />
                      </div>
                      <div className="col-4">
                        <label>
                          <b>Dasignation</b>
                        </label>
                        <select
                          value={employeeObj.designation}
                          className="form-control"
                          onChange={(event) => {
                            updateEmpFormValues(event, "designation");
                          }}
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
                        <button className="btn text-white btn-sm bg-secondary">
                          Reset
                        </button>
                      </div>
                      <div className="col-6">
                        {/* Create Button - Show only if `id` is 0 */}
                        {employeeObj.empId === 0  && (
                          <button
                            className="btn text-white btn-sm bg-success"
                            onClick={createEmployee}
                          >
                            Save Employee
                          </button>
                        )}
                        {employeeObj.id !== 0 && (
                          <button
                            className="btn btn-sm bg-secondary"
                            onClick={updateEmp}
                          >
                            Update Employee
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-5">
                    <div className="row">
                      <div className="col-4">
                        <label>
                          <b>Name</b>
                        </label>
                        <input
                          type="text"
                          onChange={(event) => {
                            updateRelativeFormValues(event, "name");
                          }}
                          placeholder="Relative Name"
                          className="form-control"
                        />
                      </div>
                      <div className="col-3">
                        <label>
                          <b>Relation</b>
                        </label>
                        <select
                          className="form-control"
                          onChange={(event) => {
                            updateRelativeFormValues(event, "relation");
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Mother">Mother</option>
                          <option value="Father">Father</option>
                          <option value="Sister">Sister</option>
                          <option value="Brother">Brother</option>
                        </select>
                      </div>
                      <div className="col-3">
                        <label>
                          <b>Age</b>
                        </label>
                        <input
                          type="text"
                          placeholder="Age"
                          onChange={(event) => {
                            updateRelativeFormValues(event, "age");
                          }}
                          className="form-control"
                        />
                      </div>
                      <div className="col-1 mt-4 text-end">
                        <button
                          className="btn btn-sm bg-primary"
                          onClick={addRelative}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="row mt-2">
                      <div className="col-12">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Sr</th>
                              <th>Name</th>
                              <th>Relation</th>
                              <th>Age</th>
                              <th className="text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                          {
                            employeeObj.mockEmpRelatives.map((item, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{item.name}</td>
                                  <td>{item.relation}</td>
                                  <td>{item.age}</td>
                                  <td className="text-center">
                                    <button className="btn btn-sm btn-danger">
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                        }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!isNewView && (
        <div className="row pt-2">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-success">
                <div className="row">
                  <div className="col-6"> Employee List</div>
                  <div className="col-6 text-end">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={changeView}
                    >
                      New Employee
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Sr</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>City</th>
                      <th>Designation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empList.map((item, index) => {
                      return (
                        <tr>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.contactNo}</td>
                          <td>{item.city}</td>
                          <td>{item.designation}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                getEmployeeById(item.id);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger mx-2"
                              onClick={() => {
                                deleteEmp(item.id);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleWithMultple;
