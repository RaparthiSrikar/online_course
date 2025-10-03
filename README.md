Task Overview
Build the frontend for an Online Course Management System. The application should allow:
Students: Browse courses, enroll, track progress.


Instructors: Create, update, delete courses.


Admins: Approve/reject courses and view analytics reports.


The application should be role-based, responsive, and communicate with backend APIs (or use mock APIs if backend is not available).

Core Requirements
1. User Interface & Routing
Multi-page SPA (Single Page Application) using React / Vue / Angular.


Pages required:


Login / Registration


Dashboard (role-based)


Course Catalog (students)


Course Management (instructors)


Reports (admin)


Enrollment & Progress Tracker


2. State Management
Use Redux / Context API / Vuex / Pinia for global state:


User authentication


Courses & enrollments


Progress tracking


3. API Integration
CRUD operations via REST APIs:


Users: login, registration


Courses: create, update, delete, approve, list


Enrollments: enroll, track progress


Proper handling of loading states, errors, and success messages.


4. Forms & Validation
Registration/login with client-side validation.


Course creation/update forms with validation and error messages.


5. Dynamic UI & Components
Responsive design for desktop and mobile.


Reusable components (buttons, cards, modals, tables, forms).


Conditional rendering for role-based access.


6. Reports & Charts
Admin dashboard displays:


Number of students per course


Revenue per course


Active vs completed enrollments


Use chart libraries (Chart.js / Recharts / ApexCharts).


7. Extra Features (Optional)
Toast notifications on success/error.


Dark/light mode toggle.


Search/filter courses by category, duration, or fee.
