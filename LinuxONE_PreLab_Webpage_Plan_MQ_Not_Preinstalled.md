# LinuxONE Event Pre-Lab Webpage Plan (MQ Not Preinstalled)

## Purpose

This document is a planning blueprint for a **pre-lab setup webpage** and related communications for the LinuxONE event.

This version assumes:

- **IBM MQ is NOT preinstalled** on the attendee VMs.
- Each attendee receives:
  - a **dedicated cloned server / VM**
  - a **unique IP or hostname**
  - a **unique SSH key pair**
- The lab includes:
  - connecting to the VM
  - validating the environment
  - installing IBM MQ
  - verifying the installation
  - creating and starting a queue manager
  - defining a queue
  - putting and getting a message
  - later phases such as troubleshooting with Bob

This plan is intended to tell you **what information belongs on the webpage**, **what should not be on the webpage**, and **how to structure the content** for both attendees and the VM setup team.

---

# Executive Summary

Because MQ is **not preinstalled**, the pre-lab webpage now needs to do more than explain how to log in.

It must clearly answer:

1. **How attendees access their VM**
2. **How IBM MQ will be installed**
3. **Who performs the installation**
4. **What privileges are required for installation**
5. **What MQ permissions are required after installation**
6. **How attendees validate that the environment is ready before the lab starts**
7. **What the VM team must prepare on every cloned VM**
8. **What support path exists if installation or permissions fail**

If the page does not make these items explicit, the event is likely to stall during the installation phase.

---

# Key Assumptions

## Lab assumptions

- The event uses **LinuxONE VMs** provisioned per attendee.
- VMs are cloned from a common baseline image.
- IBM MQ is **installed during the lab or just before it**, not baked into the VM image.
- The happy path includes:
  - VM login
  - MQ installation / setup
  - queue manager creation
  - queue creation
  - message send / receive
  - validation

## Access assumptions

- Each attendee receives unique connection details.
- Each attendee uses SSH with a dedicated key pair.
- Sensitive connection details are distributed **outside** the shared webpage.

## Privilege assumptions

One of the following must be true and must be stated on the webpage:

### Model A — Attendee installs MQ directly
The attendee account has the required installation privileges (for example, sudo), and the post-install account has the MQ permissions needed for lab tasks.

### Model B — Facilitator / bootstrap path installs MQ
A script, operator, or guided Bob workflow performs the installation under approved privileges, and the attendee account is then ready for the queue manager / queue / messaging tasks.

> **Important:** This document does not force one model. It says the webpage must clearly declare which model is being used.

---

# Recommended Information Architecture

The pre-lab experience should not be a single wall of text.

## Recommended content split

Use **three coordinated artifacts**:

1. **Shared attendee-facing pre-lab webpage**
2. **Secure attendee delivery message** (for private connection details)
3. **Internal VM setup runbook** (for the provisioning team and facilitators)

## Why this split matters

The shared webpage should be reusable and safe.
It should explain the process and expectations.
It should **not** expose attendee-specific secrets.

The secure private message should contain:
- IP / hostname
- username
- SSH private key or retrieval method
- passphrase if one exists
- host fingerprint if required

The internal runbook should contain:
- image cloning steps
- MQ media staging steps
- privilege model
- facilitator fallback procedures
- reset/recovery paths

---

# What Must Be On the Shared Pre-Lab Webpage

This is the core of the plan.

## 1. Lab overview
This section explains:
- what the lab is
- what attendees will do
- how long it takes
- what they should expect

### Required content
- One-paragraph summary of the LinuxONE + MQ lab
- A concise list of learning outcomes
- The major checkpoints:
  - connect to VM
  - install MQ
  - verify MQ
  - create queue manager
  - create queue
  - send message
  - receive message
  - validate success

### Suggested wording

> In this hands-on LinuxONE lab, each participant connects to a dedicated VM, installs and configures IBM MQ, creates and starts a queue manager, defines a queue, sends and receives a test message, and validates a working MQ messaging flow. Later phases of the lab introduce guided troubleshooting.

---

## 2. Audience / who this page is for
The page should explicitly say who it is for.

### Recommended structure
- **Attendee section**
- **Facilitator section** (optional summary only)
- **Link to internal setup documentation** for the VM team

