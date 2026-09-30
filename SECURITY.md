# Security Policy

## Reporting Vulnerabilities

If you discover a potential vulnerability within `JeevanAI`, please report it privately to the maintainers.

## Security Practices & AI Integrity

1. **API Key Protection**:
   - OpenAI, Anthropic, Gemini, or custom LLM endpoint keys must be stored strictly in `.env.local` / environment configuration and never exposed to client bundles or git history.
2. **Data Privacy**:
   - User queries and health/medical AI prompt inputs must be sanitized and protected against injection attacks.
