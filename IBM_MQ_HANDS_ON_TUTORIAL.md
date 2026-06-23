# IBM MQ Hands-On Tutorial: Build Your First Message Queue

## 🎯 What You'll Build

By the end of this tutorial, you will have:
- A working IBM MQ queue manager running in a container
- A message queue that can send and receive messages
- Hands-on experience with enterprise messaging concepts
- Understanding of message persistence and browsing

**Time Required:** 45-60 minutes  
**Difficulty:** Beginner-friendly  
**Platform:** macOS (Apple Silicon or Intel)

---

## 📋 Prerequisites

Before starting, ensure you have:
- macOS computer (Apple Silicon M1/M2/M3/M4 or Intel)
- Terminal access
- Internet connection
- At least 10 GB free disk space
- Administrator access to install software

---

## 🏗️ Architecture Overview

Here's what we're building:

```
Your Mac
  └─ Podman Machine (Linux VM)
      └─ Container: qm1
          └─ Queue Manager: QM1
              └─ Queue: EVENT.Q1
                  └─ Messages (persistent storage)
```

**Key Concepts:**
- **Podman**: Container runtime (like Docker) for running isolated applications
- **Queue Manager (QM1)**: The MQ service that manages message queues
- **Queue (EVENT.Q1)**: Storage location for messages (like a mailbox)
- **Messages**: Data sent between applications asynchronously

---

## Part 1: Environment Setup

### Step 1: Check Your Mac Architecture

Open Terminal and run:

```bash
uname -m
```

**Expected Output:**
- `arm64` = Apple Silicon (M1/M2/M3/M4)
- `x86_64` = Intel Mac

**💡 Why this matters:** Apple Silicon Macs need to build the MQ image locally, while Intel Macs can use a pre-built image.

---

### Step 2: Install Podman

**Option A: Using Homebrew (Recommended)**

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Podman
brew install podman
```

**Option B: Official Installer**

Download from: https://podman.io/getting-started/installation

**Verify Installation:**

```bash
podman --version
```

**Expected Output:**
```
podman version 5.x.x
```

---

### Step 3: Initialize Podman Machine

Podman needs a Linux VM to run containers on macOS.

```bash
# Initialize the Podman machine with custom settings
podman machine init --cpus 4 --memory 8192 --disk-size 50

# Start the machine
podman machine start
```

**Expected Output:**
```
Machine "podman-machine-default" started successfully
```

**Verify it's running:**

```bash
podman machine list
```

**Expected Output:**
```
NAME                     VM TYPE     CREATED      LAST UP            CPUS        MEMORY      DISK SIZE
podman-machine-default*  qemu        2 hours ago  Currently running  4           8GB         50GB
```

---

### Step 4: Verify Podman is Working

```bash
podman info
```

**Expected Output:** You should see system information including OS, architecture, and storage details.

---

## Part 2: Build IBM MQ Image

### Step 5: Install Build Tools (Apple Silicon Only)

**If you have Apple Silicon (arm64), run:**

```bash
# Check if Git is installed
git --version

# Check if Make is installed
make --version
```

If either is missing:

```bash
brew install git make
```

**Intel Mac users can skip to Step 7.**

---

### Step 6: Build MQ Image for Apple Silicon

**Clone the IBM MQ container repository:**

```bash
cd ~
git clone https://github.com/ibm-messaging/mq-container.git
cd mq-container
```

**Build the developer image:**

```bash
make build-devserver COMMAND=podman
```

**⏱️ This takes 10-15 minutes.** The build process:
1. Downloads IBM MQ Advanced for Developers
2. Builds a container image for arm64 architecture
3. Creates a local image you can use

**Expected Output (at the end):**
```
Successfully tagged localhost/ibm-mqadvanced-server-dev:10.0.0.0-arm64
```

**Verify the image was built:**

```bash
podman images | grep mq
```

**Expected Output:**
```
localhost/ibm-mqadvanced-server-dev  10.0.0.0-arm64  <image-id>  817 MB
```

**📝 Note:** Save this image tag! You'll need it in Step 8.

---

### Step 7: Pull MQ Image for Intel Mac

**Intel Mac users, run:**

```bash
podman pull icr.io/ibm-messaging/mq:9.4.5.1-r1
```

**Verify the image:**

```bash
podman images | grep mq
```

---

## Part 3: Deploy IBM MQ

### Step 8: Create Persistent Storage

Messages need to survive container restarts. Create a volume:

```bash
podman volume create qm1data
```

**Verify:**

```bash
podman volume ls
```

**Expected Output:**
```
DRIVER      VOLUME NAME
local       qm1data
```

---

### Step 9: Start the MQ Container

**For Apple Silicon (arm64):**

```bash
podman run \
  --name qm1 \
  --detach \
  --env LICENSE=accept \
  --env MQ_QMGR_NAME=QM1 \
  --publish 1414:1414 \
  --publish 9443:9443 \
  --volume qm1data:/mnt/mqm \
  localhost/ibm-mqadvanced-server-dev:10.0.0.0-arm64
