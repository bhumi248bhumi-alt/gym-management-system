import { useState, useEffect } from "react";
import "./Admin.css";
import { supabase } from "../../lib/supabase";

function Admin() {
  const currentUser =
    JSON.parse(localStorage.getItem("currentUser")) || {
      name: "Admin",
      email: "admin@gmail.com",
      role: "Admin",
    };

  // ==========================================
  // GENERAL
  // ==========================================

  const [activePage, setActivePage] = useState("Dashboard");

  // ==========================================
  // MEMBERS
  // ==========================================

  const [members, setMembers] = useState([]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);

  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Basic",
    status: "Active",
  });

  // ==========================================
  // PAYMENTS
  // ==========================================

  const [payments, setPayments] = useState([]);

  const [attendance, setAttendance] = useState([]);

  const [attendanceMember, setAttendanceMember] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(
  new Date().toISOString().split("T")[0]
);

const [attendanceStatus, setAttendanceStatus] = useState("Present");

const [checkIn, setCheckIn] = useState("");
const [checkOut, setCheckOut] = useState("");

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);

  const [editingPaymentId, setEditingPaymentId] =
    useState(null);

  const [paymentForm, setPaymentForm] = useState({
    member_id: "",
    member_name: "",
    plan_name: "",
    amount: "",
    payment_date: new Date()
      .toISOString()
      .split("T")[0],
    payment_method: "Cash",
    status: "Paid",
  });

  // ==========================================
  // OTHER COUNTS
  // ==========================================

  const [trainerCount, setTrainerCount] = useState(0);
  const [planCount, setPlanCount] = useState(0);

  // ==========================================
  // FETCH DATA
  // ==========================================

  useEffect(() => {
    fetchMembers();
    fetchPayments();
    fetchTrainerCount();
    fetchPlanCount();
    fetchAttendance();
  }, []);

  // ==========================================
  // FETCH MEMBERS
  // ==========================================
const fetchMembers = async () => {
  const { data, error } = await supabase
    .from("members")
    .select("*");

  if (error) {
    console.error(
      "Error fetching members:",
      error
    );
    return;
  }

  console.log("Admin members:", data);

  setMembers(data || []);
};

  // ==========================================
  // FETCH PAYMENTS
  // ==========================================

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("payment_date", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Error fetching payments:",
        error
      );
      return;
    }

    setPayments(data || []);
  };
