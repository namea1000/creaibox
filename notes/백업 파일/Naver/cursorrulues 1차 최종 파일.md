# ==================================================
# CreAibox AI Agent Rules
# ==================================================

Before writing code, modifying code, or creating new files,
always review the documentation inside:

/docs

Priority order:

1. /docs/project/*
   - Product vision
   - Current roadmap
   - TODO status

2. /docs/api/*
   - Database schema
   - API endpoints
   - Supabase structure

3. /docs/pages/*
   - Page specifications
   - Route definitions

4. /docs/rules/*
   - Coding standards
   - Naming conventions
   - Commit conventions

5. /docs/arch/*
   - Technical architecture
   - System design

If documentation conflicts with existing code,
follow documentation first and report the inconsistency.

Do not invent:
- database tables
- api routes
- folder structures
- component names

without checking docs first.

New features, architecture changes, database changes,
and major UI changes must be documented in /docs.

Small bug fixes and minor UI adjustments do not require
documentation updates unless behavior changes.

When creating new functionality:
1. Read related docs.
2. Read existing implementation.
3. Create or update docs first.
4. Then implement.

When modifying existing functionality:
1. Read related docs.
2. Read existing implementation.
3. Update docs if architecture changes.
4. Then implement.

Documentation is part of the task.
A task is not complete until related docs are updated.

The docs directory is the source of truth for the CreAibox project.

# Branding

Official brand name is:

CreAibox

Always use:
✅ CreAibox

Never use:
❌ CreAIbox
❌ Creaibox
❌ CreaIbox
❌ CREAIBOX

This applies to:
- UI text
- Documentation
- README
- Database comments
- Project descriptions
- Marketing content
- Blog content
- Source code comments

If a file contains old branding,
normalize it to "CreAibox"
when modifying that file.

When documentation and implementation differ:

1. Report the difference.
2. Do not silently overwrite architecture decisions.
3. Update docs only if the implementation was intentionally changed.