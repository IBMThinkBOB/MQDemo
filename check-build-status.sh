#!/bin/bash
# IBM MQ Build Status Checker

echo "=== IBM MQ Build Status ==="
echo ""

# Check if make process is running
if ps aux | grep -E "make build-devserver" | grep -v grep > /dev/null; then
    echo "✅ Build process is RUNNING"
    echo ""
    echo "Build started: $(ps -o lstart= -p $(pgrep -f 'make build-devserver'))"
    echo "Running for: $(ps -o etime= -p $(pgrep -f 'make build-devserver')) (HH:MM:SS)"
else
    echo "❌ Build process is NOT running"
fi

echo ""
echo "=== Podman Images ==="
podman images | grep -i mq || echo "No MQ images found yet"

echo ""
echo "=== Podman Machine Status ==="
podman machine list

echo ""
echo "=== Disk Usage ==="
df -h | grep -E "Filesystem|/System/Volumes/Data"

echo ""
echo "To monitor build in real-time, check your VS Code terminal"
echo "Or run: tail -f ~/mq-container/build.log (if log file exists)"

# Made with Bob
