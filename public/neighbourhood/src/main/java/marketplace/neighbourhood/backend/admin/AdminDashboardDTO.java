package marketplace.neighbourhood.backend.admin;

public class AdminDashboardDTO {

    private long users;
    private long providers;
    private long services;
    private long requests;
    private long bookings;

    public AdminDashboardDTO() {
    }

    public AdminDashboardDTO(long users,
                             long providers,
                             long services,
                             long requests,
                             long bookings) {
        this.users = users;
        this.providers = providers;
        this.services = services;
        this.requests = requests;
        this.bookings = bookings;
    }

    public long getUsers() {
        return users;
    }

    public void setUsers(long users) {
        this.users = users;
    }

    public long getProviders() {
        return providers;
    }

    public void setProviders(long providers) {
        this.providers = providers;
    }

    public long getServices() {
        return services;
    }

    public void setServices(long services) {
        this.services = services;
    }

    public long getRequests() {
        return requests;
    }

    public void setRequests(long requests) {
        this.requests = requests;
    }

    public long getBookings() {
        return bookings;
    }

    public void setBookings(long bookings) {
        this.bookings = bookings;
    }
}