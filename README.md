# IBM MQ Demo Project

A comprehensive hands-on demonstration environment for IBM MQ, including:
- **Local Development**: macOS (Apple Silicon) with Podman
- **Event Website**: LinuxONE hands-on lab for attendees

---

## 📋 Project Overview

This project implements a complete IBM MQ demo environment based on the specifications in [`HandsOnDemoDescription.md`](HandsOnDemoDescription.md:1). The demo teaches participants how to:

- Set up and configure IBM MQ messaging systems
- Create and manage queue managers and queues
- Send and receive messages
- Troubleshoot common issues using AI assistance (Bob)
- Build confidence working with enterprise messaging systems

**Target Platform:** macOS with Apple Silicon (M1/M2/M3/M4)  
**Container Runtime:** Podman  
**MQ Version:** IBM MQ Advanced for Developers

---

## 🚀 Quick Start

**New to this project? Start here:**

1. **Read:** [`QUICKSTART.md`](QUICKSTART.md:1) - Get up and running in 2-3 hours
2. **Follow:** Step-by-step setup instructions for Apple Silicon Macs
3. **Test:** Run the basic message flow demo
4. **Practice:** Try the troubleshooting scenarios

**Already set up?**

```bash
./start-mq-demo.sh          # Start the environment
podman exec -it qm1 bash    # Enter container
amqsput EVENT.Q1 QM1        # Send a message
amqsget EVENT.Q1 QM1        # Receive a message
```

---

## 📚 Documentation

### Core Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| [`IBM_MQ_HANDS_ON_TUTORIAL.md`](IBM_MQ_HANDS_ON_TUTORIAL.md:1) | **⭐ Complete step-by-step tutorial** | **Everyone - Start here!** |
| [`website/`](website/) | **🌐 LinuxONE Event Website** | **Event Attendees** |
| [`QUICKSTART.md`](QUICKSTART.md:1) | Fast setup and daily usage | Everyone |
| [`MQ_DEMO_IMPLEMENTATION_PLAN.md`](MQ_DEMO_IMPLEMENTATION_PLAN.md:1) | Detailed implementation guide | Implementers |
| [`DEMO_SCRIPTS_AND_SCENARIOS.md`](DEMO_SCRIPTS_AND_SCENARIOS.md:1) | Scripts and troubleshooting scenarios | Demo presenters |
| [`HandsOnDemoDescription.md`](HandsOnDemoDescription.md:1) | Demo concept and learning objectives | Stakeholders |
| [`IBM_MQ_Mac_Podman_Demo_Setup_Guide.md`](IBM_MQ_Mac_Podman_Demo_Setup_Guide.md:1) | Technical reference guide | Engineers |

### Quick Links

- **🎓 New to IBM MQ?** → [`IBM_MQ_HANDS_ON_TUTORIAL.md`](IBM_MQ_HANDS_ON_TUTORIAL.md:1) - **Start here!**
- **⚡ Quick setup?** → [`QUICKSTART.md`](QUICKSTART.md:1)
## 🌐 LinuxONE Event Website

A complete, self-contained website for LinuxONE IBM MQ hands-on lab events. Attendees can follow step-by-step instructions to install IBM MQ, configure a queue manager, and test messaging on their dedicated LinuxONE VMs.

### Website Features

- **📱 Responsive Design**: Works on desktop, tablet, and mobile
- **✅ Interactive Checklists**: Track progress through the lab
- **📋 Copy Buttons**: One-click copy for all commands
- **🎯 Progress Bar**: Visual tracking of current step
- **⌨️ Keyboard Shortcuts**: Quick navigation (Ctrl/Cmd + K)
- **💾 Auto-Save**: Progress saved to browser localStorage
- **🖨️ Print-Friendly**: Clean layout for printing

### Quick Deploy

```bash
# Test locally
cd website
python3 -m http.server 8000
# Open http://localhost:8000

# Or deploy to any static hosting:
# - GitHub Pages
# - Netlify
# - Vercel
# - AWS S3
# - Azure Static Web Apps
```

See [`website/README.md`](website/README.md) for complete deployment instructions and customization options.

