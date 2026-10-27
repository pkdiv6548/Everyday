# P1 Step 4 — Category content target and Weather API verification

**Repository:** `pkdiv6548/Everyday`  
**Scope:** T11 + T12  
**Status:** In progress — T12 verified; T11 remains open.

## T12 — Weather API browser scenarios

Weather API browser validation passed in Content Audit [run 40438725452](https://github.com/pkdiv6548/Everyday/actions/runs/40438725452). The automated scenarios cover:

- Malformed forecast payload rejection and a successful retry.
- Seven-day forecast rendering and date/unit labels.
- Unknown city and invalid coordinates.
- Location permission denial.
- Stale geocoding/forecast response protection so an older request cannot overwrite a newer selection.
- Hindi labels remaining available after API validation.

This closes T12 within the automated browser-test scope. It is not a claim of manual testing on every physical device or network condition.

## T11 — Reviewed category content target

The category coverage audit on Content Audit [run 40438952038](https://github.com/pkdiv6548/Everyday/actions/runs/40438952038) reported 571 dynamic story records and 55 static cards. The plan requires at least 50 relevant stories in each of 19 categories. Current coverage:

| Category | Current | Target | Additional reviewed stories needed |
|---|---:|---:|---:|
| Human Body | 34 | 50 | 16 |
| Space & Universe | 31 | 50 | 19 |
| Nature & Wildlife | 34 | 50 | 16 |
| Science Explained | 32 | 50 | 18 |
| Psychology & Mind | 32 | 50 | 18 |
| History & Civilizations | 31 | 50 | 19 |
| Technology & AI | 34 | 50 | 16 |
| Everyday Mysteries | 31 | 50 | 19 |
| Food Science | 33 | 50 | 17 |
| Micro World | 32 | 50 | 18 |
| Materials & Objects | 31 | 50 | 19 |
| Geography & World | 35 | 50 | 15 |
| Mathematics & Numbers | 32 | 50 | 18 |
| Plants & Botany | 33 | 50 | 17 |
| Inventions & Discoveries | 31 | 50 | 19 |
| Unsolved Questions | 31 | 50 | 19 |
| Future & Career Intelligence | 31 | 50 | 19 |
| **Total across the 17 under-target categories** | — | — | **302** |

Earth & Weather and Optical Illusions already meet the 50-story target. The 302 figure is a content gap, not a request to duplicate stories or blindly add category tags. Each new story must have a distinct, topic-matched explanation, meaningful Hindi/English parity, a credible topic-specific source, a relevant unique local image with descriptive alt text, and no duplicate slug or boilerplate.

## Execution decision

Do not mark Step 4 complete until T11's category gaps are filled with reviewed content and the category-coverage/content-integrity checks pass. The 424 generic-template records remain unpublished and must not be counted as ready content. Work should proceed in small editorial batches, beginning with the categories with the largest gap, and each batch must be checked before merging.

## Verification boundary

- Automated Weather API scenarios: passed.
- Category coverage: measured; target not met.
- T11: open.
- T12: complete within automated-test scope.
- Step 4 overall: in progress.
