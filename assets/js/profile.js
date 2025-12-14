// TrackMate Profile JavaScript

// Check authentication
const user = checkAuth();

// Load user profile data
function loadProfileData() {
    if (!user) return;
    
    // Update profile name
    const profileName = document.getElementById('profileName');
    if (profileName) {
        const name = user.full_name || user.username;
        profileName.textContent = name;
    }
    
    // Update email
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = user.email || 'email@example.com';
    }
    
    // Load additional user data
    loadUserDetails();
}

// Load user details (gender, age, height, weight)
function loadUserDetails() {
    try {
        // Update UI with user data
        document.getElementById('userGender').textContent = user.gender || '-';
        document.getElementById('userAge').textContent = user.age || '-';
        document.getElementById('userHeight').textContent = user.height ? `${user.height} cm` : '-';
        document.getElementById('userWeight').textContent = user.weight ? `${user.weight} kg` : '-';
        
    } catch (error) {
        console.error('Error loading user details:', error);
    }
}

// Open edit modal (redirect to dashboard with modal)
function openEditModal() {
    window.location.href = 'dashboard.html?edit=profile';
}

// Logout function
function logoutUser() {
    if (confirm('Are you sure you want to logout?')) {
        fetch('api/logout.php', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            localStorage.clear();
            window.location.href = 'login.html';
        }).catch(error => {
            console.error('Logout error:', error);
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Edit avatar
document.querySelector('.edit-avatar-btn')?.addEventListener('click', () => {
    alert('Avatar upload functionality coming soon!');
});

// Delete account
document.querySelector('.danger-btn')?.addEventListener('click', async () => {
    const confirmation = prompt('Type "DELETE" to confirm account deletion:');
    
    if (confirmation === 'DELETE') {
        if (confirm('Are you absolutely sure? This action cannot be undone.')) {
            try {
                // In a real app, call API to delete account
                console.log('Deleting account...');
                
                // Clear session and redirect
                localStorage.clear();
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Failed to delete account. Please try again.');
            }
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProfileData();
});