const fetchAttendance = async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .order("attendance_date", { ascending: false });

    if (error) {
      console.error("Error fetching attendance:", error);
      return;
    }

    console.log("Attendance from Supabase:", data);
    setAttendance(data || []);
  };

  const markAttendance = async () => {
    if (!attendanceMember) {
      alert("Please select a member");
      return;
    }

    const selectedMember = members.find(
      (member) => member.id === attendanceMember
    );

    if (!selectedMember) {
      alert("Member not found");
      return;
    }

    const { error } = await supabase
      .from("attendance")
      .insert([
        {
          member_id: selectedMember.id,
          member_name: selectedMember.name,
          attendance_date: attendanceDate,
          check_in: checkIn || null,
          check_out: checkOut || null,
          status: attendanceStatus,
        },
      ]);

    if (error) {
      console.error("Error marking attendance:", error);
      alert("Failed to mark attendance");
      return;
    }

    alert("Attendance marked successfully!");

    setAttendanceMember("");
    setAttendanceStatus("Present");
    setCheckIn("");
    setCheckOut("");

    fetchAttendance();
  };
  // ==========================================
  // FETCH TRAINER COUNT
  // ==========================================

  const fetchTrainerCount = async () => {
    const { count, error } = await supabase
      .from("trainers")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (error) {
      console.error(
        "Error fetching trainers:",
        error
      );
      return;
    }

    setTrainerCount(count || 0);
  };

  // ==========================================
  // FETCH PLAN COUNT
  // ==========================================

  const fetchPlanCount = async () => {
    const { count, error } = await supabase
      .from("membership_plans")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Active");

    if (error) {
      console.error(
        "Error fetching plans:",
        error
      );
      return;
    }

    setPlanCount(count || 0);
  };

  // ==========================================
  // MEMBER FORM CHANGE
  // ==========================================

  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    setMemberForm({
      ...memberForm,
      [name]: value,
    });
  };

  // ==========================================
  // OPEN ADD MEMBER
  // ==========================================

  const openAddMember = () => {
    setMemberForm({
      name: "",
      email: "",
      phone: "",
      plan: "Basic",
      status: "Active",
    });

    setEditingMemberId(null);
    setShowMemberForm(true);
  };

  // ==========================================
  // OPEN EDIT MEMBER
  // ==========================================

  const openEditMember = (member) => {
    setMemberForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      plan: member.plan || "Basic",
      status: member.status || "Active",
    });

    setEditingMemberId(member.id);
    setShowMemberForm(true);
  };

  // ==========================================
  // ADD / EDIT MEMBER
  // ==========================================

  const handleMemberSubmit = async (e) => {
    e.preventDefault();

    if (
      !memberForm.name ||
      !memberForm.email ||
      !memberForm.phone
    ) {
      alert(
        "Please fill in Name, Email and Phone."
      );
      return;
    }

    // ADD
    if (!editingMemberId) {
      const { data, error } = await supabase
        .from("members")
        .insert([
          {
            name: memberForm.name,
            email: memberForm.email,
            phone: memberForm.phone,
            plan: memberForm.plan,
            status: memberForm.status,
          },
        ])
        .select();

      if (error) {
        console.error(
          "Error adding member:",
          error
        );

        alert(
          "Could not add member.\n\n" +
            error.message
        );

        return;
      }

      setMembers((prevMembers) => [
        ...data,
        ...prevMembers,
      ]);

      alert("Member added successfully! ✅");
    }

    // EDIT
    else {
      const { data, error } = await supabase
        .from("members")
        .update({
          name: memberForm.name,
          email: memberForm.email,
          phone: memberForm.phone,
          plan: memberForm.plan,
          status: memberForm.status,
        })
        .eq("id", editingMemberId)
        .select();

      if (error) {
        console.error(
          "Error updating member:",
          error
        );

        alert(
          "Could not update member.\n\n" +
            error.message
        );

        return;
      }

      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === editingMemberId
            ? data[0]
            : member
        )
      );

      alert(
        "Member updated successfully! ✅"
      );
    }

    setMemberForm({
      name: "",
      email: "",
      phone: "",
      plan: "Basic",
      status: "Active",
    });

    setEditingMemberId(null);
    setShowMemberForm(false);
  };

  // ==========================================
  // DELETE MEMBER
  // ==========================================

  const deleteMember = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("members")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting member:",
        error
      );

      alert(
        "Could not delete member.\n\n" +
          error.message
      );

      return;
    }

    setMembers((prevMembers) =>
      prevMembers.filter(
        (member) => member.id !== id
      )
    );

    alert("Member deleted successfully! ✅");
  };

  // ==========================================
  // PAYMENT FORM CHANGE
  // ==========================================

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    setPaymentForm({
      ...paymentForm,
      [name]: value,
    });

    // Automatically fill member name
    // and membership plan
    if (name === "member_id") {
      const selectedMember = members.find(
        (member) => member.id === value
      );

      if (selectedMember) {
        setPaymentForm((prev) => ({
          ...prev,
          member_id: selectedMember.id,
          member_name: selectedMember.name,
          plan_name:
            selectedMember.plan || "",
        }));
      }
    }
  };

  // ==========================================
  // OPEN ADD PAYMENT
  // ==========================================

  const openAddPayment = () => {
    setPaymentForm({
      member_id: "",
      member_name: "",
      plan_name: "",
      amount: "",
      payment_date: new Date()
        .toISOString()
        .split("T")[0],
      payment_method: "Cash",
      status: "Paid",
    });

    setEditingPaymentId(null);
    setShowPaymentForm(true);
  };

  // ==========================================
  // OPEN EDIT PAYMENT
  // ==========================================

  const openEditPayment = (payment) => {
    setPaymentForm({
      member_id: payment.member_id || "",
      member_name: payment.member_name || "",
      plan_name: payment.plan_name || "",
      amount: payment.amount || "",
      payment_date:
        payment.payment_date ||
        new Date()
          .toISOString()
          .split("T")[0],
      payment_method:
        payment.payment_method || "Cash",
      status: payment.status || "Paid",
    });

    setEditingPaymentId(payment.id);
    setShowPaymentForm(true);
  };

  // ==========================================
  // ADD / EDIT PAYMENT
  // ==========================================

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (
      !paymentForm.member_id ||
      !paymentForm.member_name ||
      !paymentForm.amount ||
      !paymentForm.payment_date
    ) {
      alert(
        "Please select a member and enter amount and date."
      );
      return;
    }

    if (Number(paymentForm.amount) <= 0) {
      alert(
        "Payment amount must be greater than 0."
      );
      return;
    }

    const paymentData = {
      member_id: paymentForm.member_id,
      member_name: paymentForm.member_name,
      plan_name: paymentForm.plan_name,
      amount: Number(paymentForm.amount),
      payment_date: paymentForm.payment_date,
      payment_method:
        paymentForm.payment_method,
      status: paymentForm.status,
    };

    // ADD PAYMENT
    if (!editingPaymentId) {
      const { data, error } = await supabase
        .from("payments")
        .insert([paymentData])
        .select();

      if (error) {
        console.error(
          "Error adding payment:",
          error
        );

        alert(
          "Could not add payment.\n\n" +
            error.message
        );

        return;
      }

      setPayments((prevPayments) => [
        ...data,
        ...prevPayments,
      ]);

      alert(
        "Payment recorded successfully! ✅"
      );
    }

    // EDIT PAYMENT
    else {
      const { data, error } = await supabase
        .from("payments")
        .update(paymentData)
        .eq("id", editingPaymentId)
        .select();

      if (error) {
        console.error(
          "Error updating payment:",
          error
        );

        alert(
          "Could not update payment.\n\n" +
            error.message
        );

        return;
      }

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === editingPaymentId
            ? data[0]
            : payment
        )
      );

      alert(
        "Payment updated successfully! ✅"
      );
    }

    setPaymentForm({
      member_id: "",
      member_name: "",
      plan_name: "",
      amount: "",
      payment_date: new Date()
        .toISOString()
        .split("T")[0],
      payment_method: "Cash",
      status: "Paid",
    });

    setEditingPaymentId(null);
    setShowPaymentForm(false);
  };

  // ==========================================
  // DELETE PAYMENT
  // ==========================================

  const deletePayment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("payments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting payment:",
        error
      );

      alert(
        "Could not delete payment.\n\n" +
          error.message
      );

      return;
    }

    setPayments((prevPayments) =>
      prevPayments.filter(
        (payment) => payment.id !== id
      )
    );

    alert("Payment deleted successfully! ✅");
  };

  // ==========================================
  // PAYMENT STATISTICS
  // ==========================================

  const totalPayments = payments.reduce(
    (total, payment) =>
      total + Number(payment.amount || 0),
    0
  );

  const paidAmount = payments
    .filter(
      (payment) =>
        String(payment.status).toLowerCase() ===
        "paid"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  const pendingAmount = payments
    .filter(
      (payment) =>
        String(payment.status).toLowerCase() ===
        "pending"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  // ==========================================
  // SIDEBAR MENU
  // ==========================================

 const menuItems = [
  "Dashboard",
  "Members",
  "Trainers",
  "Membership Plans",
  "Payments",
  "Attendance",
  "Equipment",
  "Complaints",
  "Offers & Plans",
  "Reports",
  "Settings",
];

  // ==========================================
  // DASHBOARD
  // ==========================================

  const renderDashboard = () => {
    return (
      <>
        <div className="welcome-box">
          <div>
            <h1>
              Welcome back, {currentUser.name}! 👋
            </h1>

            <p>
              Manage your gym system from the Admin
              Dashboard.
            </p>
          </div>
        </div>

        <div className="stats-grid">

          {/* MEMBERS */}

          <div className="stat-card">
            <div className="stat-icon">
              👥
            </div>

            <div>
              <h3>{members.length}</h3>
              <p>Total Members</p>
            </div>
          </div>

          {/* TRAINERS */}

          <div className="stat-card">
            <div className="stat-icon">
              🏋️
            </div>

            <div>
              <h3>{trainerCount}</h3>
              <p>Trainers</p>
            </div>
          </div>

          {/* PAYMENTS */}

          <div className="stat-card">
            <div className="stat-icon">
              💳
            </div>

            <div>
              <h3>
                ₹{totalPayments.toLocaleString()}
              </h3>

              <p>Total Payments</p>
            </div>
          </div>

          {/* PLANS */}

          <div className="stat-card">
            <div className="stat-icon">
              📋
            </div>

            <div>
              <h3>{planCount}</h3>
              <p>Active Plans</p>
            </div>
          </div>

        </div>

        {/* RECENT MEMBERS */}

        <div className="content-card">

          <div className="card-header">

            <h2>Recent Members</h2>

            <button
              className="add-btn"
              onClick={() =>
                setActivePage("Members")
              }
            >
              View All
            </button>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {members
                  .slice(0, 4)
                  .map((member) => (
                    <tr key={member.id}>

                      <td>
                        {member.name}
                      </td>

                      <td>
                        {member.email}
                      </td>

                      <td>
                        {member.plan}
                      </td>

                      <td>
                        <span
                          className={`status ${(
                            member.status || ""
                          ).toLowerCase()}`}
                        >
                          {member.status}
                        </span>
                      </td>

                    </tr>
                  ))}

                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="empty-state"
                    >
                      No members found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </>
    );
  };

  // ==========================================
  // MEMBERS PAGE
  // ==========================================

  const renderMembers = () => {
    return (
      <>
        <div className="page-title-row">

          <div>
            <h1>Members</h1>

            <p>
              Manage all gym members.
            </p>
          </div>

          <button
            className="add-btn"
            onClick={openAddMember}
          >
            + Add Member
          </button>

        </div>

        {/* MEMBER FORM */}

        {showMemberForm && (
          <div className="member-form-box">

            <div className="form-header">

              <h2>
                {editingMemberId
                  ? "Edit Member"
                  : "Add New Member"}
              </h2>

              <button
                className="close-btn"
                onClick={() => {
                  setShowMemberForm(false);
                  setEditingMemberId(null);
                }}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleMemberSubmit}
            >

              <div className="form-grid">

                <div>
                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={memberForm.name}
                    onChange={handleMemberChange}
                  />
                </div>

                <div>
                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={memberForm.email}
                    onChange={handleMemberChange}
                  />
                </div>

                <div>
                  <label>
                    Phone *
                  </label>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={memberForm.phone}
                    onChange={handleMemberChange}
                  />
                </div>

                <div>
                  <label>
                    Membership Plan
                  </label>

                  <select
                    name="plan"
                    value={memberForm.plan}
                    onChange={handleMemberChange}
                  >
                    <option value="Basic">
                      Basic
                    </option>

                    <option value="Gold">
                      Gold
                    </option>

                    <option value="Premium">
                      Premium
                    </option>

                    <option value="Annual">
                      Annual
                    </option>
                  </select>
                </div>

                <div>
                  <label>Status</label>

                  <select
                    name="status"
                    value={memberForm.status}
                    onChange={handleMemberChange}
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

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowMemberForm(false);
                    setEditingMemberId(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingMemberId
                    ? "Update Member"
                    : "Add Member"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* MEMBER TABLE */}

        <div className="content-card">

          <div className="card-header">

            <h2>Member List</h2>

            <span>
              Total: {members.length}
            </span>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {members.map((member) => (
                  <tr key={member.id}>

                    <td>
                      {member.id}
                    </td>

                    <td>
                      <strong>
                        {member.name}
                      </strong>
                    </td>

                    <td>
                      {member.email}
                    </td>

                    <td>
                      {member.phone}
                    </td>

                    <td>
                      {member.plan}
                    </td>

                    <td>
                      <span
                        className={`status ${(
                          member.status || ""
                        ).toLowerCase()}`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEditMember(member)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteMember(member.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

                {members.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-state"
                    >
                      No members found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </>
    );
  };

  // ==========================================
  // PAYMENTS PAGE
  // ==========================================

  const renderPayments = () => {
    return (
      <>
        {/* TITLE */}

        <div className="page-title-row">

          <div>
            <h1>Payments</h1>

            <p>
              Manage gym membership payments
              and payment history.
            </p>
          </div>

          <button
            className="add-btn"
            onClick={openAddPayment}
          >
            + Record Payment
          </button>

        </div>

        {/* PAYMENT STATISTICS */}

        <div className="stats-grid payment-stats">

          <div className="stat-card">
            <div className="stat-icon">
              💰
            </div>

            <div>
              <h3>
                ₹{totalPayments.toLocaleString()}
              </h3>

              <p>Total Payments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ✅
            </div>

            <div>
              <h3>
                ₹{paidAmount.toLocaleString()}
              </h3>

              <p>Paid Amount</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              ⏳
            </div>

            <div>
              <h3>
                ₹{pendingAmount.toLocaleString()}
              </h3>

              <p>Pending Amount</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              🧾
            </div>

            <div>
              <h3>{payments.length}</h3>

              <p>Total Transactions</p>
            </div>
          </div>

        </div>

        {/* PAYMENT FORM */}

        {showPaymentForm && (
          <div className="member-form-box payment-form-box">

            <div className="form-header">

              <div>
                <h2>
                  {editingPaymentId
                    ? "Edit Payment"
                    : "Record New Payment"}
                </h2>

                <p className="form-subtitle">
                  Add payment details for a gym member.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() => {
                  setShowPaymentForm(false);
                  setEditingPaymentId(null);
                }}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handlePaymentSubmit}
            >

              <div className="form-grid">

                {/* MEMBER */}

                <div>
                  <label>
                    Member *
                  </label>

                  <select
                    name="member_id"
                    value={paymentForm.member_id}
                    onChange={handlePaymentChange}
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

                {/* PLAN */}

                <div>
                  <label>
                    Membership Plan
                  </label>

                  <input
                    type="text"
                    name="plan_name"
                    placeholder="Membership plan"
                    value={paymentForm.plan_name}
                    onChange={handlePaymentChange}
                  />
                </div>

                {/* AMOUNT */}

                <div>
                  <label>
                    Amount *
                  </label>

                  <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    min="1"
                    value={paymentForm.amount}
                    onChange={handlePaymentChange}
                  />
                </div>

                {/* DATE */}

                <div>
                  <label>
                    Payment Date *
                  </label>

                  <input
                    type="date"
                    name="payment_date"
                    value={paymentForm.payment_date}
                    onChange={handlePaymentChange}
                  />
                </div>

                {/* PAYMENT METHOD */}

                <div>
                  <label>
                    Payment Method
                  </label>

                  <select
                    name="payment_method"
                    value={
                      paymentForm.payment_method
                    }
                    onChange={handlePaymentChange}
                  >
                    <option value="Cash">
                      Cash
                    </option>

                    <option value="UPI">
                      UPI
                    </option>

                    <option value="Card">
                      Card
                    </option>

                    <option value="Bank Transfer">
                      Bank Transfer
                    </option>
                  </select>
                </div>

                {/* STATUS */}

                <div>
                  <label>
                    Payment Status
                  </label>

                  <select
                    name="status"
                    value={paymentForm.status}
                    onChange={handlePaymentChange}
                  >
                    <option value="Paid">
                      Paid
                    </option>

                    <option value="Pending">
                      Pending
                    </option>
                  </select>
                </div>

              </div>

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setEditingPaymentId(null);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingPaymentId
                    ? "Update Payment"
                    : "Record Payment"}
                </button>

              </div>

            </form>

          </div>
        )}

        {/* PAYMENT TABLE */}

        <div className="content-card">

          <div className="card-header">

            <h2>Payment History</h2>

            <span>
              Total: {payments.length}
            </span>

          </div>

          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Member</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {payments.map((payment) => (
                  <tr key={payment.id}>

                    <td>
                      <strong>
                        {payment.member_name}
                      </strong>
                    </td>

                    <td>
                      {payment.plan_name || "-"}
                    </td>

                    <td>
                      ₹
                      {Number(
                        payment.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td>
                      {payment.payment_date || "-"}
                    </td>

                    <td>
                      {payment.payment_method || "-"}
                    </td>

                    <td>

                      <span
                        className={`status ${
                          String(
                            payment.status || ""
                          ).toLowerCase()
                        }`}
                      >
                        {payment.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEditPayment(payment)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deletePayment(payment.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))}

                {payments.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="empty-state"
                    >
                      No payments recorded yet.
                      Click "Record Payment" to add
                      the first payment.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      </>
    );
  };

const renderAttendance = () => {
  return (
    <div className="page-section">
      <div className="page-header">
        <div>
          <h1>Attendance</h1>
          <p>Track member attendance</p>
        </div>
      </div>

      <div className="content-card">
        <h2>Mark Attendance</h2>

        <div className="form-grid">
          <div className="form-group">
            <label>Select Member</label>

            <select
              value={attendanceMember}
              onChange={(e) => setAttendanceMember(e.target.value)}
            >
              <option value="">Select a member</option>

              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>

            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Check In</label>

            <input
              type="time"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Check Out</label>

            <input
              type="time"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>

            <select
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)} 
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        <button
          className="primary-btn"
          onClick={markAttendance}
        >
          Mark Attendance
        </button>
      </div>

      <div className="content-card">
        <h2>Attendance Records</h2>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    No attendance records found
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{record.member_name}</td>
                    <td>{record.attendance_date}</td>
                    <td>{record.check_in || "-"}</td>
                    <td>{record.check_out || "-"}</td>
                    <td>
                      <span className={`status ${String(record.status || "").toLowerCase()}`}>
                        {record.status || "-"}
                      </span>
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
};
  // ==========================================
  // OTHER PAGES
  // ==========================================

  const renderOtherPage = () => {
    return (
      <div className="content-card">

        <h2>{activePage}</h2>

        <p>
          {activePage} management will be
          available here.
        </p>

      </div>
    );
  };

  // ==========================================
  // SELECT PAGE
  // ==========================================

  const renderPage = () => {

    if (activePage === "Dashboard") {
      return renderDashboard();
    }

    if (activePage === "Members") {
      return renderMembers();
    }

    if (activePage === "Payments") {
      return renderPayments();
    }
    if (activePage === "Attendance") return renderAttendance();

    return renderOtherPage();
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="admin-layout">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="sidebar-logo">
          🏋️
          <span>GYM ADMIN</span>
        </div>

        {/* PROFILE */}

        <div className="admin-profile">

          <div className="profile-icon">
            👨‍💼
          </div>

          <h3>
            {currentUser.name}
          </h3>

          <p>
            {currentUser.email}
          </p>

          <span>
            {currentUser.role}
          </span>

        </div>

        {/* MENU */}

        <nav>

          {menuItems.map((item) => (
            <button
              key={item}
              className={
                activePage === item
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() =>
                setActivePage(item)
              }
            >
              {item}
            </button>
          ))}

        </nav>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem(
              "currentUser"
            );

            window.location.href = "/";
          }}
        >
          🚪 Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="topbar">

          <div>
            <h2>{activePage}</h2>
          </div>

          <div className="topbar-user">
            👤 {currentUser.name}
          </div>

        </header>

        {/* CONTENT */}

        <section className="page-content">

          {renderPage()}

        </section>

      </main>

    </div>
  );
}

export default Admin;