import { useState, useEffect } from "react";
import "./Admin.css";
import { supabase } from "../../lib/supabase";

function Admin() {
  // Safe read: bad/missing data in localStorage must never blank the page
  let currentUser = {
    name: "Admin",
    email: "admin@gmail.com",
    role: "Admin",
  };

  try {
    currentUser =
      JSON.parse(localStorage.getItem("currentUser")) || currentUser;
  } catch {
    localStorage.removeItem("currentUser");
  }

  const today = () => new Date().toISOString().split("T")[0];

  // ==========================================
  // GENERAL
  // ==========================================

  const [activePage, setActivePage] = useState("Dashboard");

  // ==========================================
  // MEMBERS STATE
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
  // PAYMENTS STATE
  // ==========================================

  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  const [paymentForm, setPaymentForm] = useState({
    member_id: "",
    member_name: "",
    plan_name: "",
    amount: "",
    payment_date: today(),
    payment_method: "Cash",
    status: "Paid",
  });

  // ==========================================
  // ATTENDANCE STATE
  // ==========================================

  const [attendance, setAttendance] = useState([]);
  const [attendanceMember, setAttendanceMember] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(today());
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  // ==========================================
  // EQUIPMENT STATE
  // ==========================================

  const [equipment, setEquipment] = useState([]);

  const [offers, setOffers] = useState([]);
const [offerCount, setOfferCount] = useState(0);
const [reportData, setReportData] = useState({
  members: 0,
  trainers: 0,
  payments: 0,
  attendance: 0,
  equipment: 0,
  complaints: 0,
  offers: 0,
  totalRevenue: 0,
});
const [settings, setSettings] = useState({
  gymName: "My Gym",
  gymEmail: "",
  gymPhone: "",
  gymAddress: "",
  notifications: true,
});
const [showOfferForm, setShowOfferForm] = useState(false);
const [editingOfferId, setEditingOfferId] = useState(null);

const [offerForm, setOfferForm] = useState({
  offer_name: "",
  description: "",
  discount: "",
  valid_from: "",
  valid_until: "",
  status: "Active",
});
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [editingEquipmentId, setEditingEquipmentId] = useState(null);

  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    category: "",
    quantity: 1,
    condition: "Good",
    location: "",
    purchase_date: "",
    maintenance_status: "Up to Date",
  });

  // ==========================================
  // MEMBERSHIP PLANS STATE
  // ==========================================

  const [plans, setPlans] = useState([]);
  const [planCount, setPlanCount] = useState(0);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    status: "Active",
  });

  // ==========================================
  // TRAINERS STATE
  // ==========================================

  const [trainerCount, setTrainerCount] = useState(0);
  const [trainers, setTrainers] = useState([]);
  const [showTrainerForm, setShowTrainerForm] = useState(false);
  const [editingTrainerId, setEditingTrainerId] = useState(null);

  const [trainerForm, setTrainerForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    status: "Active",
  });

  // ==========================================
  // COMPLAINTS STATE
  // ==========================================

  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [editingComplaintId, setEditingComplaintId] = useState(null);

  const blankComplaint = () => ({
    member_name: "",
    subject: "",
    description: "",
    complaint_date: today(),
    status: "Pending",
  });

  const [complaintForm, setComplaintForm] = useState(blankComplaint);

  // ==========================================
  // FETCH FUNCTIONS
  // ==========================================

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("members").select("*");

    if (error) {
      console.error("Error fetching members:", error);
      return;
    }

    setMembers(data || []);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .order("payment_date", { ascending: false });

    if (error) {
      console.error("Error fetching payments:", error);
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

    setAttendance(data || []);
  };

  const fetchEquipment = async () => {
    const { data, error } = await supabase
      .from("equipment")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching equipment:", error);
      return;
    }

    setEquipment(data || []);
    setEquipmentCount(data?.length || 0);
  };
