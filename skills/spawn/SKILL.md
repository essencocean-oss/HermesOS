---
name: spawn
description: Lifecycle for a per-user Hermes runtime: install, run, stop, status, kill.
triggers:
  - install
  - run
  - stop
  - status
  - kill
  - spawn
  - user runtime
  - container
---

# spawn

Manage one user’s isolated Hermes runtime.

## Inputs
- user_id: string
- action: install | run | stop | status | kill
- model?: string

## Outputs
- human-readable status
- container IDs / runtime URLs when applicable
