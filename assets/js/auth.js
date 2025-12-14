// TrackMate Authentication JavaScript
// API Configuration - Use relative paths to work with any IP
const API_BASE_URL = window.location.origin + '/trackmate/api';

// Fetch configuration to include credentials
const fetchConfig = {
    credentials: 'include', // Include cookies for cross-origin requests
    headers: {
        'Content-Type': 'application/json'
    }
};

// Utility Functions
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;
    
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            alertBox.style.display = 'none';
        }, 5000);
    }
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.style.display = 'none';
    }
}

function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}Error`);
    const inputElement = document.getElementById(inputId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('show');
    });
    
    document.querySelectorAll('input.error').forEach(el => {
        el.classList.remove('error');
    });
}

function setLoading(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const loader = button.querySelector('.loader');
    
    if (isLoading) {
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (loader) loader.style.display = 'block';
    } else {
        button.disabled = false;
        if (btnText) btnText.style.display = 'block';
        if (loader) loader.style.display = 'none';
    }
}

// Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

function validateUsername(username) {
    const re = /^[a-zA-Z0-9_]{3,50}$/;
    return re.test(username);
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) return { level: 'weak', text: 'Weak', class: 'strength-weak' };
    if (strength <= 4) return { level: 'medium', text: 'Medium', class: 'strength-medium' };
    return { level: 'strong', text: 'Strong', class: 'strength-strong' };
}

function updatePasswordStrength(inputId) {
    const input = document.getElementById(inputId);
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!input || !strengthContainer || !strengthFill || !strengthText) return;
    
    const password = input.value;
    
    if (password.length === 0) {
        strengthContainer.style.display = 'none';
        return;
    }
    
    strengthContainer.style.display = 'block';
    const strength = checkPasswordStrength(password);
    
    strengthFill.className = `strength-fill ${strength.class}`;
    strengthText.textContent = `Password strength: ${strength.text}`;
    strengthText.style.color = strength.level === 'weak' ? 'var(--error)' : 
                                 strength.level === 'medium' ? 'var(--warning)' : 'var(--success)';
}

// Toggle Password Visibility
function initPasswordToggle() {
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.target || 'password';
            const input = document.getElementById(targetId);
            
            if (input) {
                const type = input.type === 'password' ? 'text' : 'password';
                input.type = type;
                this.querySelector('.eye-icon').textContent = type === 'password' ? '👁️' : '🙈';
            }
        });
    });
}

// API Request Helper
async function makeRequest(endpoint, method = 'POST', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include cookies for cross-origin requests
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
        const result = await response.json();
        
        return result;
    } catch (error) {
        console.error('API Request Error:', error);
        return {
            success: false,
            message: 'Network error. Please check your connection and try again.'
        };
    }
}

// Login Functionality
function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    initPasswordToggle();
    
    // Clear errors on input
    ['email', 'password'].forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', () => clearError(field));
        }
    });
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();
        hideAlert();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        
        // Validation
        let isValid = true;
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Submit login
        setLoading('loginBtn', true);
        
        const result = await makeRequest('login.php', 'POST', {
            email: email,
            password: password
        });
        
        setLoading('loginBtn', false);
        
        if (result.success) {
            // Store session data
            localStorage.setItem('trackmate_user', JSON.stringify(result.data));
            if (rememberMe) {
                localStorage.setItem('trackmate_remember', 'true');
            }
            
            showAlert('Login successful! Redirecting...', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showAlert(result.message || 'Login failed. Please try again.', 'error');
        }
    });
}

// Signup Functionality
function initSignup() {
    const form = document.getElementById('signupForm');
    if (!form) return;
    
    initPasswordToggle();
    
    // Clear errors on input
    ['fullName', 'username', 'email', 'password', 'confirmPassword'].forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', () => clearError(field));
        }
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrength('password');
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();
        hideAlert();
        
        const fullName = document.getElementById('fullName').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms')?.checked || false;
        
        // Validation
        let isValid = true;
        
        if (!fullName) {
            showError('fullName', 'Full name is required');
            isValid = false;
        } else if (fullName.length < 2) {
            showError('fullName', 'Full name must be at least 2 characters');
            isValid = false;
        }
        
        if (!username) {
            showError('username', 'Username is required');
            isValid = false;
        } else if (!validateUsername(username)) {
            showError('username', 'Username must be 3-50 characters (letters, numbers, underscore only)');
            isValid = false;
        }
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!agreeTerms) {
            showError('agreeTerms', 'You must agree to the terms');
            showAlert('Please agree to the Terms of Service and Privacy Policy', 'error');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Submit signup
        setLoading('signupBtn', true);
        
        const result = await makeRequest('signup.php', 'POST', {
            full_name: fullName,
            username: username,
            email: email,
            password: password,
            confirm_password: confirmPassword
        });
        
        setLoading('signupBtn', false);
        
        if (result.success) {
            showAlert(result.message || 'Account created successfully!', 'success');
            
            // Generate backup codes
            const backupResult = await makeRequest('generate-backup-codes.php', 'POST', {
                user_id: result.data.user_id
            });
            
            if (backupResult.success && backupResult.codes) {
                // Show backup codes to user
                showBackupCodes(backupResult.codes);
            } else {
                // Still redirect even if backup codes fail
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }
        } else {
            showAlert(result.message || 'Signup failed. Please try again.', 'error');
        }
    });
}

// Show backup codes modal
function showBackupCodes(codes) {
    const modalHTML = `
        <div class="backup-codes-modal" id="backupCodesModal">
            <div class="backup-codes-content">
                <h2>🔐 Save Your Backup Codes</h2>
                <p class="modal-subtitle">Store these codes safely. You'll need them to recover your account if you forget your password.</p>
                
                <div class="backup-codes-grid">
                    ${codes.map(code => `<div class="backup-code-item">${code}</div>`).join('')}
                </div>
                
                <div class="backup-codes-warning">
                    <strong>⚠️ Important:</strong> Each code can only be used once. Save them in a secure location.
                </div>
                
                <div class="backup-codes-actions">
                    <button onclick="downloadBackupCodes()" class="btn btn-secondary">
                        📥 Download Codes
                    </button>
                    <button onclick="copyBackupCodes()" class="btn btn-secondary">
                        📋 Copy All
                    </button>
                    <button onclick="closeBackupCodes()" class="btn btn-primary">
                        I've Saved Them
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Store codes globally for download/copy
    window.backupCodes = codes;
}

