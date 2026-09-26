# InvestSync — Project Notes Index

Complete phase-wise notes for the InvestSync project, built to meet Kelp's Junior Software Engineer JD requirements (Node.js, Express, PostgreSQL, Angular, socket handling).

## How to use these notes
Each phase file is self-contained with:
- **Narration** — what was done before this phase, what happens in it, what's next
- **Navigation** — jump links to every topic in the file
- **Concept explanations** — detailed, with Java/Spring Boot analogies where relevant
- **Mermaid diagrams** — visual flow for the trickier concepts
- **Interview Explanation** — a ready-to-say paragraph for each topic
- **Key Points to Remember** — the condensed cheat-sheet version
- **Docs to Reference** — official documentation links
- **Phase Summary** — wrap-up + pointer to the next phase

## Phase Files

| Phase | File | Covers |
|---|---|---|
| 0 | [Phase0_Setup_Git_Foundations.md](./Phase0_Setup_Git_Foundations.md) | Repo init, `.gitignore`, git commit convention |
| 1 | [Phase1_Node_Express_Fundamentals.md](./Phase1_Node_Express_Fundamentals.md) | Node event loop, Express, middleware, folder structure |
| 2 | [Phase2_PostgreSQL_Database_Layer.md](./Phase2_PostgreSQL_Database_Layer.md) | `pg` driver, connection pooling, schema design |
| 3 | [Phase3_REST_API_CRUD.md](./Phase3_REST_API_CRUD.md) | Express Router, full CRUD, parameterized queries, validation |
| 4 | [Phase4_WebSockets_SocketIO.md](./Phase4_WebSockets_SocketIO.md) | Socket.io, Java-sockets analogy, real-time broadcasting |
| 5 | [Phase5_Angular_Fundamentals.md](./Phase5_Angular_Fundamentals.md) | Angular components/DI/Observables, `@if`/`@for`, forms |
| 6 | [Phase6_RealTime_Zoneless_Debugging.md](./Phase6_RealTime_Zoneless_Debugging.md) | Live socket updates, zoneless Angular bug + fix (signals) |
| 7 | [Phase7_Search_Pagination_ActivityLog.md](./Phase7_Search_Pagination_ActivityLog.md) | Search/filter/pagination, second entity (audit log) |
| 8 | [Phase8_Security_Production_Hardening.md](./Phase8_Security_Production_Hardening.md) | JWT auth, error handling, rate limiting + 2 real bugs fixed |

## Your Two Strongest Interview Stories
1. **Phase 4:** the SockItChat (Java sockets) → Socket.io analogy — ties your existing project directly to this one.
2. **Phase 6:** the zoneless Angular debugging journey — wrong hypothesis (NgZone) → correct diagnosis → signals fix. Full STAR-format version included in that file.

## Recommended Prep Order Before the Interview
1. Read all 9 files once, top to bottom.
2. Read only the **Interview Explanation** paragraphs a second time, out loud.
3. Rehearse the two debugging stories (Phase 4 and Phase 6) until you can tell them without notes.
4. Skim **Key Points to Remember** across all phases the morning of the interview.
