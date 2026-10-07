import { useEffect, useState } from "react";
import "./Patient.css";
import { supabase } from "../../lib/supabase";

function Patient() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Patient profile error:", error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error("Profile loading error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  if (loading) {
    return (
      <div className="patient-loading">
        Loading Patient Dashboard...
      </div>
    );
  }

  return (
    <div className="patient-dashboard">

      {/* SIDEBAR */}
      <aside className="patient-sidebar">

        <div className="patient-logo">
          <div className="patient-logo-icon">🏥</div>

          <div>
            <h2>GYM CARE</h2>
            <span>Patient Portal</span>
          </div>
        </div>

        <div className="patient-profile-card">
          <div className="patient-avatar">
            {profile?.name
              ? profile.name.charAt(0).toUpperCase()
              : "P"}
          </div>

          <div>
            <strong>
              {profile?.name || "Patient"}
            </strong>

            <span>
              {profile?.role || "Patient"}
            </span>
          </div>
        </div>

        <nav className="patient-menu">

          <PatientMenuItem
            icon="🏠"
            text="Dashboard"
            active={activePage === "Dashboard"}
            onClick={() => setActivePage("Dashboard")}
          />

          <PatientMenuItem
            icon="📅"
            text="Appointments"
            active={activePage === "Appointments"}
            onClick={() => setActivePage("Appointments")}
          />

          <PatientMenuItem
            icon="👨‍⚕️"
            text="My Doctor"
            active={activePage === "My Doctor"}
            onClick={() => setActivePage("My Doctor")}
          />

          <PatientMenuItem
            icon="📋"
            text="Medical History"
            active={activePage === "Medical History"}
            onClick={() => setActivePage("Medical History")}
          />

          <PatientMenuItem
            icon="💊"
            text="Prescriptions"
            active={activePage === "Prescriptions"}
            onClick={() => setActivePage("Prescriptions")}
          />

          <PatientMenuItem
            icon="📄"
            text="Reports"
            active={activePage === "Reports"}
            onClick={() => setActivePage("Reports")}
          />

          <PatientMenuItem
            icon="🔔"
            text="Notifications"
            active={activePage === "Notifications"}
            onClick={() => setActivePage("Notifications")}
          />

          <PatientMenuItem
            icon="⚙️"
            text="Settings"
            active={activePage === "Settings"}
            onClick={() => setActivePage("Settings")}
          />

        </nav>

        <button
          className="patient-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>


      {/* MAIN AREA */}
      <main className="patient-main">

        <header className="patient-topbar">

          <div>
            <h1>{activePage}</h1>
            <p>
              Welcome back, {profile?.name || "Patient"}
            </p>
          </div>

          <div className="patient-top-profile">
            <div className="patient-small-avatar">
              {profile?.name
                ? profile.name.charAt(0).toUpperCase()
                : "P"}
            </div>

            <div>
              <strong>
                {profile?.name || "Patient"}
              </strong>
              <span>Patient</span>
            </div>
          </div>

        </header>


        <section className="patient-content">

          {activePage === "Dashboard" && (
            <DashboardPage
              profile={profile}
              setActivePage={setActivePage}
            />
          )}

          {activePage === "Appointments" && (
            <AppointmentsPage />
          )}

          {activePage === "My Doctor" && (
            <MyDoctorPage />
          )}

          {activePage === "Medical History" && (
            <MedicalHistoryPage />
          )}

          {activePage === "Prescriptions" && (
            <PrescriptionsPage />
          )}

          {activePage === "Reports" && (
            <ReportsPage />
          )}

          {activePage === "Notifications" && (
            <NotificationsPage />
          )}

          {activePage === "Settings" && (
            <SettingsPage profile={profile} />
          )}

        </section>

      </main>

    </div>
  );
}


/* =====================================================
   MENU ITEM
   ===================================================== */