function downloadBackupCodes() {
    const codes = window.backupCodes || [];
    const text = 'TrackMate Backup Recovery Codes\n' +
                 'Generated: ' + new Date().toLocaleString() + '\n\n' +
                 'Keep these codes safe. Each can only be used once.\n\n' +
                 codes.map((code, i) => `${i + 1}. ${code}`).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trackmate-backup-codes.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}

function copyBackupCodes() {
    const codes = window.backupCodes || [];
    const text = codes.join('\n');
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Backup codes copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy codes. Please download them instead.');
    });
}

function closeBackupCodes() {
    const modal = document.getElementById('backupCodesModal');
    if (modal) {
        modal.remove();
    }
    window.location.href = 'login.html';
}

// Forgot Password Functionality
function initForgotPassword() {
    const form = document.getElementById('forgotPasswordForm');
    if (!form) return;
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const emailTab = document.getElementById('emailTab');
    const backupTab = document.getElementById('backupTab');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            if (tab === 'email') {
                emailTab.classList.add('active');
                backupTab.classList.remove('active');
            } else {
                emailTab.classList.remove('active');
                backupTab.classList.add('active');
            }
            
            clearAllErrors();
            hideAlert();
        });
    });
    
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', () => clearError('email'));
    }
    
    const backupEmailInput = document.getElementById('backupEmail');
    if (backupEmailInput) {
        backupEmailInput.addEventListener('input', () => clearError('backupEmail'));
    }
    
    const backupCodeInput = document.getElementById('backupCode');
    if (backupCodeInput) {
        backupCodeInput.addEventListener('input', () => clearError('backupCode'));
    }
    
    // Email recovery
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();
        hideAlert();
        
        const email = document.getElementById('email').value.trim();
        
        // Validation
        let isValid = true;
        
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Submit forgot password request
        setLoading('resetBtn', true);
        
        const result = await makeRequest('forgot-password.php', 'POST', {
            email: email
        });
        
        setLoading('resetBtn', false);
        
        if (result.success) {
            showAlert(result.message || 'Password reset link sent to your email!', 'success');
            
            // Show debug link in development
            if (result.debug_link) {
                console.log('Password Reset Link:', result.debug_link);
                showAlert(`Check console for reset link (dev mode)`, 'info');
            }
            
            // Clear form
            form.reset();
        } else {
            showAlert(result.message || 'An error occurred. Please try again.', 'error');
        }
    });
    
    // Backup code recovery
    const backupBtn = document.getElementById('backupBtn');
    if (backupBtn) {
        backupBtn.addEventListener('click', async () => {
            clearAllErrors();
            hideAlert();
            
            const email = document.getElementById('backupEmail').value.trim();
            const backupCode = document.getElementById('backupCode').value.trim();
            
            // Validation
            let isValid = true;
            
            if (!email) {
                showError('backupEmail', 'Email is required');
                isValid = false;
            } else if (!validateEmail(email)) {
                showError('backupEmail', 'Please enter a valid email address');
                isValid = false;
            }
            
            if (!backupCode) {
                showError('backupCode', 'Backup code is required');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Submit backup code verification
            setLoading('backupBtn', true);
            
            const result = await makeRequest('verify-backup-code.php', 'POST', {
                email: email,
                backup_code: backupCode
            });
            
            setLoading('backupBtn', false);
            
            if (result.success) {
                showAlert('Backup code verified! Redirecting to reset password...', 'success');
                
                // Redirect to reset password with token
                setTimeout(() => {
                    window.location.href = `reset-password.html?token=${result.token}&email=${encodeURIComponent(email)}`;
                }, 1500);
            } else {
                showAlert(result.message || 'Invalid backup code. Please try again.', 'error');
            }
        });
    }
}

