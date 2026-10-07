import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

const [feedbacks, setFeedbacks] = useState([]);
const [feedbackLoading, setFeedbackLoading] = useState(false);
const [showFeedbackForm, setShowFeedbackForm] = useState(false);
const [editingFeedback, setEditingFeedback] = useState(null);

const [selectedProgressMember, setSelectedProgressMember] = useState("");
// LOGGED-IN TRAINER PROFILE
const [trainerProfile, setTrainerProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(true);
const [profileError, setProfileError] = useState("");
const [feedbackForm, setFeedbackForm] = useState({
  member_id: "",
  feedback_type: "",
  rating: "",
  comments: "",
  feedback_date: "",
});

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
const [progressRecords, setProgressRecords] = useState([]);
const [progressLoading, setProgressLoading] = useState(false);
const [showProgressForm, setShowProgressForm] = useState(false);
const [editingProgress, setEditingProgress] = useState(null);

// =========================================
// SESSIONS
// =========================================

const [sessions, setSessions] = useState([]);

// =========================================
// NOTIFICATIONS
// =========================================

const [notifications, setNotifications] = useState([]);
const [notificationLoading, setNotificationLoading] = useState(false);
const [showNotificationForm, setShowNotificationForm] = useState(false);
const [editingNotification, setEditingNotification] = useState(null);

const [notificationForm, setNotificationForm] = useState({
  title: "",
  message: "",
  notification_type: "General",
  notification_date: "",
  status: "Unread",
});

const [sessionLoading, setSessionLoading] = useState(false);
const [showSessionForm, setShowSessionForm] = useState(false);
const [editingSession, setEditingSession] = useState(null);

const [sessionForm, setSessionForm] = useState({
  member_id: "",
  session_date: "",
  start_time: "",
  end_time: "",
  session_type: "",
  status: "Scheduled",
  notes: "",
});

const [progressForm, setProgressForm] = useState({
  member_id: "",
  progress_date: "",
  weight: "",
  body_fat: "",
  chest: "",
  waist: "",
  notes: "",
});

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
// FETCH LOGGED-IN TRAINER PROFILE
// -----------------------------
const fetchTrainerProfile = async () => {
  try {
    setProfileLoading(true);
    setProfileError("");

    // Get currently logged-in Supabase user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User authentication error:", userError);

      window.location.href = "/login";
      return;
    }

    // Get profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, email, phone, role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Trainer profile error:", profileError);
      setProfileError("Unable to load trainer profile.");
      return;
    }

    // Make sure this account is actually a Trainer
    if (profile.role !== "Trainer") {
      console.error("Wrong role:", profile.role);

      await supabase.auth.signOut();
      localStorage.removeItem("currentUser");

      alert("You do not have permission to access the Trainer dashboard.");

      window.location.href = "/login";
      return;
    }

    console.log("Logged-in Trainer Profile:", profile);

    setTrainerProfile(profile);

    // Keep currentUser temporarily for compatibility
    // with other existing parts of the project.
    localStorage.setItem(
      "currentUser",
      JSON.stringify(profile)
    );
  } catch (error) {
    console.error("Unexpected profile error:", error);
    setProfileError("Something went wrong while loading your profile.");
  } finally {
    setProfileLoading(false);
  }
};

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
  const fetchProgressRecords = async () => {
  setProgressLoading(true);

  const { data, error } = await supabase
    .from("member_progress")
    .select(`
      *,
      members (
        name
      )
    `)
    .order("progress_date", { ascending: false });

  if (error) {
    console.error("Progress fetch error:", error);
  } else {
    setProgressRecords(data || []);
  }

  setProgressLoading(false);
};

const fetchSessions = async () => {
  setSessionLoading(true);

  const { data, error } = await supabase
    .from("training_sessions")
    .select(`
      *,
      members (
        name
      )
    `)
    .order("session_date", { ascending: false });

  if (error) {
    console.error("Sessions fetch error:", error);
  } else {
    console.log("Sessions:", data);
    setSessions(data || []);
  }

  setSessionLoading(false);
};

