document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }

    const profileForm = document.getElementById('profile-form');

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('http://localhost:3000/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Profile updated successfully!');
            } else {
                alert(data.message);
            }
        });
    }
});