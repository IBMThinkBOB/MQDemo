# IBM MQ Lab — Agent Task Specification

## Purpose

This document is the machine-readable task specification for an AI agent.
It defines the environment, the required actions, the exact expected outputs,
and the success criteria for the IBM MQ hands-on lab on LinuxONE.

The agent must read this document, execute each task in order, verify each
output against the acceptance criteria, and produce the 4 deliverable shell
scripts with the exact content specified below.

---

## PREREQUISITE — Establish SSH Connection to the LinuxONE VM

**The agent's local execute_command tool runs on the user's Mac, not on the LinuxONE VM.
All tasks in this spec must run on the LinuxONE VM. The agent must establish an SSH
connection via MCP before executing any task.**

### Step A — Confirm MCP SSH tool is available

Before doing anything else, check that an MCP SSH tool is available in the current session.
Look for tools named `ssh_execute`, `ssh_connect`, or similar from an MCP server such as
`ssh-linuxone`. If no SSH tool is available, follow Step B to configure one.

### Step B — Configure the MCP SSH server (if not already available)

Run these commands on the local Mac to install and register the SSH MCP server:

```bash
# Verify Node.js is available
node --version

# Test the MCP SSH server package
npx -y ssh2-mcp-tools --help
```

Then write the following to `~/.bob/settings/mcp.json` on the local Mac:

```json
{
  "mcpServers": {
    "ssh-linuxone": {
      "command": "npx",
      "args": ["-y", "ssh2-mcp-tools"],
      "env": {}
    }
  }
}
```

After writing the config, instruct the user:
> "Please restart Bob completely (Cmd+Q then reopen) and start a new chat.
> The ssh-linuxone MCP server will load on restart and I will have SSH tools
> available in the new session."

**Do not proceed with any tasks until the SSH MCP tool is confirmed available.**

### Step C — Connect to the LinuxONE VM

Once the MCP SSH tool is available, use it to open a connection to the VM.
The user must provide:

| Field | Value |
|-------|-------|
| Host | provided by attendee (e.g. `148.100.85.212`) |
| User | provided by attendee (e.g. `linux1`) |
| Key  | path to SSH private key on local Mac (e.g. `~/.ssh/linuxone_ed25519`) |

Ask the user for these values if not already provided, then connect using the SSH tool.

### Step D — Verify you are on the LinuxONE VM

Before running any lab tasks, confirm the SSH session is on the correct machine:

```bash
uname -a
```

**The output must contain `s390x`.** If it contains `Darwin` or `x86_64` you are still
on the local Mac — the SSH connection was not established. Do not proceed.

If `uname -a` contains `s390x`, proceed to TASK 1.

---

## Environment

```
OS:           Linux (s390x / IBM LinuxONE)
Shell:        bash
User:         <attendee account with sudo>
MQ Version:   IBM MQ Advanced for Developers 9.4
MQ Binaries:  /opt/mqm/bin
MQ Data:      /var/mqm
Queue Mgr:    QM1
Queue:        EVENT.Q1
```

---

## Deliverables

The agent must produce exactly these 4 files in the home directory:

| File | Permissions |
|------|-------------|
| `~/start-mq-demo.sh` | `-rwxr-xr-x` |
| `~/stop-mq-demo.sh` | `-rwxr-xr-x` |
| `~/cleanup-mq-demo.sh` | `-rwxr-xr-x` |
| `~/check-build-status.sh` | `-rwxr-xr-x` |

Final verification command the agent must run:

```bash
ls -lh ~/start-mq-demo.sh ~/stop-mq-demo.sh ~/cleanup-mq-demo.sh ~/check-build-status.sh
```

Expected output pattern (all 4 files must be present and executable):

```
-rwxr-xr-x ... start-mq-demo.sh
-rwxr-xr-x ... stop-mq-demo.sh
-rwxr-xr-x ... cleanup-mq-demo.sh
-rwxr-xr-x ... check-build-status.sh
```

---

## Task Sequence

Execute tasks in order. After each task, run the verification command.
If the verification fails, do not proceed — diagnose and fix before continuing.

---

### TASK 1 — Validate Environment

**Purpose:** Confirm the VM is the correct machine with the required access.

```bash
hostname
uname -a
whoami
sudo -v
ping -c 3 ibm.com
```

**Acceptance criteria:**
- `uname -a` output contains `s390x`
- `sudo -v` exits with code 0 (no error)
- `ping` shows 0% packet loss

**If any check fails:** Stop. Report the failing command and its output.

---

