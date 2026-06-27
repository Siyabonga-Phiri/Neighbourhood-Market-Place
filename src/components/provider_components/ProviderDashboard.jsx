import DashboardSidebar from "./DashboardSidebar";
import DashboardMain from "./DashboardMain";

function ProviderDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h1>NeighbourGig</h1>
      </header>

      <div className="dashboard-content">
        <DashboardSidebar user={user} />
        <DashboardMain />
      </div>

    </div>
  );
}

export default ProviderDashboard;