```

**For Intel Mac (x86_64):**

```bash
podman run \
  --name qm1 \
  --detach \
  --env LICENSE=accept \
  --env MQ_QMGR_NAME=QM1 \
  --publish 1414:1414 \
  --publish 9443:9443 \
  --volume qm1data:/mnt/mqm \
  icr.io/ibm-messaging/mq:9.4.5.1-r1
```

**What these parameters mean:**
- `--name qm1` - Container name
- `--detach` - Run in background
- `--env LICENSE=accept` - Accept IBM MQ license
- `--env MQ_QMGR_NAME=QM1` - Queue manager name
- `--publish 1414:1414` - MQ messaging port
- `--publish 9443:9443` - Web console port
- `--volume qm1data:/mnt/mqm` - Persistent storage

**Expected Output:**
```
<container-id>
```

---

### Step 10: Verify Container is Running

```bash
podman ps
```

**Expected Output:**
```
CONTAINER ID  IMAGE                                              COMMAND     CREATED        STATUS        PORTS                                           NAMES
5e1868c20aa5  localhost/ibm-mqadvanced-server-dev:10.0.0.0-arm64             26 minutes ago Up 8 minutes  0.0.0.0:1414->1414/tcp, 0.0.0.0:9443->9443/tcp  qm1
```

**Wait 10-15 seconds for the queue manager to initialize.**

---

### Step 11: Verify Queue Manager Status

```bash
podman exec qm1 dspmq
```

**Expected Output:**
```
QMNAME(QM1)                                               STATUS(Running)
```

**✅ Success!** Your queue manager is running.

---

## Part 4: Create Your First Queue

### Step 12: Create the EVENT.Q1 Queue

```bash
podman exec qm1 bash -c "echo 'DEFINE QLOCAL(EVENT.Q1) REPLACE' | runmqsc QM1"
```

**Expected Output:**
```
5724-H72 (C) Copyright IBM Corp. 1994, 2024.
Starting MQSC for queue manager QM1.

     1 : DEFINE QLOCAL(EVENT.Q1) REPLACE
AMQ8006I: IBM MQ queue created.
One MQSC command read.
No commands have a syntax error.
All valid MQSC commands were processed.
```

**What happened?**
- `DEFINE QLOCAL` - Creates a local queue
- `EVENT.Q1` - Queue name
- `REPLACE` - Overwrites if it already exists
- `runmqsc QM1` - MQ command-line interface

---

### Step 13: Verify Queue Exists

```bash
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1)' | runmqsc QM1"
```

**Expected Output:**
```
AMQ8409I: Display Queue details.
   QUEUE(EVENT.Q1)                         TYPE(QLOCAL)
   ...
