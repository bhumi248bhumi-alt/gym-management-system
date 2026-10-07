import { useEffect, useState } from "react";
import "./Member.css";
import { supabase } from "../../lib/supabase";

export default function Member() {
  const [memberProfile, setMemberProfile] = useState(null);
  const [memberRecord, setMemberRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");

  useEffect(() => {
    fetchMemberProfile();
  }, []);

  const fetchMemberProfile = async () => {
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

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, name, email, phone, role")
          .eq("id", user.id)
          .maybeSingle();

      if (profileError) {
        console.error("Profile error:", profileError);
      }

      if (
        profile &&
        profile.role !== "Member" &&
        profile.role !== "Admin"
      ) {
        alert("Only Member can access the Member dashboard.");
        window.location.href = "/login";
        return;
      }

      setMemberProfile(
        profile || {
          id: user.id,
          name: user.user_metadata?.name || "Member",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          role: "Member",
        }
      );

      // Find matching member record
      const { data: member, error: memberError } =
        await supabase
          .from("members")
          .select("*")
          .eq("email", user.email)
          .maybeSingle();

      if (memberError) {
        console.log(
          "Member record:",
          memberError.message
        );
      }

      setMemberRecord(member || null);
    } catch (error) {
      console.error("Member loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMemberIds = () => {
    const ids = [];

    if (memberProfile?.id) {
      ids.push(String(memberProfile.id));
    }

    if (memberRecord?.id) {
      ids.push(String(memberRecord.id));
    }

    return [...new Set(ids)];
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    localStorage.removeItem("currentUser");
    localStorage.removeItem("gymUser");

    window.location.href = "/login";
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
    },
    {
      name: "My Workouts",
      icon: "💪",
    },
    {
      name: "Diet Plan",
      icon: "🥗",
    },
    {
      name: "My Progress",
      icon: "📈",
    },
    {
      name: "Attendance",
      icon: "📅",
    },
    {
      name: "Membership",
      icon: "💳",
    },
    {
      name: "Notifications",
      icon: "🔔",
    },
    {
      name: "Settings",
      icon: "⚙️",
    },
  ];

  const DashboardPage = () => {
    const [workoutCount, setWorkoutCount] = useState(0);
    const [progressCount, setProgressCount] = useState(0);
    const [attendanceCount, setAttendanceCount] = useState(0);

    useEffect(() => {
      fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
      const ids = getMemberIds();

      if (ids.length === 0) {
        return;
      }

      // Workouts
      try {
        const { data } = await supabase
          .from("workout_plans")
          .select("id, member_id");

        const workouts = (data || []).filter((item) =>
          ids.includes(String(item.member_id))
        );

        setWorkoutCount(workouts.length);
      } catch (error) {
        console.error("Workout count error:", error);
      }

      // Progress
      try {
        const { data } = await supabase
          .from("member_progress")
          .select("id, member_id");

        const progress = (data || []).filter((item) =>
          ids.includes(String(item.member_id))
        );

        setProgressCount(progress.length);
      } catch (error) {
        console.error("Progress count error:", error);
      }

      // Attendance
      try {
        const { data } = await supabase
          .from("attendance")
          .select("id, member_id");

        const attendance = (data || []).filter((item) =>
          ids.includes(String(item.member_id))
        );

        setAttendanceCount(attendance.length);
      } catch (error) {
        console.error("Attendance count error:", error);
      }
    };

    return (
      <>
        <div className="member-welcome">
          <div>
            <h1>
              Welcome back,{" "}
              <span>
                {memberProfile?.name || "Member"}
              </span>{" "}
              👋
            </h1>

            <p>
              Stay consistent, follow your workouts
              and keep working toward your fitness
              goals.
            </p>
          </div>

          <div className="member-welcome-icon">
            💪
          </div>
        </div>

        <div className="member-stats">

          <div className="member-stat-card">
            <div className="member-stat-icon">
              💪
            </div>

            <div>
              <span>Workout Plans</span>
              <h2>{workoutCount}</h2>
            </div>
          </div>

          <div className="member-stat-card">
            <div className="member-stat-icon">
              📈
            </div>

            <div>
              <span>Progress Records</span>
              <h2>{progressCount}</h2>
            </div>
          </div>

          <div className="member-stat-card">
            <div className="member-stat-icon">
              📅
            </div>

            <div>
              <span>Attendance</span>
              <h2>{attendanceCount}</h2>
            </div>
          </div>

          <div className="member-stat-card">
            <div className="member-stat-icon">
              💳
            </div>

            <div>
              <span>Membership</span>
              <h2>
                {memberRecord?.status ||
                  "Active"}
              </h2>
            </div>
          </div>

        </div>

        <div className="member-card">

          <div className="member-card-header">
            <div>
              <h2>My Profile</h2>
              <p>
                Your registered member information
              </p>
            </div>
          </div>

          <div className="member-profile-grid">

            <div className="member-info-box">
              <label>Name</label>
              <strong>
                {memberProfile?.name || "-"}
              </strong>
            </div>

            <div className="member-info-box">
              <label>Email</label>
              <strong>
                {memberProfile?.email || "-"}
              </strong>
            </div>

            <div className="member-info-box">
              <label>Phone</label>
              <strong>
                {memberProfile?.phone || "Not added"}
              </strong>
            </div>

            <div className="member-info-box">
              <label>Role</label>
              <strong>
                {memberProfile?.role || "Member"}
              </strong>
            </div>

          </div>
        </div>

        <div className="member-card">

          <div className="member-card-header">
            <div>
              <h2>Membership Overview</h2>
              <p>
                Current membership information
              </p>
            </div>
          </div>

          <div className="member-overview">

            <div className="member-overview-box">
              <span>Plan</span>
              <strong>
                {memberRecord?.plan ||
                  "Not assigned"}
              </strong>
            </div>

            <div className="member-overview-box">
              <span>Status</span>
              <strong>
                {memberRecord?.status ||
                  "Active"}
              </strong>
            </div>

            <div className="member-overview-box">
              <span>Joining Date</span>
              <strong>
                {memberRecord?.joining_date ||
                  "Not available"}
              </strong>
            </div>

            <div className="member-overview-box">
              <span>Expiry Date</span>
              <strong>
                {memberRecord?.expiry_date ||
                  "Not available"}
              </strong>
            </div>

          </div>
        </div>

        <div className="member-card">

          <div className="member-card-header">
            <div>
              <h2>Quick Actions</h2>
              <p>
                Quickly access your fitness information
              </p>
            </div>
          </div>

          <div className="member-actions">

            <button
              onClick={() =>
                setActivePage("My Workouts")
              }
            >
              <span>💪</span>
              My Workouts
            </button>

            <button
              onClick={() =>
                setActivePage("Diet Plan")
              }
            >
              <span>🥗</span>
              Diet Plan
            </button>

            <button
              onClick={() =>
                setActivePage("My Progress")
              }
            >
              <span>📈</span>
              My Progress
            </button>

            <button
              onClick={() =>
                setActivePage("Attendance")
              }
            >
              <span>📅</span>
              Attendance
            </button>

          </div>
        </div>
      </>
    );
  };

  const MyWorkoutsPage = () => {
    const [workoutPlans, setWorkoutPlans] =
      useState([]);
    const [loadingWorkouts, setLoadingWorkouts] =
      useState(true);

    useEffect(() => {
      fetchWorkoutPlans();
    }, []);

    const fetchWorkoutPlans = async () => {
      try {
        setLoadingWorkouts(true);

        const ids = getMemberIds();

        const { data, error } = await supabase
          .from("workout_plans")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Workout plans error:",
            error
          );
          return;
        }

        const filtered = (data || []).filter(
          (plan) =>
            ids.includes(String(plan.member_id))
        );

        setWorkoutPlans(filtered);
      } catch (error) {
        console.error(
          "Workout loading error:",
          error
        );
      } finally {
        setLoadingWorkouts(false);
      }
    };

    return (
      <div className="member-card">

        <div className="member-card-header">

          <div>
            <h2>My Workouts</h2>
            <p>
              Workout plans assigned by your trainer
            </p>
          </div>

          <button
            className="member-primary-btn"
            onClick={fetchWorkoutPlans}
          >
            🔄 Refresh
          </button>

        </div>

        {loadingWorkouts ? (
          <div className="member-empty">
            Loading workout plans...
          </div>
        ) : workoutPlans.length === 0 ? (
          <div className="member-empty">

            <div className="member-empty-icon">
              💪
            </div>

            <h3>
              No Workout Plans Yet
            </h3>

            <p>
              Your trainer has not assigned a
              workout plan yet.
            </p>

          </div>
        ) : (
          <div className="member-workout-grid">

            {workoutPlans.map((plan) => (
              <div
                className="member-workout-card"
                key={plan.id}
              >

                <div className="member-workout-header">

                  <div className="member-workout-icon">
                    💪
                  </div>

                  <span className="member-workout-status">
                    {plan.status || "Active"}
                  </span>

                </div>

                <h3>
                  {plan.plan_name ||
                    "Workout Plan"}
                </h3>

                <div className="member-workout-detail">
                  <span>Goal</span>
                  <strong>
                    {plan.goal ||
                      "Not specified"}
                  </strong>
                </div>

                <div className="member-workout-detail">
                  <span>Duration</span>
                  <strong>
                    {plan.duration_weeks
                      ? `${plan.duration_weeks} weeks`
                      : "Not specified"}
                  </strong>
                </div>

                <div className="member-workout-exercises">
                  <span>Exercises</span>

                  <p>
                    {plan.exercises ||
                      "No exercises added."}
                  </p>
                </div>

                {plan.notes && (
                  <div className="member-workout-exercises">
                    <span>Notes</span>
                    <p>{plan.notes}</p>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    );
  };

  const DietPlanPage = () => {
    const [dietPlans, setDietPlans] =
      useState([]);
    const [loadingDiet, setLoadingDiet] =
      useState(true);

    useEffect(() => {
      fetchDietPlans();
    }, []);

    const fetchDietPlans = async () => {
      try {
        setLoadingDiet(true);

        const ids = getMemberIds();

        const { data, error } = await supabase
          .from("diet_plans")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Diet plans error:",
            error
          );
          return;
        }

        const filtered = (data || []).filter(
          (plan) =>
            ids.includes(String(plan.member_id))
        );

        setDietPlans(filtered);
      } catch (error) {
        console.error(
          "Diet loading error:",
          error
        );
      } finally {
        setLoadingDiet(false);
      }
    };

    return (
      <div className="member-card">

        <div className="member-card-header">

          <div>
            <h2>My Diet Plan</h2>
            <p>
              Nutrition plans assigned to you
            </p>
          </div>

          <button
            className="member-primary-btn"
            onClick={fetchDietPlans}
          >
            🔄 Refresh
          </button>

        </div>

        {loadingDiet ? (
          <div className="member-empty">
            Loading diet plans...
          </div>
        ) : dietPlans.length === 0 ? (
          <div className="member-empty">

            <div className="member-empty-icon">
              🥗
            </div>

            <h3>
              No Diet Plans Yet
            </h3>

            <p>
              Your trainer has not assigned a
              diet plan yet.
            </p>

          </div>
        ) : (
          <div className="member-workout-grid">

            {dietPlans.map((plan) => (
              <div
                className="member-workout-card"
                key={plan.id}
              >

                <div className="member-workout-header">

                  <div className="member-workout-icon">
                    🥗
                  </div>

                  <span className="member-workout-status">
                    {plan.status || "Active"}
                  </span>

                </div>

                <h3>
                  {plan.plan_name ||
                    "Diet Plan"}
                </h3>

                <div className="member-workout-detail">
                  <span>Goal</span>
                  <strong>
                    {plan.goal ||
                      "Not specified"}
                  </strong>
                </div>

                <div className="member-workout-detail">
                  <span>Daily Calories</span>
                  <strong>
                    {plan.calories ||
                    plan.daily_calories
                      ? `${plan.calories || plan.daily_calories} kcal`
                      : "Not specified"}
                  </strong>
                </div>

                <div className="member-workout-detail">
                  <span>Duration</span>
                  <strong>
                    {plan.duration_weeks
                      ? `${plan.duration_weeks} weeks`
                      : "Not specified"}
                  </strong>
                </div>

                <div className="member-workout-exercises">
                  <span>Meals</span>

                  <p>
                    {plan.meals ||
                      "No meals added."}
                  </p>
                </div>

                {plan.notes && (
                  <div className="member-workout-exercises">
                    <span>Nutrition Notes</span>
                    <p>{plan.notes}</p>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    );
  };

  const ProgressPage = () => {
    const [progress, setProgress] =
      useState([]);
    const [loadingProgress, setLoadingProgress] =
      useState(true);

    useEffect(() => {
      fetchProgress();
    }, []);

    const fetchProgress = async () => {
      try {
        setLoadingProgress(true);

        const ids = getMemberIds();

        const { data, error } = await supabase
          .from("member_progress")
          .select("*")
          .order("progress_date", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Progress error:",
            error
          );
          return;
        }

        const filtered = (data || []).filter(
          (item) =>
            ids.includes(String(item.member_id))
        );

        setProgress(filtered);
      } catch (error) {
        console.error(
          "Progress loading error:",
          error
        );
      } finally {
        setLoadingProgress(false);
      }
    };

    return (
      <div className="member-card">

        <div className="member-card-header">

          <div>
            <h2>My Progress</h2>
            <p>
              Track your fitness progress
            </p>
          </div>

          <button
            className="member-primary-btn"
            onClick={fetchProgress}
          >
            🔄 Refresh
          </button>

        </div>

        {loadingProgress ? (
          <div className="member-empty">
            Loading progress...
          </div>
        ) : progress.length === 0 ? (
          <div className="member-empty">

            <div className="member-empty-icon">
              📈
            </div>

            <h3>
              No Progress Records Yet
            </h3>

            <p>
              Your trainer has not added progress
              records yet.
            </p>

          </div>
        ) : (
          <div className="member-table-wrapper">

            <table className="member-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Body Fat</th>
                  <th>Chest</th>
                  <th>Waist</th>
                  <th>Notes</th>
                </tr>
              </thead>

              <tbody>

                {progress.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.progress_date ||
                        "-"}
                    </td>

                    <td>
                      {item.weight
                        ? `${item.weight} kg`
                        : "-"}
                    </td>

                    <td>
                      {item.body_fat
                        ? `${item.body_fat}%`
                        : "-"}
                    </td>

                    <td>
                      {item.chest
                        ? `${item.chest} cm`
                        : "-"}
                    </td>

                    <td>
                      {item.waist
                        ? `${item.waist} cm`
                        : "-"}
                    </td>

                    <td>
                      {item.notes || "-"}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    );
  };

  const AttendancePage = () => {
    const [attendance, setAttendance] =
      useState([]);
    const [loadingAttendance, setLoadingAttendance] =
      useState(true);

    useEffect(() => {
      fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
      try {
        setLoadingAttendance(true);

        const ids = getMemberIds();

        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .order("attendance_date", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Attendance error:",
            error
          );
          return;
        }

        const filtered = (data || []).filter(
          (item) =>
            ids.includes(String(item.member_id))
        );

        setAttendance(filtered);
      } catch (error) {
        console.error(
          "Attendance loading error:",
          error
        );
      } finally {
        setLoadingAttendance(false);
      }
    };

    return (
      <div className="member-card">

        <div className="member-card-header">

          <div>
            <h2>My Attendance</h2>
            <p>
              View your gym attendance history
            </p>
          </div>

          <button
            className="member-primary-btn"
            onClick={fetchAttendance}
          >
            🔄 Refresh
          </button>

        </div>

        {loadingAttendance ? (
          <div className="member-empty">
            Loading attendance...
          </div>
        ) : attendance.length === 0 ? (
          <div className="member-empty">

            <div className="member-empty-icon">
              📅
            </div>

            <h3>
              No Attendance Records
            </h3>

            <p>
              Your attendance records will appear
              here.
            </p>

          </div>
        ) : (
          <div className="member-table-wrapper">

            <table className="member-table">

              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {attendance.map((item) => (
                  <tr key={item.id}>

                    <td>
                      {item.attendance_date ||
                        "-"}
                    </td>

                    <td>
                      {item.check_in || "-"}
                    </td>

                    <td>
                      {item.check_out || "-"}
                    </td>

                    <td>
                      <span className="member-workout-status">
                        {item.status || "Present"}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>
    );
  };

  const MembershipPage = () => {
    const [membershipPlan, setMembershipPlan] =
      useState(null);
    const [loadingMembership, setLoadingMembership] =
      useState(true);

    useEffect(() => {
      fetchMembership();
    }, []);

    const fetchMembership = async () => {
      try {
        setLoadingMembership(true);

        if (!memberRecord) {
          return;
        }

        let planDetails = null;

        if (memberRecord.plan) {
          const { data } = await supabase
            .from("membership_plans")
            .select("*")
            .eq("name", memberRecord.plan)
            .maybeSingle();

          planDetails = data;
        }

        setMembershipPlan(planDetails);
      } catch (error) {
        console.error(
          "Membership error:",
          error
        );
      } finally {
        setLoadingMembership(false);
      }
    };

    if (loadingMembership) {
      return (
        <div className="member-card">
          <div className="member-empty">
            Loading membership...
          </div>
        </div>
      );
    }

    return (
      <div className="member-card">

        <div className="member-card-header">

          <div>
            <h2>My Membership</h2>
            <p>
              View your current membership details
            </p>
          </div>

          <span className="member-workout-status">
            {memberRecord?.status || "Active"}
          </span>

        </div>

        <div className="member-profile-grid">

          <div className="member-info-box">
            <label>Membership Plan</label>
            <strong>
              {memberRecord?.plan ||
                "Not assigned"}
            </strong>
          </div>

          <div className="member-info-box">
            <label>Status</label>
            <strong>
              {memberRecord?.status ||
                "Active"}
            </strong>
          </div>

          <div className="member-info-box">
            <label>Joining Date</label>
            <strong>
              {memberRecord?.joining_date ||
                "Not available"}
            </strong>
          </div>

          <div className="member-info-box">
            <label>Expiry Date</label>
            <strong>
              {memberRecord?.expiry_date ||
                "Not available"}
            </strong>
          </div>

          {membershipPlan && (
            <>
              <div className="member-info-box">
                <label>Price</label>
                <strong>
                  ₹{membershipPlan.price || "0"}
                </strong>
              </div>

              <div className="member-info-box">
                <label>Duration</label>
                <strong>
                  {membershipPlan.duration ||
                    "Not available"}
                </strong>
              </div>

              <div className="member-info-box">
                <label>Description</label>
                <strong>
                  {membershipPlan.description ||
                    "No description"}
                </strong>
              </div>
            </>
          )}

        </div>

      </div>
    );
  };

  const NotificationsPage = () => {
    const [notifications, setNotifications] =
      useState([]);
    const [loadingNotifications, setLoadingNotifications] =
      useState(true);

    useEffect(() => {
      fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);

        const ids = getMemberIds();

        const { data, error } = await supabase
          .from("trainer_notifications")
          .select("*")
          .order("notification_date", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Notifications error:",
            error
          );
          setNotifications([]);
          return;
        }

        const filtered = (data || []).filter(
          (item) =>
            !item.member_id ||
            ids.includes(String(item.member_id))
        );

        setNotifications(filtered);
      } catch (error) {
        console.error(
          "Notification loading error:",
          error
        );
      } finally {
        setLoadingNotifications(false);
      }
    };

    return (
      <div className="member-card">

        <div className="member-card-header">

          <div>
            <h2>Notifications</h2>
            <p>
              Important updates from your gym
            </p>
          </div>

          <button
            className="member-primary-btn"
            onClick={fetchNotifications}
          >
            🔄 Refresh
          </button>

        </div>

        {loadingNotifications ? (
          <div className="member-empty">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="member-empty">

            <div className="member-empty-icon">
              🔔
            </div>

            <h3>
              No Notifications
            </h3>

            <p>
              You don't have any new notifications.
            </p>

          </div>
        ) : (
          <div>

            {notifications.map((notification) => (
              <div
                className="member-notification"
                key={notification.id}
              >

                <div className="member-notification-icon">
                  🔔
                </div>

                <div className="member-notification-content">

                  <h3>
                    {notification.title ||
                      "Notification"}
                  </h3>

                  <p>
                    {notification.message ||
                      "No message"}
                  </p>

                  <small>
                    {notification.notification_date ||
                      ""}
                  </small>

                </div>

                <span className="member-workout-status">
                  {notification.status ||
                    "Unread"}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>
    );
  };

const SettingsPage = () => {
  return (
    <div className="member-settings-page">

      {/* Header */}
      <div className="member-settings-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your account preferences and settings</p>
        </div>
        <div className="member-settings-icon">⚙️</div>
      </div>

      {/* Account Settings */}
      <div className="member-settings-section">
        <h3>Account</h3>

        <div className="member-settings-list">

          <div className="member-setting-item">
            <div className="member-setting-left">
              <div className="member-setting-icon">👤</div>
              <div>
                <h4>Profile</h4>
                <p>View and manage your personal information</p>
              </div>
            </div>
            <span className="member-setting-arrow">›</span>
          </div>

          <div className="member-setting-item">
            <div className="member-setting-left">
              <div className="member-setting-icon">📧</div>
              <div>
                <h4>Email Address</h4>
                <p>{memberProfile?.email || "Your registered email"}</p>
              </div>
            </div>
            <span className="member-setting-arrow">›</span>
          </div>

          <div className="member-setting-item">
            <div className="member-setting-left">
              <div className="member-setting-icon">📱</div>
              <div>
                <h4>Phone Number</h4>
                <p>{memberProfile?.phone || "No phone number added"}</p>
              </div>
            </div>
            <span className="member-setting-arrow">›</span>
          </div>

        </div>
      </div>

      {/* Preferences */}
      <div className="member-settings-section">
        <h3>Preferences</h3>

        <div className="member-settings-list">

          <div className="member-setting-item">
            <div className="member-setting-left">
              <div className="member-setting-icon">🔔</div>
              <div>
                <h4>Notifications</h4>
                <p>Manage your notification preferences</p>
              </div>
            </div>

            <div className="member-setting-toggle">
              <span></span>
            </div>
          </div>

          <div className="member-setting-item">
            <div className="member-setting-left">
              <div className="member-setting-icon">🎨</div>
              <div>
                <h4>Appearance</h4>
                <p>Dark blue theme</p>
              </div>
            </div>

            <span className="member-setting-arrow">›</span>
          </div>

        </div>
      </div>

      {/* Security */}
      <div className="member-settings-section">
        <h3>Security</h3>

        <div className="member-settings-list">

          <div className="member-setting-item">
            <div className="member-setting-left">
              <div className="member-setting-icon">🔐</div>
              <div>
                <h4>Password</h4>
                <p>Manage your account password</p>
              </div>
            </div>

            <span className="member-setting-arrow">›</span>
          </div>

        </div>
      </div>

      {/* Account */}
      <div className="member-settings-section">
        <h3>Account Actions</h3>

        <div className="member-settings-list">

          <div
            className="member-setting-item member-setting-danger"
            onClick={handleLogout}
          >
            <div className="member-setting-left">
              <div className="member-setting-icon">🚪</div>
              <div>
                <h4>Logout</h4>
                <p>Sign out from your account</p>
              </div>
            </div>

            <span className="member-setting-arrow">›</span>
          </div>

        </div>
      </div>

    </div>
  );
};

  const renderPage = () => {
    if (activePage === "Dashboard") {
      return <DashboardPage />;
    }

    if (activePage === "My Workouts") {
      return <MyWorkoutsPage />;
    }

    if (activePage === "Diet Plan") {
      return <DietPlanPage />;
    }

    if (activePage === "My Progress") {
      return <ProgressPage />;
    }

    if (activePage === "Attendance") {
      return <AttendancePage />;
    }

    if (activePage === "Membership") {
      return <MembershipPage />;
    }

    if (activePage === "Notifications") {
      return <NotificationsPage />;
    }

    if (activePage === "Settings") {
      return <SettingsPage />;
    }

    return <DashboardPage />;
  };

  if (loading) {
    return (
      <div className="member-loading">
        Loading Member Dashboard...
      </div>
    );
  }

  return (
    <div className="member-dashboard">

      {/* SIDEBAR */}

      <aside className="member-sidebar">

        <div className="member-logo">
          🏋️
          <span>GYM MANAGEMENT</span>
        </div>

        <div className="member-profile">

          <div className="member-avatar">
            {(
              memberProfile?.name || "M"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>
              {memberProfile?.name ||
                "Member"}
            </strong>

            <span>
              Member
            </span>
          </div>

        </div>

        <nav className="member-menu">

          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`member-menu-item ${
                activePage === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActivePage(item.name)
              }
            >
              <span>
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </button>
          ))}

        </nav>

        <button
          className="member-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="member-main">

        <div className="member-topbar">

          <div>
            <h2>
              {activePage}
            </h2>

            <p>
              Manage your gym and fitness information
            </p>
          </div>

          <div className="member-top-profile">

            <div className="member-mini-avatar">
              {(
                memberProfile?.name || "M"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {memberProfile?.name ||
                  "Member"}
              </strong>

              <small>
                Member
              </small>
            </div>

          </div>

        </div>

        {renderPage()}

      </main>

    </div>
  );
}