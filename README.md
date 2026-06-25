# IBM MQ Demo Project

A hands-on lab environment for IBM MQ running on LinuxONE, guided by an AI agent (Bob).

---

## Project Overview

This project delivers a complete IBM MQ lab experience on IBM LinuxONE. Attendees connect to a dedicated VM, download a machine-readable task specification, and give it to Bob. Bob installs IBM MQ, configures the queue manager, and produces 4 management shell scripts as the lab deliverable.

**Target Platform:** IBM LinuxONE (s390x)
**OS:** Linux (native installation, no containers)
**MQ Version:** IBM MQ Advanced for Developers 9.4
**Lab Duration:** 20-30 minutes

---

## How the Lab Works

1. Attendee connects to a dedicated LinuxONE VM via SSH
2. Attendee downloads [`AGENT_TASK_SPEC.md`](AGENT_TASK_SPEC.md) from the lab website
3. Attendee gives the spec to Bob
4. Bob executes all tasks autonomously: installs MQ, configures the queue manager, creates the queue, tests message flow, and writes the 4 scripts
5. Attendee runs two verification commands to confirm completion

---

## Deliverables

Bob produces these 4 shell scripts in the attendee's home directory:

| Script | Purpose |
|--------|---------|
| `start-mq-demo.sh` | Start queue manager QM1 and confirm it is running |
| `stop-mq-demo.sh` | Gracefully stop queue manager QM1 |
| `cleanup-mq-demo.sh` | Delete the queue manager and all data (with confirmation prompt) |
| `check-build-status.sh` | Show MQ version, queue manager status, queue depth, and disk usage |

---

## Architecture

```
Attendee Laptop
  └── SSH connection
        └── LinuxONE VM (s390x)
              └── Linux OS
                    └── IBM MQ 9.4 (native install, /opt/mqm)
                          └── Queue Manager: QM1
                                └── Queue: EVENT.Q1
```

Key components:

- **LinuxONE VM** — dedicated per attendee, cloned from a common baseline image
- **IBM MQ** — installed natively on Linux during the lab (not containerised)
- **Queue Manager QM1** — the core MQ service that owns queues and routes messages
- **Queue EVENT.Q1** — local queue used for message flow testing
- **MQ data directory** — `/var/mqm`, owned by the `mqm` system user

---

## Repository Structure

| File / Directory | Purpose |
|------------------|---------|
| [`AGENT_TASK_SPEC.md`](AGENT_TASK_SPEC.md) | Machine-readable task specification given to Bob |
| [`website/`](website/) | Lab website served to attendees |
| [`website/index.html`](website/index.html) | Main attendee-facing lab guide |
| [`HandsOnDemoDescription.md`](HandsOnDemoDescription.md) | Original demo concept and learning objectives |
| [`IBM_MQ_HANDS_ON_TUTORIAL.md`](IBM_MQ_HANDS_ON_TUTORIAL.md) | Reference tutorial (human-readable, macOS/Podman version) |
| [`start-mq-demo.sh`](start-mq-demo.sh) | Reference copy of the start script |
| [`stop-mq-demo.sh`](stop-mq-demo.sh) | Reference copy of the stop script |
| [`cleanup-mq-demo.sh`](cleanup-mq-demo.sh) | Reference copy of the cleanup script |
| [`check-build-status.sh`](check-build-status.sh) | Reference copy of the status script |

---

## Agent Task Specification

[`AGENT_TASK_SPEC.md`](AGENT_TASK_SPEC.md) is the core document that drives the lab. It is structured for machine execution, not human reading. It contains:

- Environment constants (OS, MQ version, queue manager name, queue name, paths)
- 7 ordered tasks, each with exact commands and acceptance criteria
- Exact expected output strings the agent must match before advancing
- Per-task error recovery instructions
- Exact script content Bob must write verbatim to disk
- Per-script test commands and expected output
- A final verification task confirming all 4 deliverables exist and are executable

---

## Lab Website

The attendee-facing website lives in [`website/`](website/). It guides attendees through 5 steps:

1. Connect to your LinuxONE VM (~3 min)
2. Validate your environment (~2 min)
3. Download the Agent Task Specification (~1 min)
4. Give the spec to Bob and let it run (~20 min)
5. Verify Bob's output (~2 min)

The website includes a "Download Agent Spec" button (bottom-right) that downloads [`AGENT_TASK_SPEC.md`](AGENT_TASK_SPEC.md) directly to the attendee's laptop.

### Run the Website Locally

```bash
cd website
python3 -m http.server 8000
# Open http://localhost:8000
```

---

## MQ Concepts Demonstrated

| Concept | Description |
|---------|-------------|
| Queue Manager | Central MQ service that owns queues and routes messages |
| Local Queue | Named storage for messages (EVENT.Q1) |
| PUT | Placing a message on a queue (amqsput) |
| GET | Retrieving and removing a message from a queue (amqsget) |
| BROWSE | Reading a message without removing it (amqsbcg) |
| FIFO | Messages are delivered in the order they were sent |
| Persistence | Messages are written to disk and survive restarts |

---

## Common Commands (Reference)

```bash
# Check queue manager status
sudo -u mqm dspmq

# Start queue manager
sudo -u mqm strmqm QM1

# Stop queue manager
sudo -u mqm endmqm QM1

# Create a queue
sudo -u mqm bash -c "echo 'DEFINE QLOCAL(EVENT.Q1) REPLACE' | runmqsc QM1"

# Send a message
echo "Hello" | sudo -u mqm /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1

# Receive a message
sudo -u mqm /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1

# Check queue depth
sudo -u mqm bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"

# Check MQ version
dspmqver
```

---

## Success Criteria

The lab is complete when:

- IBM MQ 9.4 is installed and `dspmqver` shows the correct version
- Queue manager QM1 shows `STATUS(Running)`
- Queue EVENT.Q1 exists and message send/receive works
- All 4 scripts exist in the home directory with `-rwxr-xr-x` permissions
- `check-build-status.sh` output matches the expected pattern in the spec

---

## Resources

- [IBM MQ Documentation](https://www.ibm.com/docs/en/ibm-mq)
- [IBM MQ Developer Hub](https://developer.ibm.com/components/ibm-mq/)
- [LinuxONE](https://www.ibm.com/linuxone)

---

**Target Platform:** IBM LinuxONE (s390x)
**Lab Duration:** 20-30 minutes
**Agent:** Bob