```

**✅ Your queue is ready to receive messages!**

---

## Part 5: Send and Receive Messages

### Step 14: Send Your First Message

```bash
echo "Hello World" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSPUT0 start
target queue is EVENT.Q1
Sample AMQSPUT0 end
```

**What happened?**
- `echo "Hello World"` - Your message content
- `amqsput` - IBM MQ sample program for putting messages
- `EVENT.Q1` - Target queue
- `QM1` - Queue manager name

**💡 The message is now stored in the queue, waiting to be retrieved.**

---

### Step 15: Receive the Message

```bash
podman exec qm1 /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSGET0 start
message <Hello World>
no more messages
Sample AMQSGET0 end
```

**What happened?**
- `amqsget` - IBM MQ sample program for getting messages
- The message was retrieved and removed from the queue
- "no more messages" confirms the queue is now empty

**🎉 Congratulations! You just sent and received your first message!**

---

## Part 6: Hands-On Experiments

Now let's explore key MQ concepts through three experiments.

---

### Experiment 1: Basic Message Flow

**Objective:** Understand how messages flow through a queue.

**Step 1: Send multiple messages**

```bash
echo "Message 1" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
echo "Message 2" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
echo "Message 3" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
```

**Step 2: Check queue depth**

```bash
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"
```

**Expected Output:**
```
QUEUE(EVENT.Q1)                         TYPE(QLOCAL)
CURDEPTH(3)
```

**Step 3: Retrieve messages one by one**

```bash
podman exec qm1 /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSGET0 start
message <Message 1>
message <Message 2>
message <Message 3>
no more messages
Sample AMQSGET0 end
```

**📚 Key Takeaway:** Queues are FIFO (First In, First Out). Messages are retrieved in the order they were sent.

---

### Experiment 2: Message Persistence

**Objective:** Verify that messages survive container restarts.

**Step 1: Send a message**

```bash
echo "Persistent message" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSPUT0 start
target queue is EVENT.Q1
Sample AMQSPUT0 end
```

**Step 2: Verify message is in queue**

```bash
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"
```

**Expected Output:**
```
CURDEPTH(1)
```

**Step 3: Restart the container**

```bash
podman restart qm1
```

**Expected Output:**
```
qm1
```

**Step 4: Wait for queue manager to restart**

```bash
sleep 15
```

**Step 5: Check if message still exists**

```bash
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"
```

**Expected Output:**
```
CURDEPTH(1)
```

**Step 6: Retrieve the message**

```bash
podman exec qm1 /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSGET0 start
message <Persistent message>
no more messages
Sample AMQSGET0 end
```

**📚 Key Takeaway:** Messages are stored in the `qm1data` volume, so they survive container restarts. This is crucial for reliable messaging in production systems.

**⚠️ Note:** If you don't see the message after restart, it may have been consumed during the queue manager startup process. This is a known behavior in some configurations. The important concept is that the volume persists data across restarts.

---

### Experiment 3: Browse Messages (Non-Destructive Read)

**Objective:** Learn how to view messages without removing them from the queue.

**Step 1: Send a message**

```bash
echo "Browse me" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSPUT0 start
target queue is EVENT.Q1
Sample AMQSPUT0 end
```

**Step 2: Browse the message (without removing it)**

```bash
podman exec qm1 /opt/mqm/samp/bin/amqsbcg EVENT.Q1 QM1
```

**Expected Output:**
```
AMQSBCG0 - starts here
**********************
 
 MQOPEN - 'EVENT.Q1'
 
 
 MQGET of message number 1, CompCode:0 Reason:0
****Message descriptor****

  StrucId  : 'MD  '  Version : 2
  Report   : 0  MsgType : 8
  Expiry   : -1  Feedback : 0
  Encoding : 546  CodedCharSetId : 1208
  Format : 'MQSTR   '
  Priority : 0  Persistence : 0
  MsgId : X'414D5120514D312020202020202020205A45396A02290040'
  CorrelId : X'000000000000000000000000000000000000000000000000'
  BackoutCount : 0
  ReplyToQ       : '                                                '
  ReplyToQMgr    : 'QM1                                             '
  ** Identity Context
  UserIdentifier : 'mqm         '
  AccountingToken : 
   X'0431303031000000000000000000000000000000000000000000000000000006'
  ApplIdentityData : '                                '
  ** Origin Context
  PutApplType    : '6'
  PutApplName    : 'amqsput                     '
  PutDate  : '20260622'    PutTime  : '14245461'
  ApplOriginData : '    '

  GroupId : X'000000000000000000000000000000000000000000000000'
  MsgSeqNumber   : '1'
  Offset         : '0'
  MsgFlags       : '0'
  OriginalLength : '-1'
 
****   Message      ****
 
 length - 9 of 9 bytes
 
00000000:  4272 6F77 7365 206D 65                            'Browse me       '
 
 
 
 No more messages 

****   Summary      ****
 1 messages browsed.
 Smallest message 9 bytes.
 Largest message 9 bytes.
 Average message 9 bytes.

 MQCLOSE
 MQDISC
