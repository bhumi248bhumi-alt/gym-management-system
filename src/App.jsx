import { useEffect } from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Terms from "./pages/Auth/Terms";
import RoleSelection from "./pages/RoleSelection/RoleSelection";
import Admin from "./pages/Admin/Admin";
import Trainer from "./pages/Trainer/Trainer";
import MembershipPlans from "./pages/Admin/MembershipPlans";

import { supabase } from "./lib/supabase";

function App() {
  useEffect(() => {
    async function testSupabase() {
      const { data, error } = await supabase
        .from("members")
        .select("*");

      console.log("Members from Supabase:", data);
      console.log("Supabase error:", error);
    }

    testSupabase();
  }, []);

  const path = window.location.pathname;

  if (path === "/login") {
    return <Login />;
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

  if (path === "/admin") {
    return <Admin />;
  }

  if (path === "/trainer") {
    return <Trainer />;
  }

  return <Home />;

  if (path === "/membership-plans") return <MembershipPlans />;
}

export default App;