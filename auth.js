const STORAGE_KEY = 'ml_shop_users';
const SESSION_KEY = 'ml_shop_current_user';

document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }

    const loginForm = document.querySelector('.auth-form');
    if (loginForm && document.title.includes('Login')) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            const users = JSON.parse(localStorage.getItem(STORAGE_KEY));
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                const session = {
                    username: user.username,
                    email: user.email,
                    gameId: user.gameId,
                    loggedInAt: new Date().toISOString()
                };
                
                if (remember) {
                    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
                } else {
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
                }

                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1500);
            } else {
                showNotification('Invalid username or password!', 'error');
            }
        });
    }

    const registerForm = document.querySelector('.auth-form');
    if (registerForm && document.title.includes('Register')) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const gameId = document.getElementById('game-id').value;
            const terms = document.querySelector('input[name="terms"]').checked;

            if (password !== confirmPassword) {
                showNotification('Passwords do not match!', 'error');
                return;
            }

            if (!terms) {
                showNotification('Please accept the Terms and Conditions!', 'error');
                return;
            }

            const users = JSON.parse(localStorage.getItem(STORAGE_KEY));
            
            if (users.some(u => u.username === username)) {
                showNotification('Username already exists!', 'error');
                return;
            }

            if (users.some(u => u.email === email)) {
                showNotification('Email already registered!', 'error');
                return;
            }

            users.push({
                username,
                email,
                password,
                gameId,
                createdAt: new Date().toISOString()
            });

            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            
            showNotification('Registration successful! Redirecting to login...', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            
            if (!username) {
                showNotification('Please enter your username first!', 'error');
                return;
            }

            showNotification('Password reset instructions sent to your email!', 'success');
        });
    }

    function checkAuth() {
        const session = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    }

    function updateUIForAuth() {
        const user = checkAuth();
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu && user) {
            const usernameDisplay = document.createElement('span');
            usernameDisplay.className = 'username-display';
            usernameDisplay.textContent = `Welcome, ${user.username}`;
            
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Logout';
            logoutBtn.className = 'logout-btn';
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem(SESSION_KEY);
                sessionStorage.removeItem(SESSION_KEY);
                window.location.href = 'login.html';
            });

            navMenu.appendChild(usernameDisplay);
            navMenu.appendChild(logoutBtn);
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    updateUIForAuth();

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 5px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.5s ease;
        }
        
        .notification.success {
            background-color: #4CAF50;
        }
        
        .notification.error {
            background-color: #f44336;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .username-display {
            color: #fff;
            margin-right: 15px;
            padding: 5px 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
        }

        .logout-btn {
            color: #ff4444 !important;
            font-weight: bold;
        }
    `;
    document.head.appendChild(style);
}); 