// Reset Password Functionality
function initResetPassword() {
    const form = document.getElementById('resetPasswordForm');
    if (!form) return;
    
    initPasswordToggle();
    
    // Get token and email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (!token || !email) {
        showAlert('Invalid or missing reset token. Please request a new password reset.', 'error');
        setTimeout(() => {
            window.location.href = 'forgot-password.html';
        }, 3000);
        return;
    }
    
    // Set hidden fields
    document.getElementById('resetToken').value = token;
    document.getElementById('resetEmail').value = email;
    
    // Clear errors on input
    ['password', 'confirmPassword'].forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            input.addEventListener('input', () => clearError(field));
        }
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updatePasswordStrength('password');
        });
    }
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();
        hideAlert();
        
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        let isValid = true;
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (!validatePassword(password)) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        }
        
        if (!confirmPassword) {
            showError('confirmPassword', 'Please confirm your password');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        if (!isValid) return;
        
        // Submit reset password
        setLoading('resetBtn', true);
        
        const result = await makeRequest('reset-password.php', 'POST', {
            email: email,
            token: token,
            password: password,
            confirm_password: confirmPassword
        });
        
        setLoading('resetBtn', false);
        
        if (result.success) {
            showAlert(result.message || 'Password reset successful! Redirecting to login...', 'success');
            
            // Redirect to login
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            showAlert(result.message || 'Password reset failed. Please try again.', 'error');
        }
    });
}

// Logout Functionality
async function logout() {
    const result = await makeRequest('logout.php', 'POST');
    
    if (result.success) {
        // Clear local storage
        localStorage.removeItem('trackmate_user');
        localStorage.removeItem('trackmate_remember');
        
        // Redirect to login
        window.location.href = 'login.html';
    } else {
        console.error('Logout failed:', result.message);
        // Force redirect anyway
        localStorage.clear();
        window.location.href = 'login.html';
    }
}

// Check Authentication
function checkAuth() {
    const user = localStorage.getItem('trackmate_user');
    
    if (!user) {
        // Not logged in, redirect to login
        if (!window.location.pathname.includes('login.html') && 
            !window.location.pathname.includes('signup.html') &&
            !window.location.pathname.includes('forgot-password.html') &&
            !window.location.pathname.includes('reset-password.html')) {
            window.location.href = 'login.html';
        }
        return null;
    }
    
    try {
        return JSON.parse(user);
    } catch (e) {
        localStorage.removeItem('trackmate_user');
        window.location.href = 'login.html';
        return null;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => console.log('Service Worker registered'))
            .catch(error => console.log('Service Worker registration failed:', error));
    }
});
