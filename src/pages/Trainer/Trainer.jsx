import { useEffect, useState } from "react";
import "./Trainer.css";
import { supabase } from "../../lib/supabase";

function Trainer() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [memberError, setMemberError] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [workoutLoading, setWorkoutLoading] = useState(false);

  const [attendance, setAttendance] = useState([]);
const [attendanceLoading, setAttendanceLoading] = useState(false);
const [showAttendanceForm, setShowAttendanceForm] = useState(false);
const [editingAttendanceId, setEditingAttendanceId] = useState(null);

const [attendanceForm, setAttendanceForm] = useState({
  member_id: "",
  member_name: "",
  attendance_date: "",
  check_in: "",
  check_out: "",
  status: "Present",
});
 const [showWorkoutForm, setShowWorkoutForm] = useState(false);
const [editingWorkout, setEditingWorkout] = useState(null);
const [dietPlans, setDietPlans] = useState([]);
const [dietLoading, setDietLoading] = useState(false);
const [editingDietId, setEditingDietId] = useState(null);

const [showDietForm, setShowDietForm] = useState(false);

const [dietForm, setDietForm] = useState({
  member_id: "",
  plan_name: "",
  goal: "",
  meals: "",
  calories: "",
  duration_weeks: "",
  status: "Active",
  notes: "",
});

const [workoutForm, setWorkoutForm] = useState({
  member_id: "",
  plan_name: "",
  goal: "",
  exercises: "",
  duration_weeks: "",
  status: "Active",
  notes: "",
});

  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "My Members", icon: "👥" },
    { name: "Workout Plans", icon: "🏋️" },
    { name: "Diet Plans", icon: "🥗" },
    { name: "Attendance", icon: "📅" },
    { name: "Progress", icon: "📈" },
    { name: "Sessions", icon: "🗓️" },
    { name: "Notifications", icon: "🔔" },
    { name: "Feedback", icon: "💬" },
    { name: "Settings", icon: "⚙️" },
  ];

  // -----------------------------
  // FETCH MEMBERS FROM SUPABASE
  // -----------------------------
  const fetchMembers = async () => {
    setLoadingMembers(true);
    setMemberError("");

    const { data, error } = await supabase
      .from("members")
      .select("*");

    if (error) {
      console.error("Error fetching members:", error);
      setMemberError("Unable to load members.");
      setMembers([]);
    } else {
      console.log("Trainer members:", data);
      setMembers(data || []);
    }

    setLoadingMembers(false);
  };
useEffect(() => {
  fetchMembers();
  fetchWorkoutPlans();
  fetchDietPlans();
  fetchAttendance();
}, []);

const fetchWorkoutPlans = async () => {
  try {
    setWorkoutLoading(true);

    const { data, error } = await supabase
      .from("workout_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Workout plans error:", error);
      return;
    }

    console.log("Workout plans:", data);

    setWorkoutPlans(data || []);
  } catch (err) {
    console.error("Error fetching workout plans:", err);
  } finally {
    setWorkoutLoading(false);
  }
};

const fetchAttendance = async () => {
  try {
    setAttendanceLoading(true);

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .order("attendance_date", { ascending: false });

    if (error) {
      console.error("Error fetching attendance:", error);
      return;
    }

    console.log("Attendance:", data);

    setAttendance(data || []);
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    setAttendanceLoading(false);
  }
};

const handleDietChange = (e) => {
  const { name, value } = e.target;

  setDietForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleEditDietPlan = async (id) => {
  const plan = dietPlans.find((item) => item.id === id);

  if (!plan) return;

  setDietForm({
    member_id: plan.member_id || "",
    plan_name: plan.plan_name || "",
    goal: plan.goal || "",
    meals: plan.meals || "",
    calories: plan.calories || "",
    duration_weeks: plan.duration_weeks || "",
    status: plan.status || "Active",
    notes: plan.notes || "",
  });

  setEditingDietId(id);
  setShowDietForm(true);
};

const handleDeleteDietPlan = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this diet plan?"
  );

  if (!confirmed) return;

  try {
    setDietLoading(true);

    const { error } = await supabase
      .from("diet_plans")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting diet plan:", error);
      alert("Unable to delete diet plan.");
      return;
    }

    await fetchDietPlans();

    alert("Diet plan deleted successfully!");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setDietLoading(false);
  }
};