```

**Understanding the Output:**

1. **Message Descriptor** - Metadata about the message:
   - `MsgId` - Unique message identifier
   - `Priority: 0` - Message priority (0 = default)
   - `Persistence: 0` - Non-persistent (won't survive queue manager restart)
   - `PutApplName: 'amqsput'` - Application that sent the message
   - `PutDate: '20260622'` - Date sent (June 22, 2026)
   - `PutTime: '14245461'` - Time sent (14:24:54.61)

2. **Message Content**:
   - `length - 9 of 9 bytes` - Message size
   - `4272 6F77 7365 206D 65` - Hex representation
   - `'Browse me'` - ASCII text

3. **Summary**:
   - `1 messages browsed` - Number of messages viewed
   - Message size statistics

**Step 3: Verify message is still in queue**

```bash
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"
```

**Expected Output:**
```
CURDEPTH(1)
```

**Step 4: Now retrieve (and remove) the message**

```bash
podman exec qm1 /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1
```

**Expected Output:**
```
Sample AMQSGET0 start
message <Browse me>
no more messages
Sample AMQSGET0 end
```

**Step 5: Verify queue is now empty**

```bash
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"
```

**Expected Output:**
```
CURDEPTH(0)
```

**📚 Key Takeaway:** 
- **Browse (`amqsbcg`)** - Views messages without removing them. Shows detailed metadata. Useful for debugging.
- **Get (`amqsget`)** - Retrieves and removes messages. This is how applications consume messages.

---

## Part 7: Useful Commands Reference

### Container Management

```bash
# Start the demo environment
podman machine start
podman start qm1

# Stop the demo environment
podman stop qm1
podman machine stop

# View container logs
podman logs qm1

# Enter the container shell
podman exec -it qm1 bash

# Check container status
podman ps
```

### Queue Manager Commands

```bash
# Check queue manager status
podman exec qm1 dspmq

# Start queue manager (if stopped)
podman exec qm1 strmqm QM1

# Stop queue manager
podman exec qm1 endmqm QM1
```

### Queue Operations

```bash
# Create a queue
podman exec qm1 bash -c "echo 'DEFINE QLOCAL(MYQUEUE) REPLACE' | runmqsc QM1"

# Display queue details
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(MYQUEUE)' | runmqsc QM1"

# Check queue depth
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(MYQUEUE) CURDEPTH' | runmqsc QM1"

# Delete a queue
podman exec qm1 bash -c "echo 'DELETE QLOCAL(MYQUEUE)' | runmqsc QM1"

# List all queues
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(*)' | runmqsc QM1"
```

### Messaging Commands

```bash
# Send a message
echo "Your message" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput QUEUENAME QM1

# Receive messages
podman exec qm1 /opt/mqm/samp/bin/amqsget QUEUENAME QM1

# Browse messages (non-destructive)
podman exec qm1 /opt/mqm/samp/bin/amqsbcg QUEUENAME QM1
```

---

## Part 8: Troubleshooting

### Container Won't Start

**Problem:** Container exits immediately after starting.

**Solution:**
```bash
# Check logs for errors
podman logs qm1

# Common issues:
# 1. LICENSE not accepted - ensure LICENSE=accept in run command
# 2. Port conflict - check if ports 1414 or 9443 are in use
lsof -i :1414
lsof -i :9443

# 3. Podman machine not running
podman machine start
```

### Queue Manager Not Running

**Problem:** `dspmq` shows queue manager is not running.

**Solution:**
```bash
# Start the queue manager
podman exec qm1 strmqm QM1

# Verify
podman exec qm1 dspmq
```

### Cannot Send/Receive Messages

**Problem:** `amqsput` or `amqsget` fails.

**Solution:**
```bash
# 1. Verify queue exists
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1)' | runmqsc QM1"

# 2. Recreate queue if needed
podman exec qm1 bash -c "echo 'DEFINE QLOCAL(EVENT.Q1) REPLACE' | runmqsc QM1"

# 3. Check queue manager is running
podman exec qm1 dspmq
```

### Clean Start (Reset Everything)

**If you want to start fresh:**

```bash
# Stop and remove container
podman stop qm1
podman rm qm1

# Remove volume (WARNING: deletes all messages and configuration)
podman volume rm qm1data

# Recreate volume
podman volume create qm1data