### TASK 2 — Install IBM MQ

**Purpose:** Download and install IBM MQ 9.4 for Linux s390x.

```bash
mkdir -p ~/mq-install
cd ~/mq-install
wget https://public.dhe.ibm.com/ibmdl/export/pub/software/websphere/messaging/mqadv/mqadv_dev94_linux_s390x.tar.gz
tar -xzf mqadv_dev94_linux_s390x.tar.gz
cd MQServer
sudo ./mqlicense.sh -accept
sudo rpm -ivh MQSeries*.rpm
echo 'export PATH=$PATH:/opt/mqm/bin' >> ~/.bashrc
source ~/.bashrc
```

**Verification command:**

```bash
dspmqver
```

**Expected output (agent must match all 3 fields):**

```
Name:        IBM MQ
Version:     9.4.0.0
InstPath:    /opt/mqm
```

**If verification fails:**
- If `dspmqver: command not found` → run `source ~/.bashrc` and retry
- If RPM install error → check `sudo -v` and `df -h ~` (needs 2 GB free)
- If license error → re-run `sudo ./mqlicense.sh -accept` before RPM install

---

### TASK 3 — Create MQ System User and Set Permissions

**Purpose:** Create the `mqm` user and group required by IBM MQ.

```bash
sudo groupadd mqm
sudo useradd -g mqm -d /var/mqm mqm
echo "mqm123" | sudo passwd --stdin mqm
sudo usermod -a -G mqm $USER
sudo chown -R mqm:mqm /var/mqm
sudo chmod -R 775 /var/mqm
```

**Verification command:**

```bash
id mqm && ls -la /var/mqm | head -5
```

**Expected output:**
- `id mqm` returns a line containing `gid=...mqm`
- `/var/mqm` is owned by `mqm mqm`

**Note:** If `useradd` fails with "already exists", the user was pre-created — skip that line and continue from `usermod`.

---

### TASK 4 — Create and Start Queue Manager QM1

**Purpose:** Create and start the queue manager that all scripts depend on.

```bash
sudo -u mqm crtmqm QM1
sudo -u mqm strmqm QM1
```

**Verification command:**

```bash
sudo -u mqm dspmq
```

**Expected output (must match exactly):**

```
QMNAME(QM1)                                               STATUS(Running)
```

**If verification fails:**
- If `STATUS(Ended normally)` → run `sudo -u mqm strmqm QM1`
- If QM1 not listed → run `sudo -u mqm crtmqm QM1` then `sudo -u mqm strmqm QM1`
- Check error log: `sudo tail -30 /var/mqm/qmgrs/QM1/errors/AMQERR01.LOG`

---

### TASK 5 — Create Queue EVENT.Q1 and Verify Message Flow

**Purpose:** Create the queue and confirm put/get/browse operations work.

```bash
sudo -u mqm bash -c "echo 'DEFINE QLOCAL(EVENT.Q1) REPLACE' | runmqsc QM1"
echo "Hello from LinuxONE!" | sudo -u mqm /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
sudo -u mqm /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1
```

**Verification command:**

```bash
sudo -u mqm bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1" | grep CURDEPTH
```

**Expected output:**

```
  CURDEPTH(0)
```

(CURDEPTH is 0 because amqsget consumed the message. If it shows 1, amqsget did not run successfully — rerun it.)

**Intermediate output checks the agent must confirm before proceeding:**

After `DEFINE QLOCAL`:
```
AMQ8006I: IBM MQ queue created.
```

After `amqsput`:
```
Sample AMQSPUT0 start
target queue is EVENT.Q1
Sample AMQSPUT0 end
```

After `amqsget`:
```
Sample AMQSGET0 start
message <Hello from LinuxONE!>
no more messages
Sample AMQSGET0 end
```

---

### TASK 6 — Write the 4 Deliverable Shell Scripts

**Purpose:** Write the exact content of each script to disk and make it executable.

The agent must write each file with exactly the content specified below.
No additions, no modifications, no paraphrasing.
After writing each file, run the test command and confirm the expected output.

---

#### FILE 1: ~/start-mq-demo.sh

**Write command:**

```bash
cat > ~/start-mq-demo.sh << 'SCRIPTEOF'
#!/bin/bash
set -e

echo "Starting IBM MQ Demo Environment..."

if sudo -u mqm dspmq | grep -q "STATUS(Running)"; then
    echo "Queue manager QM1 is already running"
else
    echo "Starting queue manager QM1..."
    sudo -u mqm strmqm QM1
fi

echo "Checking queue manager status..."
sudo -u mqm dspmq

echo ""
echo "Demo environment ready."
echo ""
echo "Send a message : echo 'your text' | sudo -u mqm /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1"
echo "Get a message  : sudo -u mqm /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1"
echo "Check depth    : sudo -u mqm bash -c \"echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1\""
SCRIPTEOF
chmod +x ~/start-mq-demo.sh
```

