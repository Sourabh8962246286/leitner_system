# Graph Report - /Users/sourabhnigam/leitnerApp  (2026-04-26)

## Corpus Check
- 63 files · ~29,320 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 279 nodes · 295 edges · 61 communities detected
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 74 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]

## God Nodes (most connected - your core abstractions)
1. `fetchWithAuth()` - 17 edges
2. `refreshUI()` - 10 edges
3. `CardsService` - 8 edges
4. `CardsController` - 7 edges
5. `displayCardForReview()` - 6 edges
6. `displayNextCardInQueue()` - 6 edges
7. `renderAllTagElements()` - 6 edges
8. `AuthService` - 6 edges
9. `CardLogsService` - 6 edges
10. `apiFetchSubjects()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Leitner System` --semantically_similar_to--> `Spaced Repetition Learning`  [INFERRED] [semantically similar]
  CRON_EMAIL_PLAN.md → README.md
- `Box Schedule Logic` --semantically_similar_to--> `5-Box Leitner Structure`  [INFERRED] [semantically similar]
  CRON_EMAIL_PLAN.md → README.md
- `refreshUI()` --calls--> `renderBoxes()`  [INFERRED]
  /Users/sourabhnigam/leitnerApp/frontend/frontend.js → /Users/sourabhnigam/leitnerApp/frontend/modules/boxes.js
- `fetchWithAuth()` --calls--> `logout()`  [INFERRED]
  /Users/sourabhnigam/leitnerApp/frontend/modules/http.js → /Users/sourabhnigam/leitnerApp/frontend/auth.js
- `AuthModule` --conceptually_related_to--> `User Registration Form`  [INFERRED]
  README.md → frontend/register.html

## Hyperedges (group relationships)
- **Authentication Flow** — readme_authmodule, readme_jwt_authentication, login_login_form, register_registration_form, readme_user_schema [INFERRED 0.85]
- **Leitner Box System** — readme_box_structure, readme_boxesmodule, readme_box_schema, cron_email_plan_box_schedule, index_leitner_container [INFERRED 0.80]
- **Card Management Flow** — readme_cardsmodule, readme_card_schema, index_review_area, index_create_card_modal, cron_email_plan_getduecardsgroupedbysubject [INFERRED 0.75]

## Communities

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (5): CardLogsService, CardsService, bootstrap(), SubjectsService, UsersService

