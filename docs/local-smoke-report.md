# Local Smoke Report

Date: 2026-06-08

## Commands

```bash
PYTHONPATH=src python3 -m tracewarden run examples/evidence/case-alpha --out runs/demo
PYTHONPATH=src python3 -m unittest discover -s tests -v
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs /Users/rick/Documents/Project/Hackathon/FindEvil --phase prd
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs /Users/rick/Documents/Project/Hackathon/FindEvil --phase ui-libs
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs /Users/rick/Documents/Project/Hackathon/FindEvil --phase feature-density
node /Users/rick/Documents/MySkill/hackathonhunter-skill/scripts/audit_project.mjs /Users/rick/Documents/Project/Hackathon/FindEvil --phase realness
```

## Result

- CLI demo completed.
- Tests passed: 4/4.
- G2 PRD audit passed.
- G3 visual audit passed.
- G4 feature-density audit passed.
- Realness audit passed.
- Sample run copied to `artifacts/sample-run`.
