# MEMORY SYSTEM UPGRADE v2.0 — EXECUTION GUIDE

**Generated:** 2026-03-29 15:37 Dubai Time  
**Script:** `memory-upgrade-v2.sh`  
**Status:** READY FOR REVIEW AND EXECUTION

---

## OVERVIEW

This script implements a complete memory system upgrade for the OpenClaw workspace, introducing:

- **Tiered memory architecture** (runtime/state/knowledge/logs)
- **Safe write protocol** (tmp → validate → atomic replace)
- **Retention policies** (daily/weekly/monthly snapshots)
- **Integrity validation** (JSON validation, required keys, size checks)
- **Session indexing** (archived session metadata)
- **Backup hardening** (pre-change snapshots, checksums, SSH backup prep)

---

## PRE-EXECUTION CHECKLIST

Before running the script, verify:

- [ ] Current git status is clean (or acceptable to commit)
- [ ] At least 200 MB free disk space (for snapshot + new structure)
- [ ] You have reviewed the script and understand what it does
- [ ] You have a backup plan if rollback is needed

---

## EXECUTION STEPS

### Step 1: Review the Script

```bash
cd /data/.openclaw/workspace/scripts
less memory-upgrade-v2.sh
```

**Key sections to review:**
- Phase 0: Pre-work inspection (read-only)
- Phase 1: Snapshot creation (creates backup)
- Phase 2-3: Directory creation and file migration (copies, does not delete)
- Phase 4-5: Safe write protocol and validation
- Phase 6-8: Config updates and git commit
- Phase 9: Cleanup (requires manual confirmation)

### Step 2: Run the Script

```bash
cd /data/.openclaw/workspace
./scripts/memory-upgrade-v2.sh
```

**The script will:**
1. Ask for confirmation before proceeding
2. Create a pre-change snapshot (for rollback if needed)
3. Build new directory structure
4. Migrate files to new locations (copies, not moves)
5. Validate all JSON files
6. Update AGENTS.md and HEARTBEAT.md
7. Commit changes to git
8. Generate a detailed report

**Estimated time:** 2-5 minutes

### Step 3: Review the Report

After completion, review:

```bash
cat logs/memory-events/UPGRADE-REPORT-<timestamp>.md
```

Check for:
- ✅ All integrity checks passed
- ✅ Git commit successful
- ⚠️ Any warnings or anomalies
- ❌ Any failures

### Step 4: Verify System Functionality

Test that the upgraded memory system works:

```bash
# Check state files
cat memory/state/system-state.json
cat memory/state/agent-registry.json

# Check knowledge files
ls -lh memory/knowledge/
cat memory/knowledge/system-profile.md | head -20

# Check git status
git log -1 --oneline
git status
```

### Step 5: Optional Cleanup

If all validation passes, you may clean up original files:

```bash
# Verify archives exist first
ls -lh memory/archive/2026/03/

# Then remove originals (after manual confirmation)
rm memory/2026-03-06.md memory/2026-03-10.md memory/2026-03-20.md memory/2026-03-21.md memory/2026-03-27.md

# Keep memory/2026-03-29.md (today's active log)
```

---

## ROLLBACK PROCEDURE

If something goes wrong, restore from snapshot:

```bash
cd /data/.openclaw/

# Find the snapshot
ls -lh workspace/memory/snapshots/

# Verify checksum
SNAPSHOT_NAME="pre-memory-upgrade-<timestamp>"
sha256sum -c workspace/memory/snapshots/${SNAPSHOT_NAME}.sha256

# If checksum passes, extract
tar -xzf workspace/memory/snapshots/${SNAPSHOT_NAME}.tar.gz

# Verify files are restored
cd workspace
git status
```

---

## WHAT THE SCRIPT DOES

### Creates New Directories

```
memory/
├── state/              # High-frequency system state (atomic writes)
├── knowledge/          # Curated knowledge (agent-scoped)
│   └── agents/         # Per-agent memory files
├── sessions/           # Session summaries (indexed)
│   └── 2026/03/        # Date-organized
├── archive/            # Historical logs (read-only)
│   └── 2026/03/
└── snapshots/          # Pre-change backups

logs/
├── memory-events/      # Memory write logs
├── agent-events/       # Agent action logs
├── recovery/           # Recovery event logs
└── backups/            # Backup event logs

backups/
├── daily/              # Daily snapshots
├── weekly/             # Weekly snapshots
└── manual/             # Manual backups

config/
├── memory-policy.json      # Memory tier definitions
├── retention-policy.json   # Cleanup rules
└── backup-policy.json      # Backup configuration

runtime/
├── cache/              # Ephemeral cache (24h max)
└── tmp/                # Temporary files
```