const handleAddDietPlan = async (e) => {
  e.preventDefault();

  if (!dietForm.member_id) {
    alert("Please select a member.");
    return;
  }

  if (!dietForm.plan_name.trim()) {
    alert("Please enter a diet plan name.");
    return;
  }

  try {
    setDietLoading(true);

    const dietData = {
      member_id: dietForm.member_id,
      plan_name: dietForm.plan_name,
      goal: dietForm.goal,
      meals: dietForm.meals,
      calories: dietForm.calories
        ? Number(dietForm.calories)
        : null,
      duration_weeks: dietForm.duration_weeks
        ? Number(dietForm.duration_weeks)
        : null,
      status: dietForm.status,
      notes: dietForm.notes,
    };

    // EDIT EXISTING DIET PLAN
    if (editingDietId) {
      const { error } = await supabase
        .from("diet_plans")
        .update(dietData)
        .eq("id", editingDietId);

      if (error) {
        console.error("Error updating diet plan:", error);
        alert("Unable to update diet plan.");
        return;
      }

      alert("Diet plan updated successfully!");
    }

    // ADD NEW DIET PLAN
    else {
      const { data, error } = await supabase
        .from("diet_plans")
        .insert([dietData])
        .select();

      if (error) {
        console.error("Error adding diet plan:", error);
        alert("Unable to add diet plan.");
        return;
      }

      console.log("Diet plan added:", data);

      alert("Diet plan added successfully!");
    }

    // RESET FORM
    setDietForm({
      member_id: "",
      plan_name: "",
      goal: "",
      meals: "",
      calories: "",
      duration_weeks: "",
      status: "Active",
      notes: "",
    });

    setEditingDietId(null);
    setShowDietForm(false);

    await fetchDietPlans();

  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setDietLoading(false);
  }
};
const fetchDietPlans = async () => {
  try {
    setDietLoading(true);

    const { data, error } = await supabase
      .from("diet_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching diet plans:", error);
      return;
    }

    console.log("Diet plans:", data);

    setDietPlans(data || []);
  } catch (err) {
    console.error("Unexpected error:", err);
  } finally {
    setDietLoading(false);
  }
};

