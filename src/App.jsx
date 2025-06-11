import React, { useState, useEffect } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("add");
  const [people, setPeople] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchAadhaar, setSearchAadhaar] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [newRow, setNewRow] = useState({
    aadhaar: "",
    name: "",
    dob: "",
    mobile: "",
    age: "",
  });
  const [errors, setErrors] = useState({ aadhaar: "", mobile: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("directoryData");
    if (saved) setPeople(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("directoryData", JSON.stringify(people));
  }, [people]);

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const validateFields = (row) => {
    let errorMessages = { aadhaar: "", mobile: "" };
    let valid = true;
    if (!/^\d{12}$/.test(row.aadhaar)) {
      errorMessages.aadhaar = "Aadhaar must be 12 digits";
      valid = false;
    }
    if (!/^\d{10}$/.test(row.mobile)) {
      errorMessages.mobile = "Mobile number must be 10 digits";
      valid = false;
    }
    setErrors(errorMessages);
    return valid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedRow = { ...newRow, [name]: value };
    if (name === "dob") updatedRow.age = calculateAge(value);
    setNewRow(updatedRow);
    if (submitted) validateFields(updatedRow);
  };

  const handleAddRow = () => {
    setSubmitted(true);
    if (!validateFields(newRow)) return;

    setPeople([...people, newRow]);
    setNewRow({ aadhaar: "", name: "", dob: "", mobile: "", age: "" });
    setShowForm(false);
    setErrors({ aadhaar: "", mobile: "" });
    setSubmitted(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDelete = (index) => {
    const updated = [...people];
    updated.splice(index, 1);
    setPeople(updated);
  };

  const handleSearch = () => {
    const found = people.find((p) => p.aadhaar === searchAadhaar);
    setSearchResult(found || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center p-0">
      <div className="w-full max-w-6xl h-[90vh] bg-white rounded-lg shadow-2xl p-8 animate-fadeIn relative flex flex-col overflow-hidden">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Directory App - <span className="text-purple-600">Developed by Mohit</span>
        </h1>

        <div className="flex justify-center mb-6">
          <button
            className={`mr-4 px-6 py-2 rounded-full transition hover:scale-105 duration-200 ${activeTab === "add" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => setActiveTab("add")}
          >
            Add New Person
          </button>
          <button
            className={`px-6 py-2 rounded-full transition hover:scale-105 duration-200 ${activeTab === "view" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => setActiveTab("view")}
          >
            Retrieve Information
          </button>
        </div>

        <div className="flex-grow overflow-y-auto">
          {activeTab === "add" && (
            <>
              <div className="flex justify-end mb-2">
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
                  >
                    + Add New Entry
                  </button>
                )}
              </div>

              <div className="">
                <table className="w-full text-sm text-left border border-gray-300 rounded">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2 border">Aadhaar</th>
                      <th className="p-2 border">Name</th>
                      <th className="p-2 border">DOB</th>
                      <th className="p-2 border">Age</th>
                      <th className="p-2 border">Mobile</th>
                      <th className="p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {people.map((person, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border p-2">{person.aadhaar}</td>
                        <td className="border p-2">{person.name}</td>
                        <td className="border p-2">{person.dob}</td>
                        <td className="border p-2">{person.age}</td>
                        <td className="border p-2">{person.mobile}</td>
                        <td className="border p-2 space-x-2">
                          <button
                            onClick={() => handleDelete(index)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}

                    {showForm && (
                      <tr className="bg-gray-50">
                        <td className="border p-2 relative">
                          <input
                            name="aadhaar"
                            value={newRow.aadhaar}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                          {submitted && errors.aadhaar && (
                            <div className="absolute text-xs bg-red-600 text-white px-2 py-1 rounded shadow top-[110%] left-0 z-10">
                              {errors.aadhaar}
                            </div>
                          )}
                        </td>
                        <td className="border p-2">
                          <input
                            name="name"
                            value={newRow.name}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="date"
                            name="dob"
                            value={newRow.dob}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            readOnly
                            value={newRow.age}
                            className="border p-1 w-full bg-gray-100"
                          />
                        </td>
                        <td className="border p-2 relative">
                          <input
                            name="mobile"
                            value={newRow.mobile}
                            onChange={handleInputChange}
                            className="border p-1 w-full"
                          />
                          {submitted && errors.mobile && (
                            <div className="absolute text-xs bg-red-600 text-white px-2 py-1 rounded shadow top-[110%] left-0 z-10">
                              {errors.mobile}
                            </div>
                          )}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={handleAddRow}
                            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "view" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Enter Aadhaar No"
                  value={searchAadhaar}
                  onChange={(e) => setSearchAadhaar(e.target.value)}
                  className="border p-2 rounded w-full max-w-sm"
                />
                <button
                  onClick={handleSearch}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Search
                </button>
              </div>

              {searchResult ? (
                <div className="bg-gray-100 p-4 rounded border border-gray-300 text-sm text-gray-800 w-full max-w-lg">
                  {Object.entries(searchResult).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-1 border-b last:border-none">
                      <span className="font-medium capitalize">{key}</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No data found. Enter Aadhaar to search.</p>
              )}
            </div>
          )}
        </div>

        {showToast && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded shadow-lg text-sm w-full max-w-xs z-50">
            <div>Data added successfully!</div>
            <div className="w-full h-1 bg-green-300 mt-2 overflow-hidden rounded">
              <div className="h-1 bg-white animate-[growLinear_3s_linear_forwards]"></div>
            </div>
          </div>
        )}

        <style>
          {`@keyframes growLinear {
            from { width: 0%; }
            to { width: 100%; }
          }`}
        </style>
      </div>
    </div>
  );
}
