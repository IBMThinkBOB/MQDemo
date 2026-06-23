# LinuxONE IBM MQ Hands-On Lab Website

## Overview

This is a self-contained, interactive website for the LinuxONE IBM MQ hands-on lab event. Attendees can follow step-by-step instructions to install IBM MQ, configure a queue manager, and test messaging on their dedicated LinuxONE VMs.

## Features

### 🎯 Complete Step-by-Step Guide
- **6 Major Steps**: From SSH connection to working message queue
- **Clear Instructions**: Every command explained with expected output
- **Validation Checkpoints**: Verify success at each stage
- **Troubleshooting**: Common issues and solutions

### 🎨 Interactive Elements
- **Progress Tracking**: Visual progress bar shows current step
- **Copy Buttons**: One-click copy for all commands
- **Checkboxes**: Track completion of tasks
- **Auto-Save**: Progress saved to browser localStorage
- **Smooth Navigation**: Click progress steps to jump to sections

### ⌨️ Keyboard Shortcuts
- **Ctrl/Cmd + K**: Quick jump to any section
- **Ctrl/Cmd + P**: Print the guide
- **Ctrl/Cmd + Home**: Scroll to top

### 📱 Responsive Design
- Works on desktop, tablet, and mobile
- Print-friendly layout
- Accessible and easy to read

### 🔧 Additional Features
- Scroll-to-top button
- Help tooltip with shortcuts
- Command palette for navigation
- Automatic progress saving

## Files

```
website/
├── index.html      # Main HTML content (682 lines)
├── styles.css      # Styling and layout (571 lines)
├── script.js       # Interactive features (408 lines)
└── README.md       # This file
```

## Deployment Options

### Option 1: Simple HTTP Server (Local Testing)

```bash
cd website
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Option 2: GitHub Pages

1. Create a new repository
2. Upload the `website/` folder contents
3. Enable GitHub Pages in repository settings
4. Access at: `https://username.github.io/repo-name/`

### Option 3: Static Hosting Services

Upload to any of these services:
- **Netlify**: Drag and drop the website folder
- **Vercel**: Connect GitHub repo or upload files
- **AWS S3**: Upload as static website
- **Azure Static Web Apps**: Deploy from GitHub
- **IBM Cloud Object Storage**: Host as static site

### Option 4: Internal Web Server

Copy files to your organization's web server:

```bash
# Example: Copy to Apache web root
sudo cp -r website/* /var/www/html/mq-lab/

# Example: Copy to Nginx
sudo cp -r website/* /usr/share/nginx/html/mq-lab/
```

## Customization

### Update Connection Details

Edit `index.html` to add your specific:
- Server IP addresses
- Usernames
- SSH key file names
- VPN requirements
- Support channel information

### Modify MQ Download URL

If using a different MQ version or hosting files internally, update the `wget` command in Step 3:

```html
<!-- Find this line in index.html -->
wget https://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqadv/mqadv_dev94_linux_s390x.tar.gz

<!-- Replace with your URL -->
wget https://your-internal-server.com/path/to/mq-installer.tar.gz
```

### Add Organization Branding

1. **Logo**: Add your logo to the header
2. **Colors**: Update CSS variables in `styles.css`:
   ```css
   :root {
       --primary-color: #your-color;
       --secondary-color: #your-color;
   }
   ```
3. **Footer**: Update footer links and contact information

### Pre-stage Installation Files

If MQ installation files are pre-staged on VMs, update Step 3.2:

```html
<!-- Replace download step with -->
<h3>3.2 Locate Pre-staged Installation Files</h3>
<p>The IBM MQ installation files are already on your VM:</p>
<div class="code-block">
    <pre><code>ls /opt/event/mq-install/</code></pre>
</div>
```

## Event Preparation Checklist

### Before the Event

- [ ] Customize connection details for your environment
- [ ] Update MQ download URL or pre-stage files
- [ ] Add organization branding
- [ ] Test the website on different devices
- [ ] Deploy to accessible URL
- [ ] Share URL with attendees
- [ ] Prepare support channel (Teams/Slack)

### During the Event

- [ ] Monitor support channel for questions
- [ ] Track common issues
- [ ] Be ready to provide alternative download links
- [ ] Have backup VMs ready if needed

### After the Event

- [ ] Collect feedback
- [ ] Update troubleshooting section based on issues
- [ ] Archive attendee progress data if needed

## Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast colors
- Readable font sizes
- Screen reader friendly

## Security Considerations

### What NOT to Include

❌ **Never include in the public website:**
- SSH private keys
- Passwords or passphrases
- Individual VM IP addresses
- Root credentials
- Internal network details
- Sensitive configuration

### What to Include

✅ **Safe to include:**
- Command patterns (with placeholders)
- General process flow
- Expected outputs
- Troubleshooting steps
- Public documentation links

### Secure Distribution

For sensitive connection details:
1. Use separate secure channel (email, encrypted file)
2. Send individually to each attendee
3. Include expiration date if applicable
4. Provide instructions for secure storage

## Support

### For Attendees

If you encounter issues during the lab:
1. Check the Troubleshooting section
2. Contact event support channel
3. Provide your username and error details

### For Facilitators

Common support scenarios:
- **SSH connection fails**: Verify key permissions and server access
- **Download slow**: Provide alternative mirror or pre-staged files
- **Installation fails**: Check sudo access and disk space
- **Queue manager won't start**: Verify mqm user and permissions

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox/grid
- **Vanilla JavaScript**: No dependencies
- **LocalStorage**: Progress persistence

### Performance
- **Page Size**: ~150KB total
- **Load Time**: <1 second on typical connection
- **No External Dependencies**: Works offline after initial load

### Analytics (Optional)

To track usage, add analytics to `index.html`:

```html
<!-- Add before </head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR-ID');
</script>
```

## License

This website is created for the LinuxONE IBM MQ hands-on lab event.

## Credits

- **IBM MQ**: IBM Corporation
- **LinuxONE**: IBM Corporation
- **Design**: IBM Design Language
- **Fonts**: IBM Plex (optional, falls back to system fonts)

## Version History

- **v1.0** (2026-06-22): Initial release
  - Complete 6-step tutorial
  - Interactive features
  - Responsive design
  - Troubleshooting guide

## Contact

For questions about this website or the lab:
- Event support channel: [Your Teams/Slack channel]
- Facilitator email: [Your email]

---

**Ready to deploy!** 🚀

Simply upload these files to any web server and share the URL with your attendees.