---
- **📋 Need detailed steps?** → [`MQ_DEMO_IMPLEMENTATION_PLAN.md`](MQ_DEMO_IMPLEMENTATION_PLAN.md:1)
- **🎤 Running a demo?** → [`DEMO_SCRIPTS_AND_SCENARIOS.md`](DEMO_SCRIPTS_AND_SCENARIOS.md:1)
- **🔧 Troubleshooting?** → See troubleshooting sections in any guide

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         macOS (Apple Silicon)           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │     Podman Machine (Linux VM)     │ │
│  │                                   │ │
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Container: qm1            │ │ │
│  │  │                             │ │ │
│  │  │  ┌───────────────────────┐ │ │ │
│  │  │  │  Queue Manager: QM1   │ │ │ │
│  │  │  │                       │ │ │ │
│  │  │  │  Queue: EVENT.Q1      │ │ │ │
│  │  │  │  Queue: DEV.QUEUE.1   │ │ │ │
│  │  │  └───────────────────────┘ │ │ │
│  │  │                             │ │ │
│  │  │  Ports: 1414, 9443          │ │ │
│  │  └─────────────────────────────┘ │ │
│  │                                   │ │
│  │  Volume: qm1data (persistent)     │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Key Components:**
- **Podman Machine:** Linux VM that runs containers on macOS
- **Container qm1:** IBM MQ runtime environment
- **Queue Manager QM1:** Core MQ service managing queues
- **Queue EVENT.Q1:** Demo queue for message flow testing
- **Persistent Volume:** Preserves queue manager data across restarts

---

## 🎯 Demo Scenarios

The project includes 5 ready-to-use troubleshooting scenarios:

1. **Queue Manager Stopped** - Diagnose and restart a stopped queue manager
2. **Non-existent Queue** - Handle missing queue errors
3. **Queue Depth Full** - Manage queue capacity issues
4. **Permission Issues** - Troubleshoot access problems
5. **Container Not Running** - Recover from container failures

Each scenario includes:
- Setup instructions
- Expected error messages
- Bob-assisted diagnosis steps
- Resolution procedures

See [`DEMO_SCRIPTS_AND_SCENARIOS.md`](DEMO_SCRIPTS_AND_SCENARIOS.md:1) for complete details.

---

## 🛠️ Helper Scripts

The project includes automation scripts (copy from [`DEMO_SCRIPTS_AND_SCENARIOS.md`](DEMO_SCRIPTS_AND_SCENARIOS.md:1)):

| Script | Purpose |
|--------|---------|
| `start-mq-demo.sh` | Start the demo environment |
| `stop-mq-demo.sh` | Stop the demo environment |
| `verify-mq-demo.sh` | Verify all components are working |
| `cleanup-mq-demo.sh` | Clean up containers and volumes |
| `rebuild-mq-demo.sh` | Rebuild from scratch |

---

## 📊 Success Criteria

The demo environment is ready when:

✅ **Infrastructure:**
- Podman installed and running
- Podman machine operational
- IBM MQ image built for arm64

✅ **MQ Components:**
- Queue manager `QM1` running
- Queue `EVENT.Q1` created
- Message put/get working

✅ **Demo Readiness:**
- Web console accessible at `https://localhost:9443`
- Troubleshooting scenarios documented
- Helper scripts created

---

## 🔧 Common Commands

### Daily Operations
```bash
# Start environment
./start-mq-demo.sh

# Enter container
podman exec -it qm1 bash

# Check queue manager
dspmq

# Send message
amqsput EVENT.Q1 QM1

# Receive message
amqsget EVENT.Q1 QM1

# Stop environment
./stop-mq-demo.sh
```

### Troubleshooting
```bash
# View logs
podman logs qm1

# Check container status
podman ps -a

# Restart container
podman restart qm1

# Verify environment
./verify-mq-demo.sh
```

---

## 📖 Learning Path

### For New Users

1. **Understand the Concept** - Read [`HandsOnDemoDescription.md`](HandsOnDemoDescription.md:1)
2. **Set Up Environment** - Follow [`QUICKSTART.md`](QUICKSTART.md:1)
3. **Test Basic Flow** - Send and receive your first message
4. **Try Scenarios** - Practice troubleshooting with Bob
5. **Present Demo** - Use the demo flow script

### For Implementers

1. **Review Architecture** - Understand the technical setup
2. **Follow Implementation Plan** - Use [`MQ_DEMO_IMPLEMENTATION_PLAN.md`](MQ_DEMO_IMPLEMENTATION_PLAN.md:1)
3. **Build Environment** - Complete all 8 phases
4. **Validate Setup** - Run acceptance checklist
5. **Create Scripts** - Set up automation

### For Presenters

