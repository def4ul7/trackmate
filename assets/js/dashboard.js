// TrackMate Dashboard JavaScript

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
    const profileNameEl = document.getElementById('profileName');
    const profileEmailEl = document.getElementById('profileEmail');
    const avatarTextEl = document.getElementById('avatarText');
    const avatarCircleEl = document.querySelector('.sidebar-right .avatar-circle');
    
    if (user) {
        const name = user.full_name ? user.full_name.split(' ')[0] : user.username;
        
        if (greetingEl) {
            greetingEl.textContent = `Hello, ${name}`;
        }
        
        if (profileNameEl) {
            profileNameEl.textContent = user.full_name || user.username;
        }
        
        if (profileEmailEl) {
            profileEmailEl.textContent = user.email || 'user@trackmate.com';
        }
        
        // Update avatar - show image if available, otherwise show initial
        if (avatarCircleEl) {
            if (user.profile_image) {
                // Clear existing content
                avatarCircleEl.innerHTML = '';
                // Create and add image
                const img = document.createElement('img');
                img.src = user.profile_image + '?t=' + new Date().getTime(); // Add cache buster
                img.alt = 'Profile';
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.style.borderRadius = '50%';
                avatarCircleEl.appendChild(img);
            } else {
                // Show initial if no image
                const initial = (user.full_name || user.username).charAt(0).toUpperCase();
                avatarCircleEl.innerHTML = `<div class="avatar-text" id="avatarText">${initial}</div>`;
            }
        }
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
        user_id: user?.user_id || user?.id, // Include user_id as fallback
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
            // Update local user data with the data returned from server
            if (result.user) {
                user = result.user;
                localStorage.setItem('trackmate_user', JSON.stringify(user));
            }
            
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
        alert('An error occurred while updating profile. Please check your connection and try again.');
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

// Initialize chart with Chart.js
function initChart() {
    const canvas = document.getElementById('productivityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Working',
                    data: [6.5, 7.0, 5.5, 6.0, 5.5, 3.0, 2.0],
                    borderColor: '#FF9F66',
                    backgroundColor: 'rgba(255, 159, 102, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Phone Usage',
                    data: [2.0, 2.0, 2.0, 2.0, 1.5, 1.0, 1.5],
                    borderColor: '#9CDDDD',
                    backgroundColor: 'rgba(156, 221, 221, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Sleep',
                    data: [7.5, 8.0, 7.0, 7.5, 8.0, 9.0, 8.5],
                    borderColor: '#A78BFA',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y + 'h';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 10,
                    grid: {
                        borderDash: [5, 5],
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'h';
                        },
                        font: {
                            size: 11
                        },
                        color: '#8E8E93'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#8E8E93'
                    }
                }
            }
        }
    });
}

// Update legend colors
function updateChartLegend() {
    const workDot = document.querySelector('.work-dot');
    const phoneDot = document.querySelector('.phone-dot');
    const sleepDot = document.querySelector('.sleep-dot');
    
    if (workDot) workDot.style.background = '#FF9F66';
    if (phoneDot) phoneDot.style.background = '#9CDDDD';
    if (sleepDot) sleepDot.style.background = '#A78BFA';
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
    updateChartLegend();
    
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

// Reload user data when page becomes visible (e.g., coming back from profile page)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Reload user data from localStorage
        const userData = localStorage.getItem('trackmate_user');
        if (userData) {
            user = JSON.parse(userData);
            updateGreeting();
        }
    }
});

// Also reload when window gets focus
window.addEventListener('focus', () => {
    const userData = localStorage.getItem('trackmate_user');
    if (userData) {
        user = JSON.parse(userData);
        updateGreeting();
    }
});

// Refresh chart on window resize (removed, Chart.js handles this)

