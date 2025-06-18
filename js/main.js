document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const statusDiv = document.getElementById('status');
    const loginForm = document.getElementById('loginForm');
    const contentDiv = document.getElementById('content');

    // Check if we have a valid token
    const token = localStorage.getItem('auth_token');
    if (!token) {
        loginForm.style.display = 'block';
        contentDiv.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        contentDiv.style.display = 'block';
    }

    // Handle login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('http://83.136.210.142:8000/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('auth_token', data.token);
                loginForm.style.display = 'none';
                contentDiv.style.display = 'block';
                showStatus('Successfully logged in', 'success');
            } else {
                showStatus('Invalid password', 'error');
            }
        } catch (error) {
            showStatus('Login failed: ' + error.message, 'error');
        }
    });

    startButton.addEventListener('click', async () => {
        try {
            // Disable button and show loading state
            startButton.classList.add('loading');
            startButton.disabled = true;
            showStatus('Processing...', 'info');

            // Get auth token
            const token = localStorage.getItem('auth_token');
            if (!token) {
                showStatus('Please log in first', 'error');
                return;
            }

            // Call your Flask backend
            const response = await fetch('http://83.136.210.142:8000/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ tasks: [] })
            });

            if (response.status === 401) {
                localStorage.removeItem('auth_token');
                loginForm.style.display = 'block';
                contentDiv.style.display = 'none';
                showStatus('Session expired. Please log in again.', 'error');
                return;
            }

            const result = await response.json();
            
            // Show success message with details
            const successfulTasks = result.results.filter(r => r.status === 'started').length;
            const failedTasks = result.results.filter(r => r.status === 'error').length;
            
            let message = `✅ Successfully started ${successfulTasks} tasks`;
            if (failedTasks > 0) {
                message += `\n❌ Failed to start ${failedTasks} tasks`;
            }
            
            showStatus(message, 'success');
        } catch (error) {
            console.error('Error:', error);
            showStatus('❌ Error: ' + error.message, 'error');
        } finally {
            // Re-enable button and remove loading state
            startButton.classList.remove('loading');
            startButton.disabled = false;
        }
    });

    function showStatus(message, type) {
        statusDiv.classList.remove('hidden', 'bg-green-100', 'bg-red-100', 'bg-blue-100');
        statusDiv.classList.add(
            type === 'success' ? 'bg-green-100' :
            type === 'error' ? 'bg-red-100' : 'bg-blue-100'
        );
        statusDiv.innerHTML = message.replace(/\n/g, '<br>');
    }
}); 