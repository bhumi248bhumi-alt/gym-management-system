import { useEffect, useState } from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./ForgotPassword";
import Register from "./pages/Auth/Register";
import Terms from "./pages/Auth/Terms";
import RoleSelection from "./pages/RoleSelection/RoleSelection";

import Admin from "./pages/Admin/Admin";
import Trainer from "./pages/Trainer/Trainer";
import MembershipPlans from "./pages/Admin/MembershipPlans";
import Doctor from "./pages/Doctor/Doctor";
import Member from "./pages/Member/Member";
import Patient from "./pages/Patient/PatientDashboard";



import { supabase } from "./lib/supabase";


function App() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserProfile(null);
        setCheckingAuth(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, name, email, phone, role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile error:", error);
        setUserProfile(null);
      } else {
        console.log("Logged-in profile:", profile);
        setUserProfile(profile);
      }

      setCheckingAuth(false);
    }

    checkUser();
  }, []);

  const path = window.location.pathname;

  // ==========================================
  // PUBLIC PAGES
  // ==========================================

  if (
    path === "/" ||
    path === "/login" ||
    path === "/register" ||
    path === "/terms" ||
    path === "/forgot-password" ||
    path === "/role-selection"
    
  ) {
    if (path === "/login") {
      return <Login />;
    }

    if (path === "/forgot-password") {
      return <ForgotPassword />;
    }

    if (path === "/register") {
      return <Register />;
    }

    if (path === "/terms") {
      return <Terms />;
    }

    if (path === "/role-selection") {
      return <RoleSelection />;
    }

    return <Home />;
  }

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  if (checkingAuth) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#071426",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Checking login...
      </div>
    );
  }

  // ==========================================
  // TRAINER DASHBOARD
  // ==========================================

  if (path === "/trainer") {
    if (!userProfile) {
      window.location.href = "/login";
      return null;
    }

    if (
      userProfile.role !== "Trainer" &&
      userProfile.role !== "Admin"
    ) {
      alert(
        "You do not have permission to access the Trainer dashboard."
      );

      if (userProfile.role === "Member") {
        window.location.href = "/member";
      } else if (userProfile.role === "Doctor") {
        window.location.href = "/doctor";
      } else if (userProfile.role === "Patient") {
        window.location.href = "/patient";
      } else {
        window.location.href = "/login";
      }

      return null;
    }

    return <Trainer />;
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  if (path === "/admin") {
    if (!userProfile) {
      window.location.href = "/login";
      return null;
    }

    if (userProfile.role !== "Admin") {
      alert("Only Admin can access the Admin dashboard.");

      if (userProfile.role === "Trainer") {
        window.location.href = "/trainer";
      } else if (userProfile.role === "Doctor") {
        window.location.href = "/doctor";
      } else if (userProfile.role === "Member") {
        window.location.href = "/member";
      } else if (userProfile.role === "Patient") {
        window.location.href = "/patient";
      } else {
        window.location.href = "/login";
      }

      return null;
    }

    return <Admin />;
  }

  // ==========================================
  // MEMBERSHIP PLANS
  // ==========================================

  if (path === "/membership-plans") {
    if (!userProfile) {
      window.location.href = "/login";
      return null;
    }

    if (userProfile.role !== "Admin") {
      alert("Only Admin can access Membership Plans.");

      if (userProfile.role === "Trainer") {
        window.location.href = "/trainer";
      } else if (userProfile.role === "Doctor") {
        window.location.href = "/doctor";
      } else if (userProfile.role === "Member") {
        window.location.href = "/member";
      } else if (userProfile.role === "Patient") {
        window.location.href = "/patient";
      } else {
        window.location.href = "/login";
      }

      return null;
    }

    return <MembershipPlans />;
  }

  // ==========================================
  // DOCTOR DASHBOARD
  // ==========================================

  if (path === "/doctor") {
    if (!userProfile) {
      window.location.href = "/login";
      return null;
    }

    if (
      userProfile.role !== "Doctor" &&
      userProfile.role !== "Admin"
    ) {
      alert(
        "Only Doctor can access the Doctor dashboard."
      );

      if (userProfile.role === "Trainer") {
        window.location.href = "/trainer";
      } else if (userProfile.role === "Member") {
        window.location.href = "/member";
      } else if (userProfile.role === "Patient") {
        window.location.href = "/patient";
      } else {
        window.location.href = "/login";
      }

      return null;
    }

    return <Doctor />;
  }

  // ==========================================
  // MEMBER DASHBOARD
  // ==========================================

  if (path === "/member") {
    if (!userProfile) {
      window.location.href = "/login";
      return null;
    }

    if (
      userProfile.role !== "Member" &&
      userProfile.role !== "Admin"
    ) {
      alert(
        "Only Member can access the Member dashboard."
      );

      if (userProfile.role === "Trainer") {
        window.location.href = "/trainer";
      } else if (userProfile.role === "Doctor") {
        window.location.href = "/doctor";
      } else if (userProfile.role === "Patient") {
        window.location.href = "/patient";
      } else {
        window.location.href = "/login";
      }

      return null;
    }

    return <Member />;
  }

  // ==========================================
  // PATIENT DASHBOARD
  // ==========================================

  if (path === "/patient") {
    if (!userProfile) {
      window.location.href = "/login";
      return null;
    }

    if (
      userProfile.role !== "Patient" &&
      userProfile.role !== "Admin"
    ) {
      alert(
        "Only Patient can access the Patient dashboard."
      );

      if (userProfile.role === "Admin") {
        window.location.href = "/admin";
      } else if (userProfile.role === "Trainer") {
        window.location.href = "/trainer";
      } else if (userProfile.role === "Doctor") {
        window.location.href = "/doctor";
      } else if (userProfile.role === "Member") {
        window.location.href = "/member";
      } else {
        window.location.href = "/login";
      }

      return null;
    }

    return <Patient />;
  }

  // ==========================================
  // UNKNOWN URL
  // ==========================================

  return <Home />;
}

export default App;