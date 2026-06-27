export async function getCurrentUser() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        "http://localhost:8081/api/users/me",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Not authenticated");
    }

    return response.json();
}