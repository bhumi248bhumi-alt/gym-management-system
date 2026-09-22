import { useEffect, useState } from "react";
import "./MembershipPlans.css";
import { supabase } from "../../lib/supabase";

function MembershipPlans() {
  const [plans, setPlans] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingPlanId, setEditingPlanId] = useState(null);

  const [planForm, setPlanForm] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    status: "Active",
  });

  // Fetch plans
  useEffect(() => {
    fetchPlans();
  }, []);

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

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPlanForm({
      ...planForm,
      [name]: value,
    });
  };

  // Open add form
  const openAddPlan = () => {
    setPlanForm({
      name: "",
      price: "",
      duration: "",
      description: "",
      status: "Active",
    });

    setEditingPlanId(null);
    setShowForm(true);
  };

  // Open edit form
  const openEditPlan = (plan) => {
    setPlanForm({
      name: plan.name || "",
      price: plan.price || "",
      duration: plan.duration || "",
      description: plan.description || "",
      status: plan.status || "Active",
    });

    setEditingPlanId(plan.id);
    setShowForm(true);
  };

  // Add / Update
  const handleSubmit = async (e) => {
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

    // ADD
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
    }

    // UPDATE
    else {
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
        prev.map((plan) =>
          plan.id === editingPlanId ? data[0] : plan
        )
      );

      alert("Membership plan updated successfully! ✅");
    }

    setPlanForm({
      name: "",
      price: "",
      duration: "",
      description: "",
      status: "Active",
    });

    setEditingPlanId(null);
    setShowForm(false);
  };

  // Delete
  const deletePlan = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this membership plan?"
    );

    if (!confirmDelete) return;

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

    alert("Membership plan deleted successfully! ✅");
  };

  return (
    <div className="membership-page">

      {/* Header */}
      <div className="membership-header">
        <div>
          <h1>💳 Membership Plans</h1>
          <p>Manage gym membership plans and pricing</p>
        </div>

        <button
          className="add-plan-btn"
          onClick={openAddPlan}
        >
          + Add Plan
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="plan-form-card">

          <h2>
            {editingPlanId
              ? "✏️ Edit Membership Plan"
              : "➕ Add Membership Plan"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="plan-form-grid">

              <div className="form-group">
                <label>Plan Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Example: Premium"
                  value={planForm.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>

                <input
                  type="number"
                  name="price"
                  placeholder="Example: 1500"
                  value={planForm.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Duration (Months)</label>

                <input
                  type="number"
                  name="duration"
                  placeholder="Example: 3"
                  value={planForm.duration}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={planForm.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Description</label>

                <textarea
                  name="description"
                  placeholder="Enter plan description..."
                  value={planForm.description}
                  onChange={handleChange}
                  rows="4"
                />
              </div>

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="save-plan-btn"
              >
                {editingPlanId
                  ? "Update Plan"
                  : "Save Plan"}
              </button>

              <button
                type="button"
                className="cancel-plan-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* Plans */}
      <div className="plans-section">

        <div className="plans-section-header">
          <h2>Available Plans</h2>

          <span>
            {plans.length} Plan{plans.length !== 1 ? "s" : ""}
          </span>
        </div>

        {plans.length === 0 ? (
          <div className="empty-plans">
            <div className="empty-icon">💳</div>

            <h3>No Membership Plans Yet</h3>

            <p>
              Click "Add Plan" to create your first membership plan.
            </p>
          </div>
        ) : (
          <div className="plans-grid">

            {plans.map((plan) => (
              <div
                className="plan-card"
                key={plan.id}
              >

                <div className="plan-card-top">

                  <h3>{plan.name}</h3>

                  <span
                    className={`plan-status ${
                      plan.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {plan.status}
                  </span>

                </div>

                <div className="plan-price">
                  ₹{Number(plan.price).toLocaleString("en-IN")}
                </div>

                <div className="plan-duration">
                  📅 {plan.duration} month
                  {plan.duration !== 1 ? "s" : ""}
                </div>

                <p className="plan-description">
                  {plan.description || "No description added."}
                </p>

                <div className="plan-actions">

                  <button
                    className="edit-plan-btn"
                    onClick={() => openEditPlan(plan)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-plan-btn"
                    onClick={() => deletePlan(plan.id)}
                  >
                    🗑️ Delete
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

export default MembershipPlans;