import axios from "axios";

const USE_MOCK = true;

const api = axios.create({
  baseURL: "/api", 
  timeout: 8000,
});

const mock = {
  init() {
    if (!localStorage.getItem("ocms_data")) {
      const seed = {
        courses: [
                { id: 1, title: "React for Beginners", instructorId: 2, category: "Web", fee: 0, approved: true, enrolled: [], progress: {} },
                { id: 2, title: "Advanced Node", instructorId: 2, category: "Backend", fee: 499, approved: true, enrolled: [], progress: {} },
                { id: 3, title: "Python for Data Science", instructorId: 2, category: "Data Science", fee: 599, approved: true, enrolled: [], progress: {} },
                { id: 4, title: "Machine Learning Basics", instructorId: 2, category: "AI/ML", fee: 699, approved: true, enrolled: [], progress: {} },
                { id: 5, title: "Django Web Development", instructorId: 2, category: "Backend", fee: 399, approved: true, enrolled: [], progress: {} },
                { id: 6, title: "Vue.js Essentials", instructorId: 2, category: "Web", fee: 299, approved: true, enrolled: [], progress: {} },
                { id: 7, title: "Angular Fundamentals", instructorId: 2, category: "Web", fee: 399, approved: true, enrolled: [], progress: {} },
                { id: 8, title: "Java Spring Boot", instructorId: 2, category: "Backend", fee: 499, approved: true, enrolled: [], progress: {} },
                { id: 9, title: "C++ for Beginners", instructorId: 2, category: "Programming", fee: 199, approved: true, enrolled: [], progress: {} },
                { id: 10, title: "JavaScript Advanced Concepts", instructorId: 2, category: "Web", fee: 299, approved: true, enrolled: [], progress: {} },
                { id: 11, title: "React Native Mobile Apps", instructorId: 2, category: "Mobile", fee: 399, approved: true, enrolled: [], progress: {} },
                { id: 12, title: "SQL & Databases", instructorId: 2, category: "Database", fee: 299, approved: true, enrolled: [], progress: {} }
],
                nextIds: { user: 4, course: 13 },
      };
      localStorage.setItem("ocms_data", JSON.stringify(seed));
    }
  },

  getData() {
    return JSON.parse(localStorage.getItem("ocms_data"));
  },

  saveData(data) {
    localStorage.setItem("ocms_data", JSON.stringify(data));
    return data;
  },

  async login({ email, password }) {
    this.init();
    const data = this.getData();
    const u = data.users.find((x) => x.email === email && x.password === password);
    if (!u) throw new Error("Invalid credentials");
    // return user object without password
    const { password: _p, ...userSafe } = u;
    return userSafe;
  },

  async register({ fullName, email, password, role = "student" }) {
    this.init();
    const data = this.getData();
    if (data.users.some((u) => u.email === email)) throw new Error("Email already registered");
    const id = data.nextIds.user++;
    const user = { id, email, password, role, fullName };
    data.users.push(user);
    this.saveData(data);
    const { password: _p, ...userSafe } = user;
    return userSafe;
  },

  async listCourses({ onlyApproved = true } = {}) {
    this.init();
    const data = this.getData();
    return data.courses.filter((c) => (onlyApproved ? c.approved : true));
  },

  async getCourse(id) {
    this.init();
    const data = this.getData();
    const c = data.courses.find((x) => x.id === Number(id));
    if (!c) throw new Error("Course not found");
    return c;
  },

  async createCourse(payload) {
    this.init();
    const data = this.getData();
    const id = data.nextIds.course++;
    const course = { id, ...payload, approved: false, enrolled: [], progress: {} };
    data.courses.push(course);
    this.saveData(data);
    return course;
  },

  async updateCourse(id, update) {
    this.init();
    const data = this.getData();
    const idx = data.courses.findIndex((x) => x.id === Number(id));
    if (idx === -1) throw new Error("Course not found");
    data.courses[idx] = { ...data.courses[idx], ...update };
    this.saveData(data);
    return data.courses[idx];
  },

  async deleteCourse(id) {
    this.init();
    const data = this.getData();
    data.courses = data.courses.filter((x) => x.id !== Number(id));
    this.saveData(data);
    return true;
  },

  async enroll(courseId, userId) {
    this.init();
    const data = this.getData();
    const course = data.courses.find((c) => c.id === Number(courseId));
    if (!course) throw new Error("Course not found");
    if (!course.enrolled.includes(userId)) course.enrolled.push(userId);
    course.progress[userId] = course.progress[userId] || { completed: false, percent: 0 };
    this.saveData(data);
    return course;
  },

  async updateProgress(courseId, userId, progress) {
    this.init();
    const data = this.getData();
    const course = data.courses.find((c) => c.id === Number(courseId));
    if (!course) throw new Error("Course not found");
    course.progress[userId] = { ...course.progress[userId], ...progress };
    this.saveData(data);
    return course.progress[userId];
  },

  async approveCourse(id, approved = true) {
    return this.updateCourse(id, { approved });
  },
};

export default {
  // wrapper
  async call(method, path, payload) {
    if (USE_MOCK) {
      // basic routing
      try {
        if (path === "/auth/login") return await mock.login(payload);
        if (path === "/auth/register") return await mock.register(payload);
        if (path === "/courses" && method === "get") return await mock.listCourses({ onlyApproved: true });
        if (path.startsWith("/courses/") && method === "get") {
          const id = path.split("/")[2];
          return await mock.getCourse(id);
        }
        if (path === "/courses" && method === "post") return await mock.createCourse(payload);
        if (path.startsWith("/courses/") && method === "put") {
          const id = path.split("/")[2];
          return await mock.updateCourse(id, payload);
        }
        if (path.startsWith("/courses/") && method === "delete") {
          const id = path.split("/")[2];
          return await mock.deleteCourse(id);
        }
        if (path.endsWith("/enroll") && method === "post") {
          const id = path.split("/")[2];
          return await mock.enroll(id, payload.userId);
        }
        if (path.endsWith("/progress") && method === "post") {
          const id = path.split("/")[2];
          return await mock.updateProgress(id, payload.userId, payload.progress);
        }
        if (path.endsWith("/approve") && method === "post") {
          const id = path.split("/")[2];
          return await mock.approveCourse(id, payload.approved);
        }
        // fallback
        throw new Error("Unknown mock route: " + method + " " + path);
      } catch (err) {
        throw err;
      }
    } else {
      // real backend usage example
      const res = await api.request({ method, url: path, data: payload });
      return res.data;
    }
  },
};