### Why include this
It prevents attendee confusion and avoids exposing too much infrastructure detail on the attendee page.

---

## 3. What attendees will receive
This section is mandatory because each attendee is getting an individual VM.

### Include on the page
State that each attendee will receive:
- a dedicated LinuxONE VM
- a unique IP or hostname
- a username
- an SSH key pair or secure retrieval instructions
- event timing for delivery of those details

### Do not include on the shared page
Do **not** include:
- private keys
- direct per-user IP list
- passphrases
- admin/root passwords
- any secrets

### Suggested wording

> Each participant receives a dedicated LinuxONE VM cloned from a common baseline image, along with a unique server address, SSH username, and SSH key pair. These individual connection details are delivered separately through a secure channel before the event.

---

## 4. What attendees need before the event
This section should be practical and short.

### Include
- Laptop capable of running SSH
- Terminal access
- Ability to store and use a provided SSH key file
- Stable internet connection
- VPN access if required
- Comfort with copy/paste shell commands

### If applicable, also include
- Browser access to event materials
- Chat / support channel account (Teams, Slack, etc.)

### Suggested “must do before event” checklist
- Verify the SSH client works locally
- Verify the key file is downloaded and saved
- Verify VPN is installed/configured if needed
- Read the first-login validation section

---

## 5. How to connect to the VM
This section should contain the **pattern**, not the attendee’s actual personalized secret.

### Include sample command pattern

```bash
chmod 600 <your-key-file>
ssh -i <your-key-file> <username>@<server-or-ip>
```

### Include notes on
- file permissions for the SSH key
- where to run the command
- what success looks like
- what to do if the first connection prompts for a host key verification

### Optional add-on
A small OS-specific note:
- macOS / Linux: use terminal and OpenSSH
- Windows: use PowerShell `ssh`, Windows Terminal, or another approved SSH client

---

## 6. First-login validation steps
This section is extremely valuable because it reduces Day 1 support overhead.

### Include these commands

```bash
hostname
uname -a
whoami
pwd
```

### If attendees are expected to install MQ directly
Also include:

```bash
sudo -v
```

### Why this matters
These commands confirm:
- the attendee reached the correct VM
- the account is correct
- the shell works normally
- the install privilege path is valid if `sudo` is required

---

## 7. Environment details
This section should explain the environment clearly enough that attendees know what they are working with.

### Include
- LinuxONE VM environment
- operating system name and version (as published by the event team)
- shell environment / terminal expectations
- whether the environment is ephemeral or persistent during the event
- whether outbound internet from the VM is required or not

### Also include MQ installation readiness facts
Because MQ is not preinstalled, this section must also say:
- whether MQ installation files are already staged on the VM
- whether installation will use a package directory, local media, or automated bootstrap script
- whether IBM credentials are required (recommended: no, for event simplicity)

### Strong recommendation
The provisioning team should **pre-stage the MQ installation packages or archive on every VM** even if MQ itself is not preinstalled.
This avoids a live dependency on downloads during the event.

---

## 8. IBM MQ installation model
This is now the **most important section** on the webpage.

It should explicitly answer all of the following:

### A. Is IBM MQ preinstalled?
For this plan, the answer is:

> No. IBM MQ is not preinstalled on the attendee VMs.

### B. How will IBM MQ be installed?
Choose one of these and state it clearly:

- Attendees install MQ directly using sudo
- Attendees run a provided bootstrap script
- Facilitators run the install step for attendees
- Bob guides and executes the install path under approved privileges

### C. Where do the install files come from?
State whether:
- MQ install media is already copied to the VM
- a local repository is configured
- or a local archive directory exists on the VM

### D. What MQ version is being used?
Publish the exact planned version.
This prevents drift across cloned systems.

### E. What is the expected install workflow?
At minimum, the page should explain this at a high level.
Examples:
- “Run the provided install script from `/opt/event/mq-setup/install-mq.sh`”
- “Use Bob to execute the published installation steps”
- “Facilitator will announce when to begin the install phase”

### Suggested wording

> IBM MQ is not preinstalled on the event VMs. During the setup phase, attendees will install IBM MQ using the provided event workflow. The event team will pre-stage the required IBM MQ installation files on each VM to avoid dependency on external downloads.

