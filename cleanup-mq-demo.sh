#!/bin/bash

echo "🧹 Cleaning up IBM MQ Demo Environment..."
echo ""
echo "⚠️  WARNING: This will remove the container and optionally the volume."
echo "All queue manager data will be lost if you remove the volume."
echo ""

read -p "Stop and remove container? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    podman stop qm1 || true
    podman rm qm1 || true
    echo "✅ Container removed"
fi

echo ""
read -p "Remove persistent volume (qm1data)? This deletes all MQ data! (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    podman volume rm qm1data || true
    echo "✅ Volume removed"
fi

echo ""
echo "✅ Cleanup complete"
echo ""
echo "To rebuild from scratch:"
echo "1. Follow the build steps in MQ_DEMO_IMPLEMENTATION_PLAN.md"
echo "2. Or recreate with existing image:"
echo ""
echo "podman volume create qm1data"
echo "podman run --name qm1 --detach \\"
echo "  --env LICENSE=accept --env MQ_QMGR_NAME=QM1 \\"
echo "  --publish 1414:1414 --publish 9443:9443 \\"
echo "  --volume qm1data:/mnt/mqm \\"
echo "  localhost/ibm-mqadvanced-server-dev:10.0.0.0-arm64"

# Made with Bob