function PatientMenuItem({
  icon,
  text,
  active,
  onClick,
}) {
  return (
    <button
      className={`patient-menu-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >
      <span>{icon}</span>
      <span>{text}</span>
    </button>
  );
}


/* =====================================================
   DASHBOARD
   ===================================================== */

function DashboardPage({
  profile,
  setActivePage,
}) {
  return (
    <>

      <div className="patient-welcome-card">

        <div>
          <span className="patient-welcome-label">
            PATIENT PORTAL
          </span>

          <h2>
            Welcome, {profile?.name || "Patient"} 👋
          </h2>

          <p>
            Manage your appointments, medical records,
            prescriptions and health information.
          </p>
        </div>

        <div className="patient-welcome-icon">
          🩺
        </div>

      </div>


      <div className="patient-stat-grid">

        <div className="patient-stat-card">
          <div className="patient-stat-icon">
            📅
          </div>

          <div>
            <span>Appointments</span>
            <strong>3</strong>
          </div>
        </div>


        <div className="patient-stat-card">
          <div className="patient-stat-icon">
            💊
          </div>

          <div>
            <span>Prescriptions</span>
            <strong>2</strong>
          </div>
        </div>


        <div className="patient-stat-card">
          <div className="patient-stat-icon">
            📋
          </div>

          <div>
            <span>Medical Records</span>
            <strong>5</strong>
          </div>
        </div>


        <div className="patient-stat-card">
          <div className="patient-stat-icon">
            ❤️
          </div>

          <div>
            <span>Health Status</span>
            <strong>Good</strong>
          </div>
        </div>

      </div>


      <div className="patient-section-grid">

        <div className="patient-card">

          <div className="patient-card-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Access your important health information.</p>
            </div>
          </div>

          <div className="patient-quick-actions">

            <button
              onClick={() =>
                setActivePage("Appointments")
              }
            >
              📅
              <span>
                <strong>Appointments</strong>
                <small>View appointments</small>
              </span>
            </button>

            <button
              onClick={() =>
                setActivePage("Medical History")
              }
            >
              📋
              <span>
                <strong>Medical History</strong>
                <small>View medical records</small>
              </span>
            </button>

            <button
              onClick={() =>
                setActivePage("Prescriptions")
              }
            >
              💊
              <span>
                <strong>Prescriptions</strong>
                <small>View medicines</small>
              </span>
            </button>

            <button
              onClick={() =>
                setActivePage("Reports")
              }
            >
              📄
              <span>
                <strong>Medical Reports</strong>
                <small>View reports</small>
              </span>
            </button>

          </div>

        </div>


        <div className="patient-card">

          <div className="patient-card-header">
            <div>
              <h3>My Profile</h3>
              <p>Your registered information.</p>
            </div>
          </div>

          <div className="patient-profile-details">

            <div>
              <span>Name</span>
              <strong>
                {profile?.name || "Not available"}
              </strong>
            </div>

            <div>
              <span>Email</span>
              <strong>
                {profile?.email || "Not available"}
              </strong>
            </div>

            <div>
              <span>Phone</span>
              <strong>
                {profile?.phone || "Not available"}
              </strong>
            </div>

            <div>
              <span>Role</span>
              <strong>
                {profile?.role || "Patient"}
              </strong>
            </div>

          </div>

        </div>

      </div>

    </>
  );
}


/* =====================================================
   APPOINTMENTS
   ===================================================== */

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    appointment_type: "",
    reason: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setLoadingAppointments(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data, error } = await supabase
        .from("patient_appointments")
        .select("*")
        .eq("patient_id", user.id)
        .order("appointment_date", {
          ascending: true,
        });

      if (error) {
        console.error(
          "Appointments loading error:",
          error
        );
        return;
      }

      setAppointments(data || []);
    } catch (error) {
      console.error(
        "Appointments error:",
        error
      );
    } finally {
      setLoadingAppointments(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function bookAppointment(e) {
    e.preventDefault();

    if (
      !form.doctor_name ||
      !form.appointment_date ||
      !form.appointment_time
    ) {
      alert(
        "Please enter doctor, date and time."
      );
      return;
    }

    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login again.");
        window.location.href = "/login";
        return;
      }

      const { error } = await supabase
        .from("patient_appointments")
        .insert([
          {
            patient_id: user.id,
            doctor_name: form.doctor_name,
            appointment_date:
              form.appointment_date,
            appointment_time:
              form.appointment_time,
            appointment_type:
              form.appointment_type,
            reason: form.reason,
            status: "Scheduled",
          },
        ]);

      if (error) {
        console.error(
          "Appointment booking error:",
          error
        );

        alert(error.message);
        return;
      }

      alert(
        "Appointment booked successfully."
      );

      setForm({
        doctor_name: "",
        appointment_date: "",
        appointment_time: "",
        appointment_type: "",
        reason: "",
      });

      setShowForm(false);

      fetchAppointments();
    } catch (error) {
      console.error(
        "Appointment error:",
        error
      );

      alert(
        "Something went wrong while booking the appointment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function cancelAppointment(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmCancel) {
      return;
    }

    const { error } = await supabase
      .from("patient_appointments")
      .update({
        status: "Cancelled",
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Appointment cancellation error:",
        error
      );

      alert(error.message);
      return;
    }

    fetchAppointments();
  }

  return (
    <div>

      {/* HEADER */}

      <div className="patient-card">

        <div className="patient-card-header">

          <div>
            <h3>My Appointments</h3>

            <p>
              Book and manage your doctor appointments.
            </p>
          </div>

          <button
            className="patient-primary-btn"
            onClick={() =>
              setShowForm(!showForm)
            }
          >
            {showForm
              ? "Close"
              : "+ Book Appointment"}
          </button>

        </div>


        {/* BOOK APPOINTMENT FORM */}

        {showForm && (
          <form
            onSubmit={bookAppointment}
            className="patient-appointment-form"
          >

            <div className="patient-setting-form">

              <label>
                Doctor Name
              </label>

              <input
                type="text"
                name="doctor_name"
                value={form.doctor_name}
                onChange={handleChange}
                placeholder="Enter doctor name"
              />

            </div>


            <div className="patient-setting-form">

              <label>
                Appointment Date
              </label>

              <input
                type="date"
                name="appointment_date"
                value={form.appointment_date}
                onChange={handleChange}
              />

            </div>


            <div className="patient-setting-form">

              <label>
                Appointment Time
              </label>

              <input
                type="time"
                name="appointment_time"
                value={form.appointment_time}
                onChange={handleChange}
              />

            </div>


            <div className="patient-setting-form">

              <label>
                Appointment Type
              </label>

              <input
                type="text"
                name="appointment_type"
                value={form.appointment_type}
                onChange={handleChange}
                placeholder="Example: General Checkup"
              />

            </div>


            <div
              className="patient-setting-form"
              style={{
                gridColumn: "1 / -1",
              }}
            >

              <label>
                Reason for Appointment
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter reason for appointment"
                rows="4"
              />

            </div>


            <div
              style={{
                gridColumn: "1 / -1",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >

              <button
                type="button"
                className="patient-table-btn"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="patient-primary-btn"
                disabled={saving}
              >
                {saving
                  ? "Booking..."
                  : "Book Appointment"}
              </button>

            </div>

          </form>
        )}

      </div>


      {/* APPOINTMENTS TABLE */}

      <div className="patient-card">

        <div className="patient-card-header">

          <div>
            <h3>
              Appointment History
            </h3>

            <p>
              Your scheduled and previous appointments.
            </p>
          </div>

        </div>


        {loadingAppointments ? (

          <p style={{ color: "#8da8c5" }}>
            Loading appointments...
          </p>

        ) : appointments.length === 0 ? (

          <div
            style={{
              padding: "35px",
              textAlign: "center",
              color: "#819ab7",
            }}
          >
            <div
              style={{
                fontSize: "35px",
                marginBottom: "10px",
              }}
            >
              📅
            </div>

            <p>
              No appointments found.
            </p>

            <p
              style={{
                fontSize: "12px",
              }}
            >
              Click "+ Book Appointment" to create
              your first appointment.
            </p>
          </div>

        ) : (

          <div className="patient-table-wrapper">

            <table className="patient-table">

              <thead>

                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {appointments.map(
                  (appointment) => (

                    <tr
                      key={appointment.id}
                    >

                      <td>
                        <strong>
                          {appointment.doctor_name}
                        </strong>
                      </td>

                      <td>
                        {appointment.appointment_date}
                      </td>

                      <td>
                        {appointment.appointment_time}
                      </td>

                      <td>
                        {appointment.appointment_type ||
                          "-"}
                      </td>

                      <td>
                        {appointment.reason ||
                          "-"}
                      </td>

                      <td>

                        <span
                          className={`patient-status ${
                            appointment.status
                              ?.toLowerCase()
                          }`}
                        >
                          {appointment.status}
                        </span>

                      </td>

                      <td>

                        {appointment.status !==
                          "Cancelled" && (

                          <button
                            className="patient-table-btn"
                            onClick={() =>
                              cancelAppointment(
                                appointment.id
                              )
                            }
                          >
                            Cancel
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


/* =====================================================
   MY DOCTOR
   ===================================================== */

function MyDoctorPage() {
  return (
    <div className="patient-card">

      <div className="patient-card-header">
        <div>
          <h3>My Doctor</h3>
          <p>Your assigned doctor information.</p>
        </div>
      </div>

      <div className="patient-doctor-profile">

        <div className="patient-doctor-avatar">
          👨‍⚕️
        </div>

        <div className="patient-doctor-info">

          <h2>Dr. Bhumi</h2>

          <p>
            General Physician & Fitness Specialist
          </p>

          <div className="patient-doctor-details">
            <span>📧 drbhumi@example.com</span>
            <span>📞 +91 98765 43210</span>
            <span>🏥 Gym Health Center</span>
          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   MEDICAL HISTORY
   ===================================================== */

function MedicalHistoryPage() {

  const records = [
    {
      date: "2026-10-06",
      diagnosis: "General Health Checkup",
      treatment:
        "Regular exercise and healthy diet",
      doctor: "Dr. Bhumi",
      status: "Completed",
    },
    {
      date: "2026-10-05",
      diagnosis: "Fitness Assessment",
      treatment:
        "Workout modification recommended",
      doctor: "Dr. Bhumi",
      status: "Active",
    },
  ];

  return (
    <div className="patient-card">

      <div className="patient-card-header">
        <div>
          <h3>Medical History</h3>
          <p>
            Your previous medical records and diagnoses.
          </p>
        </div>
      </div>

      <div className="patient-table-wrapper">

        <table className="patient-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Diagnosis</th>
              <th>Treatment</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {records.map((record, index) => (
              <tr key={index}>

                <td>{record.date}</td>

                <td>
                  <strong>
                    {record.diagnosis}
                  </strong>
                </td>

                <td>{record.treatment}</td>

                <td>{record.doctor}</td>

                <td>
                  <span
                    className={`patient-status ${
                      record.status.toLowerCase()
                    }`}
                  >
                    {record.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/* =====================================================
   PRESCRIPTIONS
   ===================================================== */

function PrescriptionsPage() {

  const prescriptions = [
    {
      medicine: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once Daily",
      duration: "30 Days",
      instructions: "Take after breakfast",
      doctor: "Dr. Bhumi",
      status: "Active",
    },
    {
      medicine: "Protein Supplement",
      dosage: "1 Scoop",
      frequency: "Once Daily",
      duration: "60 Days",
      instructions: "Take after workout",
      doctor: "Dr. Bhumi",
      status: "Active",
    },
  ];

  return (
    <div className="patient-card">

      <div className="patient-card-header">
        <div>
          <h3>Prescriptions</h3>
          <p>
            Medicines prescribed by your doctor.
          </p>
        </div>
      </div>

      <div className="patient-table-wrapper">

        <table className="patient-table">

          <thead>
            <tr>
              <th>Medicine</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Instructions</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {prescriptions.map((item, index) => (
              <tr key={index}>

                <td>
                  <strong>{item.medicine}</strong>
                </td>

                <td>{item.dosage}</td>

                <td>{item.frequency}</td>

                <td>{item.duration}</td>

                <td>{item.instructions}</td>

                <td>{item.doctor}</td>

                <td>
                  <span className="patient-status active">
                    {item.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/* =====================================================
   REPORTS
   ===================================================== */

function ReportsPage() {

  const reports = [
    {
      date: "2026-10-06",
      type: "Blood Test",
      findings:
        "All blood parameters are within normal range.",
      doctor: "Dr. Bhumi",
      status: "Completed",
    },
    {
      date: "2026-10-05",
      type: "Fitness Health Report",
      findings:
        "Good fitness level. Regular exercise recommended.",
      doctor: "Dr. Bhumi",
      status: "Completed",
    },
  ];

  return (
    <div className="patient-card">

      <div className="patient-card-header">
        <div>
          <h3>Medical Reports</h3>
          <p>
            View your health and medical reports.
          </p>
        </div>
      </div>

      <div className="patient-table-wrapper">

        <table className="patient-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Report Type</th>
              <th>Findings</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {reports.map((report, index) => (
              <tr key={index}>

                <td>{report.date}</td>

                <td>
                  <strong>{report.type}</strong>
                </td>

                <td>{report.findings}</td>

                <td>{report.doctor}</td>

                <td>
                  <span className="patient-status completed">
                    {report.status}
                  </span>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/* =====================================================
   NOTIFICATIONS
   ===================================================== */

function NotificationsPage() {

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        title: "Appointment Reminder",
        message:
          "You have an appointment with Dr. Bhumi on October 10.",
        time: "Today",
        read: false,
      },
      {
        id: 2,
        title: "Prescription Updated",
        message:
          "Your Vitamin D3 prescription has been updated.",
        time: "Yesterday",
        read: false,
      },
      {
        id: 3,
        title: "Health Report Available",
        message:
          "Your latest fitness health report is available.",
        time: "2 days ago",
        read: true,
      },
    ]);

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  }

  return (
    <div className="patient-card">

      <div className="patient-card-header">
        <div>
          <h3>Notifications</h3>
          <p>
            Important updates about your health.
          </p>
        </div>
      </div>

      <div className="patient-notifications">

        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`patient-notification ${
              notification.read ? "read" : "unread"
            }`}
          >

            <div className="patient-notification-icon">
              🔔
            </div>

            <div className="patient-notification-content">

              <h4>{notification.title}</h4>

              <p>{notification.message}</p>

              <span>{notification.time}</span>

            </div>

            {!notification.read && (
              <button
                className="patient-table-btn"
                onClick={() =>
                  markAsRead(notification.id)
                }
              >
                Mark as read
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}


/* =====================================================
   SETTINGS
   ===================================================== */

function SettingsPage({ profile }) {

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [appointmentNotifications, setAppointmentNotifications] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(true);

  const [language, setLanguage] =
    useState("English");

  const [timezone, setTimezone] =
    useState("Asia/Kolkata");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");

  async function changePassword() {

    setPasswordMessage("");

    if (!newPassword || !confirmPassword) {
      setPasswordMessage(
        "Please enter both password fields."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "Passwords do not match."
      );
      return;
    }

    const { error } =
      await supabase.auth.updateUser({
        password: newPassword,
      });

    if (error) {
      setPasswordMessage(error.message);
      return;
    }

    setPasswordMessage(
      "Password updated successfully."
    );

    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="patient-settings">

      <div className="patient-card">

        <div className="patient-card-header">
          <div>
            <h3>Account Settings</h3>
            <p>
              Manage your account preferences.
            </p>
          </div>
        </div>

        <div className="patient-settings-grid">

          <div className="patient-setting-item">

            <div>
              <strong>Email Notifications</strong>
              <span>
                Receive important health updates by email.
              </span>
            </div>

            <label className="patient-switch">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) =>
                  setEmailNotifications(
                    e.target.checked
                  )
                }
              />
              <span></span>
            </label>

          </div>


          <div className="patient-setting-item">

            <div>
              <strong>
                Appointment Notifications
              </strong>

              <span>
                Get reminders about upcoming appointments.
              </span>
            </div>

            <label className="patient-switch">
              <input
                type="checkbox"
                checked={appointmentNotifications}
                onChange={(e) =>
                  setAppointmentNotifications(
                    e.target.checked
                  )
                }
              />
              <span></span>
            </label>

          </div>


          <div className="patient-setting-item">

            <div>
              <strong>Dark Mode</strong>

              <span>
                Use the dark blue dashboard theme.
              </span>
            </div>

            <label className="patient-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) =>
                  setDarkMode(e.target.checked)
                }
              />
              <span></span>
            </label>

          </div>


          <div className="patient-setting-form">

            <label>Language</label>

            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value)
              }
            >
              <option>English</option>
              <option>Kannada</option>
              <option>Hindi</option>
            </select>

          </div>


          <div className="patient-setting-form">

            <label>Timezone</label>

            <select
              value={timezone}
              onChange={(e) =>
                setTimezone(e.target.value)
              }
            >
              <option value="Asia/Kolkata">
                Asia/Kolkata
              </option>

              <option value="UTC">
                UTC
              </option>
            </select>

          </div>

        </div>

      </div>


      <div className="patient-card">

        <div className="patient-card-header">
          <div>
            <h3>Profile Information</h3>
            <p>
              Your account information.
            </p>
          </div>
        </div>

        <div className="patient-profile-details">

          <div>
            <span>Name</span>
            <strong>
              {profile?.name || "Not available"}
            </strong>
          </div>

          <div>
            <span>Email</span>
            <strong>
              {profile?.email || "Not available"}
            </strong>
          </div>

          <div>
            <span>Phone</span>
            <strong>
              {profile?.phone || "Not available"}
            </strong>
          </div>

          <div>
            <span>Role</span>
            <strong>
              {profile?.role || "Patient"}
            </strong>
          </div>

        </div>

      </div>


      <div className="patient-card">

        <div className="patient-card-header">
          <div>
            <h3>Change Password</h3>
            <p>
              Update your Supabase account password.
            </p>
          </div>
        </div>

        <div className="patient-password-form">

          <div className="patient-setting-form">

            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              placeholder="Enter new password"
            />

          </div>


          <div className="patient-setting-form">

            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              placeholder="Confirm new password"
            />

          </div>

          <button
            className="patient-primary-btn"
            onClick={changePassword}
          >
            Update Password
          </button>

          {passwordMessage && (
            <p className="patient-password-message">
              {passwordMessage}
            </p>
          )}

        </div>

      </div>

    </div>
  );
}


export default Patient;