// TrackMate Reports JavaScript

// Check authentication
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

// Chart instances
let dailyChart = null;
let weeklyChart = null;
let monthlyChart = null;
let yearlyChart = null;

// Update date
function updateDate() {
    const now = new Date();
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', options);
    document.getElementById('currentDate').textContent = dateStr;
}

// Show report tab
function showReportTab(tab) {
    // Hide all sections
    document.querySelectorAll('.report-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(`${tab}Report`).classList.add('active');
    
    // Add active to clicked tab
    event.target.classList.add('active');
    
    // Load data for the selected tab
    switch(tab) {
        case 'daily':
            loadDailyReport();
            break;
        case 'weekly':
            loadWeeklyReport();
            break;
        case 'monthly':
            loadMonthlyReport();
            break;
        case 'yearly':
            loadYearlyReport();
            break;
    }
}

// Navigate dates
function navigateDate(type, direction) {
    const dateInput = document.getElementById(`${type}Date`);
    let currentDate;
    
    if (type === 'yearly') {
        const currentYear = parseInt(dateInput.value);
        dateInput.value = currentYear + direction;
    } else {
        currentDate = new Date(dateInput.value || new Date());
        
        switch(type) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + direction);
                dateInput.value = currentDate.toISOString().split('T')[0];
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + (direction * 7));
                const year = currentDate.getFullYear();
                const week = getWeekNumber(currentDate);
                dateInput.value = `${year}-W${week.toString().padStart(2, '0')}`;
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + direction);
                const yearMonth = currentDate.toISOString().slice(0, 7);
                dateInput.value = yearMonth;
                break;
        }
    }
    
    // Reload the report
    switch(type) {
        case 'daily': loadDailyReport(); break;
        case 'weekly': loadWeeklyReport(); break;
        case 'monthly': loadMonthlyReport(); break;
        case 'yearly': loadYearlyReport(); break;
    }
}

// Get week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Load Daily Report
function loadDailyReport() {
    const date = document.getElementById('dailyDate').value || new Date().toISOString().split('T')[0];
    
    // Destroy existing chart
    if (dailyChart) {
        dailyChart.destroy();
    }
    
    // Create pie chart for daily activities
    const ctx = document.getElementById('dailyChart');
    dailyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Working', 'Phone Usage', 'Sleeping', 'Eating', 'Other'],
            datasets: [{
                data: [6.5, 3.2, 7.8, 2.0, 4.5],
                backgroundColor: [
                    '#FF9F66',
                    '#9CDDDD',
                    '#A78BFA',
                    '#FCA5A5',
                    '#CBD5E0'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12,
                            family: "'Inter', sans-serif"
                        }
                    }
                }
            }
        }
    });
}

// Load Weekly Report
function loadWeeklyReport() {
    const week = document.getElementById('weeklyDate').value;
    
    // Destroy existing chart
    if (weeklyChart) {
        weeklyChart.destroy();
    }
    
    // Create bar chart for weekly trends
    const ctx = document.getElementById('weeklyChart');
    weeklyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [
                {
                    label: 'Working',
                    data: [6.5, 7.0, 5.5, 6.0, 5.5, 3.0, 2.0],
                    backgroundColor: '#FF9F66'
                },
                {
                    label: 'Phone',
                    data: [2.0, 2.0, 2.0, 2.0, 1.5, 1.0, 1.5],
                    backgroundColor: '#9CDDDD'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: {
                        borderDash: [5, 5]
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'h';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Load Monthly Report
function loadMonthlyReport() {
    const month = document.getElementById('monthlyDate').value;
    
    // Destroy existing chart
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    // Create line chart for monthly overview
    const ctx = document.getElementById('monthlyChart');
    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Working Hours',
                    data: [42, 38, 45, 43],
                    borderColor: '#FF9F66',
                    backgroundColor: 'rgba(255, 159, 102, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Phone Usage',
                    data: [18, 22, 20, 19],
                    borderColor: '#9CDDDD',
                    backgroundColor: 'rgba(156, 221, 221, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Sleep Hours',
                    data: [52, 54, 51, 53],
                    borderColor: '#A78BFA',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [5, 5]
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'h';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Load Yearly Report
function loadYearlyReport() {
    const year = document.getElementById('yearlyDate').value;
    
    // Destroy existing chart
    if (yearlyChart) {
        yearlyChart.destroy();
    }
    
    // Create bar chart for yearly overview
    const ctx = document.getElementById('yearlyChart');
    yearlyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Working',
                    data: [160, 152, 168, 164, 172, 168, 160, 176, 180, 172, 168, 164],
                    backgroundColor: '#FF9F66'
                },
                {
                    label: 'Phone',
                    data: [80, 85, 78, 82, 88, 85, 80, 82, 78, 85, 82, 80],
                    backgroundColor: '#9CDDDD'
                },
                {
                    label: 'Sleep',
                    data: [220, 200, 224, 210, 217, 210, 220, 217, 210, 220, 210, 220],
                    backgroundColor: '#A78BFA'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        borderDash: [5, 5]
                    },
                    ticks: {
                        callback: function(value) {
                            return value + 'h';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Export report
function exportReport() {
    // Get current active report
    const activeSection = document.querySelector('.report-section.active');
    const reportType = activeSection.id.replace('Report', '');
    
    // Prepare data for export
    const reportData = {
        type: reportType,
        date: new Date().toISOString(),
        user: user.username,
        data: {
            // This would be replaced with actual data
            summary: 'Activity report data',
            activities: []
        }
    };
    
    // Create JSON file
    const dataStr = JSON.stringify(reportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackmate-${reportType}-report-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Print report
function printReport() {
    window.print();
}

// Initialize date inputs with current date
function initializeDates() {
    const now = new Date();
    
    // Daily
    document.getElementById('dailyDate').value = now.toISOString().split('T')[0];
    
    // Weekly
    const year = now.getFullYear();
    const week = getWeekNumber(now);
    document.getElementById('weeklyDate').value = `${year}-W${week.toString().padStart(2, '0')}`;
    
    // Monthly
    document.getElementById('monthlyDate').value = now.toISOString().slice(0, 7);
    
    // Yearly
    document.getElementById('yearlyDate').value = year.toString();
}

// Logout function
function logout() {
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    initializeDates();
    loadDailyReport();
});
