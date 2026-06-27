function DashboardSidebar({ user, profile }) {

  return (

    <aside className="sidebar">


      <div className="profile-section">


        <div className="avatar"></div>


        <h3>

          {profile?.firstName}
          {" "}
          {profile?.lastName}

        </h3>


        <p>

          {profile?.email}

        </p>


      </div>




      <nav className="sidebar-menu">


        <div>Dashboard</div>

        <div>My Profile</div>

        <div>My Listings</div>

        <div>My Requests</div>

        <div>Messages</div>

        <div>Reviews</div>

        <div>Settings</div>


      </nav>


    </aside>

  );

}


export default DashboardSidebar;