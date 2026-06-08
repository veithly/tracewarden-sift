import json


SCHEMA = {
    "name": "tracewarden-sift-readonly-tools",
    "description": "MCP-style read-only forensic tool surface for Protocol SIFT agents.",
    "tools": [
        {
            "name": "read_timeline",
            "description": "Parse a timeline CSV under the sealed evidence root.",
            "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
            "guardrail": "Read-only; path fixed to evidence_root/timeline.csv.",
        },
        {
            "name": "read_auth",
            "description": "Read authentication log lines under the sealed evidence root.",
            "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
            "guardrail": "Read-only; path fixed to evidence_root/auth.log.",
        },
        {
            "name": "read_powershell",
            "description": "Read PowerShell evidence under the sealed evidence root.",
            "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
            "guardrail": "Read-only; no arbitrary shell commands exposed.",
        },
    ],
}


def schema_json() -> str:
    return json.dumps(SCHEMA, indent=2, sort_keys=True)
