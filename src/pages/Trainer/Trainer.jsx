import { useEffect, useState } from "react";
import "./Trainer.css";
import { supabase } from "../../lib/supabase";

function Trainer() {
  const [trainers, setTrainers] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingTrainerId, setEditingTrainerId] =
    useState(null);

  const [trainerForm, setTrainerForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    status: "Active",
  });

  // ==========================================
  // FETCH TRAINERS
  // ==========================================

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    const { data, error } = await supabase
      .from("trainers")
      .select("*");

    if (error) {
      console.error(
        "Error fetching trainers:",
        error
      );
      return;
    }

    console.log(
      "Trainers from Supabase:",
      data
    );

    setTrainers(data || []);
  };

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTrainerForm({
      ...trainerForm,
      [name]: value,
    });
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddTrainer = () => {
    setTrainerForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      status: "Active",
    });

    setEditingTrainerId(null);
    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditTrainer = (trainer) => {
    setTrainerForm({
      name: trainer.name || "",
      email: trainer.email || "",
      phone: trainer.phone || "",
      specialization:
        trainer.specialization || "",
      experience:
        trainer.experience || "",
      status: trainer.status || "Active",
    });

    setEditingTrainerId(trainer.id);
    setShowForm(true);
  };

  // ==========================================
  // ADD / UPDATE TRAINER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !trainerForm.name ||
      !trainerForm.email ||
      !trainerForm.phone
    ) {
      alert(
        "Please fill in Name, Email and Phone."
      );
      return;
    }

    // ========================================
    // ADD TRAINER
    // ========================================

    if (!editingTrainerId) {
      const { data, error } = await supabase
        .from("trainers")
        .insert([
          {
            name: trainerForm.name,
            email: trainerForm.email,
            phone: trainerForm.phone,
            specialization:
              trainerForm.specialization,
            experience:
              trainerForm.experience
                ? Number(trainerForm.experience)
                : null,
            status: trainerForm.status,
          },
        ])
        .select();

      if (error) {
        console.error(
          "Error adding trainer:",
          error
        );

        alert(
          "Could not add trainer.\n\n" +
            error.message
        );

        return;
      }

      setTrainers((prev) => [
        ...prev,
        ...data,
      ]);

      alert(
        "Trainer added successfully! ✅"
      );
    }

    // ========================================
    // UPDATE TRAINER
    // ========================================

    else {
      const { data, error } = await supabase
        .from("trainers")
        .update({
          name: trainerForm.name,
          email: trainerForm.email,
          phone: trainerForm.phone,
          specialization:
            trainerForm.specialization,
          experience:
            trainerForm.experience
              ? Number(trainerForm.experience)
              : null,
          status: trainerForm.status,
        })
        .eq("id", editingTrainerId)
        .select();

      if (error) {
        console.error(
          "Error updating trainer:",
          error
        );

        alert(
          "Could not update trainer.\n\n" +
            error.message
        );

        return;
      }

      setTrainers((prev) =>
        prev.map((trainer) =>
          trainer.id === editingTrainerId
            ? data[0]
            : trainer
        )
      );

      alert(
        "Trainer updated successfully! ✅"
      );
    }

    // Reset form

    setTrainerForm({
      name: "",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      status: "Active",
    });

    setEditingTrainerId(null);
    setShowForm(false);
  };

  // ==========================================
  // DELETE TRAINER
  // ==========================================

  const deleteTrainer = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainer?"
    );

    if (!confirmDelete) {
      return;
    }

    const { error } = await supabase
      .from("trainers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error deleting trainer:",
        error
      );

      alert(
        "Could not delete trainer.\n\n" +
          error.message
      );

      return;
    }

    setTrainers((prev) =>
      prev.filter(
        (trainer) => trainer.id !== id
      )
    );

    alert(
      "Trainer deleted successfully! ✅"
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="trainer-page">

      {/* HEADER */}

      <div className="trainer-header">

        <div>
          <h1>🏋️ Trainers</h1>

          <p>
            Manage your gym trainers and
            their information.
          </p>
        </div>

        <button
          className="trainer-add-btn"
          onClick={openAddTrainer}
        >
          + Add Trainer
        </button>

      </div>

      {/* FORM */}

      {showForm && (

        <div className="trainer-form-card">

          <div className="trainer-form-header">

            <h2>
              {editingTrainerId
                ? "Edit Trainer"
                : "Add New Trainer"}
            </h2>

            <button
              className="trainer-close-btn"
              onClick={() => {
                setShowForm(false);
                setEditingTrainerId(null);
              }}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="trainer-form-grid">

              {/* NAME */}

              <div>
                <label>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter trainer name"
                  value={trainerForm.name}
                  onChange={handleChange}
                />
              </div>

              {/* EMAIL */}

              <div>
                <label>
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={trainerForm.email}
                  onChange={handleChange}
                />
              </div>

              {/* PHONE */}

              <div>
                <label>
                  Phone *
                </label>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={trainerForm.phone}
                  onChange={handleChange}
                />
              </div>

              {/* SPECIALIZATION */}

              <div>
                <label>
                  Specialization
                </label>

                <input
                  type="text"
                  name="specialization"
                  placeholder="e.g. Strength Training"
                  value={
                    trainerForm.specialization
                  }
                  onChange={handleChange}
                />
              </div>

              {/* EXPERIENCE */}

              <div>
                <label>
                  Experience (Years)
                </label>

                <input
                  type="number"
                  name="experience"
                  placeholder="e.g. 5"
                  min="0"
                  value={trainerForm.experience}
                  onChange={handleChange}
                />
              </div>

              {/* STATUS */}

              <div>
                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={trainerForm.status}
                  onChange={handleChange}
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

            <div className="trainer-form-buttons">

              <button
                type="button"
                className="trainer-cancel-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingTrainerId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="trainer-save-btn"
              >
                {editingTrainerId
                  ? "Update Trainer"
                  : "Add Trainer"}
              </button>

            </div>

          </form>

        </div>
      )}

      {/* TRAINER LIST */}

      <div className="trainer-table-card">

        <div className="trainer-table-header">

          <h2>
            Trainer List
          </h2>

          <span>
            Total: {trainers.length}
          </span>

        </div>

        <div className="trainer-table-container">

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

              {trainers.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="no-trainers"
                  >
                    No trainers found.
                  </td>
                </tr>

              ) : (

                trainers.map((trainer) => (

                  <tr key={trainer.id}>

                    <td>
                      <strong>
                        {trainer.name}
                      </strong>
                    </td>

                    <td>
                      {trainer.email}
                    </td>

                    <td>
                      {trainer.phone}
                    </td>

                    <td>
                      {trainer.specialization ||
                        "-"}
                    </td>

                    <td>
                      {trainer.experience
                        ? `${trainer.experience} years`
                        : "-"}
                    </td>

                    <td>

                      <span
                        className={`trainer-status ${
                          (
                            trainer.status || ""
                          ).toLowerCase()
                        }`}
                      >
                        {trainer.status}
                      </span>

                    </td>

                    <td>

                      <button
                        className="trainer-edit-btn"
                        onClick={() =>
                          openEditTrainer(
                            trainer
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="trainer-delete-btn"
                        onClick={() =>
                          deleteTrainer(
                            trainer.id
                          )
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

    </div>
  );
}

export default Trainer;