---
title: "Admin and organization management"
tool: "Claude"
icon: "tool-claude"
level: "intermediate"
summary: "The Admin API lets you manage organization resources programmatically — organization members, workspaces, and API keys — instead of manual setup in the Console"
readTime: "5 min"
readers: "0"
locked: false
order: 6
---
# Claude guide — Part 6: Admin and organization management

> Compiled from the [Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api) and the [Claude Help Center](https://support.claude.com/en/) — for organization admins managing members, permissions, costs, security, and special programs

---

## 📖 Key terms for Admin

| Term | Plain meaning |
|---|---|
| **Admin API** | An API specifically for organization admins, used to manage members and settings programmatically |
| **Workspace** | A separate workspace, used to group API keys and control costs by team or project |
| **SSO** (Single Sign-On) | Logging in with one organization account to access all services without creating a new password |
| **IdP** (Identity Provider) | The organization's identity management system, e.g. Okta, Azure AD, Google Workspace |
| **SAML / OIDC** | Protocols (common languages) for passing authentication data between SSO systems |
| **JIT** (Just-In-Time provisioning) | Automatically creating a user account when they first log in via SSO, with no need to create it in advance |
| **SCIM** | A standard for automatically syncing users from an IdP — add, edit, or disable user accounts automatically |
| **WIF** (Workload Identity Federation) | A way for automated systems to use short-lived tokens instead of permanent API keys — safer |
| **Onboarding / Offboarding** | Adding new members to the system / removing members from the system |
| **Data residency** | A requirement that data be stored in a certain country or region, e.g. must be stored in Europe |
| **Zero Data Retention (ZDR)** | Not keeping data after processing, good for highly privacy-sensitive data |
| **Audit log** | A record of all activity in the system, for security auditing and standards compliance |
| **Compliance** | Adhering to standards or laws, e.g. HIPAA (health), SOC 2 (IT security) |

---

## 1. Admin API (manage the organization programmatically)
Reference: [Admin API](https://platform.claude.com/docs/en/manage-claude/admin-api)

### What is this topic?
The Admin API lets you manage organization resources programmatically — organization members, workspaces, and API keys — instead of manual setup in the Console.

### What it's used for
- Automate user onboarding/offboarding
- Manage workspace access permissions programmatically
- Track/manage API key usage

### Key details from the official docs
- **Requires a dedicated Admin API key** (starting with `sk-ant-admin...`) different from a regular API key; only admin-role members can create it
- **Not available for individual accounts**; you must set up the organization in Console → Settings → Organization first
- On Claude Platform on AWS, only workspace endpoints are usable; the rest (members, invites, API keys, reports) are not supported

### Organization-level roles (5 roles)
| Role | Permissions |
|---|---|
| `user` | Use the Workbench |
| `claude_code_user` | Use the Workbench + Claude Code |
| `developer` | Use the Workbench + manage API keys |
| `billing` | Use the Workbench + manage billing |
| `admin` | Do all of the above + manage users |

### Example (manage members)
```bash
# List organization members
curl "https://api.anthropic.com/v1/organizations/users?limit=10" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"

# Change a member's role
curl "https://api.anthropic.com/v1/organizations/users/{user_id}" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  --data '{"role": "developer"}'
```

### Main endpoints
- Members: `/v1/organizations/users`
- Invites: `/v1/organizations/invites`
- Workspaces + workspace members: `/v1/organizations/workspaces/...`
- API keys: `/v1/organizations/api_keys`
- Organization info: `/v1/organizations/me`

### Best Practices
Name workspaces/API keys meaningfully, handle errors, review roles regularly, delete unused workspaces/invites, rotate API keys periodically.

### Quick summary
The Admin API (key `sk-ant-admin...`) manages members/workspaces/API keys programmatically; has 5 roles, organizations only.

---

## 2. Workspaces
Reference: [Workspaces](https://platform.claude.com/docs/en/manage-claude/workspaces)

### Key details from the official docs
- Workspaces group API keys and control cost and rate limits by use case/team
- You can set workspace-level roles (e.g. `workspace_developer`, `workspace_admin`)
- Create/manage them in the Console and via the Admin API

### Quick summary
Workspace = group API keys + control cost/permissions by team or use case.

---

## 3. Usage and cost tracking
Reference: [Usage and Cost API](https://platform.claude.com/docs/en/manage-claude/usage-cost-api) · [Rate Limits API](https://platform.claude.com/docs/en/manage-claude/rate-limits-api) · [Claude Code Analytics API](https://platform.claude.com/docs/en/manage-claude/claude-code-analytics-api)

### Key details from the official docs
- **Usage and Cost API** — pull usage (token) and cost reports for the organization, broken down by time/workspace/model
- **Rate Limits API** — read the organization's and workspaces' set rate limits
- **Claude Code Analytics API** — track Claude Code adoption and developer productivity

### Quick summary
There are APIs to view usage/cost, rate limits, and Claude Code analytics.

---

## 4. Organization authentication and Identity (SSO, JIT, SCIM)
Reference: [Authentication](https://platform.claude.com/docs/en/manage-claude/authentication) · [Workload Identity Federation](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation) · [Identity management](https://support.claude.com/en/collections/17270717-identity-management-sso-jit-scim)

### What is this topic?
For organizations (Team/Enterprise), there are ways to manage identity and access centrally, connecting to the organization's Identity Provider (IdP).

### Key details from the official docs
- **SSO (Single Sign-On)** — log in with one organization account via an **IdP** (Identity Provider — an identity management system) like Okta, Azure AD, Google Workspace, using the SAML or OIDC protocol
- **JIT (Just-In-Time provisioning)** — automatically create a new user account the moment they first log in via SSO, with no need to create them one by one in advance
- **SCIM** — a standard that syncs the user list and permissions from the IdP to Claude automatically; when you add/remove/edit in the IdP, it updates in Claude too — enabling fast **onboarding/offboarding**
- **Workload Identity Federation (WIF)** — a way for automated systems to use short-lived access tokens instead of permanent API keys, safer because the tokens expire quickly (`POST /v1/oauth/token`)

### Cautions
- SSO/SCIM setup must be done by the IdP admin and the Claude organization admin
- Use WIF instead of permanent API keys in automated systems for security

### Quick summary
Organizations use SSO (unified login), JIT (auto-create accounts), SCIM (sync users), and WIF (short-lived tokens instead of API keys).

---

## 5. Data & Compliance
Reference: [Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency) · [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) · [Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api)

### Key details from the official docs
- **Data residency** — choose the region where data is stored and processed, good for organizations with requirements about which country data must be in
- **API and data retention** — set the policy for how long Anthropic keeps API data, including the **Zero Data Retention (ZDR)** option (no data kept at all) for eligible features
- **Compliance API** — pull the organization's **audit log**: Activity Feed, chat/file/project data, user/role/group data, for auditing and standards compliance
- **Encryption keys** — supports self-managed encryption keys for the organization (more control over data protection)

### Quick summary
Organizations choose data residency, use ZDR for eligible features, and pull the audit log via the Compliance API.

---

## 6. Claude for Education
Reference: [Claude for Education](https://support.claude.com/en/collections/12630177-claude-for-education)

### Key details from the official docs
- A plan for educational institutions (universities/schools) for students and staff to use Claude
- Has learning-focused modes/features, e.g. Learning mode that guides students to think for themselves instead of giving ready-made answers
- Includes institution-level management (permissions, learner privacy)

### Quick summary
The education plan lets a whole institution use Claude, with a learning-assistant mode and organization-level management.

---

## 7. Claude for Nonprofits
Reference: [Claude for Nonprofits](https://support.claude.com/en/collections/17047088-claude-for-nonprofits)

### Key details from the official docs
- A program for nonprofit organizations, accessing Claude on special terms/pricing
- Has eligibility criteria and a specific application process; see details in the help center

### Quick summary
A benefits program for nonprofits, with specific criteria/application steps.

---

## 8. Claude for Government
Reference: [Claude for Government](https://support.claude.com/en/collections/19395194-claude-for-government)

### Key details from the official docs
- A solution for government agencies, focused on security, compliance, and high-grade data control
- See terms/access details in the help center and from sales

### Quick summary
A government solution focused on high-grade security and compliance.

---

## Additional reference topics
- API Console roles and permissions: https://support.claude.com/en/articles/10186004-api-console-roles-and-permissions
- Team and Enterprise plans: https://support.claude.com/en/collections/9387370-team-and-enterprise-plans
- WIF reference: https://platform.claude.com/docs/en/manage-claude/wif-reference
- Trust Center (security/compliance): https://trust.anthropic.com