---

## 9. Privileges and permissions
This section is mandatory in the non-preinstalled model.

### It must answer two separate questions

#### Installation privileges
- Does the attendee account have sudo?
- If not, who performs the install?
- Is there an automation/bootstrap path that runs the install under elevated privileges?

#### Post-install MQ authority
- Can the attendee create and start a queue manager?
- Can the attendee define queues?
- Is the attendee user in the MQ administration group or otherwise granted MQ admin permissions?

### Recommended wording if attendees install MQ directly

> The attendee account has sudo access for the installation phase. After IBM MQ is installed, the attendee account has the MQ permissions needed to create and start a queue manager, define the lab queue, and complete the lab exercises.

### Recommended wording if facilitators / automation install MQ

> IBM MQ installation is performed through the approved setup workflow. After installation, the attendee account is ready for queue manager and queue administration tasks required by the lab.

---

## 10. Pre-lab validation checklist
This section should tell attendees exactly how to verify readiness before the event begins.

### Before installation

```bash
hostname
uname -a
whoami
sudo -v
ls <path-to-staged-mq-files>
```

### After installation

```bash
dspmqver
dspmq
id
groups
```

### What these checks verify
- host access works
- install privilege path works
- MQ files are present
- MQ installed successfully
- queue manager commands are available
- user/group authority looks correct

### Recommended attendee-facing framing

> Complete the validation checklist before the lab officially begins. If any command fails, contact the event support channel immediately.

---

## 11. Lab workflow summary
This should be a simple sequence people can mentally prepare for.

### Include
1. Connect to the VM via SSH
2. Validate VM access and environment
3. Install IBM MQ (or verify the setup workflow)
4. Verify the MQ installation
5. Create and start a queue manager
6. Define the lab queue
7. Put a message
8. Get the message
9. Confirm the system is working

### Why this helps
It reduces attendee anxiety and makes the lab feel approachable.

---

## 12. Troubleshooting and support
This section is even more important now that installation is part of the lab.

### Include common issues
- I cannot SSH to my VM
- My key is rejected / permission denied (publickey)
- `sudo -v` fails
- The MQ install files are missing
- The install script or install command fails
- `dspmqver` is not found after install
- I cannot create a queue manager
- I do not have the expected MQ permissions

### Include what to do
- check the support channel
- contact facilitators
- report the output of the failed command
- do not attempt ad hoc system changes unless instructed

### Include support location
Examples:
- event Teams channel
- Slack channel
- email alias
- in-room support table

---

# What Must Be In the Internal VM Setup Runbook

This section should **not** necessarily be on the public attendee page.
It is here because the webpage plan must reflect what the infrastructure team needs to know.

## 1. Base image details
The setup team runbook should document:
- base image name
- clone source
- Linux distribution/version
- LinuxONE architecture
- shell and package manager assumptions
- any event-specific users and groups

## 2. Per-attendee provisioning model
The runbook should specify:
- how each VM is cloned
- how each VM is named
- how each attendee is mapped to a VM
- how IPs/hostnames are assigned
- how SSH keys are generated and injected
- how the attendee-specific secure message is generated

## 3. MQ installation readiness
Because MQ is not preinstalled, the runbook must specify:
- the exact IBM MQ version used for the event
- where the MQ installation media or packages are stored
- how those files are copied or staged onto each VM
- how install dependencies are handled
- how install success is verified before handing the VM to an attendee

## 4. Privilege model
The runbook must specify exactly which of the following is true:
- attendee account receives sudo
- facilitator account performs install
- setup script performs install
- another approved privilege path exists

## 5. Post-install permission model
The runbook must specify:
- whether the attendee user has MQ admin authority
- group membership expectations
- whether the attendee can create/start queue managers
- whether the attendee can define queues
- whether any post-install user/group refresh is required

## 6. Validation steps for provisioning team
The VM team should validate every cloned server with a checklist such as:

```bash
hostname
whoami
sudo -v
ls <path-to-staged-mq-files>
```

If MQ is installed during provisioning validation rather than by the attendee, also verify:

```bash
dspmqver
dspmq
```

