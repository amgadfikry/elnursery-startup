#!/bin/bash

echo "Init replica set"
mongo --host mongodb-primary <<EOF
rs.initiate({
  _id: "demo",
  members: [
    { _id: 0, host: "mongodb-primary" },
    { _id: 1, host: "mongodb-secondary1" },
    { _id: 2, host: "mongodb-secondary2" }
    ]
  })
EOF

echo "Create replica successfuly"