const fetchOffers = async () => {
  const { data, error } = await supabase
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching offers:", error);
    return;
  }

  setOffers(data || []);
  setOfferCount((data || []).length);
};
const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("gym_settings")
    .select("*")
    .limit(1);

  if (error) {
    console.error("Error fetching settings:", error);
    return;
  }

  if (data && data.length > 0) {
    const savedSettings = data[0];

    setSettings({
      gymName: savedSettings.gym_name || "",
      gymEmail: savedSettings.gym_email || "",
      gymPhone: savedSettings.gym_phone || "",
      gymAddress: savedSettings.gym_address || "",
      notifications: savedSettings.notifications ?? true,
    });
  }
};
const fetchReportData = async () => {
  try {
    const [
      membersResult,
      trainersResult,
      paymentsResult,
      attendanceResult,
      equipmentResult,
      complaintsResult,
      offersResult,
    ] = await Promise.all([
      supabase.from("members").select("*"),
      supabase.from("trainers").select("*"),
      supabase.from("payments").select("*"),
      supabase.from("attendance").select("*"),
      supabase.from("equipment").select("*"),
      supabase.from("complaints").select("*"),
      supabase.from("offers").select("*"),
    ]);

    const members = membersResult.data || [];
    const trainers = trainersResult.data || [];
    const payments = paymentsResult.data || [];
    const attendance = attendanceResult.data || [];
    const equipment = equipmentResult.data || [];
    const complaints = complaintsResult.data || [];
    const offers = offersResult.data || [];

    const totalRevenue = payments.reduce(
      (total, payment) => {
        return total + Number(payment.amount || 0);
      },
      0
    );

    setReportData({
      members: members.length,
      trainers: trainers.length,
      payments: payments.length,
      attendance: attendance.length,
      equipment: equipment.length,
      complaints: complaints.length,
      offers: offers.length,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching report data:", error);
  }
};

const handleOfferChange = (e) => {
  const { name, value } = e.target;

  setOfferForm((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const openAddOffer = () => {
  setEditingOfferId(null);

  setOfferForm({
    offer_name: "",
    description: "",
    discount: "",
    valid_from: "",
    valid_until: "",
    status: "Active",
  });

  setShowOfferForm(true);
};

const openEditOffer = (offer) => {
  setEditingOfferId(offer.id);

  setOfferForm({
    offer_name: offer.offer_name || "",
    description: offer.description || "",
    discount: offer.discount || "",
    valid_from: offer.valid_from || "",
    valid_until: offer.valid_until || "",
    status: offer.status || "Active",
  });

  setShowOfferForm(true);
};

const handleOfferSubmit = async (e) => {
  e.preventDefault();

  if (!offerForm.offer_name) {
    alert("Please enter offer name.");
    return;
  }

  const offerData = {
    offer_name: offerForm.offer_name,
    description: offerForm.description,
    discount: Number(offerForm.discount) || 0,
    valid_from: offerForm.valid_from || null,
    valid_until: offerForm.valid_until || null,
    status: offerForm.status,
  };

  if (editingOfferId) {
    const { error } = await supabase
      .from("offers")
      .update(offerData)
      .eq("id", editingOfferId);

    if (error) {
      console.error("Error updating offer:", error);
      alert("Failed to update offer.");
      return;
    }

    alert("Offer updated successfully.");
  } else {
    const { error } = await supabase
      .from("offers")
      .insert([offerData]);

    if (error) {
      console.error("Error adding offer:", error);
      alert("Failed to add offer.");
      return;
    }

    alert("Offer added successfully.");
  }

  setShowOfferForm(false);
  setEditingOfferId(null);

  setOfferForm({
    offer_name: "",
    description: "",
    discount: "",
    valid_from: "",
    valid_until: "",
    status: "Active",
  });

  fetchOffers();
};

const deleteOffer = async (id) => {
  if (!window.confirm("Are you sure you want to delete this offer?")) {
    return;
  }

  const { error } = await supabase
    .from("offers")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting offer:", error);
    alert("Failed to delete offer.");
    return;
  }

  alert("Offer deleted successfully.");

  fetchOffers();
};
  const fetchTrainers = async () => {
    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trainers:", error);
      return;
    }

    setTrainers(data || []);
    setTrainerCount((data || []).length);
  };

  const fetchTrainerCount = async () => {
    const { count, error } = await supabase
      .from("trainers")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching trainer count:", error);
      return;
    }

    setTrainerCount(count || 0);
  };

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("membership_plans")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching plans:", error);
      return;
    }

    setPlans(data || []);
  };

  const fetchPlanCount = async () => {
    const { count, error } = await supabase
      .from("membership_plans")
      .select("*", { count: "exact", head: true })
      .eq("status", "Active");

    if (error) {
      console.error("Error fetching plan count:", error);
      return;
    }

    setPlanCount(count || 0);
  };

  const fetchComplaints = async () => {
    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching complaints:", error);
      return;
    }

    setComplaints(data || []);
  };

  // ==========================================
  // LOAD ALL DATA ON FIRST RENDER
  // ==========================================

  useEffect(() => {
    // Data fetch on mount: state is only set after the request resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
    fetchPayments();
    fetchTrainerCount();
    fetchTrainers();
    fetchPlanCount();
    fetchPlans();
    fetchAttendance();
    fetchEquipment();
    fetchComplaints();
    fetchOffers();
    fetchReportData();
    fetchSettings();
  }, []);

  // ==========================================
  // TRAINER FUNCTIONS
  // ==========================================

  const handleTrainerChange = (e) => {
    const { name, value } = e.target;

    setTrainerForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddTrainer = () => {
    setEditingTrainerId(null);

    setTrainerForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      status: "Active",
    });

    setShowTrainerForm(true);
  };

  const openEditTrainer = (trainer) => {
    setEditingTrainerId(trainer.id);

    setTrainerForm({
      name: trainer.name || "",
      email: trainer.email || "",
      phone: trainer.phone || "",
      specialization: trainer.specialization || "",
      experience: trainer.experience || "",
      status: trainer.status || "Active",
    });

    setShowTrainerForm(true);
  };

  const handleTrainerSubmit = async (e) => {
    e.preventDefault();

    if (!trainerForm.name || !trainerForm.email || !trainerForm.phone) {
      alert("Please fill Name, Email and Phone.");
      return;
    }

    const trainerData = {
      name: trainerForm.name,
      email: trainerForm.email,
      phone: trainerForm.phone,
      specialization: trainerForm.specialization,
      experience: Number(trainerForm.experience) || 0,
      status: trainerForm.status,
    };

    let error;

    if (editingTrainerId) {
      const result = await supabase
        .from("trainers")
        .update(trainerData)
        .eq("id", editingTrainerId);

      error = result.error;
    } else {
      const result = await supabase.from("trainers").insert([trainerData]);

      error = result.error;
    }

    if (error) {
      console.error("Trainer save error:", error);
      alert("Failed to save trainer.");
      return;
    }

    setShowTrainerForm(false);
    setEditingTrainerId(null);

    await fetchTrainers();
  };

  const deleteTrainer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmed) return;

    const { error } = await supabase.from("trainers").delete().eq("id", id);

    if (error) {
      console.error("Trainer delete error:", error);
      alert("Failed to delete trainer.");
      return;
    }

    await fetchTrainers();
  };

  // ==========================================
  // COMPLAINT FUNCTIONS
  // ==========================================

  const handleComplaintChange = (e) => {
    const { name, value } = e.target;

    setComplaintForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddComplaint = () => {
    setEditingComplaintId(null);
    setComplaintForm(blankComplaint());
    setShowComplaintForm(true);
  };

  const handleEditComplaint = (complaint) => {
    setEditingComplaintId(complaint.id);

    setComplaintForm({
      member_name: complaint.member_name || "",
      subject: complaint.subject || "",
      description: complaint.description || "",
      complaint_date: complaint.complaint_date || today(),
      status: complaint.status || "Pending",
    });

    setShowComplaintForm(true);
  };

  const closeComplaintForm = () => {
    setShowComplaintForm(false);
    setEditingComplaintId(null);
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (
      !complaintForm.member_name ||
      !complaintForm.subject ||
      !complaintForm.description
    ) {
      alert("Please fill in Member Name, Subject and Description.");
      return;
    }

    const complaintData = {
      member_name: complaintForm.member_name,
      subject: complaintForm.subject,
      description: complaintForm.description,
      complaint_date: complaintForm.complaint_date,
      status: complaintForm.status,
    };

    let error;

    if (editingComplaintId) {
      const result = await supabase
        .from("complaints")
        .update(complaintData)
        .eq("id", editingComplaintId);

      error = result.error;
    } else {
      const result = await supabase.from("complaints").insert([complaintData]);

      error = result.error;
    }

    if (error) {
      console.error("Complaint save error:", error);
      alert("Could not save complaint.\n\n" + error.message);
      return;
    }

    alert(
      editingComplaintId
        ? "Complaint updated successfully! ✅"
        : "Complaint added successfully! ✅"
    );

    closeComplaintForm();
    await fetchComplaints();
  };

  const handleDeleteComplaint = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this complaint?"
    );

    if (!confirmed) return;

    const { error } = await supabase.from("complaints").delete().eq("id", id);

    if (error) {
      console.error("Error deleting complaint:", error);
      alert("Could not delete complaint.\n\n" + error.message);
      return;
    }

    setComplaints((prev) => prev.filter((complaint) => complaint.id !== id));

    alert("Complaint deleted successfully! ✅");
  };

  // ==========================================
  // EQUIPMENT FUNCTIONS
  // ==========================================

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();

    if (!equipmentForm.name || !equipmentForm.category) {
      alert("Please enter equipment name and category.");
      return;
    }

    const equipmentData = {
      name: equipmentForm.name,
      category: equipmentForm.category,
      quantity: Number(equipmentForm.quantity) || 1,
      condition: equipmentForm.condition,
      location: equipmentForm.location,
      purchase_date: equipmentForm.purchase_date || null,
      maintenance_status: equipmentForm.maintenance_status,
    };

    try {
      if (editingEquipmentId) {
        const { error } = await supabase
          .from("equipment")
          .update(equipmentData)
          .eq("id", editingEquipmentId);

        if (error) throw error;
        alert("Equipment updated successfully.");
      } else {
        const { error } = await supabase
          .from("equipment")
          .insert([equipmentData]);

        if (error) throw error;
        alert("Equipment added successfully.");
      }

      setEquipmentForm({
        name: "",
        category: "",
        quantity: 1,
        condition: "Good",
        location: "",
        purchase_date: "",
        maintenance_status: "Up to Date",
      });
      setEditingEquipmentId(null);
      setShowEquipmentForm(false);
      await fetchEquipment();
    } catch (error) {
      console.error("Equipment save error:", error);
      alert("Failed to save equipment.\n\n" + error.message);
    }
  };

  const handleEditEquipment = (item) => {
    setEditingEquipmentId(item.id);
    setEquipmentForm({
      name: item.name || "",
      category: item.category || "",
      quantity: item.quantity || 1,
      condition: item.condition || "Good",
      location: item.location || "",
      purchase_date: item.purchase_date || "",
      maintenance_status: item.maintenance_status || "Up to Date",
    });
    setShowEquipmentForm(true);
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?"))
      return;

    const { error } = await supabase.from("equipment").delete().eq("id", id);

    if (error) {
      console.error("Error deleting equipment:", error);
      alert("Failed to delete equipment.\n\n" + error.message);
      return;
    }

    alert("Equipment deleted successfully.");
    await fetchEquipment();
  };

  // ==========================================
  // MEMBER FUNCTIONS
  // ==========================================

  const handleMemberChange = (e) => {
    const { name, value } = e.target;

    setMemberForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const closeMemberForm = () => {
    setShowMemberForm(false);
    setEditingMemberId(null);
  };

  const handleMemberSubmit = async (e) => {
    e.preventDefault();

    if (!memberForm.name || !memberForm.email || !memberForm.phone) {
      alert("Please fill in Name, Email and Phone.");
      return;
    }

    const memberData = {
      name: memberForm.name,
      email: memberForm.email,
      phone: memberForm.phone,
      plan: memberForm.plan,
      status: memberForm.status,
    };

    if (!editingMemberId) {
      const { data, error } = await supabase
        .from("members")
        .insert([memberData])
        .select();

      if (error) {
        console.error("Error adding member:", error);
        alert("Could not add member.\n\n" + error.message);
        return;
      }

      setMembers((prev) => [...data, ...prev]);

      alert("Member added successfully! ✅");
    } else {
      const { data, error } = await supabase
        .from("members")
        .update(memberData)
        .eq("id", editingMemberId)
        .select();

      if (error) {
        console.error("Error updating member:", error);
        alert("Could not update member.\n\n" + error.message);
        return;
      }

      setMembers((prev) =>
        prev.map((member) => (member.id === editingMemberId ? data[0] : member))
      );

      alert("Member updated successfully! ✅");
    }

    closeMemberForm();
  };

  const deleteMember = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmed) return;

    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      console.error("Error deleting member:", error);
      alert("Could not delete member.\n\n" + error.message);
      return;
    }

    setMembers((prev) => prev.filter((member) => member.id !== id));

    alert("Member deleted successfully! ✅");
  };

  // ==========================================
  // PAYMENT FUNCTIONS
  // ==========================================

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    if (name === "member_id") {
      const selectedMember = members.find((member) => member.id === value);

      setPaymentForm((prev) => ({
        ...prev,
        member_id: value,
        member_name: selectedMember?.name || "",
        plan_name: selectedMember?.plan || "",
      }));

      return;
    }

    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddPayment = () => {
    setPaymentForm({
      member_id: "",
      member_name: "",
      plan_name: "",
      amount: "",
      payment_date: today(),
      payment_method: "Cash",
      status: "Paid",
    });

    setEditingPaymentId(null);
    setShowPaymentForm(true);
  };

  const openEditPayment = (payment) => {
    setPaymentForm({
      member_id: payment.member_id || "",
      member_name: payment.member_name || "",
      plan_name: payment.plan_name || "",
      amount: payment.amount || "",
      payment_date: payment.payment_date || today(),
      payment_method: payment.payment_method || "Cash",
      status: payment.status || "Paid",
    });

    setEditingPaymentId(payment.id);
    setShowPaymentForm(true);
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setEditingPaymentId(null);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (
      !paymentForm.member_id ||
      !paymentForm.member_name ||
      !paymentForm.amount ||
      !paymentForm.payment_date
    ) {
      alert("Please select a member and enter amount and date.");
      return;
    }

    if (Number(paymentForm.amount) <= 0) {
      alert("Payment amount must be greater than 0.");
      return;
    }

    const paymentData = {
      member_id: paymentForm.member_id,
      member_name: paymentForm.member_name,
      plan_name: paymentForm.plan_name,
      amount: Number(paymentForm.amount),
      payment_date: paymentForm.payment_date,
      payment_method: paymentForm.payment_method,
      status: paymentForm.status,
    };

    if (!editingPaymentId) {
      const { data, error } = await supabase
        .from("payments")
        .insert([paymentData])
        .select();

      if (error) {
        console.error("Error adding payment:", error);
        alert("Could not add payment.\n\n" + error.message);
        return;
      }

      setPayments((prev) => [...data, ...prev]);

      alert("Payment recorded successfully! ✅");
    } else {
      const { data, error } = await supabase
        .from("payments")
        .update(paymentData)
        .eq("id", editingPaymentId)
        .select();

      if (error) {
        console.error("Error updating payment:", error);
        alert("Could not update payment.\n\n" + error.message);
        return;
      }

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === editingPaymentId ? data[0] : payment
        )
      );

      alert("Payment updated successfully! ✅");
    }

    closePaymentForm();
  };

  const deletePayment = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) return;

    const { error } = await supabase.from("payments").delete().eq("id", id);

    if (error) {
      console.error("Error deleting payment:", error);
      alert("Could not delete payment.\n\n" + error.message);
      return;
    }

    setPayments((prev) => prev.filter((payment) => payment.id !== id));

    alert("Payment deleted successfully! ✅");
  };

  // ==========================================
  // ATTENDANCE FUNCTIONS
  // ==========================================

  const markAttendance = async () => {
    if (!attendanceMember) {
      alert("Please select a member.");
      return;
    }

    const selectedMember = members.find(
      (member) => member.id === attendanceMember
    );

    if (!selectedMember) {
      alert("Member not found.");
      return;
    }

    const { error } = await supabase.from("attendance").insert([
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
      alert("Failed to mark attendance.\n\n" + error.message);
      return;
    }

    alert("Attendance marked successfully! ✅");

    setAttendanceMember("");
    setAttendanceStatus("Present");
    setCheckIn("");
    setCheckOut("");

    fetchAttendance();
  };

  // ==========================================
  // PLAN FUNCTIONS
  // ==========================================

  const handlePlanChange = (e) => {
    const { name, value } = e.target;

    setPlanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openAddPlan = () => {
    setPlanForm({
      name: "",
      price: "",
      duration: "",
      description: "",
      status: "Active",
    });

    setEditingPlanId(null);
    setShowPlanForm(true);
  };

  const openEditPlan = (plan) => {
    setPlanForm({
      name: plan.name || "",
      price: plan.price || "",
      duration: plan.duration || "",
      description: plan.description || "",
      status: plan.status || "Active",
    });

    setEditingPlanId(plan.id);
    setShowPlanForm(true);
  };

  const closePlanForm = () => {
    setShowPlanForm(false);
    setEditingPlanId(null);
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();

    if (!planForm.name || !planForm.price || !planForm.duration) {
      alert("Please fill in Plan Name, Price and Duration.");
      return;
    }

    const planData = {
      name: planForm.name,
      price: Number(planForm.price),
      duration: Number(planForm.duration),
      description: planForm.description,
      status: planForm.status,
    };

    if (!editingPlanId) {
      const { data, error } = await supabase
        .from("membership_plans")
        .insert([planData])
        .select();

      if (error) {
        console.error("Error adding plan:", error);
        alert("Could not add plan.\n\n" + error.message);
        return;
      }

      setPlans((prev) => [...data, ...prev]);

      alert("Membership plan added successfully! ✅");
    } else {
      const { data, error } = await supabase
        .from("membership_plans")
        .update(planData)
        .eq("id", editingPlanId)
        .select();

      if (error) {
        console.error("Error updating plan:", error);
        alert("Could not update plan.\n\n" + error.message);
        return;
      }

      setPlans((prev) =>
        prev.map((plan) => (plan.id === editingPlanId ? data[0] : plan))
      );

      alert("Membership plan updated successfully! ✅");
    }

    closePlanForm();
    fetchPlanCount();
  };

  const deletePlan = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this membership plan?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("membership_plans")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting plan:", error);
      alert("Could not delete plan.\n\n" + error.message);
      return;
    }

    setPlans((prev) => prev.filter((plan) => plan.id !== id));

    fetchPlanCount();

    alert("Membership plan deleted successfully! ✅");
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalPayments = payments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const paidAmount = payments
    .filter((payment) => String(payment.status).toLowerCase() === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const pendingAmount = payments
    .filter((payment) => String(payment.status).toLowerCase() === "pending")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  // ==========================================
  // SIDEBAR
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
      <div className="dashboard-page">
        <div className="welcome-box">
          <div>
            <span className="welcome-label">ADMIN DASHBOARD</span>
            <h1>Welcome back, {currentUser.name} 👋</h1>
            <p>Here's what's happening with your gym today.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div>
              <h3>{members.length}</h3>
              <p>Total Members</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏋️</div>
            <div>
              <h3>{trainerCount}</h3>
              <p>Trainers</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div>
              <h3>₹{totalPayments.toLocaleString("en-IN")}</h3>
              <p>Total Payments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div>
              <h3>{planCount}</h3>
              <p>Active Plans</p>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Recent Members</h2>
              <p>Latest members registered in your gym</p>
            </div>

            <button
              className="outline-btn"
              onClick={() => setActivePage("Members")}
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
                {members.slice(0, 5).map((member) => (
                  <tr key={member.id}>
                    <td>
                      <strong>{member.name}</strong>
                    </td>
                    <td>{member.email}</td>
                    <td>
                      <span className="plan-tag">{member.plan}</span>
                    </td>
                    <td>
                      <span
                        className={`status ${String(
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
                    <td colSpan="4" className="empty-state">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // MEMBERS PAGE
  // ==========================================

  const renderMembers = () => {
    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">MEMBERS</span>
            <h1>Gym Members</h1>
            <p>Manage your gym members and membership details.</p>
          </div>

          <button className="primary-btn" onClick={openAddMember}>
            + Add Member
          </button>
        </div>

        {showMemberForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h2>{editingMemberId ? "Edit Member" : "Add New Member"}</h2>
                <p>Enter the member's information below.</p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={closeMemberForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleMemberSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter full name"
                    value={memberForm.name}
                    onChange={handleMemberChange}
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    value={memberForm.email}
                    onChange={handleMemberChange}
                  />
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter phone number"
                    value={memberForm.phone}
                    onChange={handleMemberChange}
                  />
                </div>

                <div className="form-group">
                  <label>Membership Plan</label>
                  <select
                    name="plan"
                    value={memberForm.plan}
                    onChange={handleMemberChange}
                  >
                    <option value="Basic">Basic</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={memberForm.status}
                    onChange={handleMemberChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeMemberForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingMemberId ? "Update Member" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Member List</h2>
              <p>All registered gym members</p>
            </div>

            <span className="count-badge">{members.length} Members</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
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
                      <strong>{member.name}</strong>
                    </td>
                    <td>{member.email}</td>
                    <td>{member.phone}</td>
                    <td>
                      <span className="plan-tag">{member.plan}</span>
                    </td>
                    <td>
                      <span
                        className={`status ${String(
                          member.status || ""
                        ).toLowerCase()}`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => openEditMember(member)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteMember(member.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {members.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAYMENTS PAGE
  // ==========================================

  const renderPayments = () => {
    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">PAYMENTS</span>
            <h1>Payment Management</h1>
            <p>Manage membership payments and transactions.</p>
          </div>

          <button className="primary-btn" onClick={openAddPayment}>
            + Record Payment
          </button>
        </div>

        <div className="stats-grid payment-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div>
              <h3>₹{totalPayments.toLocaleString("en-IN")}</h3>
              <p>Total Payments</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>₹{paidAmount.toLocaleString("en-IN")}</h3>
              <p>Paid Amount</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>₹{pendingAmount.toLocaleString("en-IN")}</h3>
              <p>Pending Amount</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🧾</div>
            <div>
              <h3>{payments.length}</h3>
              <p>Transactions</p>
            </div>
          </div>
        </div>

        {showPaymentForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h2>
                  {editingPaymentId ? "Edit Payment" : "Record New Payment"}
                </h2>
                <p>Enter the payment information below.</p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={closePaymentForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Member *</label>
                  <select
                    name="member_id"
                    value={paymentForm.member_id}
                    onChange={handlePaymentChange}
                  >
                    <option value="">Select Member</option>

                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Membership Plan</label>
                  <input
                    type="text"
                    name="plan_name"
                    value={paymentForm.plan_name}
                    onChange={handlePaymentChange}
                    placeholder="Membership plan"
                  />
                </div>

                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    value={paymentForm.amount}
                    onChange={handlePaymentChange}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="form-group">
                  <label>Payment Date *</label>
                  <input
                    type="date"
                    name="payment_date"
                    value={paymentForm.payment_date}
                    onChange={handlePaymentChange}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    name="payment_method"
                    value={paymentForm.payment_method}
                    onChange={handlePaymentChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={paymentForm.status}
                    onChange={handlePaymentChange}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closePaymentForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingPaymentId ? "Update Payment" : "Record Payment"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Payment History</h2>
              <p>Recent gym payment transactions</p>
            </div>

            <span className="count-badge">
              {payments.length} Transactions
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
                      <strong>{payment.member_name}</strong>
                    </td>
                    <td>{payment.plan_name || "-"}</td>
                    <td>
                      <strong>
                        ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                      </strong>
                    </td>
                    <td>{payment.payment_date || "-"}</td>
                    <td>{payment.payment_method || "-"}</td>
                    <td>
                      <span
                        className={`status ${String(
                          payment.status || ""
                        ).toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => openEditPayment(payment)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deletePayment(payment.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {payments.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      No payments recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // ATTENDANCE PAGE
  // ==========================================

  const renderAttendance = () => {
    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">ATTENDANCE</span>
            <h1>Attendance</h1>
            <p>Track and manage member attendance.</p>
          </div>
        </div>

        <div className="form-card">
          <div className="form-header">
            <div>
              <h2>Mark Attendance</h2>
              <p>Record today's member attendance.</p>
            </div>
          </div>

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

          <div className="form-actions">
            <button className="primary-btn" onClick={markAttendance}>
              Mark Attendance
            </button>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Attendance Records</h2>
              <p>Member attendance history</p>
            </div>

            <span className="count-badge">{attendance.length} Records</span>
          </div>

          <div className="table-container">
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
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.member_name}</strong>
                    </td>
                    <td>{record.attendance_date}</td>
                    <td>{record.check_in || "-"}</td>
                    <td>{record.check_out || "-"}</td>
                    <td>
                      <span
                        className={`status ${String(
                          record.status || ""
                        ).toLowerCase()}`}
                      >
                        {record.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))}

                {attendance.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // MEMBERSHIP PLANS PAGE
  // ==========================================

  const renderMembershipPlans = () => {
    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">MEMBERSHIP</span>
            <h1>Membership Plans</h1>
            <p>Create and manage your gym membership plans.</p>
          </div>

          <button className="primary-btn" onClick={openAddPlan}>
            + Add Plan
          </button>
        </div>

        {showPlanForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h2>
                  {editingPlanId
                    ? "Edit Membership Plan"
                    : "Add Membership Plan"}
                </h2>
                <p>Define the price, duration and details of the plan.</p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={closePlanForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePlanSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Plan Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={planForm.name}
                    onChange={handlePlanChange}
                    placeholder="Example: Premium"
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    min="1"
                    value={planForm.price}
                    onChange={handlePlanChange}
                    placeholder="Example: 1999"
                  />
                </div>

                <div className="form-group">
                  <label>Duration (Months) *</label>
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={planForm.duration}
                    onChange={handlePlanChange}
                    placeholder="Example: 3"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={planForm.status}
                    onChange={handlePlanChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={planForm.description}
                  onChange={handlePlanChange}
                  placeholder="Enter plan description"
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closePlanForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingPlanId ? "Update Plan" : "Add Plan"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="plans-grid">
          {plans.length === 0 ? (
            <div className="empty-plan-box">
              <div className="empty-plan-icon">📋</div>
              <h3>No Membership Plans</h3>
              <p>Click "+ Add Plan" to create your first plan.</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div className="plan-card" key={plan.id}>
                <div className="plan-card-header">
                  <div>
                    <span className="plan-small-label">MEMBERSHIP</span>
                    <h2>{plan.name}</h2>
                  </div>

                  <span
                    className={
                      plan.status === "Active"
                        ? "status active"
                        : "status inactive"
                    }
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="plan-price">
                  ₹{Number(plan.price).toLocaleString("en-IN")}
                </div>

                <div className="plan-duration">
                  {plan.duration} month
                  {Number(plan.duration) !== 1 ? "s" : ""}
                </div>

                <div className="plan-divider" />

                <p className="plan-description">
                  {plan.description || "No description added."}
                </p>

                <div className="plan-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditPlan(plan)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deletePlan(plan.id)}
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
  };

  // ==========================================
  // TRAINERS PAGE
  // ==========================================

  const renderTrainers = () => {
    return (
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1>Trainers</h1>
            <p>Manage your gym trainers</p>
          </div>

          <button className="primary-btn" onClick={openAddTrainer}>
            + Add Trainer
          </button>
        </div>

        {showTrainerForm && (
          <div className="form-card">
            <h2>{editingTrainerId ? "Edit Trainer" : "Add Trainer"}</h2>

            <form onSubmit={handleTrainerSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={trainerForm.name}
                    onChange={handleTrainerChange}
                    placeholder="Enter trainer name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={trainerForm.email}
                    onChange={handleTrainerChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={trainerForm.phone}
                    onChange={handleTrainerChange}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={trainerForm.specialization}
                    onChange={handleTrainerChange}
                    placeholder="Example: Strength Training"
                  />
                </div>

                <div className="form-group">
                  <label>Experience (Years)</label>
                  <input
                    type="number"
                    name="experience"
                    value={trainerForm.experience}
                    onChange={handleTrainerChange}
                    placeholder="Example: 5"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={trainerForm.status}
                    onChange={handleTrainerChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {editingTrainerId ? "Update Trainer" : "Add Trainer"}
                </button>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowTrainerForm(false);
                    setEditingTrainerId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-card">
          {trainers.length === 0 ? (
            <div className="empty-state">
              <h3>No Trainers Added</h3>
              <p>Click "+ Add Trainer" to add your first trainer.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {trainers.map((trainer) => (
                    <tr key={trainer.id}>
                      <td>
                        <strong>{trainer.name}</strong>
                      </td>
                      <td>{trainer.email}</td>
                      <td>{trainer.phone}</td>
                      <td>{trainer.specialization || "-"}</td>
                      <td>{trainer.experience || 0} years</td>
                      <td>
                        <span
                          className={
                            trainer.status === "Active"
                              ? "status-active"
                              : "status-inactive"
                          }
                        >
                          {trainer.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="edit-btn"
                            onClick={() => openEditTrainer(trainer)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteTrainer(trainer.id)}
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
  };

  // ==========================================
  // EQUIPMENT PAGE
  // ==========================================

  const renderEquipment = () => {
    const totalQuantity = equipment.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );

    const goodCondition = equipment.filter(
      (item) => item.condition === "Good"
    ).length;

    const maintenanceDue = equipment.filter(
      (item) => item.maintenance_status !== "Up to Date"
    ).length;

    const openAddEquipment = () => {
      setEditingEquipmentId(null);
      setEquipmentForm({
        name: "",
        category: "",
        quantity: 1,
        condition: "Good",
        location: "",
        purchase_date: "",
        maintenance_status: "Up to Date",
      });
      setShowEquipmentForm(true);
    };

    const closeEquipmentForm = () => {
      setShowEquipmentForm(false);
      setEditingEquipmentId(null);
    };

    const updateEquipmentField = (field) => (e) =>
      setEquipmentForm({ ...equipmentForm, [field]: e.target.value });

    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">EQUIPMENT</span>
            <h1>Gym Equipment</h1>
            <p>Manage gym equipment, quantity, condition and maintenance.</p>
          </div>

          <button className="primary-btn" onClick={openAddEquipment}>
            + Add Equipment
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏋️</div>
            <div>
              <h3>{equipmentCount}</h3>
              <p>Equipment Types</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <h3>{totalQuantity}</h3>
              <p>Total Quantity</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{goodCondition}</h3>
              <p>Good Condition</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔧</div>
            <div>
              <h3>{maintenanceDue}</h3>
              <p>Maintenance Due</p>
            </div>
          </div>
        </div>

        {showEquipmentForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h2>
                  {editingEquipmentId ? "Edit Equipment" : "Add New Equipment"}
                </h2>
                <p>Enter the equipment information below.</p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={closeEquipmentForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEquipmentSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Equipment Name *</label>
                  <input
                    type="text"
                    placeholder="Example: Treadmill"
                    value={equipmentForm.name}
                    onChange={updateEquipmentField("name")}
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={equipmentForm.category}
                    onChange={updateEquipmentField("category")}
                  >
                    <option value="">Select Category</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Strength">Strength</option>
                    <option value="Free Weights">Free Weights</option>
                    <option value="Functional">Functional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={equipmentForm.quantity}
                    onChange={updateEquipmentField("quantity")}
                  />
                </div>

                <div className="form-group">
                  <label>Condition</label>
                  <select
                    value={equipmentForm.condition}
                    onChange={updateEquipmentField("condition")}
                  >
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Needs Repair">Needs Repair</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="Example: Cardio Area"
                    value={equipmentForm.location}
                    onChange={updateEquipmentField("location")}
                  />
                </div>

                <div className="form-group">
                  <label>Purchase Date</label>
                  <input
                    type="date"
                    value={equipmentForm.purchase_date}
                    onChange={updateEquipmentField("purchase_date")}
                  />
                </div>

                <div className="form-group">
                  <label>Maintenance Status</label>
                  <select
                    value={equipmentForm.maintenance_status}
                    onChange={updateEquipmentField("maintenance_status")}
                  >
                    <option value="Up to Date">Up to Date</option>
                    <option value="Due Soon">Due Soon</option>
                    <option value="Maintenance Due">Maintenance Due</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeEquipmentForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingEquipmentId ? "Update Equipment" : "Add Equipment"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Equipment List</h2>
              <p>All equipment registered in your gym</p>
            </div>

            <span className="count-badge">{equipment.length} Equipment</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Condition</th>
                  <th>Location</th>
                  <th>Purchase Date</th>
                  <th>Maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                    </td>
                    <td>
                      <span className="plan-tag">{item.category || "-"}</span>
                    </td>
                    <td>{item.quantity || 0}</td>
                    <td>
                      <span
                        className={`status ${
                          item.condition === "Good"
                            ? "active"
                            : item.condition === "Fair"
                            ? "pending"
                            : "inactive"
                        }`}
                      >
                        {item.condition || "-"}
                      </span>
                    </td>
                    <td>{item.location || "-"}</td>
                    <td>{item.purchase_date || "-"}</td>
                    <td>
                      <span
                        className={`status ${
                          item.maintenance_status === "Up to Date"
                            ? "active"
                            : item.maintenance_status === "Due Soon"
                            ? "pending"
                            : "inactive"
                        }`}
                      >
                        {item.maintenance_status || "-"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditEquipment(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteEquipment(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {equipment.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      No equipment found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

const renderOffers = () => {
  return (
    <>
      <div className="page-title-row">
        <div>
          <h1>Offers & Plans</h1>
          <p>Manage special offers and promotions.</p>
        </div>

        <button
          className="add-btn"
          onClick={openAddOffer}
        >
          + Add Offer
        </button>
      </div>

      {showOfferForm && (
        <div className="member-form-box">

          <div className="form-header">
            <h2>
              {editingOfferId
                ? "Edit Offer"
                : "Add New Offer"}
            </h2>

            <button
              className="close-btn"
              type="button"
              onClick={() => {
                setShowOfferForm(false);
                setEditingOfferId(null);
              }}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleOfferSubmit}>

            <div className="form-grid">

              <div>
                <label>Offer Name *</label>

                <input
                  type="text"
                  name="offer_name"
                  placeholder="e.g. New Member Offer"
                  value={offerForm.offer_name}
                  onChange={handleOfferChange}
                  required
                />
              </div>

              <div>
                <label>Discount (%) *</label>

                <input
                  type="number"
                  name="discount"
                  placeholder="e.g. 20"
                  value={offerForm.discount}
                  onChange={handleOfferChange}
                  min="0"
                  max="100"
                  required
                />
              </div>

              <div>
                <label>Valid From</label>

                <input
                  type="date"
                  name="valid_from"
                  value={offerForm.valid_from}
                  onChange={handleOfferChange}
                />
              </div>

              <div>
                <label>Valid Until</label>

                <input
                  type="date"
                  name="valid_until"
                  value={offerForm.valid_until}
                  onChange={handleOfferChange}
                />
              </div>

              <div>
                <label>Status</label>

                <select
                  name="status"
                  value={offerForm.status}
                  onChange={handleOfferChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Enter offer description"
                  value={offerForm.description}
                  onChange={handleOfferChange}
                  rows="3"
                />
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowOfferForm(false);
                  setEditingOfferId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
              >
                {editingOfferId
                  ? "Update Offer"
                  : "Add Offer"}
              </button>

            </div>

          </form>
        </div>
      )}

      <div className="content-card">

        <div className="card-header">
          <h2>Available Offers</h2>

          <span>
            {offerCount} Offers
          </span>
        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Offer Name</th>
                <th>Description</th>
                <th>Discount</th>
                <th>Valid From</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {offers.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center" }}
                  >
                    No offers found
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id}>

                    <td>
                      <strong>
                        {offer.offer_name}
                      </strong>
                    </td>

                    <td>
                      {offer.description || "-"}
                    </td>

                    <td>
                      {offer.discount}%
                    </td>

                    <td>
                      {offer.valid_from || "-"}
                    </td>

                    <td>
                      {offer.valid_until || "-"}
                    </td>

                    <td>
                      <span
                        className={`status ${String(
                          offer.status || ""
                        ).toLowerCase()}`}
                      >
                        {offer.status || "-"}
                      </span>
                    </td>

                    <td>

                      <button
                        className="edit-btn"
                        onClick={() =>
                          openEditOffer(offer)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteOffer(offer.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
};

  // ==========================================
  // COMPLAINTS PAGE
  // ==========================================

  const renderComplaints = () => {
    const countByStatus = (status) =>
      complaints.filter((c) => c.status === status).length;

    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">ADMIN</span>
            <h1>Complaints</h1>
            <p>Manage member complaints and requests</p>
          </div>

          <button className="primary-btn" onClick={openAddComplaint}>
            + Add Complaint
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div>
              <h3>{complaints.length}</h3>
              <p>Total Complaints</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>{countByStatus("Pending")}</h3>
              <p>Pending</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div>
              <h3>{countByStatus("In Progress")}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div>
              <h3>{countByStatus("Resolved")}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        {showComplaintForm && (
          <div className="form-card">
            <div className="form-header">
              <div>
                <h2>
                  {editingComplaintId ? "Edit Complaint" : "Add New Complaint"}
                </h2>
                <p>Enter complaint details</p>
              </div>

              <button
                className="close-btn"
                type="button"
                onClick={closeComplaintForm}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleComplaintSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Member Name *</label>
                  <input
                    type="text"
                    name="member_name"
                    placeholder="Enter member name"
                    value={complaintForm.member_name}
                    onChange={handleComplaintChange}
                  />
                </div>

                <div className="form-group">
                  <label>Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Enter complaint subject"
                    value={complaintForm.subject}
                    onChange={handleComplaintChange}
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="complaint_date"
                    value={complaintForm.complaint_date}
                    onChange={handleComplaintChange}
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={complaintForm.status}
                    onChange={handleComplaintChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  rows="5"
                  placeholder="Enter complaint description"
                  value={complaintForm.description}
                  onChange={handleComplaintChange}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeComplaintForm}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-btn">
                  {editingComplaintId ? "Update Complaint" : "Save Complaint"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="content-card">
          <div className="card-header">
            <div>
              <h2>Recent Complaints</h2>
              <p>View and manage member complaints</p>
            </div>

            <span className="count-badge">
              {complaints.length}{" "}
              {complaints.length === 1 ? "Complaint" : "Complaints"}
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Subject</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>
                      <strong>{complaint.member_name}</strong>
                    </td>
                    <td>{complaint.subject}</td>
                    <td>{complaint.description}</td>
                    <td>{complaint.complaint_date}</td>
                    <td>
                      <span
                        className={`status ${String(complaint.status || "")
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {complaint.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEditComplaint(complaint)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteComplaint(complaint.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {complaints.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      No complaints found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==========================================
  // OTHER PAGES (placeholder)
  // ==========================================

const renderReports = () => {
  return (
    <>
      <div className="page-title-row">
        <div>
          <h1>Reports</h1>
          <p>Overview of your gym management data.</p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <h3>Total Members</h3>
            <strong>{reportData.members}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏋️</div>
          <div>
            <h3>Total Trainers</h3>
            <strong>{reportData.trainers}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div>
            <h3>Total Payments</h3>
            <strong>{reportData.payments}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div>
            <h3>Total Revenue</h3>
            <strong>₹{reportData.totalRevenue}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <h3>Attendance Records</h3>
            <strong>{reportData.attendance}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div>
            <h3>Equipment</h3>
            <strong>{reportData.equipment}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div>
            <h3>Complaints</h3>
            <strong>{reportData.complaints}</strong>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div>
            <h3>Offers</h3>
            <strong>{reportData.offers}</strong>
          </div>
        </div>

      </div>

      <div className="content-card" style={{ marginTop: "24px" }}>
        <div className="card-header">
          <div>
            <h2>Gym Summary</h2>
            <p>Current information from your gym database.</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Members</td>
                <td>{reportData.members}</td>
              </tr>

              <tr>
                <td>Trainers</td>
                <td>{reportData.trainers}</td>
              </tr>

              <tr>
                <td>Payments</td>
                <td>{reportData.payments}</td>
              </tr>

              <tr>
                <td>Attendance</td>
                <td>{reportData.attendance}</td>
              </tr>

              <tr>
                <td>Equipment</td>
                <td>{reportData.equipment}</td>
              </tr>

              <tr>
                <td>Complaints</td>
                <td>{reportData.complaints}</td>
              </tr>

              <tr>
                <td>Offers</td>
                <td>{reportData.offers}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const renderSettings = () => {
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSettingsSave = async (e) => {
  e.preventDefault();

  const settingsData = {
    gym_name: settings.gymName,
    gym_email: settings.gymEmail,
    gym_phone: settings.gymPhone,
    gym_address: settings.gymAddress,
    notifications: settings.notifications,
  };

  const { data: existingSettings, error: fetchError } = await supabase
    .from("gym_settings")
    .select("id")
    .limit(1);

  if (fetchError) {
    console.error("Error checking settings:", fetchError);
    alert("Failed to save settings.");
    return;
  }

  if (existingSettings && existingSettings.length > 0) {
    const { error } = await supabase
      .from("gym_settings")
      .update(settingsData)
      .eq("id", existingSettings[0].id);

    if (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
      return;
    }
  } else {
    const { error } = await supabase
      .from("gym_settings")
      .insert([settingsData]);

    if (error) {
      console.error("Error inserting settings:", error);
      alert("Failed to save settings.");
      return;
    }
  }

  alert("Settings saved successfully!");
};
  return (
    <>
      <div className="page-title-row">
        <div>
          <h1>Settings</h1>
          <p>Manage your gym and admin settings.</p>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header">
          <div>
            <h2>Gym Information</h2>
            <p>Update your gym details.</p>
          </div>
        </div>

        <form onSubmit={handleSettingsSave}>
          <div className="form-grid">

            <div>
              <label>Gym Name</label>
              <input
                type="text"
                name="gymName"
                value={settings.gymName}
                onChange={handleSettingsChange}
                placeholder="Enter gym name"
              />
            </div>

            <div>
              <label>Gym Email</label>
              <input
                type="email"
                name="gymEmail"
                value={settings.gymEmail}
                onChange={handleSettingsChange}
                placeholder="Enter gym email"
              />
            </div>

            <div>
              <label>Gym Phone</label>
              <input
                type="text"
                name="gymPhone"
                value={settings.gymPhone}
                onChange={handleSettingsChange}
                placeholder="Enter gym phone"
              />
            </div>

            <div>
              <label>Gym Address</label>
              <input
                type="text"
                name="gymAddress"
                value={settings.gymAddress}
                onChange={handleSettingsChange}
                placeholder="Enter gym address"
              />
            </div>

          </div>

          <div style={{ marginTop: "20px" }}>
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleSettingsChange}
              />
              {" "}Enable notifications
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
  const renderOtherPage = () => {
    return (
      <div className="page-section">
        <div className="page-title-row">
          <div>
            <span className="section-label">ADMIN</span>
            <h1>{activePage}</h1>
            <p>This section is ready for development.</p>
          </div>
        </div>

        <div className="coming-soon-card">
          <div className="coming-soon-icon">🚧</div>
          <h2>{activePage}</h2>
          <p>{activePage} management will be available here.</p>
        </div>
      </div>
    );
  };

  // ==========================================
  // PAGE SELECTOR
  // ==========================================

  const renderPage = () => {
    if (activePage === "Dashboard") return renderDashboard();
    if (activePage === "Members") return renderMembers();
    if (activePage === "Trainers") return renderTrainers();
    if (activePage === "Payments") return renderPayments();
    if (activePage === "Attendance") return renderAttendance();
    if (activePage === "Equipment") return renderEquipment();
    if (activePage === "Offers & Plans") {
  return renderOffers();
}
    if (activePage === "Membership Plans") return renderMembershipPlans();
    if (activePage === "Complaints") return renderComplaints();
    if (activePage === "Reports") return renderReports();
    if (activePage === "Settings") return renderSettings();

    return renderOtherPage();
  };

  // ==========================================
  // MAIN UI
  // ==========================================

  const menuIcons = {
    Dashboard: "▦",
    Members: "👥",
    Trainers: "🏋️",
    "Membership Plans": "💎",
    Payments: "💳",
    Attendance: "📅",
    Equipment: "⚙️",
    Complaints: "⚠️",
    "Offers & Plans": "🎁",
    Reports: "📊",
    Settings: "⚙",
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}

      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🏋️</div>

          <div>
            <strong>GYM</strong>
            <span>ADMIN</span>
          </div>
        </div>

        <div className="admin-profile">
          <div className="profile-icon">👨‍💼</div>

          <div className="profile-info">
            <h3>{currentUser.name}</h3>
            <p>{currentUser.email}</p>
            <span className="role-badge">{currentUser.role}</span>
          </div>
        </div>

        <div className="menu-title">MAIN MENU</div>

        <nav className="sidebar-menu">
          {menuItems.map((item) => (
            <button
              key={item}
              className={activePage === item ? "menu-item active" : "menu-item"}
              onClick={() => setActivePage(item)}
            >
              <span className="menu-icon">{menuIcons[item]}</span>
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("currentUser");
              window.location.href = "/";
            }}
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="admin-main">
        <header className="topbar">
          <div className="topbar-left">
            <span className="topbar-label">GYM MANAGEMENT SYSTEM</span>
            <h2>{activePage}</h2>
          </div>

          <div className="topbar-user">
            <div className="topbar-avatar">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div>
              <strong>{currentUser.name}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        <section className="page-content">{renderPage()}</section>
      </main>
    </div>
  );
}

export default Admin;