const handleWorkoutChange = (e) => {
  const { name, value } = e.target;

  setWorkoutForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleAttendanceChange = (e) => {
  const { name, value } = e.target;

  setAttendanceForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleSaveAttendance = async (e) => {
  e.preventDefault();

  if (!attendanceForm.member_id) {
    alert("Please select a member.");
    return;
  }

  if (!attendanceForm.attendance_date) {
    alert("Please select a date.");
    return;
  }

  try {
    setAttendanceLoading(true);

    const attendanceData = {
      member_id: attendanceForm.member_id,
      member_name: attendanceForm.member_name,
      attendance_date: attendanceForm.attendance_date,
      check_in: attendanceForm.check_in || null,
      check_out: attendanceForm.check_out || null,
      status: attendanceForm.status,
    };

    if (editingAttendanceId) {
      const { error } = await supabase
        .from("attendance")
        .update(attendanceData)
        .eq("id", editingAttendanceId);

      if (error) {
        console.error("Error updating attendance:", error);
        alert("Unable to update attendance.");
        return;
      }

      alert("Attendance updated successfully!");
    } else {
      const { data, error } = await supabase
        .from("attendance")
        .insert([attendanceData])
        .select();

      if (error) {
        console.error("Error adding attendance:", error);
        alert("Unable to add attendance.");
        return;
      }

      console.log("Attendance added:", data);
      alert("Attendance marked successfully!");
    }

    setAttendanceForm({
      member_id: "",
      member_name: "",
      attendance_date: "",
      check_in: "",
      check_out: "",
      status: "Present",
    });

    setEditingAttendanceId(null);
    setShowAttendanceForm(false);

    await fetchAttendance();
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setAttendanceLoading(false);
  }
};

const handleAddWorkoutPlan = async (e) => {
  e.preventDefault();

  if (!workoutForm.member_id) {
    alert("Please select a member.");
    return;
  }

  if (!workoutForm.plan_name.trim()) {
    alert("Please enter a workout plan name.");
    return;
  }

  try {
    setWorkoutLoading(true);

    const { data, error } = await supabase
      .from("workout_plans")
      .insert([
        {
          member_id: workoutForm.member_id,
          plan_name: workoutForm.plan_name,
          goal: workoutForm.goal,
          exercises: workoutForm.exercises,
          duration_weeks: workoutForm.duration_weeks
            ? Number(workoutForm.duration_weeks)
            : null,
          status: workoutForm.status,
          notes: workoutForm.notes,
        },
      ])
      .select();

    if (error) {
      console.error("Error adding workout plan:", error);
      alert("Unable to add workout plan.");
      return;
    }

    console.log("Workout plan added:", data);

    setWorkoutForm({
      member_id: "",
      plan_name: "",
      goal: "",
      exercises: "",
      duration_weeks: "",
      status: "Active",
      notes: "",
    });

    setShowWorkoutForm(false);

    await fetchWorkoutPlans();

    alert("Workout plan added successfully!");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setWorkoutLoading(false);
  }
};
const handleEditWorkoutPlan = async (e) => {
  e.preventDefault();

  if (!workoutForm.member_id) {
    alert("Please select a member.");
    return;
  }

  if (!workoutForm.plan_name.trim()) {
    alert("Please enter a workout plan name.");
    return;
  }

  try {
    setWorkoutLoading(true);

    const { data, error } = await supabase
      .from("workout_plans")
      .update({
        member_id: workoutForm.member_id,
        plan_name: workoutForm.plan_name,
        goal: workoutForm.goal,
        exercises: workoutForm.exercises,
        duration_weeks: workoutForm.duration_weeks
          ? Number(workoutForm.duration_weeks)
          : null,
        status: workoutForm.status,
        notes: workoutForm.notes,
      })
      .eq("id", editingWorkout.id)
      .select();

    if (error) {
      console.error("Error updating workout plan:", error);
      alert("Unable to update workout plan.");
      return;
    }

    console.log("Workout plan updated:", data);

    setWorkoutForm({
      member_id: "",
      plan_name: "",
      goal: "",
      exercises: "",
      duration_weeks: "",
      status: "Active",
      notes: "",
    });

    setEditingWorkout(null);
    setShowWorkoutForm(false);

    await fetchWorkoutPlans();

    alert("Workout plan updated successfully!");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setWorkoutLoading(false);
  }
};
const handleDeleteWorkoutPlan = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this workout plan?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    setWorkoutLoading(true);

    const { error } = await supabase
      .from("workout_plans")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting workout plan:", error);
      alert("Unable to delete workout plan.");
      return;
    }

    await fetchWorkoutPlans();

    alert("Workout plan deleted successfully!");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setWorkoutLoading(false);
  }
};
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  // -----------------------------
  // DASHBOARD
  // -----------------------------
  const renderDashboard = () => {
    return (
      <>
        <div className="trainer-welcome">
          <div>
            <p className="trainer-small-title">
              TRAINER DASHBOARD
            </p>

            <h1>
              Welcome back, <span>Trainer</span> 👋
            </h1>

            <p>
              Manage your members, workouts and training
              activities from one place.
            </p>
          </div>

          <div className="trainer-date">
            📅 Today
          </div>
        </div>

        <div className="trainer-stats-grid">
          <div className="trainer-stat-card">
            <div className="trainer-stat-icon blue">
              👥
            </div>

            <div>
              <p>Total Assigned Members</p>
              <h2>{members.length}</h2>
              <span>Members in system</span>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-icon purple">
              🗓️
            </div>

            <div>
              <p>Today's Sessions</p>
              <h2>5</h2>
              <span>Training sessions</span>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-icon green">
              ✅
            </div>

            <div>
              <p>Today's Attendance</p>
              <h2>18</h2>
              <span>Members checked in</span>
            </div>
          </div>

          <div className="trainer-stat-card">
            <div className="trainer-stat-icon orange">
              ⏳
            </div>

            <div>
              <p>Pending Tasks</p>
              <h2>7</h2>
              <span>Tasks remaining</span>
            </div>
          </div>
        </div>

        <div className="trainer-dashboard-grid">
          <div className="trainer-panel">
            <div className="trainer-panel-header">
              <div>
                <h2>Today's Sessions</h2>
                <p>Your upcoming training sessions</p>
              </div>

              <button
                onClick={() => setActivePage("Sessions")}
              >
                View All
              </button>
            </div>

            <div className="session-list">
              <div className="session-item">
                <div className="session-time">
                  <strong>09:00</strong>
                  <span>AM</span>
                </div>

                <div className="session-info">
                  <h3>Strength Training</h3>
                  <p>👤 Rahul Sharma</p>
                </div>

                <span className="session-status">
                  Upcoming
                </span>
              </div>

              <div className="session-item">
                <div className="session-time">
                  <strong>11:30</strong>
                  <span>AM</span>
                </div>

                <div className="session-info">
                  <h3>Weight Loss Training</h3>
                  <p>👤 Priya Sharma</p>
                </div>

                <span className="session-status">
                  Upcoming
                </span>
              </div>

              <div className="session-item">
                <div className="session-time">
                  <strong>05:00</strong>
                  <span>PM</span>
                </div>

                <div className="session-info">
                  <h3>Personal Training</h3>
                  <p>👤 Arjun Kumar</p>
                </div>

                <span className="session-status">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          <div className="trainer-panel">
            <div className="trainer-panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Frequently used options</p>
              </div>
            </div>

            <div className="quick-actions">
              <button
                onClick={() => setActivePage("My Members")}
              >
                <span>👥</span>

                <div>
                  <strong>My Members</strong>
                  <small>View assigned members</small>
                </div>
              </button>

              <button
                onClick={() =>
                  setActivePage("Workout Plans")
                }
              >
                <span>🏋️</span>

                <div>
                  <strong>Workout Plans</strong>
                  <small>Manage workout plans</small>
                </div>
              </button>

              <button
                onClick={() =>
                  setActivePage("Diet Plans")
                }
              >
                <span>🥗</span>

                <div>
                  <strong>Diet Plans</strong>
                  <small>Manage diet plans</small>
                </div>
              </button>

              <button
                onClick={() =>
                  setActivePage("Attendance")
                }
              >
                <span>📅</span>

                <div>
                  <strong>Attendance</strong>
                  <small>Mark member attendance</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // -----------------------------
  // MY MEMBERS
  // -----------------------------
  const renderMembers = () => {
    return (
      <div className="trainer-members-page">
        <div className="trainer-members-header">
          <div>
            <p className="trainer-small-title">
              MEMBER MANAGEMENT
            </p>

            <h1>My Members 👥</h1>

            <p>
              View the members available in your gym system.
            </p>
          </div>

          <button
            className="trainer-refresh-btn"
            onClick={fetchMembers}
          >
            🔄 Refresh
          </button>
        </div>

        <div className="trainer-member-summary">
          <div className="trainer-member-summary-icon">
            👥
          </div>

          <div>
            <span>Total Members</span>
            <strong>{members.length}</strong>
          </div>
        </div>

        <div className="trainer-members-card">
          <div className="trainer-members-card-header">
            <div>
              <h2>Member List</h2>
              <p>
                Member information from the gym database
              </p>
            </div>
          </div>

          {loadingMembers ? (
            <div className="trainer-members-message">
              <div className="trainer-loading-icon">
                ⏳
              </div>

              <h3>Loading members...</h3>

              <p>
                Please wait while we get the member data.
              </p>
            </div>
          ) : memberError ? (
            <div className="trainer-members-message error">
              <div className="trainer-loading-icon">
                ⚠️
              </div>

              <h3>{memberError}</h3>

              <button onClick={fetchMembers}>
                Try Again
              </button>
            </div>
          ) : members.length === 0 ? (
            <div className="trainer-members-message">
              <div className="trainer-loading-icon">
                👥
              </div>

              <h3>No members found</h3>

              <p>
                Members added from the Admin dashboard will
                appear here.
              </p>
            </div>
          ) : (
            <div className="trainer-table-wrapper">
              <table className="trainer-members-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <td>
                        <div className="trainer-member-name">
                          <div className="trainer-member-avatar">
                            {member.name
                              ? member.name
                                  .charAt(0)
                                  .toUpperCase()
                              : "M"}
                          </div>

                          <div>
                            <strong>
                              {member.name || "Unknown"}
                            </strong>

                            <span>
                              Member
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {member.email || "-"}
                      </td>

                      <td>
                        {member.phone || "-"}
                      </td>

                      <td>
                        <span className="trainer-plan-badge">
                          {member.plan || "No Plan"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            member.status === "Inactive"
                              ? "trainer-status inactive"
                              : "trainer-status"
                          }
                        >
                          <span></span>

                          {member.status ||
                            "Active"}
                        </span>
                    </td>

                    <td>
                      <button
                        className="trainer-view-btn"
                        onClick={() => setSelectedMember(member)}
                        >
                      👁️ View
                      </button>
                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        {selectedMember && (
          <div
            className="trainer-member-modal-overlay"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="trainer-member-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="trainer-member-modal-header">
                <div>
                  <p>MEMBER DETAILS</p>
                  <h2>Member Profile</h2>
                </div>
                <button
                  className="trainer-modal-close"
                  onClick={() => setSelectedMember(null)}
                >
                  ✕
                </button>
              </div>

              <div className="trainer-modal-profile">
                <div className="trainer-modal-avatar">
                  {selectedMember.name
                    ? selectedMember.name.charAt(0).toUpperCase()
                    : "M"}
                </div>
                <div>
                  <h3>{selectedMember.name || "Unknown Member"}</h3>
                  <span>Gym Member</span>
                </div>
              </div>

              <div className="trainer-member-details-grid">
                <div className="trainer-detail-box">
                  <span>📧 Email</span>
                  <strong>{selectedMember.email || "-"}</strong>
                </div>
                <div className="trainer-detail-box">
                  <span>📱 Phone</span>
                  <strong>{selectedMember.phone || "-"}</strong>
                </div>
                <div className="trainer-detail-box">
                  <span>💳 Membership Plan</span>
                  <strong>{selectedMember.plan || "No Plan"}</strong>
                </div>
                <div className="trainer-detail-box">
                  <span>🟢 Status</span>
                  <strong>{selectedMember.status || "Active"}</strong>
                </div>
              </div>

              <div className="trainer-modal-footer">
                <button onClick={() => setSelectedMember(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    );
  };
  // -----------------------------
  // OTHER PAGES
  // -----------------------------
  const renderPage = () => {
    if (activePage === "Dashboard") {
      return renderDashboard();
    }

    if (activePage === "My Members") {
      return renderMembers();
    }

    // =============================
    // DIET PLANS
    // =============================
    if (activePage === "Diet Plans") {
      return (
        <div className="page-content">

          <div className="page-header">
            <div>
              <h1>Diet Plans</h1>
              <p>
                Create and manage nutrition plans for your members.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setEditingDietId(null);

                setDietForm({
                  member_id: "",
                  plan_name: "",
                  goal: "",
                  meals: "",
                  calories: "",
                  duration_weeks: "",
                  status: "Active",
                  notes: "",
                });

                setShowDietForm(true);
              }}
            >
              + Add Diet Plan
            </button>
          </div>

          {/* =============================
              ADD / EDIT DIET FORM
          ============================= */}

          {showDietForm && (
            <div className="workout-form-card">

              <div className="workout-form-header">

                <div>
                  <h2>
                    {editingDietId
                      ? "Edit Diet Plan"
                      : "Add Diet Plan"}
                  </h2>

                  <p>
                    {editingDietId
                      ? "Update the nutrition plan details."
                      : "Create a nutrition plan for a member."}
                  </p>
                </div>

                <button
                  type="button"
                  className="workout-close-btn"
                  onClick={() => {
                    setShowDietForm(false);
                    setEditingDietId(null);
                  }}
                >
                  ✕
                </button>

              </div>

              <form onSubmit={handleAddDietPlan}>

                <div className="workout-form-grid">

                  {/* MEMBER */}

                  <div className="workout-form-group">
                    <label>Member *</label>

                    <select
                      name="member_id"
                      value={dietForm.member_id}
                      onChange={handleDietChange}
                      required
                    >
                      <option value="">
                        Select Member
                      </option>

                      {members.map((member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.name || "Unknown Member"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PLAN NAME */}

                  <div className="workout-form-group">
                    <label>Plan Name *</label>

                    <input
                      type="text"
                      name="plan_name"
                      value={dietForm.plan_name}
                      onChange={handleDietChange}
                      placeholder="Example: Weight Loss Diet"
                      required
                    />
                  </div>

                  {/* GOAL */}

                  <div className="workout-form-group">
                    <label>Goal</label>

                    <input
                      type="text"
                      name="goal"
                      value={dietForm.goal}
                      onChange={handleDietChange}
                      placeholder="Example: Weight Loss"
                    />
                  </div>

                  {/* CALORIES */}

                  <div className="workout-form-group">
                    <label>Daily Calories</label>

                    <input
                      type="number"
                      name="calories"
                      value={dietForm.calories}
                      onChange={handleDietChange}
                      placeholder="Example: 1800"
                      min="1"
                    />
                  </div>

                  {/* DURATION */}

                  <div className="workout-form-group">
                    <label>Duration (Weeks)</label>

                    <input
                      type="number"
                      name="duration_weeks"
                      value={dietForm.duration_weeks}
                      onChange={handleDietChange}
                      placeholder="Example: 8"
                      min="1"
                    />
                  </div>

                  {/* STATUS */}

                  <div className="workout-form-group">
                    <label>Status</label>

                    <select
                      name="status"
                      value={dietForm.status}
                      onChange={handleDietChange}
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Paused">
                        Paused
                      </option>
                    </select>
                  </div>

                </div>

                {/* MEALS */}

                <div className="workout-form-group full-width">
                  <label>Meals</label>

                  <textarea
                    name="meals"
                    value={dietForm.meals}
                    onChange={handleDietChange}
                    placeholder="Example: Breakfast - Oats and eggs, Lunch - Rice and chicken, Dinner - Salad and soup..."
                    rows="5"
                  />
                </div>

                {/* NOTES */}

                <div className="workout-form-group full-width">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={dietForm.notes}
                    onChange={handleDietChange}
                    placeholder="Add nutrition instructions or additional notes..."
                    rows="3"
                  />
                </div>

                {/* BUTTONS */}

                <div className="workout-form-actions">

                  <button
                    type="button"
                    className="workout-cancel-btn"
                    onClick={() => {
                      setShowDietForm(false);
                      setEditingDietId(null);

                      setDietForm({
                        member_id: "",
                        plan_name: "",
                        goal: "",
                        meals: "",
                        calories: "",
                        duration_weeks: "",
                        status: "Active",
                        notes: "",
                      });
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="workout-save-btn"
                    disabled={dietLoading}
                  >
                    {dietLoading
                      ? "Saving..."
                      : editingDietId
                      ? "Update Diet Plan"
                      : "Save Diet Plan"}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* =============================
              DIET PLAN LIST
          ============================= */}

          {dietLoading ? (
            <div className="empty-state">
              <h3>Loading diet plans...</h3>
            </div>
          ) : dietPlans.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🥗
              </div>

              <h3>No Diet Plans Yet</h3>

              <p>
                Create a diet plan and assign it to one
                of your members.
              </p>

              <button
                className="primary-btn"
                onClick={() => setShowDietForm(true)}
              >
                + Create Diet Plan
              </button>

            </div>

          ) : (

            <div className="cards-grid">

              {dietPlans.map((plan) => (

                <div
                  className="content-card"
                  key={plan.id}
                >

                  <div className="card-header">

                    <div>
                      <h3>{plan.plan_name}</h3>

                      <span className="status-badge">
                        {plan.status || "Active"}
                      </span>
                    </div>

                  </div>

                  <div className="card-body">

                    <p>
                      <strong>Goal:</strong>{" "}
                      {plan.goal || "Not specified"}
                    </p>

                    <p>
                      <strong>Calories:</strong>{" "}
                      {plan.calories
                        ? `${plan.calories} kcal`
                        : "Not specified"}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {plan.duration_weeks
                        ? `${plan.duration_weeks} weeks`
                        : "Not specified"}
                    </p>

                    <p>
                      <strong>Meals:</strong>{" "}
                      {plan.meals || "Not specified"}
                    </p>

                    {plan.notes && (
                      <p>
                        <strong>Notes:</strong>{" "}
                        {plan.notes}
                      </p>
                    )}

                  </div>

                  {/* EDIT / DELETE */}

                  <div className="card-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        handleEditDietPlan(plan.id)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteDietPlan(plan.id)
                      }
                      disabled={dietLoading}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      );
    }

    // =============================
    // WORKOUT PLANS
    // =============================

    if (activePage === "Workout Plans") {
      return (
        <div className="page-content">

          <div className="page-header">

            <div>
              <h1>Workout Plans</h1>

              <p>
                Create and manage workout plans for your members.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setEditingWorkout(null);

                setWorkoutForm({
                  member_id: "",
                  plan_name: "",
                  goal: "",
                  exercises: "",
                  duration_weeks: "",
                  status: "Active",
                  notes: "",
                });

                setShowWorkoutForm(true);
              }}
            >
              + Add Workout Plan
            </button>

          </div>

          {/* WORKOUT FORM */}

          {showWorkoutForm && (
            <div className="workout-form-card">

              <div className="workout-form-header">

                <div>

                  <h2>
                    {editingWorkout
                      ? "Edit Workout Plan"
                      : "Add Workout Plan"}
                  </h2>

                  <p>
                    {editingWorkout
                      ? "Update the workout plan details."
                      : "Create a workout plan for a member."}
                  </p>

                </div>

                <button
                  type="button"
                  className="workout-close-btn"
                  onClick={() => {
                    setShowWorkoutForm(false);
                    setEditingWorkout(null);
                  }}
                >
                  ✕
                </button>

              </div>

              <form
                onSubmit={
                  editingWorkout
                    ? handleEditWorkoutPlan
                    : handleAddWorkoutPlan
                }
              >

                <div className="workout-form-grid">

                  {/* MEMBER */}

                  <div className="workout-form-group">

                    <label>Member *</label>

                    <select
                      name="member_id"
                      value={workoutForm.member_id}
                      onChange={handleWorkoutChange}
                      required
                    >

                      <option value="">
                        Select Member
                      </option>

                      {members.map((member) => (
                        <option
                          key={member.id}
                          value={member.id}
                        >
                          {member.name || "Unknown Member"}
                        </option>
                      ))}

                    </select>

                  </div>

                  {/* PLAN NAME */}

                  <div className="workout-form-group">

                    <label>Plan Name *</label>

                    <input
                      type="text"
                      name="plan_name"
                      value={workoutForm.plan_name}
                      onChange={handleWorkoutChange}
                      placeholder="Example: Weight Loss Plan"
                      required
                    />

                  </div>

                  {/* GOAL */}

                  <div className="workout-form-group">

                    <label>Goal</label>

                    <input
                      type="text"
                      name="goal"
                      value={workoutForm.goal}
                      onChange={handleWorkoutChange}
                      placeholder="Example: Weight Loss"
                    />

                  </div>

                  {/* DURATION */}

                  <div className="workout-form-group">

                    <label>Duration (Weeks)</label>

                    <input
                      type="number"
                      name="duration_weeks"
                      value={workoutForm.duration_weeks}
                      onChange={handleWorkoutChange}
                      placeholder="Example: 8"
                      min="1"
                    />

                  </div>

                  {/* STATUS */}

                  <div className="workout-form-group">

                    <label>Status</label>

                    <select
                      name="status"
                      value={workoutForm.status}
                      onChange={handleWorkoutChange}
                    >

                      <option value="Active">
                        Active
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Paused">
                        Paused
                      </option>

                    </select>

                  </div>

                </div>

                {/* EXERCISES */}

                <div className="workout-form-group full-width">

                  <label>Exercises</label>

                  <textarea
                    name="exercises"
                    value={workoutForm.exercises}
                    onChange={handleWorkoutChange}
                    placeholder="Example: Squats, Push-ups, Running, Planks..."
                    rows="4"
                  />

                </div>

                {/* NOTES */}

                <div className="workout-form-group full-width">

                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={workoutForm.notes}
                    onChange={handleWorkoutChange}
                    placeholder="Add additional instructions or notes..."
                    rows="3"
                  />

                </div>

                {/* BUTTONS */}

                <div className="workout-form-actions">

                  <button
                    type="button"
                    className="workout-cancel-btn"
                    onClick={() => {
                      setShowWorkoutForm(false);
                      setEditingWorkout(null);

                      setWorkoutForm({
                        member_id: "",
                        plan_name: "",
                        goal: "",
                        exercises: "",
                        duration_weeks: "",
                        status: "Active",
                        notes: "",
                      });
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="workout-save-btn"
                    disabled={workoutLoading}
                  >
                    {workoutLoading
                      ? "Saving..."
                      : editingWorkout
                      ? "Update Workout Plan"
                      : "Save Workout Plan"}
                  </button>

                </div>

              </form>

            </div>
          )}

          {/* WORKOUT PLAN LIST */}

          {workoutLoading ? (

            <div className="empty-state">
              <h3>Loading workout plans...</h3>
            </div>

          ) : workoutPlans.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                🏋️
              </div>

              <h3>No Workout Plans Yet</h3>

              <p>
                Create a workout plan and assign it to
                one of your members.
              </p>

            </div>

          ) : (

            <div className="cards-grid">

              {workoutPlans.map((plan) => (

                <div
                  className="content-card"
                  key={plan.id}
                >

                  <div className="card-header">

                    <div>

                      <h3>{plan.plan_name}</h3>

                      <span className="status-badge">
                        {plan.status || "Active"}
                      </span>

                    </div>

                  </div>

                  <div className="card-body">

                    <p>
                      <strong>Goal:</strong>{" "}
                      {plan.goal || "Not specified"}
                    </p>

                    <p>
                      <strong>Duration:</strong>{" "}
                      {plan.duration_weeks
                        ? `${plan.duration_weeks} weeks`
                        : "Not specified"}
                    </p>

                    <p>
                      <strong>Exercises:</strong>{" "}
                      {plan.exercises || "Not specified"}
                    </p>

                    {plan.notes && (
                      <p>
                        <strong>Notes:</strong>{" "}
                        {plan.notes}
                      </p>
                    )}

                  </div>

                  <div className="card-actions">

                    <button
                      className="edit-btn"
                      onClick={() => {

                        setEditingWorkout(plan);

                        setWorkoutForm({
                          member_id: plan.member_id || "",
                          plan_name: plan.plan_name || "",
                          goal: plan.goal || "",
                          exercises: plan.exercises || "",
                          duration_weeks:
                            plan.duration_weeks || "",
                          status:
                            plan.status || "Active",
                          notes: plan.notes || "",
                        });

                        setShowWorkoutForm(true);

                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteWorkoutPlan(plan.id)
                      }
                      disabled={workoutLoading}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>
      );
    }

    // =============================
    // OTHER PAGES
    // =============================

    return (
      <div className="trainer-coming-soon">

        <div className="coming-soon-icon">

          {
            menuItems.find(
              (item) => item.name === activePage
            )?.icon
          }

        </div>

        <h2>{activePage}</h2>

        <p>
          This section will be connected next.
        </p>

        <button
          onClick={() => setActivePage("Dashboard")}
        >
          ← Back to Dashboard
        </button>

      </div>
    );
  };

  if (activePage === "Attendance") {
  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Track and manage member attendance.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingAttendanceId(null);
            setAttendanceForm({
              member_id: "",
              member_name: "",
              attendance_date: "",
              check_in: "",
              check_out: "",
              status: "Present",
            });
            setShowAttendanceForm(true);
          }}
        >
          + Mark Attendance
        </button>
      </div>

      {showAttendanceForm && (
        <div className="workout-form-card">
          <div className="workout-form-header">
            <div>
              <h2>
                {editingAttendanceId
                  ? "Edit Attendance"
                  : "Mark Attendance"}
              </h2>

              <p>
                Record attendance for a member.
              </p>
            </div>

            <button
              type="button"
              className="workout-close-btn"
              onClick={() => {
                setShowAttendanceForm(false);
                setEditingAttendanceId(null);
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSaveAttendance}>
            <div className="workout-form-grid">

              <div className="form-group">
                <label>Member</label>

                <select
                  name="member_id"
                  value={attendanceForm.member_id}
                  onChange={(e) => {
                    const selected = members.find(
                      (member) => member.id === e.target.value
                    );

                    setAttendanceForm((prev) => ({
                      ...prev,
                      member_id: e.target.value,
                      member_name: selected
                        ? selected.name
                        : "",
                    }));
                  }}
                  required
                >
                  <option value="">
                    Select Member
                  </option>

                  {members.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Attendance Date</label>

                <input
                  type="date"
                  name="attendance_date"
                  value={attendanceForm.attendance_date}
                  onChange={handleAttendanceChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Check In</label>

                <input
                  type="time"
                  name="check_in"
                  value={attendanceForm.check_in}
                  onChange={handleAttendanceChange}
                />
              </div>

              <div className="form-group">
                <label>Check Out</label>

                <input
                  type="time"
                  name="check_out"
                  value={attendanceForm.check_out}
                  onChange={handleAttendanceChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={attendanceForm.status}
                  onChange={handleAttendanceChange}
                >
                  <option value="Present">
                    Present
                  </option>

                  <option value="Absent">
                    Absent
                  </option>

                  <option value="Late">
                    Late
                  </option>
                </select>
              </div>

            </div>

            <div className="workout-form-actions">
              <button
                type="button"
                className="workout-cancel-btn"
                onClick={() => {
                  setShowAttendanceForm(false);
                  setEditingAttendanceId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="workout-save-btn"
                disabled={attendanceLoading}
              >
                {attendanceLoading
                  ? "Saving..."
                  : editingAttendanceId
                  ? "Update Attendance"
                  : "Save Attendance"}
              </button>
            </div>
          </form>
        </div>
      )}

      {attendanceLoading ? (
        <div className="empty-state">
          <p>Loading attendance...</p>
        </div>
      ) : attendance.length === 0 ? (
        <div className="empty-state">
          <h3>No attendance records yet</h3>
          <p>
            Click "Mark Attendance" to record your
            first attendance.
          </p>
        </div>
      ) : (
        <div className="cards-grid">
          {attendance.map((record) => (
            <div
              className="content-card"
              key={record.id}
            >
              <div className="content-card-header">
                <div>
                  <h3>{record.member_name}</h3>
                  <p>{record.attendance_date}</p>
                </div>

                <span className="status-badge">
                  {record.status}
                </span>
              </div>

              <div className="card-details">
                <p>
                  <strong>Check In:</strong>{" "}
                  {record.check_in || "—"}
                </p>

                <p>
                  <strong>Check Out:</strong>{" "}
                  {record.check_out || "—"}
                </p>
              </div>

              <div className="card-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingAttendanceId(record.id);

                    setAttendanceForm({
                      member_id: record.member_id || "",
                      member_name: record.member_name || "",
                      attendance_date:
                        record.attendance_date || "",
                      check_in: record.check_in || "",
                      check_out: record.check_out || "",
                      status: record.status || "Present",
                    });

                    setShowAttendanceForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={async () => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this attendance record?"
                    );

                    if (!confirmed) return;

                    try {
                      setAttendanceLoading(true);

                      const { error } = await supabase
                        .from("attendance")
                        .delete()
                        .eq("id", record.id);

                      if (error) {
                        console.error(
                          "Error deleting attendance:",
                          error
                        );

                        alert(
                          "Unable to delete attendance."
                        );

                        return;
                      }

                      await fetchAttendance();

                      alert(
                        "Attendance deleted successfully!"
                      );
                    } catch (err) {
                      console.error(
                        "Unexpected error:",
                        err
                      );

                      alert(
                        "Something went wrong."
                      );
                    } finally {
                      setAttendanceLoading(false);
                    }
                  }}
                  disabled={attendanceLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

  return (
    <div className="trainer-layout">

      {/* SIDEBAR */}

      <aside className="trainer-sidebar">

        <div className="trainer-logo">
          <div className="trainer-logo-icon">
            🏋️
          </div>

          <div>
            <strong>GYM</strong>
            <span>MANAGEMENT</span>
          </div>
        </div>

        <div className="trainer-profile">
          <div className="trainer-avatar">
            T
          </div>

          <div>
            <strong>Trainer</strong>
            <span>Fitness Trainer</span>
          </div>
        </div>

        <nav className="trainer-nav">

          <p className="trainer-nav-title">
            MAIN MENU
          </p>

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={
                activePage === item.name
                  ? "trainer-nav-item active"
                  : "trainer-nav-item"
              }
              onClick={() =>
                setActivePage(item.name)
              }
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}

        </nav>

        <button
          className="trainer-logout"
          onClick={handleLogout}
        >
          <span>🚪</span>
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="trainer-main">

        <header className="trainer-topbar">

          <div>
            <h2>{activePage}</h2>

            <p>
              Gym Management System
            </p>
          </div>

          <div className="trainer-topbar-right">

            <button className="trainer-notification">
              🔔
              <span></span>
            </button>

            <div className="trainer-top-profile">

              <div className="trainer-mini-avatar">
                T
              </div>

              <div>
                <strong>Trainer</strong>
                <small>Trainer Account</small>
              </div>

            </div>

          </div>

        </header>

        <section className="trainer-content">
          {renderPage()}
        </section>

      </main>

    </div>
  );
}

export default Trainer;