### Migrates Files

| Original | New Location | Action |
|----------|--------------|--------|
| `memory/heartbeat-state.json` | `memory/state/heartbeat-state.json` | Copy |
| `USER.md` | `memory/knowledge/user-profile.md` | Copy |
| `MEMORY.md` | `memory/knowledge/system-profile.md` | Copy |
| `memory/ONYX.md` | `memory/knowledge/agents/onyx.json` | Convert to JSON |
| `memory/2026-03-{06,10,20,21,27}.md` | `memory/archive/2026/03/` | Copy (archive) |

### Creates New Files

**State Files:**
- `memory/state/system-state.json` — System status
- `memory/state/agent-registry.json` — Agent configuration
- `memory/state/workflow-checkpoints.json` — Workflow state

**Knowledge Files:**
- `memory/knowledge/agents/hatoomi.json` — Hatoomi agent memory
- `memory/knowledge/agents/onyx.json` — ONYX ELITE memory (JSON format)

**Config Files:**
- `config/memory-policy.json` — Tier definitions
- `config/retention-policy.json` — Retention rules
- `config/backup-policy.json` — Backup configuration

**Session Index:**
- `memory/sessions/2026/03/session-index.json` — Archived session metadata

### Updates System Files

- **AGENTS.md** — Adds memory system v2.0 startup sequence and write rules
- **HEARTBEAT.md** — Adds memory system tasks (state backup, file monitoring)
- **.gitignore** — Excludes runtime/, backups/, logs/, *.tmp

---

## SAFE WRITE PROTOCOL

From Phase 4 onwards, all writes to `memory/state/` and `memory/knowledge/` use:

```bash
# Write to temporary file
echo "$content" > file.json.tmp

# Validate JSON
python3 -m json.tool file.json.tmp > /dev/null

# If valid, atomic replace
mv file.json.tmp file.json

# Log the write
echo "[timestamp] WRITE | file=file.json | status=ok" >> logs/memory-events/
```

This prevents:
- Partial writes
- Invalid JSON
- Lost data during crashes

---

## POST-UPGRADE ACTIONS

After successful migration:

1. **Set up GitHub SSH authentication** (push is currently blocked)
2. **Enable SSH backup** (follow `secrets/backup-ssh-instructions.md`)
3. **Create backup cron jobs** (daily snapshots + live state backup every 6 hours)
4. **Test safe write protocol** (update heartbeat state using new procedure)
5. **Monitor memory growth** (check logs/memory-events/ weekly)

---

## TROUBLESHOOTING

### Script fails at Phase X

**Check the log:**
```bash
tail -50 logs/memory-events/upgrade-<timestamp>.log
```

**Rollback if needed:**
```bash
cd /data/.openclaw
tar -xzf workspace/memory/snapshots/pre-memory-upgrade-<timestamp>.tar.gz
```

### JSON validation errors

**Check which file:**
```bash
grep "FAIL" logs/memory-events/upgrade-<timestamp>.log
```

**Validate manually:**
```bash
python3 -m json.tool memory/state/system-state.json
```

### Git commit fails

**Check git status:**
```bash
cd /data/.openclaw/workspace
git status
git diff
```

**Manually commit if needed:**
```bash
git add -A
git commit -m "feat: memory system upgrade v2.0"
```

---

## SUPPORT

If issues arise:

1. Check the full log: `logs/memory-events/upgrade-<timestamp>.log`
2. Review the report: `logs/memory-events/UPGRADE-REPORT-<timestamp>.md`
3. Restore from snapshot if critical failure
4. Contact system operator with log output

---

## SCRIPT FEATURES

- ✅ **Error handling** — Exits on first error, rolls back on failure
- ✅ **Validation** — JSON validation, required keys, size checks
- ✅ **Logging** — Every action logged to file + console
- ✅ **Snapshots** — Pre-change backup with checksum
- ✅ **Safe writes** — Atomic file replacement (tmp → validate → move)
- ✅ **Non-destructive** — Copies files, does not delete originals (until Phase 9 manual confirmation)
- ✅ **Rollback** — Full system snapshot for easy restore
- ✅ **Reporting** — Detailed markdown report with git commit hash

---

**Script location:** `/data/.openclaw/workspace/scripts/memory-upgrade-v2.sh`  
**Documentation:** `/data/.openclaw/workspace/scripts/README-MEMORY-UPGRADE.md` (this file)  
**Support:** Check logs in `logs/memory-events/`

---

**END OF README**
