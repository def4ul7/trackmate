// TrackMate Profile JavaScript

// Check authentication (checkAuth is defined in auth.js)
let user = null;
try {
    const userData = localStorage.getItem('trackmate_user');
    if (userData) {
        user = JSON.parse(userData);
    } else {
        window.location.href = 'login.html';
    }
} catch (e) {
    window.location.href = 'login.html';
}

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
    
    // Load profile image if exists
    loadProfileImage();
    
    // Load additional user data
    loadUserDetails();
}

// Load profile image
function loadProfileImage() {
    const avatarImage = document.getElementById('avatarImage');
    const avatarEmoji = document.getElementById('avatarEmoji');
    
    if (user.profile_image) {
        avatarImage.src = user.profile_image;
        avatarImage.style.display = 'block';
        avatarEmoji.style.display = 'none';
    } else {
        avatarImage.style.display = 'none';
        avatarEmoji.style.display = 'block';
    }
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
    document.getElementById('avatarInput').click();
});

// Handle avatar upload
document.getElementById('avatarInput')?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB.');
        return;
    }
    
    const avatarImage = document.getElementById('avatarImage');
    const avatarEmoji = document.getElementById('avatarEmoji');
    const avatarCircle = document.getElementById('avatarCircle');
    const editBtn = document.getElementById('editAvatarBtn');
    
    // Show loading state
    const originalBtnText = editBtn.textContent;
    editBtn.textContent = '⏳';
    editBtn.disabled = true;
    avatarCircle.style.opacity = '0.6';
    
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        avatarImage.src = e.target.result;
        avatarImage.style.display = 'block';
        avatarEmoji.style.display = 'none';
    };
    reader.readAsDataURL(file);
    
    // Upload to server
    const formData = new FormData();
    formData.append('profile_image', file);
    
    try {
        const response = await fetch('api/upload-profile-image.php', {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update user data in localStorage
            user.profile_image = result.image_path;
            localStorage.setItem('trackmate_user', JSON.stringify(user));
            
            // Load the processed image from server
            avatarImage.src = result.image_path + '?t=' + new Date().getTime();
            
            // Show success feedback
            avatarCircle.style.opacity = '1';
            editBtn.textContent = '✓';
            setTimeout(() => {
                editBtn.textContent = originalBtnText;
            }, 2000);
        } else {
            console.error('Upload failed:', result);
            alert('Upload failed: ' + (result.message || 'Unknown error'));
            // Revert to previous state
            loadProfileImage();
            avatarCircle.style.opacity = '1';
            editBtn.textContent = originalBtnText;
        }
    } catch (error) {
        console.error('Upload error:', error);
        alert('Network error: Could not connect to server. Please check your connection and try again.');
        // Revert to previous state
        loadProfileImage();
        avatarCircle.style.opacity = '1';
        editBtn.textContent = originalBtnText;
    } finally {
        editBtn.disabled = false;
        // Reset file input
        e.target.value = '';
    }
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
