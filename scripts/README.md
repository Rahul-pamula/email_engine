# Database & Seed Scripts

This folder contains utility scripts for database management. Run these manually from the **project root** directory.

| Script | Purpose | How to Run |
|---|---|---|
| `run_migration.sh` | Runs all SQL migrations via Supabase CLI | `bash scripts/run_migration.sh` |
| `run_migration_direct.py` | Direct Python migrations (no CLI needed) | `python scripts/run_migration_direct.py` |
| `run_template_migration.sh` | Runs template-specific migrations | `bash scripts/run_template_migration.sh` |
| `schema.sql` | Full DB schema snapshot (reference only) | View only |
| `seed_templates.py` | Seeds template presets into the database | `python scripts/seed_templates.py` |

> **Note:** Make sure you have a `.env` file at the project root with valid `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` before running any of these.