1. **Practice Demo Flow** - Run through scenarios multiple times
2. **Time Each Section** - Know your pacing
3. **Prepare Bob Examples** - Have AI assistance ready
4. **Test Failures** - Ensure scenarios work reliably
5. **Have Backups** - Prepare alternative scenarios

---

## 🎓 Demo Flow (20 Minutes)

**Part 1: Introduction (5 min)**
- Show environment and components
- Explain queue manager and queues
- Demonstrate basic concepts

**Part 2: Happy Path (5 min)**
- Create queue
- Send message
- Receive message
- Validate end-to-end flow

**Part 3: Introduce Failure (2 min)**
- Stop queue manager
- Attempt to send message
- Observe error

**Part 4: Troubleshoot with Bob (5 min)**
- Describe error to Bob
- Follow Bob's diagnostic steps
- Apply Bob's solution

**Part 5: Validate Fix (3 min)**
- Restart queue manager
- Retry message flow
- Confirm resolution

---

## 🔍 Troubleshooting

### Quick Fixes

**Container won't start:**
```bash
podman machine start
podman start qm1
```

**Queue manager not running:**
```bash
podman exec -it qm1 bash
strmqm QM1
```

**Queue doesn't exist:**
```bash
podman exec -it qm1 bash
echo "DEFINE QLOCAL('EVENT.Q1') REPLACE" | runmqsc QM1
```

**Complete reset:**
```bash
./cleanup-mq-demo.sh
./rebuild-mq-demo.sh
```

---

## 📦 Requirements

### System Requirements
- macOS with Apple Silicon (M1/M2/M3/M4)
- 10GB free disk space
- 4GB RAM minimum (8GB recommended)
- Internet connection for initial setup

### Software Requirements
- Podman (installed via Homebrew or official installer)
- Git (usually pre-installed with Xcode Command Line Tools)
- GNU Make (installed via Homebrew if needed)

### Time Requirements
- Initial setup: 2-3 hours
- Daily startup: 2-3 minutes
- Demo duration: 5-20 minutes

---

## 🤝 Contributing

This is a demo project. To improve it:

1. Test the setup on your Mac
2. Document any issues or improvements
3. Suggest additional troubleshooting scenarios
4. Share your demo experiences

---

## 📝 Notes

- **Architecture-specific:** This setup is for Apple Silicon Macs. Intel Macs use a different image (see [`IBM_MQ_Mac_Podman_Demo_Setup_Guide.md`](IBM_MQ_Mac_Podman_Demo_Setup_Guide.md:230-251))
- **Container-based:** MQ runs in a container, not natively on macOS
- **Development only:** This uses IBM MQ Advanced for Developers (not for production)
- **Persistent data:** Queue manager data survives container restarts via volume mount

---

## 🔗 Resources

### IBM Documentation
- [IBM MQ Documentation](https://www.ibm.com/docs/en/ibm-mq)
- [IBM MQ Container Repository](https://github.com/ibm-messaging/mq-container)
- [IBM Developer - MQ on macOS](https://developer.ibm.com/tutorials/mq-macos-dev/)

### Podman Documentation
- [Podman Official Site](https://podman.io/)
- [Podman Machine Documentation](https://docs.podman.io/en/latest/markdown/podman-machine.1.html)

### Project Documentation
- All documentation is in this repository
- Start with [`QUICKSTART.md`](QUICKSTART.md:1)
- Refer to [`MQ_DEMO_IMPLEMENTATION_PLAN.md`](MQ_DEMO_IMPLEMENTATION_PLAN.md:1) for details

---

## 📅 Project Status

**Current Phase:** Planning Complete ✅

**Next Steps:**
1. Begin implementation following [`QUICKSTART.md`](QUICKSTART.md:1)
2. Complete Phase 1-8 of [`MQ_DEMO_IMPLEMENTATION_PLAN.md`](MQ_DEMO_IMPLEMENTATION_PLAN.md:1)
3. Test all troubleshooting scenarios
4. Practice demo presentation
5. Prepare Bob integration examples

---

## 📞 Support

For issues during setup:
1. Check the troubleshooting sections in documentation
2. Review `podman logs qm1` for container issues
3. Run `./verify-mq-demo.sh` to check environment
4. Consult the detailed implementation plan

---

**Project Created:** 2026-06-22  
**Target Platform:** macOS Apple Silicon  
**Status:** Ready for Implementation  
**Estimated Setup Time:** 2-3 hours