**Test command:**

```bash
~/start-mq-demo.sh
```

**Expected output (must contain all of these lines):**

```
Queue manager QM1 is already running
QMNAME(QM1)                                               STATUS(Running)
Demo environment ready.
```

---

#### FILE 2: ~/stop-mq-demo.sh

**Write command:**

```bash
cat > ~/stop-mq-demo.sh << 'SCRIPTEOF'
#!/bin/bash

echo "Stopping IBM MQ Demo Environment..."

if sudo -u mqm dspmq | grep -q "STATUS(Running)"; then
    echo "Stopping queue manager QM1..."
    sudo -u mqm endmqm QM1
    echo "Queue manager stopped."
else
    echo "Queue manager QM1 is not running."
fi

echo ""
echo "Demo environment stopped."
echo "To restart: ~/start-mq-demo.sh"
SCRIPTEOF
chmod +x ~/stop-mq-demo.sh
```

**Test command:**

```bash
~/stop-mq-demo.sh && ~/start-mq-demo.sh
```

**Expected output from stop:**

```
Stopping IBM MQ Demo Environment...
Stopping queue manager QM1...
Queue manager stopped.

Demo environment stopped.
To restart: ~/start-mq-demo.sh
```

**After test, restart MQ with `~/start-mq-demo.sh` before continuing.**

---

#### FILE 3: ~/cleanup-mq-demo.sh

**Write command:**

```bash
cat > ~/cleanup-mq-demo.sh << 'SCRIPTEOF'
#!/bin/bash

echo "Cleaning up IBM MQ Demo Environment..."
echo ""
echo "WARNING: This will stop and delete the QM1 queue manager."
echo "All queue definitions and messages will be permanently removed."
echo ""

read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

if sudo -u mqm dspmq 2>/dev/null | grep -q "STATUS(Running)"; then
    echo "Stopping queue manager QM1..."
    sudo -u mqm endmqm QM1
fi

echo "Deleting queue manager QM1..."
sudo -u mqm dltmqm QM1 || true

echo ""
echo "Cleanup complete. To rebuild from scratch, run: ~/start-mq-demo.sh"
echo "(It will recreate QM1 on next run)"
SCRIPTEOF
chmod +x ~/cleanup-mq-demo.sh
```

**Test command (agent must test with "n" to avoid destroying the environment):**

```bash
echo "n" | ~/cleanup-mq-demo.sh
```

**Expected output:**

```
Cleaning up IBM MQ Demo Environment...

WARNING: This will stop and delete the QM1 queue manager.
All queue definitions and messages will be permanently removed.

Cleanup cancelled.
```

---

#### FILE 4: ~/check-build-status.sh

**Write command:**

```bash
cat > ~/check-build-status.sh << 'SCRIPTEOF'
#!/bin/bash

echo "=== IBM MQ Status ==="
echo ""

echo "--- MQ Version ---"
dspmqver | grep -E "Name|Version|InstPath"

echo ""
echo "--- Queue Manager Status ---"
sudo -u mqm dspmq

echo ""
echo "--- Queue Depth: EVENT.Q1 ---"
sudo -u mqm bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1" \
    | grep -E "QUEUE|CURDEPTH" || echo "Queue not found. Has Step 5 been completed?"

echo ""
echo "--- Disk Usage ---"
df -h /var/mqm
SCRIPTEOF
chmod +x ~/check-build-status.sh
```

**Test command:**

```bash
~/check-build-status.sh
```

**Expected output (agent must confirm all 4 sections appear):**

```
=== IBM MQ Status ===

--- MQ Version ---
Name:        IBM MQ
Version:     9.4.0.0
InstPath:    /opt/mqm

--- Queue Manager Status ---
QMNAME(QM1)                                               STATUS(Running)

--- Queue Depth: EVENT.Q1 ---
  QUEUE(EVENT.Q1)
  CURDEPTH(0)

--- Disk Usage ---
Filesystem      Size  Used Avail Use% Mounted on
...              ...   ...   ...  ...  /var/mqm
```

---

### TASK 7 — Final Verification

**Purpose:** Confirm all 4 deliverables exist, are executable, and produce correct output.

