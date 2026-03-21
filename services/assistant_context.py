from __future__ import annotations


class AssistantContextBuilder:
    """Placeholder assistant context packaging service."""

    version = "scaffold-v1"

    def describe(self) -> dict[str, str]:
        return {
            "service": "assistant_context",
            "status": "placeholder",
            "purpose": "Future reusable context assembler for LLM-backed copilot flows.",
        }