### Community 1 - "Community 1"
Cohesion: 0.15
Nodes (19): apiCreateCard(), apiCreateSubject(), apiCreateTag(), apiDeleteCard(), apiDeleteSubject(), apiDeleteTag(), apiFetchBoxes(), apiFetchCardLogs() (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (14): createCardElement(), displayCardForReview(), displayNextCardInQueue(), hideCardLogs(), loadAndRenderCardLogs(), renderCardLogs(), reviewAction(), toggleCardLogs() (+6 more)

### Community 3 - "Community 3"
Cohesion: 0.15
Nodes (17): Notifications Module, Scheduler Module, Create Card Modal, Leitner Box Container, Manage Subjects Modal, Manage Tags Modal, Review Area Component, Box Schema (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (8): SubjectsController, handleCreateTag(), handleDeleteTag(), handleFilterChange(), renderAllTagElements(), renderTagCheckboxes(), renderTagFilters(), renderTagList()

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (3): BoxesService, EmailService, SchedulerService

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (4): renderBoxes(), renderCards(), addDragAndDropListeners(), onDrop()

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (2): AuthController, AuthService

### Community 8 - "Community 8"
Cohesion: 0.36
Nodes (6): getToken(), handleLogin(), initAuth(), initDarkMode(), logout(), setToken()

### Community 9 - "Community 9"
Cohesion: 0.25
Nodes (1): CardsController

### Community 10 - "Community 10"
Cohesion: 0.33
Nodes (4): handleCreateCard(), renderColorSelector(), toggleEditMode(), renderCardSubjectSelector()

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (7): Box Schedule Logic, Email Service, getDueCardsGroupedBySubject Method, NotificationChannel Interface, Rationale: Extensible Notification Channels, Scheduler Service, 5-Box Leitner Structure

### Community 12 - "Community 12"
Cohesion: 0.33
Nodes (1): TagsService

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (1): TagsController

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (1): CardLogsController

### Community 15 - "Community 15"
Cohesion: 0.5
Nodes (1): JwtStrategy

### Community 16 - "Community 16"
Cohesion: 0.5
Nodes (1): JwtRefreshStrategy

### Community 17 - "Community 17"
Cohesion: 0.5
Nodes (1): BoxesController

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (4): User Login Form, AuthModule, JWT Authentication System, User Registration Form

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (3): Daily Email Reminder Feature, Leitner System, Spaced Repetition Learning

### Community 20 - "Community 20"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "Community 21"
Cohesion: 1.0
Nodes (1): AppModule

### Community 22 - "Community 22"
Cohesion: 1.0
Nodes (1): DatabaseModule

### Community 23 - "Community 23"
Cohesion: 1.0
Nodes (1): AuthModule

### Community 24 - "Community 24"
Cohesion: 1.0
Nodes (1): LoginDto

### Community 25 - "Community 25"
Cohesion: 1.0
Nodes (1): RegisterDto

### Community 26 - "Community 26"
Cohesion: 1.0
Nodes (1): JwtAuthGuard

### Community 27 - "Community 27"
Cohesion: 1.0
Nodes (1): JwtRefreshGuard

### Community 28 - "Community 28"
Cohesion: 1.0
Nodes (1): CardsModule

### Community 29 - "Community 29"
Cohesion: 1.0
Nodes (1): CreateCardDto

### Community 30 - "Community 30"
Cohesion: 1.0
Nodes (1): UpdateCardDto

### Community 31 - "Community 31"
Cohesion: 1.0
Nodes (1): ReviewCardDto

### Community 32 - "Community 32"
Cohesion: 1.0
Nodes (1): Card

### Community 33 - "Community 33"
Cohesion: 1.0
Nodes (1): SchedulerModule

### Community 34 - "Community 34"
Cohesion: 1.0
Nodes (1): TagsModule

### Community 35 - "Community 35"
Cohesion: 1.0
Nodes (1): CreateTagDto

### Community 36 - "Community 36"
Cohesion: 1.0
Nodes (1): Tag

### Community 37 - "Community 37"
Cohesion: 1.0
Nodes (1): CardLogsModule

### Community 38 - "Community 38"
Cohesion: 1.0
Nodes (1): CardLog

### Community 39 - "Community 39"
Cohesion: 1.0
Nodes (1): SubjectsModule

### Community 40 - "Community 40"
Cohesion: 1.0
Nodes (1): CreateSubjectDto

### Community 41 - "Community 41"
Cohesion: 1.0
Nodes (1): Subject

### Community 42 - "Community 42"
Cohesion: 1.0
Nodes (1): UsersModule

### Community 43 - "Community 43"
Cohesion: 1.0
Nodes (1): CreateUserDto

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (1): User

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (1): NotificationsModule

### Community 46 - "Community 46"
Cohesion: 1.0
Nodes (1): BoxesModule

### Community 47 - "Community 47"
Cohesion: 1.0
Nodes (1): Box

### Community 48 - "Community 48"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Community 49"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Community 50"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Community 51"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Community 52"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Community 53"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Community 54"
Cohesion: 1.0
Nodes (1): DatabaseModule

### Community 55 - "Community 55"
Cohesion: 1.0
Nodes (1): Main Application UI

### Community 56 - "Community 56"
Cohesion: 1.0
Nodes (1): Sidebar Filter Components

### Community 57 - "Community 57"
Cohesion: 1.0
Nodes (1): Dark Mode Toggle

### Community 58 - "Community 58"
Cohesion: 1.0
Nodes (1): Review Timer Component

### Community 59 - "Community 59"
Cohesion: 1.0
Nodes (1): Card Logs Panel

### Community 60 - "Community 60"
Cohesion: 1.0
Nodes (1): NestJS Framework

## Knowledge Gaps
- **45 isolated node(s):** `AppModule`, `DatabaseModule`, `AuthModule`, `LoginDto`, `RegisterDto` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 20`** (2 nodes): `seed.ts`, `bootstrap()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 21`** (2 nodes): `AppModule`, `app.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 22`** (2 nodes): `database.module.ts`, `DatabaseModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `AuthModule`, `auth.module.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 24`** (2 nodes): `login.dto.ts`, `LoginDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 25`** (2 nodes): `register.dto.ts`, `RegisterDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 26`** (2 nodes): `jwt-auth.guard.ts`, `JwtAuthGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 27`** (2 nodes): `jwt-refresh.guard.ts`, `JwtRefreshGuard`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 28`** (2 nodes): `cards.module.ts`, `CardsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 29`** (2 nodes): `create-card.dto.ts`, `CreateCardDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 30`** (2 nodes): `update-card.dto.ts`, `UpdateCardDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 31`** (2 nodes): `review-card.dto.ts`, `ReviewCardDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 32`** (2 nodes): `Card`, `card.schema.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 33`** (2 nodes): `scheduler.module.ts`, `SchedulerModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 34`** (2 nodes): `tags.module.ts`, `TagsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 35`** (2 nodes): `create-tag.dto.ts`, `CreateTagDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 36`** (2 nodes): `tag.schema.ts`, `Tag`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 37`** (2 nodes): `card-logs.module.ts`, `CardLogsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 38`** (2 nodes): `CardLog`, `card-log.schema.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 39`** (2 nodes): `subjects.module.ts`, `SubjectsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 40`** (2 nodes): `create-subject.dto.ts`, `CreateSubjectDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 41`** (2 nodes): `subject.schema.ts`, `Subject`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 42`** (2 nodes): `users.module.ts`, `UsersModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 43`** (2 nodes): `create-user.dto.ts`, `CreateUserDto`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 44`** (2 nodes): `user.schema.ts`, `User`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 45`** (2 nodes): `notifications.module.ts`, `NotificationsModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 46`** (2 nodes): `boxes.module.ts`, `BoxesModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 47`** (2 nodes): `box.schema.ts`, `Box`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 48`** (1 nodes): `constants.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 49`** (1 nodes): `vite.config.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 50`** (1 nodes): `state.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 51`** (1 nodes): `eslint.config.mjs`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 52`** (1 nodes): `app.e2e-spec.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 53`** (1 nodes): `notification-channel.interface.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 54`** (1 nodes): `DatabaseModule`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 55`** (1 nodes): `Main Application UI`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 56`** (1 nodes): `Sidebar Filter Components`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 57`** (1 nodes): `Dark Mode Toggle`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 58`** (1 nodes): `Review Timer Component`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 59`** (1 nodes): `Card Logs Panel`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 60`** (1 nodes): `NestJS Framework`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `refreshUI()` connect `Community 1` to `Community 2`, `Community 4`, `Community 6`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `fetchWithAuth()` connect `Community 1` to `Community 8`, `Community 10`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `displayNextCardInQueue()` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `fetchWithAuth()` (e.g. with `apiFetchBoxes()` and `apiFetchSubjects()`) actually correct?**
  _`fetchWithAuth()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **Are the 9 inferred relationships involving `refreshUI()` (e.g. with `apiFetchBoxes()` and `apiFetchSubjects()`) actually correct?**
  _`refreshUI()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 3 inferred relationships involving `displayCardForReview()` (e.g. with `createCardElement()` and `showTimerUI()`) actually correct?**
  _`displayCardForReview()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `AppModule`, `DatabaseModule`, `AuthModule` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._