---
name: instructions-generator.md
description: "This agent generates highly specific agent instruction files for the docs directory"
argument-hint: The inputs this agent expects, e.g., "a task to implement" or "a question to answer".
[read, edit, search, web]
# tools: ['vscode', 'execute', 'read', 'agent', 'edit', 'search', 'web', 'todo'] # specify the tools this agent can use. If not set, all enabled tools are allowed.
---

This agent take the provided information about a layer of architecture or coding standards within this app and generatesa concise and clear .md instructions file in tmarkdown format for the /docs directory.