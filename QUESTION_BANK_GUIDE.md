# Question Bank Update Guide 📝

This guide explains how maintainers or educators can update or extend the question bank in **Bank Reasoning Master** without touching a single line of JavaScript or application code.

---

## 1. Where Questions Are Stored

Questions are maintained in two ways:
1. **Base JSON Repository**: `/public/data/questions.json`
2. **In-Browser Question Importer**: Available directly under the **Import & Backup** tab inside the web app.

---

## 2. Question Schema Format

Every question in the repository follows this standardized JSON structure:

```json
{
  "id": "REA-SBI-2026-PUZ-0001",
  "exam": ["SBI_CLERK", "IBPS_CLERK"],
  "phase": "PRELIMS",
  "year": 2026,
  "topic": "puzzles",
  "subtopic": "Floor Puzzle",
  "type": "PYQ_STYLE",
  "difficulty": "MEDIUM",
  "expected_time": 90,
  "question_en": "Seven persons — A, B, C, D, E, F, and G — live on seven different floors...",
  "question_hi": "सात व्यक्ति — A, B, C, D, E, F और G — एक 7 मंजिला इमारत में रहते हैं...",
  "options": [
    "Floor 1",
    "Floor 2",
    "Floor 3",
    "Floor 4",
    "Floor 5"
  ],
  "correct_answer": 2,
  "solution_en": "Step 1: Fix anchor clue. A lives on floor 3...",
  "solution_hi": "चरण 1: निश्चित आधार तय करें। A मंजिल 3 पर रहता है...",
  "shortcut": "Start with the odd floor clue to eliminate 5 out of 7 floors immediately.",
  "exam_trick": "Never test dead cases where intermediate floor gaps exceed maximum boundaries.",
  "trap": "Miscounting 'three floors between' as difference of 3 instead of 4.",
  "tags": ["floor", "7-persons", "single-variable"]
}
```

---

## 3. Field Definitions & Verification Rules

| Field | Required? | Accepted Values / Rules |
|---|---|---|
| `id` | **Yes** | Unique identifier (e.g. `REA-SBI-2026-PUZ-0001`). Must be unique across the entire database. |
| `exam` | **Yes** | Array of target exams: `["SBI_CLERK"]`, `["IBPS_CLERK"]`, `["IBPS_RRB_OA"]` or combination. |
| `phase` | **Yes** | `"PRELIMS"` or `"MAINS"`. |
| `year` | **Yes** | 4-digit year (e.g. `2026`). |
| `topic` | **Yes** | Must match one of the 22 topic IDs in `topics.json`: `puzzles`, `seating`, `syllogism`, `inequality`, `coding_decoding`, `blood_relations`, `direction_distance`, `ranking_order`, `alphanumeric_series`, `number_letter_series`, `input_output`, `data_sufficiency`, `logical_reasoning`, `statement_conclusion`, `statement_assumption`, `cause_effect`, `course_of_action`, `coded_inequality`, `coded_blood_relation`, `coded_direction`, `miscellaneous_reasoning`. |
| `subtopic` | Yes | Descriptive subtopic (e.g., `Floor Puzzle (7 floors)`). |
| `type` | **Yes** | Transparency status: `ACTUAL_PYQ`, `MEMORY_BASED_PYQ`, `REPORTED_PYQ`, `PYQ_STYLE`, or `ORIGINAL`. (Never fabricate an actual PYQ!). |
| `difficulty` | **Yes** | `"EASY"`, `"MEDIUM"`, or `"HARD"`. |
| `expected_time`| **Yes** | Target time in seconds (e.g. `15` for inequality, `90` for floor puzzle). |
| `question_en` | **Yes** | Full question text in English. |
| `question_hi` | Optional | Question text in Hindi. |
| `options` | **Yes** | Array of 4 or 5 options. |
| `correct_answer` | **Yes** | 0-indexed integer pointer to the correct option in `options` (0 = A, 1 = B, 2 = C, 3 = D, 4 = E). |
| `solution_en` | **Yes** | Detailed step-by-step textbook solution in English. |
| `solution_hi` | Optional | Solution in Hindi. |
| `shortcut` | **Yes** | Topper shortcut technique explaining the fastest exam method. |
| `exam_trick` | Optional | Key tactical advice for exam conditions. |
| `trap` | Optional | Common mistake that causes negative marks. |

---

## 4. How to Add Questions

### Method A: Direct File Edit
1. Open `/public/data/questions.json` in your code editor.
2. Append your new question object to the array.
3. Save the file. Run `npm run build` or push to GitHub — GitHub Pages will deploy immediately!

### Method B: In-Browser Question Importer (Zero Code)
1. Open the web app in any browser.
2. Click on the **Import & Backup** tab in the top navigation ribbon.
3. Paste your question JSON object or array into the textarea.
4. Click **Validate JSON**. The engine will check for:
   - Valid JSON syntax
   - Required fields
   - Duplicate ID detection
5. Click **Import Valid Questions**. The questions are immediately saved to the browser's local repository and ready for practice!

---

## 5. Adding New Official Exam Notifications

When SBI or IBPS releases a new recruitment cycle:
1. Open `/public/data/exam-config.json`.
2. Locate the corresponding exam object (`SBI_CLERK`, `IBPS_CLERK`, or `IBPS_RRB_OA`).
3. Update `latest_cycle`, `last_verified`, and any changed question counts or sectional times.
4. **Archive Preservation**: Move the previous pattern into the `archive_history` array inside that exam's object. **Never silently overwrite historical patterns!**
