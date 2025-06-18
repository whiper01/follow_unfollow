document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const statusDiv = document.getElementById('status');

    startButton.addEventListener('click', async () => {
        try {
            // Disable button and show loading state
            startButton.classList.add('loading');
            startButton.disabled = true;
            showStatus('Processing...', 'info');

            // Call your Flask backend
            const response = await fetch('http://83.136.210.142:8000/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tasks: [] }) // Empty tasks array will trigger backend to fetch scheduled tasks
            });

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