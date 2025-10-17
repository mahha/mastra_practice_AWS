#!/bin/sh
curl -X POST http://localhost:3000/api/workflow/execute -H "Content-Type: application/json" -d '{ "query": "AIについての情報", "owner": "mahha", "repo": "mastra_practice" }' | jq | tee ./result.json
