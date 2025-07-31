# Day 3 Learning Plan - TypeScript Advanced

## 📅 Basic Information
- **Date**: July 29, 2025
- **Duration**: 6 hours (3 sessions of 2 hours each)
- **Goal**: Master TypeScript union types, intersection types, and utility types

---

## 🕘 Morning Session (9:00-11:00)
### Content: Union Types and Intersection Types
- **Theory Study** (30 minutes): [Advanced Types](https://www.patrickzhong.com/TypeScript/zh/reference/advanced-types.html)
  - **Specific Scope**: Only learn two basic concepts from the page
    - Intersection Types - using `&` symbol
    - Union Types - using `|` symbol
  - **Learning Depth**: Understand basic syntax and simple usage only
- **Practical Coding** (90 minutes):
  - `day03_union_types.ts` - Union types practice
  - `day03_union_types.test.ts` - Test file

**Tasks**:
- Create blockchain status union type: `"pending" | "confirmed" | "failed"`
- Implement user information intersection type merging
- Write 3 test cases

---

## 🕐 Afternoon Session (14:00-16:00)
### Content: Utility Types
- **Theory Study** (20 minutes): [Utility Types](http://www.patrickzhong.com/TypeScript/zh/reference/utility-types.html)
- **Practical Coding** (100 minutes):
  - `day03_utility_types.ts` - Utility types practice
  - `day03_utility_types.test.ts` - Test file

**Tasks**:
- Use `Partial<T>` to create user update interface
- Use `Pick<T,K>` to select partial block fields
- Use `Omit<T,K>` to create new user interface

---

## 🕕 Evening Session (19:00-21:00)
### Content: Integrated Project
- **Project Development** (120 minutes):
  - `day03_mini_project.ts` - User management project
  - `day03_mini_project.test.ts` - Test file
  - `day03_summary.md` - Learning summary
  - `day03_run_all.ts` - Test runner script

**Requirements**:
- Define user types (including union type status)
- Implement user CRUD operations (using utility types)
- Use intersection types to merge user information
- Complete test coverage

---

## ✅ Completion Criteria
- [ ] Understand the difference between union types `A | B` and intersection types `A & B`
- [ ] Correctly use `Partial<T>`, `Pick<T,K>`, `Omit<T,K>`
- [ ] Complete basic functionality of user management project
- [ ] All code files run without TypeScript errors in vscode
- [ ] Complete learning summary document

---

## 📁 File Structure
```
day03_codes/
├── day03_union_types.ts
├── day03_union_types.test.ts
├── day03_utility_types.ts
├── day03_utility_types.test.ts
├── day03_mini_project.ts
├── day03_mini_project.test.ts
├── day03_summary.md
└── day03_run_all.ts
```# Day 3 Learning Plan - TypeScript Advanced

## 📅 Basic Information
- **Date**: July 29, 2025
- **Duration**: 6 hours (3 sessions of 2 hours each)
- **Goal**: Master TypeScript union types, intersection types, and utility types

---

## 🕘 Morning Session (9:00-11:00)
### Content: Union Types and Intersection Types
- **Theory Study** (30 minutes): First 1/3 of [Advanced Types](https://www.patrickzhong.com/TypeScript/zh/reference/advanced-types.html)
- **Practical Coding** (90 minutes):
  - `day03_union_types.ts` - Union types practice
  - `day03_union_types.test.ts` - Test file

**Tasks**:
- Create blockchain status union type: `"pending" | "confirmed" | "failed"`
- Implement user information intersection type merging
- Write 3 test cases

---

## 🕐 Afternoon Session (14:00-16:00)
### Content: Utility Types
- **Theory Study** (20 minutes): [Utility Types](http://www.patrickzhong.com/TypeScript/zh/reference/utility-types.html)
- **Practical Coding** (100 minutes):
  - `day03_utility_types.ts` - Utility types practice
  - `day03_utility_types.test.ts` - Test file

**Tasks**:
- Use `Partial<T>` to create user update interface
- Use `Pick<T,K>` to select partial block fields
- Use `Omit<T,K>` to create new user interface

---

## 🕕 Evening Session (19:00-21:00)
### Content: Integrated Project
- **Project Development** (120 minutes):
  - `day03_mini_project.ts` - User management project
  - `day03_mini_project.test.ts` - Test file
  - `day03_summary.md` - Learning summary
  - `day03_run_all.ts` - Test runner script

**Requirements**:
- Define user types (including union type status)
- Implement user CRUD operations (using utility types)
- Use intersection types to merge user information
- Complete test coverage

---

## ✅ Completion Criteria
- [ ] Understand the difference between union types `A | B` and intersection types `A & B`
- [ ] Correctly use `Partial<T>`, `Pick<T,K>`, `Omit<T,K>`
- [ ] Complete basic functionality of user management project
- [ ] All code files run without TypeScript errors in vscode
- [ ] Complete learning summary document

---

## 📁 File Structure
```
day03/
├── day03_union_types.ts
├── day03_union_types.test.ts
├── day03_utility_types.ts
├── day03_utility_types.test.ts
├── day03_mini_project.ts
├── day03_mini_project.test.ts
├── day03_summary.md
└── day03_run_all.ts
```