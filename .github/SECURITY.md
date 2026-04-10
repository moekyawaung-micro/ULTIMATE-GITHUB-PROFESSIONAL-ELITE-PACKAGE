# .github/SECURITY.md

# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

## Security Guidelines

### Authentication
- Always use HTTPS
- Implement JWT with expiration
- Use secure password hashing (bcrypt)
- Enable 2FA

### Data Protection
- Encrypt sensitive data at rest
- Use TLS for data in transit
- Implement role-based access control
- Regular security audits

### Dependency Management
- Keep dependencies updated
- Use `npm audit` regularly
- Review security advisories
- Use lock files

### Code Review
- Peer review all code
- Use static analysis tools
- Implement SAST scanning
- Regular penetration testing

## Security Checklist

- [ ] No hardcoded secrets
- [ ] HTTPS enforced
- [ ] Input validation
- [ ] Output encoding
- [ ] CSRF tokens
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] Authentication required
- [ ] Authorization checks
- [ ] Audit logging

## Responsible Disclosure

We follow responsible disclosure practices:
1. Report vulnerability privately
2. We'll acknowledge within 48 hours
3. We'll work on a fix
4. We'll coordinate release timing
5. We'll credit the researcher

Thank you for helping keep our project secure!