const handleAddProgress = async (e) => {
  e.preventDefault();

  if (
    !progressForm.member_id ||
    !progressForm.progress_date ||
    !progressForm.weight
  ) {
    alert("Please select member, enter date and weight.");
    return;
  }

  try {
    setProgressLoading(true);

    // Convert DD-MM-YYYY to YYYY-MM-DD
    const dateParts = progressForm.progress_date.trim().split("-");

    if (dateParts.length !== 3) {
      alert("Please enter date as DD-MM-YYYY.");
      return;
    }

    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    const progressData = {
      member_id: progressForm.member_id,
      progress_date: formattedDate,
      weight: Number(progressForm.weight),

      body_fat: progressForm.body_fat
        ? Number(progressForm.body_fat)
        : null,

      chest: progressForm.chest
        ? Number(progressForm.chest)
        : null,

      waist: progressForm.waist
        ? Number(progressForm.waist)
        : null,

      notes: progressForm.notes || "",
    };

    console.log("Adding progress:", progressData);

    const { data, error } = await supabase
      .from("member_progress")
      .insert([progressData])
      .select();

    if (error) {
      console.error("ADD PROGRESS ERROR:", error);
      alert("Failed to add progress: " + error.message);
      return;
    }

    console.log("Progress added successfully:", data);

    // Find member name
    const selectedMember = members.find(
      (member) =>
        String(member.id) ===
        String(progressForm.member_id)
    );

    const memberName = selectedMember
      ? selectedMember.name
      : "Member";

    // Today's date for notification
    const today = new Date();

    const notificationDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    // Create notification
    const notificationData = {
      title: "Progress Updated",
      message: `New progress record was added for ${memberName}.`,
      notification_type: "Progress",
      notification_date: notificationDate,
      status: "Unread",
    };

    const {
      error: notificationError,
    } = await supabase
      .from("trainer_notifications")
      .insert([notificationData]);

    if (notificationError) {
      console.error(
        "Notification error:",
        notificationError
      );
    }

    
    // Clear form
    setProgressForm({
      member_id: "",
      progress_date: "",
      weight: "",
      body_fat: "",
      chest: "",
      waist: "",
      notes: "",
    });

    setShowProgressForm(false);

    // Refresh data
    await fetchProgressRecords();
    await fetchNotifications();

    alert("Progress added successfully!");

  } catch (error) {
    console.error("Unexpected progress error:", error);
    alert("Something went wrong: " + error.message);
  } finally {
    setProgressLoading(false);
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

const fetchFeedbacks = async () => {
  try {
    setFeedbackLoading(true);

    const { data, error } = await supabase
      .from("trainer_feedback")
      .select(`
        *,
        members (
          name
        )
      `)
      .order("feedback_date", { ascending: false });

    if (error) {
      console.error("Feedback fetch error:", error);
      return;
    }

    console.log("Feedbacks:", data);

    setFeedbacks(data || []);
  } catch (error) {
    console.error("Feedback error:", error);
  } finally {
    setFeedbackLoading(false);
  }
};

const handleSaveFeedback = async (e) => {
  e.preventDefault();

  if (!feedbackForm.member_id) {
    alert("Please select a member.");
    return;
  }

  if (!feedbackForm.feedback_type.trim()) {
    alert("Please enter feedback type.");
    return;
  }

  if (!feedbackForm.feedback_date) {
    alert("Please enter feedback date.");
    return;
  }

  try {
    setFeedbackLoading(true);

    const feedbackData = {
      member_id: feedbackForm.member_id,
      feedback_type: feedbackForm.feedback_type,
      rating: feedbackForm.rating
        ? Number(feedbackForm.rating)
        : null,
      comments: feedbackForm.comments,
      feedback_date: feedbackForm.feedback_date,
    };

    // =========================
    // EDIT FEEDBACK
    // =========================
    if (editingFeedback) {
      const { error } = await supabase
        .from("trainer_feedback")
        .update(feedbackData)
        .eq("id", editingFeedback.id);

      if (error) {
        console.error("Update feedback error:", error);
        alert("Unable to update feedback.");
        return;
      }

      alert("Feedback updated successfully!");
    }

    // =========================
    // ADD NEW FEEDBACK
    // =========================
    else {
      const { data, error } = await supabase
        .from("trainer_feedback")
        .insert([feedbackData])
        .select();

      if (error) {
        console.error("Add feedback error:", error);
        alert("Unable to add feedback.");
        return;
      }

      console.log("Feedback added:", data);

      // FIND MEMBER NAME
      const selectedMember = members.find(
        (member) =>
          String(member.id) === String(feedbackForm.member_id)
      );

      const memberName = selectedMember
        ? selectedMember.name
        : "Member";

      // TODAY'S DATE
      const today = new Date();

      const notificationDate =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      // =========================
      // CREATE NOTIFICATION
      // =========================
      const notificationData = {
        title: "New Feedback Added",
        message: `${memberName} submitted new ${feedbackForm.feedback_type} feedback.`,
        notification_type: "Feedback",
        notification_date: notificationDate,
        status: "Unread",
      };

      console.log(
        "Creating feedback notification:",
        notificationData
      );

      const {
        data: notificationResult,
        error: notificationError,
      } = await supabase
        .from("trainer_notifications")
        .insert([notificationData])
        .select();

      if (notificationError) {
        console.error(
          "FEEDBACK NOTIFICATION ERROR:",
          notificationError
        );
      } else {
        console.log(
          "FEEDBACK NOTIFICATION CREATED:",
          notificationResult
        );
      }

      alert("Feedback added successfully!");
    }

    // RESET FORM
    setFeedbackForm({
      member_id: "",
      feedback_type: "",
      rating: "",
      comments: "",
      feedback_date: "",
    });

    setEditingFeedback(null);
    setShowFeedbackForm(false);

    await fetchFeedbacks();

    // REFRESH NOTIFICATIONS
    await fetchNotifications();

  } catch (error) {
    console.error("Unexpected feedback error:", error);
    alert("Something went wrong.");
  } finally {
    setFeedbackLoading(false);
  }
};


const handleDeleteFeedback = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this feedback?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const { error } = await supabase
      .from("trainer_feedback")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete feedback error:", error);
      alert("Unable to delete feedback.");
      return;
    }

    alert("Feedback deleted successfully!");

    await fetchFeedbacks();

  } catch (error) {
    console.error("Unexpected delete error:", error);
    alert("Something went wrong.");
  }
};

useEffect(() => {
  fetchTrainerProfile();

  fetchMembers();
  fetchWorkoutPlans();
  fetchDietPlans();
  fetchProgressRecords();
  fetchSessions();
  fetchNotifications();
  fetchFeedbacks();
}, []);


const handleSaveSession = async (e) => {
  e.preventDefault();

  if (
    !sessionForm.member_id ||
    !sessionForm.session_date ||
    !sessionForm.session_type
  ) {
    alert(
      "Please select member, enter date and session type."
    );
    return;
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD
  const dateParts = sessionForm.session_date.split("-");

  if (dateParts.length !== 3) {
    alert("Please enter date as DD-MM-YYYY.");
    return;
  }

  const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  const sessionData = {
    member_id: sessionForm.member_id,

    session_date: formattedDate,

    start_time:
      sessionForm.start_time || null,

    end_time:
      sessionForm.end_time || null,

    session_type:
      sessionForm.session_type,

    status:
      sessionForm.status,

    notes:
      sessionForm.notes,
  };


  if (editingSession) {

    const { error } = await supabase
      .from("training_sessions")
      .update(sessionData)
      .eq("id", editingSession.id);

    if (error) {
      console.error(
        "Update session error:",
        error
      );

      alert("Failed to update session.");
      return;
    }

    alert("Session updated successfully!");

  } else {

    const { error } = await supabase
      .from("training_sessions")
      .insert([sessionData]);

    if (error) {
      console.error(
        "Add session error:",
        error
      );

      alert("Failed to add session.");
      return;
    }

    alert("Session added successfully!");
  }


  setSessionForm({
    member_id: "",
    session_date: "",
    start_time: "",
    end_time: "",
    session_type: "",
    status: "Scheduled",
    notes: "",
  });

  setEditingSession(null);
  setShowSessionForm(false);

  fetchSessions();
};

const handleDeleteSession = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this session?"
  );

  if (!confirmDelete) {
    return;
  }

  const { error } = await supabase
    .from("training_sessions")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete session error:", error);
    alert("Failed to delete session.");
    return;
  }

  alert("Session deleted successfully!");

  fetchSessions();
};