## 7. Recovery / reset plan
The internal runbook must say how to recover when:
- a VM is unreachable
- a key is wrong
- install files are missing
- MQ install fails
- permissions are incorrect
- facilitator must replace a VM quickly

---

# What Should NOT Be On the Shared Page

The following items should **not** be published on the attendee-facing webpage:

- private SSH keys
- per-attendee IP/username/master mapping lists
- root passwords
- sudo passwords
- passphrases
- internal package repository credentials
- any secret or internal-only Bob configuration details
- internal escalation-only operational procedures

The attendee page should contain the **process**, not the actual secrets.

---

# Recommended Page Layout

Below is a practical structure for the webpage.

## Suggested page sections

1. **Overview**
2. **Who This Is For**
3. **What You Will Receive**
4. **What You Need Before the Event**
5. **How to Connect to Your VM**
6. **First Login Validation**
7. **Environment Details**
8. **IBM MQ Installation Model**
9. **Privileges and Permissions**
10. **Pre-Lab Validation Checklist**
11. **Lab Workflow Summary**
12. **Troubleshooting and Support**
13. **Internal Setup Team Notes** *(internal-only or separate page)*

---

# Suggested Draft Copy Block for the Shared Webpage

Use the following as a starting point.

## Overview

Welcome to the LinuxONE IBM MQ hands-on lab.
Each participant will connect to a dedicated LinuxONE VM, complete the IBM MQ setup workflow, create and start a queue manager, define a queue, send and receive a message, and validate a working messaging flow.

## What You Will Receive

Each attendee will receive:
- a dedicated LinuxONE VM
- a unique server address
- a username
- an SSH key pair or secure retrieval instructions

These individual connection details will be sent separately through a secure channel before the event.

## What You Need Before the Event

Please ensure that you have:
- a laptop with terminal access
- an SSH client
- the ability to save and use a provided SSH key file
- internet access (and VPN access if instructed)
- access to the event support channel

## Connect to Your VM

Use the connection pattern below with the personalized details you receive:

```bash
chmod 600 <your-key-file>
ssh -i <your-key-file> <username>@<server-or-ip>
```

## First Login Validation

After signing in, run:

```bash
hostname
uname -a
whoami
pwd
sudo -v
```

If any of these commands fail unexpectedly, contact event support before continuing.

## IBM MQ Installation Model

IBM MQ is not preinstalled on the VM.
The event team will provide the approved IBM MQ installation workflow and the required installation files will already be staged on the VM.

## Pre-Lab Validation

Before the lab formally begins, confirm:

```bash
ls <path-to-staged-mq-files>
```

After IBM MQ installation, confirm:

```bash
dspmqver
dspmq
```

## Support

If you run into issues with SSH access, installation, or permissions, contact the event support channel immediately.

---

# Questions the Event Owner Must Answer Before Publishing the Page

Before this page goes live, the event owner must provide final answers for the placeholders below:

## Connection details process
- How exactly will attendees receive their server/IP/SSH key information?
- What secure channel will be used?
- When will it be delivered?

## Installation model
- Will attendees have sudo?
- Or will facilitators / automation install MQ?
- What is the exact MQ install command or script path?

## MQ version / files
- What MQ version will be used?
- Where are the MQ install files staged on the VM?
- What is the exact path attendees should validate?

## Permission model
- What permissions will the attendee account have after installation?
- Can the attendee create and start a queue manager without facilitator intervention?

## Support process
- What is the official support channel?
- Who monitors it?
- What is the fallback if a VM is broken?

---

# Final Recommendations

## Recommendation 1
Treat the shared page as a **process and readiness page**, not a secrets page.

## Recommendation 2
If MQ is not preinstalled, make the **installation model and required privileges** the most visible part of the page.

## Recommendation 3
Use a **separate secure communication** to deliver attendee-specific VM access details.

## Recommendation 4
Maintain a separate **internal provisioning runbook** for the VM team.

## Recommendation 5
Publish a short validation checklist that attendees can run before the lab begins so support issues are discovered early.

---

# One-Sentence Summary

If IBM MQ is not preinstalled, the pre-lab webpage must clearly explain **how attendees access their VM, how MQ installation will happen, who has the required privileges, how post-install MQ permissions are granted, and how both attendees and the VM team validate readiness before the lab starts**.
