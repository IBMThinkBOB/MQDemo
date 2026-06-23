#!/bin/bash
set -e

echo "🚀 Starting IBM MQ Demo Environment..."

# Start Podman machine if not running
echo "📦 Checking Podman machine status..."
if ! podman machine list | grep -q "Currently running"; then
    echo "Starting Podman machine..."
    podman machine start
else
    echo "✅ Podman machine already running"
fi

# Wait for Podman to be ready
sleep 3

# Start container if not running
if ! podman ps | grep -q qm1; then
    echo "🔄 Starting qm1 container..."
    podman start qm1
    echo "⏳ Waiting for queue manager to initialize..."
    sleep 10
else
    echo "✅ Container qm1 already running"
fi

# Verify queue manager
echo "🔍 Checking queue manager status..."
podman exec qm1 dspmq

echo ""
echo "✅ Demo environment ready!"
echo ""
echo "📊 Access web console: https://localhost:9443"
echo "🖥️  Enter container: podman exec -it qm1 bash"
echo "📝 View logs: podman logs qm1"
echo ""
echo "Quick commands inside container:"
echo "  - Check QM: dspmq"
echo "  - Send message: /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1"
echo "  - Get message: /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1"
echo ""
echo "Or from host:"
echo "  - Send: echo 'message' | podman exec -i qm1 /opt/mqm/samp/bin/amqsput EVENT.Q1 QM1"
echo "  - Get: podman exec qm1 /opt/mqm/samp/bin/amqsget EVENT.Q1 QM1"

# Made with Bob