const fetchNotifications = async () => {
  try {
    setNotificationLoading(true);

    const { data, error } = await supabase
      .from("trainer_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Notification fetch error:", error);
      return;
    }

    console.log("ALL TRAINER NOTIFICATIONS:", data);

    setNotifications(data || []);
  } catch (error) {
    console.error("Notification error:", error);
  } finally {
    setNotificationLoading(false);
  }
};
const handleSaveNotification = async (e) => {
  e.preventDefault();

  if (
    !notificationForm.title ||
    !notificationForm.message ||
    !notificationForm.notification_date
  ) {
    alert("Please fill title, message and date.");
    return;
  }

  const parts = notificationForm.notification_date.split("-");

  if (parts.length !== 3) {
    alert("Please enter date as DD-MM-YYYY.");
    return;
  }

  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

  const notificationData = {
    title: notificationForm.title,
    message: notificationForm.message,
    notification_type: notificationForm.notification_type,
    notification_date: formattedDate,
    status: notificationForm.status,
  };

  if (editingNotification) {
    const { error } = await supabase
      .from("trainer_notifications")
      .update(notificationData)
      .eq("id", editingNotification.id);

    if (error) {
      console.error("Update notification error:", error);
      alert("Failed to update notification.");
      return;
    }

    alert("Notification updated successfully!");
  } else {
    const { error } = await supabase
      .from("trainer_notifications")
      .insert([notificationData]);

    if (error) {
      console.error("Add notification error:", error);
      alert("Failed to add notification.");
      return;
    }

    alert("Notification added successfully!");
  }

  setNotificationForm({
    title: "",
    message: "",
    notification_type: "General",
    notification_date: "",
    status: "Unread",
  });

  setEditingNotification(null);
  setShowNotificationForm(false);

  fetchNotifications();
};


const handleDeleteNotification = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this notification?"
  );

  if (!confirmDelete) {
    return;
  }

  const { error } = await supabase
    .from("trainer_notifications")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete notification error:", error);
    alert("Failed to delete notification.");
    return;
  }

  alert("Notification deleted successfully!");

  fetchNotifications();
};

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

    // =========================
    // EDIT DIET PLAN
    // =========================
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

    // =========================
    // ADD NEW DIET PLAN
    // =========================
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

      // FIND MEMBER
      const selectedMember = members.find(
        (member) =>
          String(member.id) === String(dietForm.member_id)
      );

      const memberName = selectedMember
        ? selectedMember.name
        : "Member";

      // TODAY'S DATE
      const today = new Date();

      const notificationDate =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0");

      // =========================
      // CREATE NOTIFICATION
      // =========================
      const notificationData = {
        title: "Diet Plan Added",
        message: `New diet plan "${dietForm.plan_name}" was added for ${memberName}.`,
        notification_type: "Diet",
        notification_date: notificationDate,
        status: "Unread",
      };

      console.log(
        "Creating diet notification:",
        notificationData
      );

      const { data: notificationDataResult, error: notificationError } =
        await supabase
          .from("trainer_notifications")
          .insert([notificationData])
          .select();

      if (notificationError) {
        console.error(
          "DIET NOTIFICATION ERROR:",
          notificationError
        );

        alert(
          "Diet plan was added, but notification could not be created."
        );
      } else {
        console.log(
          "DIET NOTIFICATION CREATED:",
          notificationDataResult
        );
      }

      alert("Diet plan added successfully!");
    }

    // RESET
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
    await fetchNotifications();

  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setDietLoading(false);
  }
};


const handleEditProgress = async (e) => {
  e.preventDefault();

  const { error } = await supabase
    .from("member_progress")
    .update({
      member_id: progressForm.member_id,
      progress_date: progressForm.progress_date,
      weight: Number(progressForm.weight),
      body_fat: progressForm.body_fat
        ? Number(progressForm.body_fat)
        : null,
      chest: progressForm.chest
        ? Number(progressForm.chest)
        : null,
      waist: progressForm.waist
        ? Number(progressForm.waist)
        : null,
      notes: progressForm.notes,
    })
    .eq("id", editingProgress.id);

  if (error) {
    console.error("Edit progress error:", error);
    alert("Failed to update progress");
    return;
  }

  alert("Progress updated successfully!");

  setEditingProgress(null);
  setShowProgressForm(false);

  setProgressForm({
    member_id: "",
    progress_date: "",
    weight: "",
    body_fat: "",
    chest: "",
    waist: "",
    notes: "",
  });

  fetchProgressRecords();
};


const handleDeleteProgress = async (id) => {
  if (!window.confirm("Are you sure you want to delete this progress record?")) {
    return;
  }

  const { error } = await supabase
    .from("member_progress")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete progress error:", error);
    alert("Failed to delete progress");
    return;
  }

  alert("Progress deleted successfully!");

  fetchProgressRecords();
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

const handleLogout = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
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

  if (!editingWorkout) {
    alert("No workout plan selected for editing.");
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

    // Find member name
    const selectedMember = members.find(
      (member) => String(member.id) === String(workoutForm.member_id)
    );

    const memberName = selectedMember
      ? selectedMember.name
      : "Member";

    // Get today's date
    const today = new Date();
    const notificationDate =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    // Create automatic notification
    const { error: notificationError } = await supabase
      .from("trainer_notifications")
      .insert([
        {
          title: "Workout Plan Added",
          message: `New workout plan "${workoutForm.plan_name}" was added for ${memberName}.`,
          notification_type: "Workout",
          notification_date: notificationDate,
          status: "Unread",
        },
      ]);

    if (notificationError) {
      console.error(
        "Workout notification error:",
        notificationError
      );
    } else {
      console.log("Workout notification created successfully.");
    }

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
    await fetchNotifications();

    alert("Workout plan added successfully!");
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Something went wrong.");
  } finally {
    setWorkoutLoading(false);
  }
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
            Welcome back,{" "}
              <span>{trainerProfile?.name || "Trainer"}</span> 👋
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

