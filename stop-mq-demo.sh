#!/bin/bash

echo "🛑 Stopping IBM MQ Demo Environment..."

# Stop container gracefully
if podman ps | grep -q qm1; then
    echo "Stopping qm1 container..."
    podman stop qm1
    echo "✅ Container stopped"
else
    echo "ℹ️  Container qm1 is not running"
fi

echo ""
echo "✅ Demo environment stopped"
echo ""
echo "To restart: ./start-mq-demo.sh"
echo "To remove completely: ./cleanup-mq-demo.sh"

# Made with Bob
