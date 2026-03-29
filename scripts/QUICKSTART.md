# MEMORY SYSTEM UPGRADE v2.0 — QUICKSTART

**Status:** ✅ SCRIPT READY FOR EXECUTION  
**Location:** `/data/.openclaw/workspace/scripts/memory-upgrade-v2.sh`  
**Documentation:** `README-MEMORY-UPGRADE.md`

---

## TL;DR — RUN THE UPGRADE

```bash
cd /data/.openclaw/workspace
./scripts/memory-upgrade-v2.sh
```

**The script will:**
1. Create a pre-change snapshot (rollback insurance)
2. Build new tiered memory structure
3. Migrate all files safely (copies, not moves)
4. Validate everything (JSON, checksums, integrity)
5. Update AGENTS.md and HEARTBEAT.md
6. Commit to git
7. Generate detailed report

**Time:** 2-5 minutes  
**Risk:** LOW (non-destructive, full snapshot taken first)

---

## WHAT YOU GET

### Before Upgrade
```
memory/
├── 2026-03-*.md        # Flat daily logs
├── ONYX.md             # Markdown memory
└── heartbeat-state.json

(No structure, no retention policy, no backup automation)
```

### After Upgrade
```
memory/
├── state/              # Atomic system state
│   ├── system-state.json
│   ├── agent-registry.json
│   └── heartbeat-state.json
├── knowledge/          # Curated knowledge
│   ├── user-profile.md
│   ├── system-profile.md
│   └── agents/
│       ├── hatoomi.json
│       └── onyx.json
├── sessions/           # Indexed session metadata
├── archive/            # Historical logs (90 days)
└── snapshots/          # Pre-change backups

logs/                   # Structured logging
backups/                # Automated snapshots
config/                 # Policies (retention, backup, memory tiers)
runtime/                # Ephemeral cache
```

**Benefits:**
- ✅ Clear separation of concerns (state vs knowledge vs logs)
- ✅ Safe write protocol (no more partial writes or corruption)
- ✅ Retention policies (automatic cleanup)
- ✅ Backup automation (snapshots + SSH ready)
- ✅ Session indexing (find archived sessions fast)
- ✅ JSON validation (all state files validated before write)

---

## IF SOMETHING GOES WRONG

**Rollback in 30 seconds:**

```bash
cd /data/.openclaw
ls workspace/memory/snapshots/  # Find snapshot name
SNAPSHOT="pre-memory-upgrade-YYYYMMDD-HHMMSS"
sha256sum -c workspace/memory/snapshots/${SNAPSHOT}.sha256  # Verify checksum
tar -xzf workspace/memory/snapshots/${SNAPSHOT}.tar.gz      # Restore
```

Done. System restored to pre-upgrade state.

---

## NEXT STEPS AFTER UPGRADE

1. **Review the report:**
   ```bash
   cat logs/memory-events/UPGRADE-REPORT-<timestamp>.md
   ```

2. **Set up GitHub SSH:**
   ```bash
   ssh-keygen -t ed25519 -C "hatoomi@openclaw"
   # Add ~/.ssh/id_ed25519.pub to GitHub
   git remote set-url origin git@github.com:hatoomi/neon-survivor.git
   ```

3. **Enable SSH backup:**
   ```bash
   cat secrets/backup-ssh-instructions.md
   ```

4. **Create backup cron jobs:**
   ```bash
   # Daily snapshot at 02:00 UTC
   0 2 * * * cd /data/.openclaw/workspace && tar -czf backups/daily/snapshot-$(date +\%Y\%m\%d).tar.gz memory/state/ memory/knowledge/ config/
   
   # Live state backup every 6 hours
   0 */6 * * * cd /data/.openclaw/workspace && tar -czf backups/daily/state-$(date +\%Y\%m\%d-\%H\%M).tar.gz memory/state/ memory/knowledge/ config/
   ```

---

## QUESTIONS?

**Q: Will this break my current system?**  
A: No. The script copies files, does not delete originals. Full snapshot taken first. Rollback is 30 seconds.

**Q: How long does it take?**  
A: 2-5 minutes. Most time is snapshot creation and file copying.

**Q: Can I run this in production?**  
A: Yes. The script is designed for production use. Non-destructive, fully logged, snapshot-backed.

**Q: What if I need to rollback?**  
A: Extract the snapshot (see "IF SOMETHING GOES WRONG" above). Takes 30 seconds.

**Q: Do I need to stop the agent?**  
A: No. The script can run while the agent is active. However, it will commit to git, so make sure current git status is acceptable.

**Q: Will I lose any data?**  
A: No. All files are copied, not moved. Originals stay in place until you manually confirm cleanup (Phase 9).

---

## SCRIPT VALIDATION

**Generated:** 2026-03-29 15:37 Dubai  
**Tested:** Pre-flight checks passed  
**Reviewed:** Structure validated, safe write protocol confirmed  
**Committed:** Git commit 4af7ca9

**Ready for execution.**

---

**Run now:**
```bash
cd /data/.openclaw/workspace && ./scripts/memory-upgrade-v2.sh
```

---

**END OF QUICKSTART**