if (activePage === "Settings") {
  return (
    <div className="page-content settings-page">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your trainer account and system preferences.</p>
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <div className="settings-card">
        <div className="settings-card-header">
          <div>
            <h2>Profile Settings</h2>
            <p>Your trainer account information</p>
          </div>
        </div>

        <div className="settings-grid">

          <div className="setting-item">
            <span className="setting-label">Trainer Name</span>
            <span className="setting-value">
  {trainerProfile?.name || "Loading..."}
</span>
          </div>

          <div className="setting-item">
            <span className="setting-label">Email</span>
            <span className="setting-value">
  {trainerProfile?.email || "Loading..."}
</span>
          </div>

          <div className="setting-item">
            <span className="setting-label">Phone Number</span>
            <span className="setting-value">
  {trainerProfile?.phone || "Not provided"}
</span>
          </div>

          <div className="setting-item">
            <span className="setting-label">Specialization</span>
            <span className="setting-value">Fitness & Strength Training</span>
          </div>

        </div>
      </div>


      {/* GYM SETTINGS */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Gym Settings</h2>
            <p>General gym information</p>
          </div>
        </div>

        <div className="settings-grid">

          <div className="setting-item">
            <span className="setting-label">Gym Name</span>
            <span className="setting-value">Gym Management System</span>
          </div>

          <div className="setting-item">
            <span className="setting-label">Gym Address</span>
            <span className="setting-value">Main Branch</span>
          </div>

          <div className="setting-item">
            <span className="setting-label">Opening Time</span>
            <span className="setting-value">06:00 AM</span>
          </div>

          <div className="setting-item">
            <span className="setting-label">Closing Time</span>
            <span className="setting-value">10:00 PM</span>
          </div>

        </div>
      </div>


      {/* NOTIFICATION SETTINGS */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Notification Settings</h2>
            <p>Automatic trainer notifications</p>
          </div>
        </div>

        <div className="settings-list">

          <div className="setting-row">
            <div>
              <strong>Workout Plan Notifications</strong>
              <p>Receive notifications when workout plans are updated.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Diet Plan Notifications</strong>
              <p>Receive notifications when diet plans are updated.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Progress Notifications</strong>
              <p>Receive notifications when member progress is updated.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Feedback Notifications</strong>
              <p>Receive notifications when members submit feedback.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Session Notifications</strong>
              <p>Receive notifications about training sessions.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

        </div>
      </div>


      {/* SYSTEM PREFERENCES */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>System Preferences</h2>
            <p>Default application preferences</p>
          </div>
        </div>

        <div className="settings-list">

          <div className="setting-row">
            <div>
              <strong>Dark Blue Theme</strong>
              <p>Use the professional dark blue trainer dashboard theme.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Email Notifications</strong>
              <p>Receive important system updates through email.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

          <div className="setting-row">
            <div>
              <strong>Automatic Notifications</strong>
              <p>Automatically create notifications for important activities.</p>
            </div>
            <span className="status-on">ON</span>
          </div>

        </div>
      </div>


      {/* SECURITY */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div>
            <h2>Security</h2>
            <p>Manage your account security</p>
          </div>
        </div>

        <div className="security-actions">

          <button
  className="settings-action-btn"
  onClick={async () => {
    const newPassword = window.prompt("Enter your new password:");

    if (!newPassword) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const confirmPassword = window.prompt("Confirm your new password:");

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Password change failed: " + error.message);
      console.error(error);
      return;
    }

    alert("Password changed successfully!");
  }}
>
  Change Password
</button>

          <button
            className="settings-action-btn logout-settings-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>

    </div>
  );
}

        if (activePage === "Progress") {
      return (
        <div className="page-content">

          <div className="page-header">
            <div>
              <h1>Progress</h1>
              <p>Track and manage member fitness progress.</p>
            </div>

            <button
              className="add-btn"
              onClick={() => {
                console.log("ADD PROGRESS BUTTON CLICKED");

                setEditingProgress(null);

                setProgressForm({
                  member_id: "",
                  progress_date: "",
                  weight: "",
                  body_fat: "",
                  chest: "",
                  waist: "",
                  notes: "",
                });

                setShowProgressForm(true);
              }}
            >
              + Add Progress
            </button>
          </div>

          {showProgressForm && (
            <div className="form-card">

              <h2>
                {editingProgress
                  ? "Edit Progress"
                  : "Add Progress"}
              </h2>

              <form
                onSubmit={
                  editingProgress
                    ? handleEditProgress
                    : handleAddProgress
                }
              >

                <div className="form-group">
                  <label>Member</label>

                  <select
                    value={progressForm.member_id}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        member_id: e.target.value,
                      })
                    }
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
                  <label>Progress Date</label>

                  <input
                    type="text"
                    placeholder="DD-MM-YYYY"
                    value={progressForm.progress_date}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        progress_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Weight (kg)</label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter weight"
                    value={progressForm.weight}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        weight: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Body Fat (%)</label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter body fat"
                    value={progressForm.body_fat}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        body_fat: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Chest (cm)</label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter chest"
                    value={progressForm.chest}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        chest: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Waist (cm)</label>

                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter waist"
                    value={progressForm.waist}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        waist: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>

                  <textarea
                    rows="4"
                    placeholder="Enter notes..."
                    value={progressForm.notes}
                    onChange={(e) =>
                      setProgressForm({
                        ...progressForm,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    {editingProgress
                      ? "Update Progress"
                      : "Save Progress"}
                  </button>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowProgressForm(false);
                      setEditingProgress(null);
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>
            </div>
          )}

          {/* WEIGHT PROGRESS GRAPH */}
<div className="table-card">

  <h2>Weight Progress</h2>

  {progressRecords.length === 0 ? (
    <div className="empty-state">
      <p>Add progress records to see the weight graph.</p>
    </div>
  ) : (
    <div style={{ width: "100%", height: 350 }}>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={[...progressRecords]
            .sort(
              (a, b) =>
                new Date(a.progress_date) -
                new Date(b.progress_date)
            )
            .map((progress) => ({
              date: progress.progress_date,
              weight: Number(progress.weight),
            }))}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="date"
          />

          <YAxis
            label={{
              value: "Weight (kg)",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="weight"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  )}

</div>

          <div className="table-card">

            <h2>Member Progress Records</h2>

            {progressLoading ? (
              <div className="empty-state">
                Loading progress...
              </div>
            ) : progressRecords.length === 0 ? (
              <div className="empty-state">
                <h3>No Progress Records Found</h3>
                <p>Add progress to see records here.</p>
              </div>
            ) : (
              <div className="table-wrapper">

                <table>

                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Date</th>
                      <th>Weight</th>
                      <th>Body Fat</th>
                      <th>Chest</th>
                      <th>Waist</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {progressRecords.map((progress) => (
                      <tr key={progress.id}>

                        <td>
                          {progress.members?.name ||
                            "Unknown Member"}
                        </td>

                        <td>
                          {progress.progress_date}
                        </td>

                        <td>
                          {progress.weight} kg
                        </td>

                        <td>
                          {progress.body_fat
                            ? `${progress.body_fat}%`
                            : "—"}
                        </td>

                        <td>
                          {progress.chest
                            ? `${progress.chest} cm`
                            : "—"}
                        </td>

                        <td>
                          {progress.waist
                            ? `${progress.waist} cm`
                            : "—"}
                        </td>

                        <td>

                          <button
                            className="edit-btn"
                            onClick={() => {

                              setEditingProgress(progress);

                              setProgressForm({
                                member_id:
                                  progress.member_id || "",
                                progress_date:
                                  progress.progress_date || "",
                                weight:
                                  progress.weight || "",
                                body_fat:
                                  progress.body_fat || "",
                                chest:
                                  progress.chest || "",
                                waist:
                                  progress.waist || "",
                                notes:
                                  progress.notes || "",
                              });

                              setShowProgressForm(true);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteProgress(
                                progress.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>
      );
    }

    if (activePage === "Notifications") {
  return (
    <div className="page-content">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your latest gym activities.</p>
        </div>
      </div>

      {/* NOTIFICATIONS CARD */}
      <div className="table-card notifications-card">

        <div className="notifications-header">
          <div>
            <h2>Notification Inbox</h2>
            <p>
              {notifications.filter(
                (notification) => notification.status === "Unread"
              ).length}{" "}
              unread notification(s)
            </p>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <h3>No Notifications</h3>
            <p>You don't have any notifications yet.</p>
          </div>
        ) : (
          <div className="notifications-list">

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.status === "Unread"
                    ? "notification-unread"
                    : ""
                }`}
              >

                {/* ICON */}
                <div className="notification-icon">
                  🔔
                </div>

                {/* CONTENT */}
                <div className="notification-content">

                  <div className="notification-title-row">
                    <h3>{notification.title}</h3>

                    {notification.status === "Unread" && (
                      <span className="unread-badge">
                        Unread
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-date">
                    {notification.notification_date}
                  </div>

                </div>

                {/* ACTIONS */}
                <div className="notification-actions">

                  {notification.status === "Unread" && (
                    <button
                      className="notification-read-btn"
                      onClick={async () => {

                        const { error } = await supabase
                          .from("trainer_notifications")
                          .update({
                            status: "Read",
                          })
                          .eq("id", notification.id);

                        if (error) {
                          console.error(
                            "Mark as read error:",
                            error
                          );
                          alert("Failed to mark as read.");
                          return;
                        }

                        fetchNotifications();
                      }}
                    >
                      Mark as Read
                    </button>
                  )}

                  <button
                    className="notification-delete-btn"
                    onClick={async () => {

                      if (
                        !window.confirm(
                          "Are you sure you want to delete this notification?"
                        )
                      ) {
                        return;
                      }

                      const { error } = await supabase
                        .from("trainer_notifications")
                        .delete()
                        .eq("id", notification.id);

                      if (error) {
                        console.error(
                          "Delete notification error:",
                          error
                        );
                        alert("Failed to delete notification.");
                        return;
                      }

                      fetchNotifications();
                    }}
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

    if (activePage === "Feedback") {
  return (
    <div className="page-content">

      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h1>Feedback</h1>
          <p>Manage member feedback and reviews</p>
        </div>

        <button
          className="add-btn"
          onClick={() => {
            setEditingFeedback(null);

            setFeedbackForm({
              member_id: "",
              feedback_type: "",
              rating: "",
              comments: "",
              feedback_date: "",
            });

            setShowFeedbackForm(true);
          }}
        >
          + Add Feedback
        </button>
      </div>


      {/* FEEDBACK FORM */}
      {showFeedbackForm && (
        <div className="form-card">

          <h2>
            {editingFeedback
              ? "Edit Feedback"
              : "Add Feedback"}
          </h2>

          <form onSubmit={handleSaveFeedback}>

            {/* MEMBER */}
            <div className="form-group">
              <label>Member</label>

              <select
                value={feedbackForm.member_id}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    member_id: e.target.value,
                  })
                }
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


            {/* FEEDBACK TYPE */}
            <div className="form-group">
              <label>Feedback Type</label>

              <input
                type="text"
                placeholder="Example: Workout, Trainer, Gym"
                value={feedbackForm.feedback_type}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    feedback_type: e.target.value,
                  })
                }
                required
              />
            </div>


            {/* RATING */}
            <div className="form-group">
              <label>Rating (1 - 5)</label>

              <input
                type="number"
                min="1"
                max="5"
                placeholder="Enter rating"
                value={feedbackForm.rating}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    rating: e.target.value,
                  })
                }
              />
            </div>


            {/* DATE */}
            <div className="form-group">
              <label>Feedback Date</label>

              <input
                type="text"
                placeholder="DD-MM-YYYY"
                value={feedbackForm.feedback_date}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    feedback_date: e.target.value,
                  })
                }
                required
              />
            </div>


            {/* COMMENTS */}
            <div className="form-group">
              <label>Comments</label>

              <textarea
                rows="5"
                placeholder="Enter member feedback..."
                value={feedbackForm.comments}
                onChange={(e) =>
                  setFeedbackForm({
                    ...feedbackForm,
                    comments: e.target.value,
                  })
                }
              />
            </div>


            {/* BUTTONS */}
            <div className="form-actions">

              <button
                type="submit"
                className="save-btn"
              >
                {editingFeedback
                  ? "Update Feedback"
                  : "Save Feedback"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowFeedbackForm(false);
                  setEditingFeedback(null);
                }}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}


      {/* FEEDBACK LIST */}
      <div className="feedback-container">

        {feedbackLoading ? (
          <div className="empty-state">
            Loading feedback...
          </div>
        ) : feedbacks.length === 0 ? (

          <div className="empty-state">
            <h3>No Feedback Found</h3>
            <p>
              Add feedback to see it here.
            </p>
          </div>

        ) : (

          feedbacks.map((feedback) => (
            <div
              className="feedback-card"
              key={feedback.id}
            >

              <div className="feedback-top">

                <div>
                  <h3>
                    {feedback.members?.name ||
                      "Unknown Member"}
                  </h3>

                  <span className="feedback-type">
                    {feedback.feedback_type}
                  </span>
                </div>

                <div className="feedback-rating">
                  ⭐ {feedback.rating || "N/A"}/5
                </div>

              </div>


              <p className="feedback-comments">
                {feedback.comments ||
                  "No comments provided."}
              </p>


              <div className="feedback-bottom">

                <span>
                  📅 {feedback.feedback_date}
                </span>

                <div className="feedback-actions">

                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingFeedback(feedback);

                      setFeedbackForm({
                        member_id:
                          feedback.member_id || "",
                        feedback_type:
                          feedback.feedback_type || "",
                        rating:
                          feedback.rating || "",
                        comments:
                          feedback.comments || "",
                        feedback_date:
                          feedback.feedback_date || "",
                      });

                      setShowFeedbackForm(true);
                    }}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDeleteFeedback(feedback.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>
          ))

        )}

      </div>

    </div>
  );
}

if (activePage === "Notifications") {
  return (
    <div className="page-content">

      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Automatic notifications</p>
        </div>
      </div>

      <div className="notifications-container">

        {notificationLoading ? (
          <div className="empty-state">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <h3>No Notifications</h3>
            <p>
              Notifications will appear here automatically when
              trainer activities are performed.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className="notification-card"
              key={notification.id}
            >
              <div className="notification-icon">
                🔔
              </div>

              <div className="notification-content">
                <h3>{notification.title}</h3>

                <p>{notification.message}</p>

                <div className="notification-details">
                  <span>
                    {notification.notification_type}
                  </span>

                  <span>
                    {notification.notification_date}
                  </span>

                </div>
              </div>
            </div>
          ))
        )}

      </div>

    </div>
  );
}

  // =========================================
  // SESSIONS
  // =========================================

  if (activePage === "Sessions") {
    return (
      <div className="page-content">

        <div className="page-header">
          <div>
            <h1>Sessions</h1>
            <p>
              Schedule and manage training sessions for your members.
            </p>
          </div>

          <button
            className="add-btn"
            onClick={() => {
              setEditingSession(null);

              setSessionForm({
                member_id: "",
                session_date: "",
                start_time: "",
                end_time: "",
                session_type: "",
                status: "Scheduled",
                notes: "",
              });

              setShowSessionForm(true);
            }}
          >
            + Add Session
          </button>
        </div>


        {/* ================================
            ADD / EDIT SESSION FORM
        ================================= */}

        {showSessionForm && (
          <div className="form-card session-form-card">

            <h2>
              {editingSession
                ? "Edit Session"
                : "Add Session"}
            </h2>

            <form onSubmit={handleSaveSession}>

              <div className="form-grid">

                {/* MEMBER */}
                <div className="form-group">
                  <label>Member</label>

                  <select
                    value={sessionForm.member_id}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        member_id: e.target.value,
                      })
                    }
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


                {/* SESSION DATE */}
                <div className="form-group">
                  <label>Session Date</label>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="DD-MM-YYYY"
                    value={sessionForm.session_date}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        session_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>


                {/* START TIME */}
                <div className="form-group">
                  <label>Start Time</label>

                  <input
                    type="text"
                    placeholder="HH:MM"
                    value={sessionForm.start_time}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        start_time: e.target.value,
                      })
                    }
                  />
                </div>


                {/* END TIME */}
                <div className="form-group">
                  <label>End Time</label>

                  <input
                    type="text"
                    placeholder="HH:MM"
                    value={sessionForm.end_time}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        end_time: e.target.value,
                      })
                    }
                  />
                </div>


                {/* SESSION TYPE */}
                <div className="form-group">
                  <label>Session Type</label>

                  <input
                    type="text"
                    placeholder="Example: Strength Training"
                    value={sessionForm.session_type}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        session_type: e.target.value,
                      })
                    }
                    required
                  />
                </div>


                {/* STATUS */}
                <div className="form-group">
                  <label>Status</label>

                  <select
                    value={sessionForm.status}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        status: e.target.value,
                      })
                    }
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


              {/* NOTES */}

              <div className="form-group">
                <label>Notes</label>

                <textarea
                  placeholder="Enter session notes"
                  value={sessionForm.notes}
                  onChange={(e) =>
                    setSessionForm({
                      ...sessionForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>


              {/* BUTTONS */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="save-btn session-save-btn"
                >
                  {editingSession
                    ? "Update Session"
                    : "Save Session"}
                </button>

                <button
                  type="button"
                  className="cancel-btn session-cancel-btn"
                  onClick={() => {
                    setShowSessionForm(false);
                    setEditingSession(null);
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}


        {/* ================================
            SESSION RECORDS
        ================================= */}

        <div className="table-card session-table-card">

          <div className="table-header">
            <div>
              <h2>Training Sessions</h2>
              <p>
                View and manage scheduled training sessions.
              </p>
            </div>
          </div>


          {sessionLoading ? (

            <div className="empty-state">
              Loading sessions...
            </div>

          ) : sessions.length === 0 ? (

            <div className="empty-state">
              <div className="empty-icon">
                📅
              </div>

              <h3>No Sessions Yet</h3>

              <p>
                Add your first training session.
              </p>
            </div>

          ) : (

            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Date</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Session Type</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {sessions.map((session) => (

                    <tr key={session.id}>

                      <td>
                        <strong>
                          {session.members?.name || "Unknown"}
                        </strong>
                      </td>

                      <td>
                        {session.session_date || "-"}
                      </td>

                      <td>
                        {session.start_time || "-"}
                      </td>

                      <td>
                        {session.end_time || "-"}
                      </td>

                      <td>
                        {session.session_type || "-"}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            session.status === "Completed"
                              ? "completed"
                              : session.status === "Cancelled"
                              ? "cancelled"
                              : "scheduled"
                          }`}
                        >
                          {session.status}
                        </span>
                      </td>

                      <td>
                        {session.notes || "-"}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-btn"
                            onClick={() => {

                              setEditingSession(session);

                              setSessionForm({
                                member_id:
                                  session.member_id || "",

                                session_date:
                                  session.session_date
                                    ? session.session_date
                                        .split("-")
                                        .reverse()
                                        .join("-")
                                    : "",

                                start_time:
                                  session.start_time
                                    ? session.start_time.slice(0, 5)
                                    : "",

                                end_time:
                                  session.end_time
                                    ? session.end_time.slice(0, 5)
                                    : "",

                                session_type:
                                  session.session_type || "",

                                status:
                                  session.status || "Scheduled",

                                notes:
                                  session.notes || "",
                              });

                              setShowSessionForm(true);
                            }}
                          >
                            Edit
                          </button>


                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteSession(session.id)
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

          )}

        </div>

      </div>
    );
  }

// =============================
// PROGRESS
// =============================
if (activePage === "Progress") {
  const selectedMemberProgress = progressRecords
    .filter(
      (record) =>
        !selectedProgressMember ||
        String(record.member_id) ===
          String(selectedProgressMember)
    )
    .sort(
      (a, b) =>
        new Date(a.progress_date) -
        new Date(b.progress_date)
    );

  const progressChartData = selectedMemberProgress.map(
    (record) => ({
      date: record.progress_date,
      weight: Number(record.weight),
      bodyFat: record.body_fat
        ? Number(record.body_fat)
        : null,
    })
  );

  return (
    <div className="page-content">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Progress Tracking</h1>
          <p>
            Track member fitness progress over time
          </p>
        </div>

       <button
  type="button"
  className="add-btn"
  onClick={() => {
    console.log("ADD PROGRESS BUTTON CLICKED");

    setEditingProgress(null);

    setProgressForm({
      member_id: "",
      progress_date: "",
      weight: "",
      body_fat: "",
      chest: "",
      waist: "",
      notes: "",
    });

    setShowProgressForm(true);
  }}
>
  + Add Progress
</button>
      </div>


      {/* MEMBER SELECT */}
      <div className="progress-member-selector">

        <label>Select Member</label>

        <select
          value={selectedProgressMember}
          onChange={(e) =>
            setSelectedProgressMember(e.target.value)
          }
        >
          <option value="">
            Select a member
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


      {/* WEIGHT GRAPH */}
      <div className="progress-chart-card">

  <div className="progress-chart-header">
    <div>
      <h2>Weight Progress</h2>
      <p>Weight changes over time</p>
    </div>

    {selectedMemberProgress.length > 0 && (
      <div className="chart-summary">
        <span>
          Records: {selectedMemberProgress.length}
        </span>

        <span>
          Latest:{" "}
          {
            selectedMemberProgress[
              selectedMemberProgress.length - 1
            ].weight
          } kg
        </span>
      </div>
    )}
  </div>

  {selectedMemberProgress.length < 2 ? (

    <div className="chart-empty">
      <h3>Not enough data</h3>
      <p>
        Add at least two progress records for this
        member to display the weight graph.
      </p>
    </div>

  ) : (

    <div className="real-line-chart">

      <div className="y-axis">

        <span>
          {Math.max(
            ...selectedMemberProgress.map(
              (item) => Number(item.weight)
            )
          )} kg
        </span>

        <span>
          {(
            (Math.max(
              ...selectedMemberProgress.map(
                (item) => Number(item.weight)
              )
            ) +
              Math.min(
                ...selectedMemberProgress.map(
                  (item) => Number(item.weight)
                )
              )) /
            2
          ).toFixed(1)} kg
        </span>

        <span>
          {Math.min(
            ...selectedMemberProgress.map(
              (item) => Number(item.weight)
            )
          )} kg
        </span>

      </div>


      <div className="svg-chart-container">

        {(() => {

          const width = 900;
          const height = 300;
          const padding = 40;

          const weights =
            selectedMemberProgress.map(
              (item) => Number(item.weight)
            );

          const maxWeight = Math.max(...weights);
          const minWeight = Math.min(...weights);

          const range =
            maxWeight - minWeight || 1;

          const points =
            selectedMemberProgress.map(
              (item, index) => {

                const x =
                  padding +
                  (index *
                    (width - padding * 2)) /
                    (selectedMemberProgress.length - 1);

                const y =
                  height -
                  padding -
                  ((Number(item.weight) -
                    minWeight) /
                    range) *
                    (height - padding * 2);

                return {
                  x,
                  y,
                  weight: item.weight,
                  date: item.progress_date,
                };

              }
            );

          const path = points
            .map(
              (point, index) =>
                `${index === 0 ? "M" : "L"} ${
                  point.x
                } ${point.y}`
            )
            .join(" ");

          return (
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="weight-svg"
              preserveAspectRatio="none"
            >

              {/* Grid lines */}

              <line
                x1="40"
                y1="40"
                x2="860"
                y2="40"
                className="chart-grid-line"
              />

              <line
                x1="40"
                y1="150"
                x2="860"
                y2="150"
                className="chart-grid-line"
              />

              <line
                x1="40"
                y1="260"
                x2="860"
                y2="260"
                className="chart-grid-line"
              />


              {/* Main line */}

              <path
                d={path}
                className="weight-line"
                fill="none"
              />


              {/* Points */}

              {points.map((point, index) => (
                <g key={index}>

                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="7"
                    className="weight-point"
                  />

                  <text
                    x={point.x}
                    y={point.y - 15}
                    className="weight-label"
                    textAnchor="middle"
                  >
                    {point.weight} kg
                  </text>

                </g>
              ))}

            </svg>
          );

        })()}

      </div>

    </div>

  )}

</div>


      {/* BODY FAT */}
      <div className="progress-chart-card">

        <div className="progress-chart-header">
          <div>
            <h2>Body Fat Progress</h2>
            <p>Body fat percentage over time</p>
          </div>
        </div>

        {progressChartData.filter(
          (item) => item.bodyFat !== null
        ).length === 0 ? (
          <div className="chart-empty">
            No body fat data available.
          </div>
        ) : (
          <div className="body-fat-list">

            {progressChartData
              .filter(
                (item) => item.bodyFat !== null
              )
              .map((record, index) => (
                <div
                  className="body-fat-row"
                  key={index}
                >

                  <span>
                    {record.date}
                  </span>

                  <div className="body-fat-bar">

                    <div
                      className="body-fat-fill"
                      style={{
                        width: `${Math.min(
                          record.bodyFat * 3,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <strong>
                    {record.bodyFat}%
                  </strong>

                </div>
              ))}

          </div>
        )}

      </div>


      {/* ADD / EDIT FORM */}
      {showProgressForm && (
        <div className="form-card">

          <h2>
            {editingProgress
              ? "Edit Progress"
              : "Add Progress"}
          </h2>

          <form
            onSubmit={
              editingProgress
                ? handleEditProgress
                : handleAddProgress
            }
          >

            <div className="form-group">
              <label>Member</label>

              <select
                value={progressForm.member_id}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    member_id: e.target.value,
                  })
                }
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
              <label>Progress Date</label>

              <input
                type="text"
                placeholder="DD-MM-YYYY"
                value={progressForm.progress_date}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    progress_date: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>Weight (kg)</label>

              <input
                type="number"
                step="0.01"
                placeholder="Enter weight"
                value={progressForm.weight}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    weight: e.target.value,
                  })
                }
                required
              />
            </div>


            <div className="form-group">
              <label>Body Fat (%)</label>

              <input
                type="number"
                step="0.01"
                placeholder="Enter body fat"
                value={progressForm.body_fat}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    body_fat: e.target.value,
                  })
                }
              />
            </div>


            <div className="form-group">
              <label>Chest (cm)</label>

              <input
                type="number"
                step="0.01"
                placeholder="Enter chest measurement"
                value={progressForm.chest}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    chest: e.target.value,
                  })
                }
              />
            </div>


            <div className="form-group">
              <label>Waist (cm)</label>

              <input
                type="number"
                step="0.01"
                placeholder="Enter waist measurement"
                value={progressForm.waist}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    waist: e.target.value,
                  })
                }
              />
            </div>


            <div className="form-group">
              <label>Notes</label>

              <textarea
                rows="4"
                placeholder="Enter progress notes"
                value={progressForm.notes}
                onChange={(e) =>
                  setProgressForm({
                    ...progressForm,
                    notes: e.target.value,
                  })
                }
              />
            </div>


            <div className="form-actions">

              <button
                type="submit"
                className="save-btn"
              >
                {editingProgress
                  ? "Update Progress"
                  : "Save Progress"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowProgressForm(false);
                  setEditingProgress(null);
                }}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}


      {/* PROGRESS RECORDS */}
      <div className="progress-records">

        <h2>Progress Records</h2>

        {progressLoading ? (
          <div className="empty-state">
            Loading progress...
          </div>
        ) : selectedMemberProgress.length === 0 ? (
          <div className="empty-state">
            No progress records found.
          </div>
        ) : (

          selectedMemberProgress.map((record) => (
            <div
              className="progress-record-card"
              key={record.id}
            >

              <div>
                <h3>
                  {record.members?.name ||
                    "Member"}
                </h3>

                <p>
                  Date: {record.progress_date}
                </p>

                <p>
                  Weight: {record.weight} kg
                </p>

                {record.body_fat !== null && (
                  <p>
                    Body Fat: {record.body_fat}%
                  </p>
                )}

                {record.chest !== null && (
                  <p>
                    Chest: {record.chest} cm
                  </p>
                )}

                {record.waist !== null && (
                  <p>
                    Waist: {record.waist} cm
                  </p>
                )}

                {record.notes && (
                  <p>
                    Notes: {record.notes}
                  </p>
                )}
              </div>


              <div className="progress-actions">

                <button
                  className="edit-btn"
                  onClick={() => {

                    setEditingProgress(record);

                    setProgressForm({
                      member_id:
                        record.member_id || "",
                      progress_date:
                        record.progress_date || "",
                      weight:
                        record.weight || "",
                      body_fat:
                        record.body_fat || "",
                      chest:
                        record.chest || "",
                      waist:
                        record.waist || "",
                      notes:
                        record.notes || "",
                    });

                    setShowProgressForm(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDeleteProgress(record.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>
          ))

        )}

      </div>

    </div>
  );
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

    <div className="progress-form-card">
      <div className="progress-form-grid">
        <div className="progress-form-group">
          <div className="progress-form-buttons">
            <button type="submit" className="progress-save-btn">
  {editingProgress ? "Update Progress" : "Save Progress"}
</button>
<button
  type="button"
  className="progress-cancel-btn"
  onClick={() => {
    setShowProgressForm(false);
    setEditingProgress(null);
  }}
>
  Cancel
</button>
          </div>
        </div>
      </div>
    </div>
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
    {trainerProfile?.name
      ? trainerProfile.name.charAt(0).toUpperCase()
      : "T"}
  </div>

  <div>
    <strong>
      {trainerProfile?.name || "Trainer"}
    </strong>

    <span>
      {trainerProfile?.role || "Trainer"}
    </span>
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
    {trainerProfile?.name
      ? trainerProfile.name.charAt(0).toUpperCase()
      : "T"}
  </div>

  <div>
    <strong>
      {trainerProfile?.name || "Trainer"}
    </strong>

    <small>
      {trainerProfile?.email || "Trainer Account"}
    </small>
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
