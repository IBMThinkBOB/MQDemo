// Copy code functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling;
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#24a148';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed';
        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    });
}

// Progress tracking
document.addEventListener('DOMContentLoaded', () => {
    // Load saved progress from localStorage
    loadProgress();
    
    // Add checkbox listeners
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveProgress);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Progress bar step navigation
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const stepNumber = index + 1;
            const targetSection = document.querySelector(`#step${stepNumber}`);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for progress bar
    const sections = document.querySelectorAll('.step-section');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const stepNumber = sectionId.replace('step', '');
                updateProgressBar(parseInt(stepNumber));
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    // Add download spec button
    const downloadBtn = document.createElement('a');
    downloadBtn.textContent = 'Download Agent Spec';
    downloadBtn.className = 'print-btn';
    downloadBtn.href = 'AGENT_TASK_SPEC.md';
    downloadBtn.download = 'AGENT_TASK_SPEC.md';
    downloadBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0f62fe;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transition: all 0.3s ease;
        text-decoration: none;
        display: inline-block;
    `;
    downloadBtn.addEventListener('mouseenter', () => {
        downloadBtn.style.background = '#0043ce';
        downloadBtn.style.transform = 'translateY(-2px)';
    });
    downloadBtn.addEventListener('mouseleave', () => {
        downloadBtn.style.background = '#0f62fe';
        downloadBtn.style.transform = 'translateY(0)';
    });
    document.body.appendChild(downloadBtn);
    
    // Add scroll-to-top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.textContent = '↑';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: #525252;
        color: white;
        border: none;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll-to-top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
});

// Update progress bar
function updateProgressBar(stepNumber) {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        const currentStep = index + 1;
        if (currentStep < stepNumber) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (currentStep === stepNumber) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });
}

// Save progress to localStorage
function saveProgress() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const progress = {};
    
    checkboxes.forEach((checkbox, index) => {
        progress[`checkbox_${index}`] = checkbox.checked;
    });
    
    localStorage.setItem('mqLabProgress', JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('mqLabProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
        
        checkboxes.forEach((checkbox, index) => {
            if (progress[`checkbox_${index}`]) {
                checkbox.checked = true;
            }
        });
    }
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        localStorage.removeItem('mqLabProgress');
        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        alert('Progress reset successfully!');
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to download spec
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const a = document.createElement('a');
        a.href = 'AGENT_TASK_SPEC.md';
        a.download = 'AGENT_TASK_SPEC.md';
        a.click();
    }
    
    // Ctrl/Cmd + Home to scroll to top
    if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// Add command palette (Ctrl/Cmd + K)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showCommandPalette();
    }
});

function showCommandPalette() {
    const sections = [
        { name: 'Overview', id: 'overview' },
        { name: 'What You Will Receive', id: 'receive' },
        { name: 'Prerequisites', id: 'prerequisites' },
        { name: 'Step 1: Connect to VM', id: 'step1' },
        { name: 'Step 2: Validate Environment', id: 'step2' },
        { name: 'Step 3: Install IBM MQ', id: 'step3' },
        { name: 'Step 4: Configure Queue Manager', id: 'step4' },
        { name: 'Step 5: Create Queue and Test', id: 'step5' },
        { name: 'Step 6: Validation', id: 'step6' },
        { name: 'Troubleshooting', id: 'troubleshooting' },
        { name: 'Quick Reference', id: 'reference' },
        { name: 'Next Steps', id: 'next-steps' }
    ];
    
    const palette = document.createElement('div');
    palette.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        padding: 20px;
    `;
    
    const title = document.createElement('h3');
    title.textContent = 'Jump to Section';
    title.style.marginBottom = '15px';
    palette.appendChild(title);
    
    sections.forEach(section => {
        const btn = document.createElement('button');
        btn.textContent = section.name;
        btn.style.cssText = `
            display: block;
            width: 100%;
            padding: 12px;
            margin: 5px 0;
            background: #f4f4f4;
            border: none;
            border-radius: 4px;
            text-align: left;
            cursor: pointer;
            font-size: 1rem;
        `;
        btn.addEventListener('click', () => {
            document.getElementById(section.id).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            document.body.removeChild(overlay);
        });
        btn.addEventListener('mouseenter', () => {
            btn.style.background = '#e0e0e0';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = '#f4f4f4';
        });
        palette.appendChild(btn);
    });
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    overlay.appendChild(palette);
    
    document.body.appendChild(overlay);
}

// Add help tooltip
const helpBtn = document.createElement('button');
helpBtn.textContent = '?';
helpBtn.title = 'Keyboard Shortcuts';
helpBtn.style.cssText = `
    position: fixed;
    bottom: 140px;
    right: 20px;
    background: #525252;
    color: white;
    border: none;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transition: all 0.3s ease;
`;
helpBtn.addEventListener('click', showHelp);
document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(helpBtn);
});

function showHelp() {
    const helpContent = `
        <h3>Keyboard Shortcuts</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;"><strong>Ctrl/Cmd + K</strong> - Jump to section</li>
            <li style="margin: 10px 0;"><strong>Ctrl/Cmd + D</strong> - Download Agent Spec</li>
            <li style="margin: 10px 0;"><strong>Ctrl/Cmd + Home</strong> - Scroll to top</li>
        </ul>
        <h3 style="margin-top: 20px;">Tips</h3>
        <ul style="list-style: none; padding: 0;">
            <li style="margin: 10px 0;">• Click progress bar steps to jump to sections</li>
            <li style="margin: 10px 0;">• Check boxes to track your progress</li>
            <li style="margin: 10px 0;">• Use copy buttons to copy commands</li>
            <li style="margin: 10px 0;">• Your progress is saved automatically</li>
        </ul>
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        width: 90%;
        max-width: 500px;
        padding: 30px;
    `;
    modal.innerHTML = helpContent;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 10px 20px;
        background: #0f62fe;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
    `;
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    modal.appendChild(closeBtn);
    
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
    `;
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    overlay.appendChild(modal);
    
    document.body.appendChild(overlay);
}

console.log('LinuxONE IBM MQ Lab - Interactive Guide Loaded');
console.log('Press Ctrl/Cmd + K to jump to any section');

