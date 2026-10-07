import { useEffect, useState } from "react";
import "./Doctor.css";
import { supabase } from "../../lib/supabase";

function MedicalRecordsPage() {
  const [records, setRecords] = useState([
    {
      id: 1,
      patient: "Priya Sharma",
      date: "2026-10-06",
      diagnosis: "General Health Checkup",
      treatment: "Regular exercise and healthy diet",
      doctor: "Dr. bhumi90h",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      date: "2026-10-05",
      diagnosis: "Fitness Assessment",
      treatment: "Workout modification recommended",
      doctor: "Dr. bhumi90h",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [form, setForm] = useState({
    patient: "",
    date: "",
    diagnosis: "",
    treatment: "",
    doctor: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAdd = () => {
    setEditingRecord(null);

    setForm({
      patient: "",
      date: "",
      diagnosis: "",
      treatment: "",
      doctor: "",
      status: "Active",
    });

    setShowForm(true);
  };

  const openEdit = (record) => {
    setEditingRecord(record);

    setForm({
      patient: record.patient,
      date: record.date,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      doctor: record.doctor,
      status: record.status,
    });

    setShowForm(true);
  };

  const saveRecord = (e) => {
    e.preventDefault();

    if (
      !form.patient ||
      !form.date ||
      !form.diagnosis ||
      !form.treatment ||
      !form.doctor
    ) {
      alert("Please fill all medical record details.");
      return;
    }

    if (editingRecord) {
      setRecords((previous) =>
        previous.map((record) =>
          record.id === editingRecord.id
            ? {
                ...record,
                ...form,
              }
            : record
        )
      );
    } else {
      setRecords((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setShowForm(false);
    setEditingRecord(null);
  };

  const deleteRecord = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmDelete) return;

    setRecords((previous) =>
      previous.filter((record) => record.id !== id)
    );
  };

  return (
    <section className="doctor-card">

      <div className="doctor-card-header">
        <div>
          <h2>Medical Records</h2>
          <p>
            Manage patient medical history and records
          </p>
        </div>

        <button
          className="doctor-primary-btn"
          onClick={openAdd}
        >
          + Add Medical Record
        </button>
      </div>

      {showForm && (
        <div className="doctor-patient-form">

          <div className="doctor-form-title">
            <h3>
              {editingRecord
                ? "Edit Medical Record"
                : "Add Medical Record"}
            </h3>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>

          <form onSubmit={saveRecord}>

            <div className="doctor-form-grid">

              <div>
                <label>Patient Name</label>

                <input
                  type="text"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label>Doctor</label>

                <input
                  type="text"
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  placeholder="Enter doctor name"
                />
              </div>

              <div>
                <label>Record Date</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Diagnosis</label>

                <input
                  type="text"
                  name="diagnosis"
                  value={form.diagnosis}
                  onChange={handleChange}
                  placeholder="Enter diagnosis"
                />
              </div>

              <div>
                <label>Treatment</label>

                <input
                  type="text"
                  name="treatment"
                  value={form.treatment}
                  onChange={handleChange}
                  placeholder="Enter treatment"
                />
              </div>

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

            </div>

            <div className="doctor-form-buttons">

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit">
                {editingRecord
                  ? "Update Record"
                  : "Save Record"}
              </button>

            </div>

          </form>
        </div>
      )}

      <div className="doctor-patient-table">

        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Doctor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {records.map((record) => (
              <tr key={record.id}>

                <td>
                  <strong>{record.patient}</strong>
                </td>

                <td>{record.date}</td>

                <td>{record.diagnosis}</td>

                <td>{record.treatment}</td>

                <td>{record.doctor}</td>

                <td>
                  <span
                    className={
                      record.status === "Active"
                        ? "doctor-status active"
                        : "doctor-status inactive"
                    }
                  >
                    {record.status}
                  </span>
                </td>

                <td>
                  <div className="doctor-table-actions">

                    <button
                      onClick={() =>
                        openEdit(record)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteRecord(record.id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

function MedicalReportsPage() {
  const [reports, setReports] = useState([
    {
      id: 1,
      patient: "Priya Sharma",
      reportDate: "2026-10-06",
      reportType: "Blood Test",
      findings: "All blood parameters are within normal range.",
      doctor: "Dr. Bhumi",
      status: "Completed",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      reportDate: "2026-10-05",
      reportType: "Fitness Health Report",
      findings: "Good fitness level. Regular exercise recommended.",
      doctor: "Dr. Bhumi",
      status: "Completed",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const [reportForm, setReportForm] = useState({
    patient: "",
    reportDate: "",
    reportType: "",
    findings: "",
    doctor: "",
    status: "Completed",
  });

  const handleChange = (e) => {
    setReportForm({
      ...reportForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddReport = () => {
    setEditingReport(null);

    setReportForm({
      patient: "",
      reportDate: "",
      reportType: "",
      findings: "",
      doctor: "",
      status: "Completed",
    });

    setShowForm(true);
  };

  const handleEditReport = (report) => {
    setEditingReport(report);

    setReportForm({
      patient: report.patient,
      reportDate: report.reportDate,
      reportType: report.reportType,
      findings: report.findings,
      doctor: report.doctor,
      status: report.status,
    });

    setShowForm(true);
  };

  const handleDeleteReport = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this medical report?"
    );

    if (!confirmDelete) return;

    setReports(reports.filter((report) => report.id !== id));
  };

  const handleSaveReport = (e) => {
    e.preventDefault();

    if (
      !reportForm.patient ||
      !reportForm.reportDate ||
      !reportForm.reportType ||
      !reportForm.findings ||
      !reportForm.doctor
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingReport) {
      setReports(
        reports.map((report) =>
          report.id === editingReport.id
            ? {
                ...report,
                ...reportForm,
              }
            : report
        )
      );

      alert("Medical report updated successfully.");
    } else {
      const newReport = {
        id: Date.now(),
        ...reportForm,
      };

      setReports([newReport, ...reports]);

      alert("Medical report added successfully.");
    }

    setShowForm(false);
    setEditingReport(null);
  };

  return (
    <div className="doctor-content">

      <div className="doctor-card">

        <div className="doctor-card-header">
          <div>
            <h2>Medical Reports</h2>
            <p>Manage patient medical reports and health findings</p>
          </div>

          <button
            className="doctor-primary-btn"
            onClick={handleAddReport}
          >
            + Add Medical Report
          </button>
        </div>

        {showForm && (
          <form
            className="doctor-patient-form"
            onSubmit={handleSaveReport}
          >
            <h3 className="doctor-form-title">
              {editingReport
                ? "Edit Medical Report"
                : "Add Medical Report"}
            </h3>

            <div className="doctor-form-grid">

              <input
                type="text"
                name="patient"
                placeholder="Patient Name"
                value={reportForm.patient}
                onChange={handleChange}
              />

              <input
                type="date"
                name="reportDate"
                value={reportForm.reportDate}
                onChange={handleChange}
              />

              <input
                type="text"
                name="reportType"
                placeholder="Report Type"
                value={reportForm.reportType}
                onChange={handleChange}
              />

              <input
                type="text"
                name="doctor"
                placeholder="Doctor Name"
                value={reportForm.doctor}
                onChange={handleChange}
              />

              <select
                name="status"
                value={reportForm.status}
                onChange={handleChange}
              >
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
              </select>

              <textarea
                name="findings"
                placeholder="Medical Findings / Report Details"
                value={reportForm.findings}
                onChange={handleChange}
                rows="4"
              />

            </div>

            <div className="doctor-form-buttons">

              <button
                type="submit"
                className="doctor-primary-btn"
              >
                {editingReport ? "Update Report" : "Save Report"}
              </button>

              <button
                type="button"
                className="doctor-secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingReport(null);
                }}
              >
                Cancel
              </button>

            </div>
          </form>
        )}

        <div className="doctor-table-wrapper">

          <table className="doctor-patient-table">

            <thead>
              <tr>
                <th>Patient</th>
                <th>Date</th>
                <th>Report Type</th>
                <th>Findings</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {reports.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No medical reports found.
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id}>

                    <td>
                      <strong>{report.patient}</strong>
                    </td>

                    <td>{report.reportDate}</td>

                    <td>{report.reportType}</td>

                    <td>{report.findings}</td>

                    <td>{report.doctor}</td>

                    <td>
                      <span className="doctor-status">
                        {report.status}
                      </span>
                    </td>

                    <td>
                      <div className="doctor-table-actions">

                        <button
                          onClick={() =>
                            handleEditReport(report)
                          }
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteReport(report.id)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 1,
      patient: "Priya Sharma",
      medicine: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once Daily",
      duration: "30 Days",
      instructions: "Take after breakfast",
      doctor: "Dr. Bhumi",
      status: "Active",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      medicine: "Protein Supplement",
      dosage: "1 Scoop",
      frequency: "Once Daily",
      duration: "60 Days",
      instructions: "Take after workout",
      doctor: "Dr. Bhumi",
      status: "Active",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    patient: "",
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    doctor: "",
    status: "Active",
  });

  const resetForm = () => {
    setForm({
      patient: "",
      medicine: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      doctor: "",
      status: "Active",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.patient ||
      !form.medicine ||
      !form.dosage ||
      !form.frequency ||
      !form.duration ||
      !form.doctor
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId) {
      setPrescriptions(
        prescriptions.map((prescription) =>
          prescription.id === editingId
            ? { ...prescription, ...form }
            : prescription
        )
      );
    } else {
      const newPrescription = {
        id: Date.now(),
        ...form,
      };

      setPrescriptions([
        ...prescriptions,
        newPrescription,
      ]);
    }

    resetForm();
  };

  const handleEdit = (prescription) => {
    setForm({
      patient: prescription.patient,
      medicine: prescription.medicine,
      dosage: prescription.dosage,
      frequency: prescription.frequency,
      duration: prescription.duration,
      instructions: prescription.instructions,
      doctor: prescription.doctor,
      status: prescription.status,
    });

    setEditingId(prescription.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      setPrescriptions(
        prescriptions.filter(
          (prescription) => prescription.id !== id
        )
      );
    }
  };

  return (
    <div className="doctor-page">

      {/* HEADER */}
      <div className="doctor-card-header">
        <div>
          <h2>Prescriptions</h2>
          <p>Manage patient prescriptions and medications.</p>
        </div>

        <button
          className="doctor-primary-btn"
          onClick={() => {
            setEditingId(null);
            setForm({
              patient: "",
              medicine: "",
              dosage: "",
              frequency: "",
              duration: "",
              instructions: "",
              doctor: "",
              status: "Active",
            });
            setShowForm(true);
          }}
        >
          + Add Prescription
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="doctor-card doctor-patient-form">

          <h3 className="doctor-form-title">
            {editingId
              ? "Edit Prescription"
              : "Add Prescription"}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="doctor-form-grid">

              <div>
                <label>Patient *</label>
                <input
                  type="text"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label>Medicine *</label>
                <input
                  type="text"
                  name="medicine"
                  value={form.medicine}
                  onChange={handleChange}
                  placeholder="Enter medicine name"
                />
              </div>

              <div>
                <label>Dosage *</label>
                <input
                  type="text"
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  placeholder="Example: 500 mg"
                />
              </div>

              <div>
                <label>Frequency *</label>
                <select
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                >
                  <option value="">Select frequency</option>
                  <option value="Once Daily">
                    Once Daily
                  </option>
                  <option value="Twice Daily">
                    Twice Daily
                  </option>
                  <option value="Three Times Daily">
                    Three Times Daily
                  </option>
                  <option value="Before Meal">
                    Before Meal
                  </option>
                  <option value="After Meal">
                    After Meal
                  </option>
                  <option value="As Needed">
                    As Needed
                  </option>
                </select>
              </div>

              <div>
                <label>Duration *</label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Example: 30 Days"
                />
              </div>

              <div>
                <label>Doctor *</label>
                <input
                  type="text"
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  placeholder="Enter doctor name"
                />
              </div>

              <div>
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="doctor-full-width">
                <label>Instructions</label>
                <textarea
                  name="instructions"
                  value={form.instructions}
                  onChange={handleChange}
                  placeholder="Enter medicine instructions"
                  rows="3"
                />
              </div>

            </div>

            <div className="doctor-form-buttons">

              <button
                type="submit"
                className="doctor-primary-btn"
              >
                {editingId
                  ? "Update Prescription"
                  : "Save Prescription"}
              </button>

              <button
                type="button"
                className="doctor-secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="doctor-card">

        <div className="doctor-card-header">
          <div>
            <h3>Prescription List</h3>
            <p>
              Total prescriptions: {prescriptions.length}
            </p>
          </div>
        </div>

        <div className="doctor-table-wrapper">

          <table className="doctor-patient-table">

            <thead>
              <tr>
                <th>Patient</th>
                <th>Medicine</th>
                <th>Dosage</th>
                <th>Frequency</th>
                <th>Duration</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>

                  <td>
                    <strong>
                      {prescription.patient}
                    </strong>
                  </td>

                  <td>
                    {prescription.medicine}
                  </td>

                  <td>
                    {prescription.dosage}
                  </td>

                  <td>
                    {prescription.frequency}
                  </td>

                  <td>
                    {prescription.duration}
                  </td>

                  <td>
                    {prescription.doctor}
                  </td>

                  <td>
                    <span className="doctor-status">
                      {prescription.status}
                    </span>
                  </td>

                  <td>

                    <div className="doctor-table-actions">

                      <button
                        onClick={() =>
                          handleEdit(prescription)
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(prescription.id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("IST");

  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleChangePassword = async () => {
    const newPassword = window.prompt(
      "Enter your new password:"
    );

    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert(error.message);
      return;
    }

    showMessage("Password changed successfully.");
  };

  const handleDarkMode = (value) => {
    setDarkMode(value);

    if (value) {
      document.body.classList.add("doctor-dark-mode");
    } else {
      document.body.classList.remove("doctor-dark-mode");
    }

    showMessage(
      value
        ? "Dark mode enabled."
        : "Dark mode disabled."
    );
  };

  return (
    <div className="doctor-page">

      <div className="doctor-card-header">
        <div>
          <h2>Settings</h2>
          <p>
            Manage your account and application preferences.
          </p>
        </div>
      </div>

      {message && (
        <div className="doctor-settings-message">
          {message}
        </div>
      )}

      {/* ACCOUNT */}

      <div className="doctor-settings-section">
        <h3>Account</h3>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              👤
            </div>

            <div>
              <h4>Profile</h4>
              <p>
                View your doctor profile information.
              </p>
            </div>
          </div>

          <span className="doctor-setting-arrow">
            ›
          </span>
        </div>

        <div
          className="doctor-setting-card doctor-setting-clickable"
          onClick={handleChangePassword}
        >
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              🔐
            </div>

            <div>
              <h4>Change Password</h4>
              <p>
                Change your account password.
              </p>
            </div>
          </div>

          <span className="doctor-setting-arrow">
            ›
          </span>
        </div>
      </div>

      {/* PREFERENCES */}

      <div className="doctor-settings-section">
        <h3>Preferences</h3>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              🔔
            </div>

            <div>
              <h4>Email Notifications</h4>
              <p>
                Receive important updates by email.
              </p>
            </div>
          </div>

          <label className="doctor-setting-toggle">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => {
                setEmailNotifications(e.target.checked);

                showMessage(
                  e.target.checked
                    ? "Email notifications enabled."
                    : "Email notifications disabled."
                );
              }}
            />

            <span></span>
          </label>
        </div>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              📅
            </div>

            <div>
              <h4>Appointment Reminders</h4>
              <p>
                Receive reminders for upcoming appointments.
              </p>
            </div>
          </div>

          <label className="doctor-setting-toggle">
            <input
              type="checkbox"
              checked={appointmentReminders}
              onChange={(e) => {
                setAppointmentReminders(e.target.checked);

                showMessage(
                  e.target.checked
                    ? "Appointment reminders enabled."
                    : "Appointment reminders disabled."
                );
              }}
            />

            <span></span>
          </label>
        </div>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              🌙
            </div>

            <div>
              <h4>Dark Mode</h4>
              <p>
                Use the dark interface for the dashboard.
              </p>
            </div>
          </div>

          <label className="doctor-setting-toggle">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) =>
                handleDarkMode(e.target.checked)
              }
            />

            <span></span>
          </label>
        </div>
      </div>

      {/* SECURITY */}

      <div className="doctor-settings-section">
        <h3>Security</h3>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              🛡️
            </div>

            <div>
              <h4>Two-Factor Authentication</h4>
              <p>
                Add an extra layer of account security.
              </p>
            </div>
          </div>

          <label className="doctor-setting-toggle">
            <input
              type="checkbox"
              checked={twoFactor}
              onChange={(e) => {
                setTwoFactor(e.target.checked);

                showMessage(
                  e.target.checked
                    ? "Two-factor authentication enabled."
                    : "Two-factor authentication disabled."
                );
              }}
            />

            <span></span>
          </label>
        </div>
      </div>

      {/* APPLICATION */}

      <div className="doctor-settings-section">
        <h3>Application</h3>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              🌐
            </div>

            <div>
              <h4>Language</h4>
              <p>
                Select your preferred language.
              </p>
            </div>
          </div>

          <select
            className="doctor-setting-select"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);

              showMessage(
                `Language changed to ${e.target.value}.`
              );
            }}
          >
            <option value="English">English</option>
            <option value="Kannada">Kannada</option>
            <option value="Hindi">Hindi</option>
          </select>
        </div>

        <div className="doctor-setting-card">
          <div className="doctor-setting-left">
            <div className="doctor-setting-icon">
              🕐
            </div>

            <div>
              <h4>Time Zone</h4>
              <p>
                Select your preferred time zone.
              </p>
            </div>
          </div>

          <select
            className="doctor-setting-select"
            value={timeZone}
            onChange={(e) => {
              setTimeZone(e.target.value);

              showMessage(
                `Time zone changed to ${e.target.value}.`
              );
            }}
          >
            <option value="IST">IST</option>
            <option value="UTC">UTC</option>
            <option value="GMT">GMT</option>
          </select>
        </div>
      </div>

    </div>
  );
}

function Doctor() {
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active sidebar page
  const [activePage, setActivePage] = useState("Dashboard");

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: "Priya Sharma",
      doctor: "Dr. bhumi90h",
      date: "2026-10-07",
      time: "10:00 AM",
      reason: "General Checkup",
      status: "Scheduled",
    },
    {
      id: 2,
      patient: "Rahul Kumar",
      doctor: "Dr. bhumi90h",
      date: "2026-10-08",
      time: "11:30 AM",
      reason: "Fitness Medical Check",
      status: "Scheduled",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState(null);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    date: "",
    time: "",
    reason: "",
    status: "Scheduled",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAdd = () => {
    setEditingAppointment(null);

    setForm({
      patient: "",
      doctor: "",
      date: "",
      time: "",
      reason: "",
      status: "Scheduled",
    });

    setShowForm(true);
  };

  const openEdit = (appointment) => {
    setEditingAppointment(appointment);

    setForm({
      patient: appointment.patient,
      doctor: appointment.doctor,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status,
    });

    setShowForm(true);
  };

  const saveAppointment = (e) => {
    e.preventDefault();

    if (
      !form.patient ||
      !form.doctor ||
      !form.date ||
      !form.time ||
      !form.reason
    ) {
      alert("Please fill all appointment details.");
      return;
    }

    if (editingAppointment) {
      setAppointments((previous) =>
        previous.map((appointment) =>
          appointment.id === editingAppointment.id
            ? {
                ...appointment,
                ...form,
              }
            : appointment
        )
      );
    } else {
      setAppointments((previous) => [
        ...previous,
        {
          id: Date.now(),
          ...form,
        },
      ]);
    }

    setShowForm(false);
    setEditingAppointment(null);
  };

  const deleteAppointment = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) return;

    setAppointments((previous) =>
      previous.filter(
        (appointment) => appointment.id !== id
      )
    );
  };

  return (
    <section className="doctor-card">

      <div className="doctor-card-header">

        <div>
          <h2>Appointments</h2>

          <p>
            Manage patient appointments and schedules
          </p>
        </div>

        <button
          className="doctor-primary-btn"
          onClick={openAdd}
        >
          + New Appointment
        </button>

      </div>

      {/* FORM */}

      {showForm && (
        <div className="doctor-patient-form">

          <div className="doctor-form-title">

            <h3>
              {editingAppointment
                ? "Edit Appointment"
                : "New Appointment"}
            </h3>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>

          </div>

          <form onSubmit={saveAppointment}>

            <div className="doctor-form-grid">

              <div>
                <label>Patient Name</label>

                <input
                  type="text"
                  name="patient"
                  value={form.patient}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label>Doctor</label>

                <input
                  type="text"
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  placeholder="Enter doctor name"
                />
              </div>

              <div>
                <label>Date</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Time</label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Reason</label>

                <input
                  type="text"
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Reason for appointment"
                />
              </div>

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Scheduled">
                    Scheduled
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

            </div>

            <div className="doctor-form-buttons">

              <button
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit">
                {editingAppointment
                  ? "Update Appointment"
                  : "Save Appointment"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* TABLE */}

      <div className="doctor-patient-table">

        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {appointments.map((appointment) => (
              <tr key={appointment.id}>

                <td>
                  <strong>
                    {appointment.patient}
                  </strong>
                </td>

                <td>
                  {appointment.doctor}
                </td>

                <td>
                  {appointment.date}
                </td>

                <td>
                  {appointment.time}
                </td>

                <td>
                  {appointment.reason}
                </td>

                <td>
                  <span
                    className={
                      appointment.status === "Scheduled"
                        ? "doctor-status active"
                        : appointment.status ===
                          "Completed"
                        ? "doctor-status active"
                        : "doctor-status inactive"
                    }
                  >
                    {appointment.status}
                  </span>
                </td>

                <td>

                  <div className="doctor-table-actions">

                    <button
                      onClick={() =>
                        openEdit(appointment)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteAppointment(
                          appointment.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

  // Demo patient data
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@gmail.com",
      phone: "9876543210",
      age: 28,
      gender: "Female",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      phone: "9988776655",
      age: 32,
      gender: "Male",
      status: "Active",
    },
    {
      id: 3,
      name: "Anjali Singh",
      email: "anjali@gmail.com",
      phone: "9123456789",
      age: 25,
      gender: "Female",
      status: "Inactive",
    },
  ]);

  const [showPatientForm, setShowPatientForm] =
    useState(false);

  const [editingPatient, setEditingPatient] =
    useState(null);

  const [patientForm, setPatientForm] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    status: "Active",
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        window.location.href = "/login";
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(
          "Doctor profile error:",
          profileError
        );
        return;
      }

      if (
        profile.role !== "Doctor" &&
        profile.role !== "Admin"
      ) {
        alert(
          "You do not have permission to access the Doctor dashboard."
        );

        window.location.href = "/login";
        return;
      }

      setDoctorProfile(profile);
    } catch (error) {
      console.error("Doctor error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("currentUser");

    window.location.href = "/login";
  };

  // ==========================================
  // PATIENT FORM
  // ==========================================

  const handlePatientInput = (e) => {
    const { name, value } = e.target;

    setPatientForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddPatient = () => {
    setEditingPatient(null);

    setPatientForm({
      name: "",
      email: "",
      phone: "",
      age: "",
      gender: "",
      status: "Active",
    });

    setShowPatientForm(true);
  };

  const openEditPatient = (patient) => {
    setEditingPatient(patient);

    setPatientForm({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: patient.age,
      gender: patient.gender,
      status: patient.status,
    });

    setShowPatientForm(true);
  };

  const savePatient = (e) => {
    e.preventDefault();

    if (
      !patientForm.name ||
      !patientForm.email ||
      !patientForm.phone
    ) {
      alert("Please fill Name, Email and Phone.");
      return;
    }

    if (editingPatient) {
      setPatients((previous) =>
        previous.map((patient) =>
          patient.id === editingPatient.id
            ? {
                ...patient,
                ...patientForm,
              }
            : patient
        )
      );
    } else {
      const newPatient = {
        id: Date.now(),
        ...patientForm,
      };

      setPatients((previous) => [
        ...previous,
        newPatient,
      ]);
    }

    setShowPatientForm(false);
    setEditingPatient(null);
  };

  const deletePatient = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    setPatients((previous) =>
      previous.filter(
        (patient) => patient.id !== id
      )
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="doctor-loading">
        Loading Doctor Dashboard...
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  const dashboardContent = (
    <>
      {/* WELCOME */}
      <section className="doctor-welcome">
        <div>
          <h1>
            Welcome back,{" "}
            <span>
              {doctorProfile?.name || "Doctor"}
            </span>{" "}
            👋
          </h1>

          <p>
            Manage your patients, appointments and
            medical information from one place.
          </p>
        </div>

        <div className="doctor-welcome-icon">
          🩺
        </div>
      </section>

      {/* STAT CARDS */}
      <section className="doctor-stats">

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon">
            👥
          </div>

          <div>
            <span>Total Patients</span>
            <h2>{patients.length}</h2>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon">
            📅
          </div>

          <div>
            <span>Appointments</span>
            <h2>0</h2>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon">
            📋
          </div>

          <div>
            <span>Medical Records</span>
            <h2>0</h2>
          </div>
        </div>

        <div className="doctor-stat-card">
          <div className="doctor-stat-icon">
            🔔
          </div>

          <div>
            <span>Notifications</span>
            <h2>0</h2>
          </div>
        </div>

      </section>

      {/* PROFILE */}
      <section className="doctor-card">

        <div className="doctor-card-header">
          <div>
            <h2>Doctor Profile</h2>
            <p>
              Your registered account information
            </p>
          </div>
        </div>

        <div className="doctor-profile-grid">

          <div className="doctor-info-box">
            <label>Name</label>

            <strong>
              {doctorProfile?.name ||
                "Not available"}
            </strong>
          </div>

          <div className="doctor-info-box">
            <label>Email</label>

            <strong>
              {doctorProfile?.email ||
                "Not available"}
            </strong>
          </div>

          <div className="doctor-info-box">
            <label>Phone</label>

            <strong>
              {doctorProfile?.phone ||
                "Not provided"}
            </strong>
          </div>

          <div className="doctor-info-box">
            <label>Role</label>

            <strong>
              {doctorProfile?.role ||
                "Doctor"}
            </strong>
          </div>

        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="doctor-card">

        <div className="doctor-card-header">
          <div>
            <h2>Quick Actions</h2>
            <p>
              Common doctor activities
            </p>
          </div>
        </div>

        <div className="doctor-actions">

          <button
            onClick={() =>
              setActivePage("Patients")
            }
          >
            👥
            <span>View Patients</span>
          </button>

          <button
            onClick={() =>
              setActivePage("Appointments")
            }
          >
            📅
            <span>Appointments</span>
          </button>

          <button
            onClick={() =>
              setActivePage("Medical Records")
            }
          >
            📋
            <span>Medical Records</span>
          </button>

          <button
            onClick={() =>
              setActivePage("Prescriptions")
            }
          >
            💊
            <span>Prescriptions</span>
          </button>

        </div>

      </section>
    </>
  );

  // ==========================================
  // PATIENTS PAGE
  // ==========================================

  const patientsContent = (
    <section className="doctor-card">

      <div className="doctor-card-header">

        <div>
          <h2>Patients</h2>

          <p>
            Manage your patients and their information
          </p>
        </div>

        <button
          className="doctor-primary-btn"
          onClick={openAddPatient}
        >
          + Add Patient
        </button>

      </div>

      {/* ADD / EDIT FORM */}

      {showPatientForm && (
        <div className="doctor-patient-form">

          <div className="doctor-form-title">

            <h3>
              {editingPatient
                ? "Edit Patient"
                : "Add New Patient"}
            </h3>

            <button
              type="button"
              onClick={() =>
                setShowPatientForm(false)
              }
            >
              ✕
            </button>

          </div>

          <form onSubmit={savePatient}>

            <div className="doctor-form-grid">

              <div>
                <label>Patient Name</label>

                <input
                  type="text"
                  name="name"
                  value={patientForm.name}
                  onChange={handlePatientInput}
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={patientForm.email}
                  onChange={handlePatientInput}
                  placeholder="Enter email"
                />
              </div>

              <div>
                <label>Phone</label>

                <input
                  type="text"
                  name="phone"
                  value={patientForm.phone}
                  onChange={handlePatientInput}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label>Age</label>

                <input
                  type="number"
                  name="age"
                  value={patientForm.age}
                  onChange={handlePatientInput}
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label>Gender</label>

                <select
                  name="gender"
                  value={patientForm.gender}
                  onChange={handlePatientInput}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={patientForm.status}
                  onChange={handlePatientInput}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

            </div>

            <div className="doctor-form-buttons">

              <button
                type="button"
                onClick={() =>
                  setShowPatientForm(false)
                }
              >
                Cancel
              </button>

              <button type="submit">
                {editingPatient
                  ? "Update Patient"
                  : "Save Patient"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* PATIENT TABLE */}

      <div className="doctor-patient-table">

        <table>

          <thead>
            <tr>
              <th>Patient</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {patients.map((patient) => (
              <tr key={patient.id}>

                <td>
                  <strong>
                    {patient.name}
                  </strong>
                </td>

                <td>
                  {patient.email}
                </td>

                <td>
                  {patient.phone}
                </td>

                <td>
                  {patient.age || "-"}
                </td>

                <td>
                  {patient.gender || "-"}
                </td>

                <td>
                  <span
                    className={
                      patient.status === "Active"
                        ? "doctor-status active"
                        : "doctor-status inactive"
                    }
                  >
                    {patient.status}
                  </span>
                </td>

                <td>

                  <div className="doctor-table-actions">

                    <button
                      onClick={() =>
                        openEditPatient(patient)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deletePatient(patient.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </section>
  );

  // ==========================================
  // OTHER PAGES - TEMPORARILY
  // ==========================================

  const simplePage = (title, icon, text) => (
    <section className="doctor-card">

      <div className="doctor-card-header">

        <div>
          <h2>
            {icon} {title}
          </h2>

          <p>{text}</p>
        </div>

      </div>

      <div
        style={{
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "55px",
            marginBottom: "15px",
          }}
        >
          {icon}
        </div>

        <h2>{title}</h2>

        <p
          style={{
            color: "#8fa9c7",
            marginTop: "10px",
          }}
        >
          This module is ready to be built next.
        </p>
      </div>

    </section>
  );

  // ==========================================
  // MAIN PAGE CONTENT
  // ==========================================

  const getPageContent = () => {

    if (activePage === "Dashboard") {
      return dashboardContent;
    }

    if (activePage === "Patients") {
      return patientsContent;
    }

   if (activePage === "Appointments") {
  return (
    <AppointmentsPage />
  );
}

if (activePage === "Medical Reports") {
  return <MedicalReportsPage />;
}

if (activePage === "Medical Records") {
  return <MedicalRecordsPage />;
}
if (activePage === "Prescriptions") {
  return <PrescriptionsPage />;
}
if (activePage === "Settings") {
  return <SettingsPage />;
}
    return dashboardContent;
  };

  return (
    <div className="doctor-dashboard">

      {/* SIDEBAR */}
      <aside className="doctor-sidebar">

        <div className="doctor-logo">
          🩺
          <span>GYM MANAGEMENT</span>
        </div>

        <div className="doctor-profile">

          <div className="doctor-avatar">

            {doctorProfile?.name
              ? doctorProfile.name
                  .charAt(0)
                  .toUpperCase()
              : "D"}

          </div>

          <div>

            <strong>
              {doctorProfile?.name ||
                "Doctor"}
            </strong>

            <span>
              {doctorProfile?.role ||
                "Doctor"}
            </span>

          </div>

        </div>

        <nav className="doctor-menu">

          <div
            className={
              activePage === "Dashboard"
                ? "doctor-menu-item active"
                : "doctor-menu-item"
            }
            onClick={() =>
              setActivePage("Dashboard")
            }
          >
            📊
            <span>Dashboard</span>
          </div>

          <div
            className={
              activePage === "Patients"
                ? "doctor-menu-item active"
                : "doctor-menu-item"
            }
            onClick={() =>
              setActivePage("Patients")
            }
          >
            👥
            <span>Patients</span>
          </div>

          <div
            className={
              activePage === "Appointments"
                ? "doctor-menu-item active"
                : "doctor-menu-item"
            }
            onClick={() =>
              setActivePage("Appointments")
            }
          >
            📅
            <span>Appointments</span>
          </div>

          {/* MEDICAL REPORTS */}

<div
  className={
    activePage === "Medical Reports"
      ? "doctor-menu-item active"
      : "doctor-menu-item"
  }
  onClick={() =>
    setActivePage("Medical Reports")
  }
>
  📄
  <span>Medical Reports</span>
</div>


{/* MEDICAL RECORDS */}

<div
  className={
    activePage === "Medical Records"
      ? "doctor-menu-item active"
      : "doctor-menu-item"
  }
  onClick={() =>
    setActivePage("Medical Records")
  }
>
  📋
  <span>Medical Records</span>
</div>

          <div
            className={
              activePage === "Prescriptions"
                ? "doctor-menu-item active"
                : "doctor-menu-item"
            }
            onClick={() =>
              setActivePage("Prescriptions")
            }
          >
            💊
            <span>Prescriptions</span>
          </div>

          <div
            className={
              activePage === "Settings"
                ? "doctor-menu-item active"
                : "doctor-menu-item"
            }
            onClick={() =>
              setActivePage("Settings")
            }
          >
            ⚙️
            <span>Settings</span>
          </div>

        </nav>

        <button
          className="doctor-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main className="doctor-main">

        {/* TOP BAR */}
        <header className="doctor-topbar">

          <div>

            <h2>
              {activePage === "Dashboard"
                ? "Doctor Dashboard"
                : activePage}
            </h2>

            <p>
              {activePage === "Dashboard"
                ? "Manage patients and medical records"
                : `Manage ${activePage.toLowerCase()}`}
            </p>

          </div>

          <div className="doctor-top-profile">

            <div className="doctor-mini-avatar">

              {doctorProfile?.name
                ? doctorProfile.name
                    .charAt(0)
                    .toUpperCase()
                : "D"}

            </div>

            <div>

              <strong>
                {doctorProfile?.name ||
                  "Doctor"}
              </strong>

              <small>
                {doctorProfile?.email ||
                  "Doctor Account"}
              </small>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className="doctor-content">

          {getPageContent()}

        </section>

      </main>

    </div>
  );
}

export default Doctor;