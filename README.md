# Instagram Follow Tasks Manager

A simple web interface to manage Instagram follow tasks from Airtable.

## Setup

1. Enable GitHub Pages for this repository:
   - Go to repository Settings
   - Navigate to Pages section
   - Select `main` branch and `/root` folder
   - Click Save

2. Access the interface at: `https://[your-username].github.io/[repo-name]/`

## Usage

1. Click the "Start Scheduled Tasks" button to process all tasks with status "Scheduled" in Airtable
2. The interface will show:
   - Number of successfully started tasks
   - Any errors that occurred
   - Loading state while processing

## Security Note

Make sure your Airtable API key and other sensitive information are properly secured in your backend environment variables. 