```bash
ls -lh ~/start-mq-demo.sh ~/stop-mq-demo.sh ~/cleanup-mq-demo.sh ~/check-build-status.sh
```

**Expected output (all 4 files, all executable):**

```
-rwxr-xr-x 1 <user> <group> ... /home/<user>/start-mq-demo.sh
-rwxr-xr-x 1 <user> <group> ... /home/<user>/stop-mq-demo.sh
-rwxr-xr-x 1 <user> <group> ... /home/<user>/cleanup-mq-demo.sh
-rwxr-xr-x 1 <user> <group> ... /home/<user>/check-build-status.sh
```

```bash
~/check-build-status.sh
```

**Expected output confirms:**
- IBM MQ 9.4.0.0 installed
- QM1 STATUS(Running)
- EVENT.Q1 CURDEPTH(0)
- /var/mqm disk usage visible

**Lab is complete when all 4 files exist, are executable, and `check-build-status.sh` output matches the expected pattern above.**

Once lab completion is confirmed, output the following to the user exactly as written:

---

**Lab complete. Here is how to test your IBM MQ environment yourself:**

**Step 1 — Set up your PATH (once per session)**
```bash
export PATH=$PATH:/opt/mqm/bin
```
This is already saved in `~/.bashrc` for future sessions. You only need this until you log out.

**Step 2 — Check current status**
```bash
~/check-build-status.sh
```
Expected: MQ 9.4.0.0, QM1 running, EVENT.Q1 at depth 0, disk usage for /var/mqm.

**Step 3 — Send a message to the queue**
```bash
echo "Hello from LinuxONE!" | sudo -u mqm /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
```
Expected:
```
Sample AMQSPUT0 start
target queue is EVENT.Q1
Sample AMQSPUT0 end
```

**Step 4 — Check the queue depth (message is sitting there)**
```bash
sudo -u mqm bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1" | grep CURDEPTH
```
Expected: `CURDEPTH(1)` — your message is waiting.

**Step 5 — Read the message back**
```bash
sudo -u mqm /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1
```
Expected:
```
Sample AMQSGET0 start
message <Hello from LinuxONE!>
no more messages
Sample AMQSGET0 end
```
Note: `amqsget` waits ~15 seconds for more messages before exiting — that is normal.

**Step 6 — Stop and restart MQ**
```bash
~/stop-mq-demo.sh
~/start-mq-demo.sh
```

**Step 7 — (Optional / Destructive) Full cleanup**
```bash
~/cleanup-mq-demo.sh
```
This will prompt you — enter `n` to cancel, or `y` to delete QM1 entirely. If you run it with `y`, recreate QM1 with:
```bash
sudo -u mqm crtmqm QM1 && sudo -u mqm strmqm QM1
```
Then redefine the queue before the scripts will work again.

**Quick Reference**

| What | Command |
|------|---------|
| Full status | `~/check-build-status.sh` |
| Start MQ | `~/start-mq-demo.sh` |
| Stop MQ | `~/stop-mq-demo.sh` |
| Put a message | `echo "text" \| sudo -u mqm /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1` |
| Get a message | `sudo -u mqm /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1` |
| Check queue depth | `sudo -u mqm bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' \| runmqsc QM1"` |
| Cleanup (destructive) | `~/cleanup-mq-demo.sh` |

---

## Error Recovery Reference

| Symptom | Diagnosis command | Fix |
|---------|-------------------|-----|
| `dspmqver: not found` | `echo $PATH` | `source ~/.bashrc` |
| `STATUS(Ended normally)` | `sudo -u mqm dspmq` | `sudo -u mqm strmqm QM1` |
| `AMQ8118E: queue manager exists` | `sudo -u mqm dspmq` | Skip `crtmqm`, go straight to `strmqm` |
| `AMQ7017E: queue already exists` | — | Normal — `REPLACE` flag handles this |
| `Permission denied` on script | `ls -l ~/script.sh` | `chmod +x ~/script.sh` |
| RPM install fails | `df -h ~` | Free up disk space, need 2 GB minimum |
| `sudo -v` denied | `groups` | Contact facilitator — account lacks sudo |

---

## Constraints

- Queue manager name must be exactly `QM1` — scripts hardcode this value
- Queue name must be exactly `EVENT.Q1` — scripts hardcode this value
- Scripts must be written to `~/` (home directory of the attendee account)
- Do not modify script content — exact byte-for-byte match is required for reproducibility
- MQ version 9.4 — do not substitute a different version without updating the download URL