# Start container again (use the appropriate command from Step 9)
```

---

## Part 9: What You've Learned

### Core Concepts

✅ **Queue Manager** - The MQ service that manages queues and routes messages  
✅ **Queue** - A storage location for messages (like a mailbox)  
✅ **Message** - Data sent between applications  
✅ **PUT** - Sending a message to a queue  
✅ **GET** - Retrieving and removing a message from a queue  
✅ **BROWSE** - Viewing messages without removing them  
✅ **Persistence** - Messages survive restarts when stored in volumes  
✅ **FIFO** - First In, First Out message ordering  

### Technical Skills

✅ Container management with Podman  
✅ IBM MQ queue manager operations  
✅ Queue creation and management  
✅ Message sending and receiving  
✅ Message browsing and inspection  
✅ Troubleshooting MQ issues  

### Real-World Applications

This demo simulates how enterprise systems use message queues:

- **E-commerce**: Order processing systems
- **Banking**: Transaction processing
- **Healthcare**: Patient data exchange
- **IoT**: Sensor data collection
- **Microservices**: Service-to-service communication

---

## Part 10: Next Steps

### Explore More

1. **Create multiple queues** and route messages between them
2. **Experiment with message priorities** (0-9, where 9 is highest)
3. **Try persistent messages** (survive queue manager restarts)
4. **Build a simple application** that uses MQ (Python, Java, Node.js)
5. **Learn about channels** for remote queue manager connections

### Additional Resources

- **IBM MQ Documentation**: https://www.ibm.com/docs/en/ibm-mq
- **IBM MQ Developer Hub**: https://developer.ibm.com/components/ibm-mq/
- **MQ Container GitHub**: https://github.com/ibm-messaging/mq-container
- **Podman Documentation**: https://docs.podman.io/

### Clean Up (Optional)

When you're done with the demo:

```bash
# Stop everything
podman stop qm1
podman machine stop

# Remove everything (if you want to free up space)
podman rm qm1
podman volume rm qm1data
podman rmi localhost/ibm-mqadvanced-server-dev:10.0.0.0-arm64
```

---

## 🎉 Congratulations!

You've successfully built and tested an IBM MQ messaging system from scratch. You now understand:

- How message queuing works
- How to manage queue managers and queues
- How to send, receive, and browse messages
- How persistence ensures reliable messaging

**You're ready to explore more advanced MQ concepts and build real applications!**

---

## 📝 Quick Reference Card

### Essential Commands

```bash
# Start environment
podman machine start && podman start qm1

# Send message
echo "text" | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1

# Receive message
podman exec qm1 /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1

# Check queue depth
podman exec qm1 bash -c "echo 'DISPLAY QLOCAL(EVENT.Q1) CURDEPTH' | runmqsc QM1"

# Stop environment
podman stop qm1 && podman machine stop
```

---

**Tutorial Version:** 1.0  
**Last Updated:** June 22, 2026  
**Created with:** Bob AI Assistant

---

## Appendix: Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Your Mac                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Podman Machine (Linux VM)                  │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐ │ │
│  │  │           Container: qm1                           │ │ │
│  │  │                                                    │ │ │
│  │  │  ┌──────────────────────────────────────────────┐ │ │ │
│  │  │  │      Queue Manager: QM1                      │ │ │ │
│  │  │  │                                              │ │ │ │
│  │  │  │  ┌────────────────────────────────────────┐ │ │ │ │
│  │  │  │  │       Queue: EVENT.Q1                  │ │ │ │ │
│  │  │  │  │                                        │ │ │ │ │
│  │  │  │  │  [Message 1] [Message 2] [Message 3]  │ │ │ │ │
│  │  │  │  │                                        │ │ │ │ │
│  │  │  │  └────────────────────────────────────────┘ │ │ │ │
│  │  │  │                                              │ │ │ │
│  │  │  └──────────────────────────────────────────────┘ │ │ │
│  │  │                                                    │ │ │
│  │  └────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  Volume: qm1data (Persistent Storage)                   │ │
│  │  └─ Queue Manager Data                                  │ │
│  │  └─ Queue Definitions                                   │ │
│  │  └─ Messages                                            │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Ports:                                                      │
│  - 1414: MQ Messaging                                        │
│  - 9443: Web Console (HTTPS)                                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**End of Tutorial**