// TrackMate Dashboard JavaScript

// Check authentication
const user = checkAuth();

// Update date
function updateDate() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    
    const dateElements = document.querySelectorAll('#currentDate, #dateText');
    dateElements.forEach(el => {
        if (el) el.textContent = dateStr;
    });
}

// Update greeting
function updateGreeting() {
    const greetingEl = document.getElementById('userGreeting');
    if (greetingEl && user) {
        const name = user.full_name ? user.full_name.split(' ')[0] : user.username;
        greetingEl.textContent = `Hello, ${name}`;
    }
}

// Load user health data
async function loadHealthData() {
    if (!user) return;
    
    try {
        // Update health info from user data
        const heightEl = document.getElementById('userHeight');
        const weightEl = document.getElementById('userWeight');
        const bmiEl = document.getElementById('bmiValue');
        
        if (user.height && heightEl) {
            heightEl.textContent = `${user.height} cm`;
        }
        
        if (user.weight && weightEl) {
            weightEl.textContent = `${user.weight} kg`;
        }
        
        // Calculate BMI if height and weight available
        if (user.height && user.weight) {
            const heightM = user.height / 100;
            const bmi = (user.weight / (heightM * heightM)).toFixed(1);
            if (bmiEl) bmiEl.textContent = bmi;
        }
        
        // TODO: Fetch health metrics from API
        // For now using mock data
        
    } catch (error) {
        console.error('Error loading health data:', error);
    }
}

// Open Edit Profile Modal
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal || !user) return;
    
    // Populate form with current user data
    document.getElementById('editFullName').value = user.full_name || '';
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editGender').value = user.gender || '';
    document.getElementById('editAge').value = user.age || '';
    document.getElementById('editHeight').value = user.height || '';
    document.getElementById('editWeight').value = user.weight || '';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Edit Profile Modal
function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Handle Edit Profile Form Submit
document.getElementById('editProfileForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        full_name: formData.get('full_name'),
        username: formData.get('username'),
        email: formData.get('email'),
        gender: formData.get('gender'),
        age: formData.get('age'),
        height: formData.get('height'),
        weight: formData.get('weight')
    };
    
    try {
        const response = await fetch('api/update-profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local user data
            Object.assign(user, data);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update UI
            updateGreeting();
            loadHealthData();
            
            // Close modal
            closeEditProfileModal();
            
            // Show success message
            alert('Profile updated successfully!');
        } else {
            alert(result.message || 'Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating profile');
    }
});

// Close modal on outside click
document.getElementById('editProfileModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'editProfileModal') {
        closeEditProfileModal();
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Call logout API
        fetch('api/logout.php', {
            method: 'POST',
            credentials: 'include'
        }).then(() => {
            // Clear local storage
            localStorage.clear();
            // Redirect to login
            window.location.href = 'login.html';
        }).catch(error => {
            console.error('Logout error:', error);
            // Still logout locally on error
            localStorage.clear();
            window.location.href = 'login.html';
        });
    }
}

// Simple productivity chart
function initChart() {
    const canvas = document.getElementById('productivityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;
    
    const data = [
        { study: 5, code: 3, meditation: 1 },
        { study: 6, code: 4, meditation: 2 },
        { study: 4, code: 5, meditation: 1 },
        { study: 7, code: 3, meditation: 2 },
        { study: 5, code: 6, meditation: 1 },
        { study: 6, code: 4, meditation: 2 },
        { study: 5, code: 5, meditation: 1 },
        { study: 8, code: 3, meditation: 2 },
        { study: 6, code: 4, meditation: 1 },
        { study: 5, code: 5, meditation: 2 },
        { study: 7, code: 4, meditation: 1 },
        { study: 6, code: 5, meditation: 2 },
        { study: 5, code: 6, meditation: 1 },
        { study: 7, code: 4, meditation: 2 },
        { study: 6, code: 5, meditation: 1 },
        { study: 8, code: 3, meditation: 2 },
        { study: 5, code: 6, meditation: 1 },
        { study: 6, code: 4, meditation: 2 },
        { study: 7, code: 5, meditation: 1 },
        { study: 5, code: 6, meditation: 2 }
    ];
    
    const barWidth = (canvas.width - 100) / data.length;
    const maxHeight = 10;
    const barSpacing = 2;
    const groupSpacing = barWidth / 3;
    
    // Draw bars
    data.forEach((day, index) => {
        const x = 50 + (index * barWidth);
        
        // Study (red)
        const studyHeight = (day.study / maxHeight) * 180;
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x, canvas.height - studyHeight - 30, groupSpacing - barSpacing, studyHeight);
        
        // Code (cyan)
        const codeHeight = (day.code / maxHeight) * 180;
        ctx.fillStyle = '#9CDDDD';
        ctx.fillRect(x + groupSpacing, canvas.height - codeHeight - 30, groupSpacing - barSpacing, codeHeight);
        
        // Meditation (orange)
        const meditationHeight = (day.meditation / maxHeight) * 180;
        ctx.fillStyle = '#FF9F66';
        ctx.fillRect(x + (groupSpacing * 2), canvas.height - meditationHeight - 30, groupSpacing - barSpacing, meditationHeight);
    });
}

// Clear notifications
document.querySelector('.clear-btn')?.addEventListener('click', () => {
    const notifications = document.querySelector('.notifications');
    if (notifications && confirm('Clear all notifications?')) {
        notifications.innerHTML = '<div class="notification-item">No new notifications</div>';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    updateGreeting();
    loadHealthData();
    
    // Wait for canvas to be sized
    setTimeout(() => {
        initChart();
    }, 100);
    
    // Check if edit parameter is in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') === 'profile') {
        setTimeout(() => openEditProfileModal(), 300);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Refresh chart on window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initChart();
    }, 250);
});
