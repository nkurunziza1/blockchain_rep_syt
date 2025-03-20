import { v4 as uuidv4 } from "uuid";
import { StableBTreeMap, Principal } from "azle";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";

type Department = {
  id: string;
  name: string;
  facultyCount: number;
  faculty: string[];
  universityId: string;
  hodId: string;
};

type University = {
  id: string;
  name: string;
  location: string;
  departments: Department[];
  establishedYear: number;
  owner: string;
  ranking: number;
};

type Student = {
  id: string;
  name: string;
  universityId: string;
  programId: string;
  year: number;
};

type Teacher = {
  id: string;
  name: string;
  universityId: string;
  courses: string[];
};

type HOD = {
  id: string;
  name: string;
  universityId: string;
  departmentId: string;
};

type Program = {
  id: string;
  name: string;
  departmentId: string;
  years: number;
  courses: string[];
};

enum Roles {
  student = "students",
  teacher = "teacher",
  HOD = "HOD",
  admin = "admin",
}

export type User = {
  id: string;
  email: string;
  password: string;
  role: Roles;
  sessionId: string;
  firstName: string;
  lastName: string;
  phone: string;
  regNumber: string;
  studentInfo?: StudentInfo;
  teacherInfo?: TeacherInfo;
};

export type StudentInfo = {
  student_id: string;
  full_name: {
    first: string;
    middle: string;
    last: string;
  };
  registration_id: string;
  program: string;
  year_of_study: number;
  email: string;
  phone_number: string;
  school: string;
  department: string;
  enrolled_courses: Array<{
    course_id: string;
    course_name: string;
    duration_in_hours: number;
    credits: number;
    course_status: courseStatus;
  }>;
  status: string;
  gpa: number;
  date_of_birth: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
  study_progress: {
    completed_modules: number;
    total_modules: number;
  };
};

export type TeacherInfo = {
  teacher_id: string;
  name: {
    first: string;
    last: string;
  };
  full_name: {
    first: string;
    middle: string;
    last: string;
  };
  registration_id: string;
  status: string;
  email: string;
  phone_number: string;
  registered_courses: Array<{
    course_id: string;
    course_name: string;
    course_credits: number;
    course_status: courseStatus;
  }>;
  experience_years: number;
  specialization: string;
};

enum courseStatus {
  Pending = "pending",
  OnGoing = "on-going",
  Completed = "completed",
  Paused = "Paused",
}

type UserProfile = {
  id: string;
  firstName: string;
  userId: string;
  lastName: string;
  email: string;
  phone: string;
  profilePic?: string;
  coverPic?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  country?: string;
  district?: string;
  regNumber?: string;
  role?: Roles;
  descriptions?: string;
  title?: string;
  province?: string;
};

type MarksCategory = {
  category: string;
  marks: number;
};

type Course = {
  courseName: string;
  marks: MarksCategory[];
  createdAt: Date;
  updatedAt: Date;
};

type StudentMarksRecord = {
  id: string;
  studentRegNumber: string;
  name: string;
  email: string;
  department?: string;
  university?: string;
  year: number;
  program: string;
  courses: Course[];
  createdAt: Date;
  updatedAt: Date;
};

type MarksVersion = {
  id: string;
  studentMarks: StudentMarksRecord;
  timestamp: bigint;
  changedBy: string;
  changeType: "CREATE" | "UPDATE" | "DELETE";
  previousVersionId: string | null;
};

// Database Initialization
const userProfiles = StableBTreeMap<string, UserProfile>(3);
const users = StableBTreeMap<string, User>(0);
const studentMarks = StableBTreeMap<string, StudentMarksRecord>(4);
const marksHistory = StableBTreeMap<string, MarksVersion[]>(1);

const app = express();
app.use(cors());

app.use(express.json());

// Signup endpoint
app.post("/auth/signup", async (req, res) => {
  const {
    email,
    password,
    role,
    firstName,
    lastName,
    phone,
    regNumber,
    studentInfo,
    teacherInfo,
  } = req.body;
  const existingUser = users.values().find((user) => user.email === email);
  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "Email already exists" });
  }
  const sessionId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 8);
  const authUser: User = {
    id: uuidv4(),
    firstName,
    lastName,
    phone,
    regNumber,
    email,
    password: hashedPassword,
    role,
    sessionId,
    studentInfo: role === "student" ? studentInfo : undefined,
    teacherInfo: role === "teacher" ? teacherInfo : undefined,
  };
  users.insert(authUser.id, authUser);
  return res.status(200).json({
    success: true,
    message: "Signup successful",
    sessionId,
    userId: authUser.id,
    role: authUser.role,
  });
});

// Middleware for session verification
const verifySession = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const user = Array.from(users.values()).find((u) => u.sessionId === token);

  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
};

// Protected user profile endpoint
app.get("/user", verifySession, async (req, res) => {
  const user = users.values();
  res.json(user);
});

app.get("/students", verifySession, async (req, res) => {
  const isUserAeTeacher = (req as any).user.role;
  console.log("req?.user.role", (req as any).user.role);
  if (!isUserAeTeacher) {
    return res.status(403).json({ message: "Resources forbidden" });
  }
  console.log("role____", Roles.student);
  const students = users.values().filter((user) => user.role === Roles.student);
  return res.status(200).json(students);
});

// Login endpoint
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const authUser = Array.from(users.values()).find(
    (user) => user.email === email
  );

  if (!authUser) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password, authUser.password);
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate new session ID on login
  const sessionId = uuidv4();
  authUser.sessionId = sessionId;
  users.insert(authUser.id, authUser);

  const userProfile = Array.from(userProfiles.values()).find(
    (profile) => profile.id === authUser.id
  );

  return res.json({
    success: true,
    message: "Login successful",
    sessionId,
    userId: authUser.id,
    role: authUser.role,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    phone: authUser.phone,
    email: authUser.email,
    user: userProfile,
  });
});

// Logout endpoint
app.post("/auth/logout", verifySession, (req, res) => {
  try {
    // Get the user from the verified session
    const user = (req as any).user;

    // Invalidate the session by clearing the sessionId
    user.sessionId = "";
    users.insert(user.id, user);

    return res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during logout",
    });
  }
});

app.post("/profile/create", verifySession, async (req, res) => {
  const userId = (req as any).user.id;
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      country,
      district,
      profilePic,
      coverPic,
      title,
      province,
      descriptions,
    } = req.body;

    const { regNumber, role } = (req as any).user;
    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }
    const existingProfile = Array.from(userProfiles.values()).find(
      (profile) => profile.email === email
    );

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    const newProfile: UserProfile = {
      id: uuidv4(),
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      gender,
      userId,
      country,
      district,
      profilePic: profilePic,
      coverPic: coverPic,
      regNumber,
      role: role,
      descriptions: descriptions,
      title: title,
      province: province,
    };

    userProfiles.insert(newProfile.id, newProfile);
    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile: newProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
});

// Get All Profiles Endpoint (Admin/Authorized Users)
app.get("/profiles", verifySession, (req, res) => {
  try {
    const user = (req as any).user;

    if (user.role !== Roles.admin) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access. Admin rights required.",
      });
    }

    const profiles = Array.from(userProfiles.values());
    return res.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Update Profile Endpoint
app.put("/profile/:id", verifySession, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingProfile = userProfiles.get(id);
    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const updatedProfile = {
      ...existingProfile,
      ...updateData,
      id,
    };

    userProfiles.insert(id, updatedProfile);
    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/profile/me", verifySession, (req, res) => {
  try {
    const user = (req as any).user;

    const userProfile = Array.from(userProfiles.values()).find(
      (profile) => profile.userId === user.id
    );
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }
    return res.json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Error fetching own profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/public/profile/:regNumber", (req, res) => {
  try {
    const { regNumber } = req.params;

    const userProfile = Array.from(userProfiles.values()).find(
      (profile) => profile.regNumber === regNumber
    );

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    const publicProfile = {
      id: userProfile.id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      phone: userProfile.phone,
      profilePic: userProfile.profilePic,
      coverPic: userProfile.coverPic,
      regNumber: userProfile.regNumber,
      country: userProfile.country,
      district: userProfile.district,
    };

    return res.json({
      success: true,
      profile: publicProfile,
    });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

app.get("/public/profiles/search", (req, res) => {
  try {
    const { name, country, district, page = 1, limit = 10 } = req.query;

    // Filter profiles based on search criteria
    let filteredProfiles = Array.from(userProfiles.values());

    if (country) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.country === country
      );
    }

    if (district) {
      filteredProfiles = filteredProfiles.filter(
        (profile) => profile.district === district
      );
    }

    if (name) {
      filteredProfiles = filteredProfiles.filter(
        (profile) =>
          profile.firstName
            .toLowerCase()
            .includes(name.toString().toLowerCase()) ||
          profile.lastName.toLowerCase().includes(name.toString().toLowerCase())
      );
    }

    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = Number(page) * Number(limit);

    const paginatedProfiles = filteredProfiles
      .slice(startIndex, endIndex)
      .map((profile) => ({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        profilePic: profile.profilePic,
        coverPic: profile.coverPic,
        country: profile.country,
        district: profile.district,
      }));

    return res.json({
      success: true,
      page: Number(page),
      totalProfiles: filteredProfiles.length,
      totalPages: Math.ceil(filteredProfiles.length / Number(limit)),
      profiles: paginatedProfiles,
    });
  } catch (error) {
    console.error("Error searching profiles:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create marks endpoint
app.post("/marks/create", verifySession, (req, res) => {
  try {
    const user = (req as any).user;
    if (user.role !== Roles.teacher && user.role !== Roles.HOD) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and HODs can create marks",
      });
    }

    const {
      studentRegNumber,
      name,
      email,
      year,
      course: courseName,
      marks,
      program,
      university,
      department,
    } = req.body;

    // Find existing student record
    const existingStudent = Array.from(studentMarks.values()).find(
      (record) => record.studentRegNumber === studentRegNumber
    );

    if (existingStudent) {
      // Check if course already exists
      const existingCourse = existingStudent.courses.find(
        (c) => c.courseName === courseName
      );

      if (existingCourse) {
        // Check for category duplicates within the course
        const duplicateCategories = marks.filter((newMark: any) =>
          existingCourse.marks.some(
            (existingMark) => existingMark.category === newMark.category
          )
        );

        if (duplicateCategories.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Marks already exist for categories: ${duplicateCategories
              .map((m: any) => m.category)
              .join(", ")}`,
          });
        }

        // Add new marks to existing course
        existingCourse.marks.push(...marks);
        existingCourse.updatedAt = new Date();
      } else {
        // Add new course to existing student record
        existingStudent.courses.push({
          courseName,
          marks,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      existingStudent.updatedAt = new Date();
      studentMarks.insert(existingStudent.id, existingStudent);

      return res.status(200).json({
        success: true,
        message: "Marks updated successfully",
        studentRecord: existingStudent,
      });
    }

    // Create new student record if none exists
    const newStudentRecord: StudentMarksRecord = {
      id: uuidv4(),
      studentRegNumber,
      name,
      email,
      department,
      university,
      year,
      program,
      courses: [
        {
          courseName,
          marks,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const versionRecord: MarksVersion = {
      id: uuidv4(),
      studentMarks: newStudentRecord,
      timestamp: BigInt(Date.now()),
      changedBy: user.id,
      changeType: "CREATE",
      previousVersionId: null,
    };

    studentMarks.insert(newStudentRecord.id, newStudentRecord);
    marksHistory.insert(newStudentRecord.id, [versionRecord]);

    return res.status(201).json({
      success: true,
      message: "Student record created successfully",
      studentRecord: newStudentRecord,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating/updating marks",
    });
  }
});

app.post("/marks/update/:id", verifySession, (req, res) => {
  try {
    const user = (req as any).user;
    if (user.role !== Roles.teacher && user.role !== Roles.HOD) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and HODs can update marks",
      });
    }

    const { id } = req.params;
    const updateData = req.body;
    const existingMarks = studentMarks.get(id);

    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    // Create new version record
    const previousVersions = marksHistory.get(id) || [];
    const previousVersion = previousVersions[previousVersions.length - 1];

    const updatedMarks = {
      ...existingMarks,
      ...updateData,
      id,
      updatedAt: new Date(),
    };

    // Create version record
    const versionRecord: MarksVersion = {
      id: uuidv4(),
      studentMarks: updatedMarks,
      timestamp: BigInt(Date.now()),
      changedBy: user.id,
      changeType: "UPDATE",
      previousVersionId: previousVersion?.id || null,
    };

    // Update current state
    studentMarks.insert(id, updatedMarks);

    // Add to version history
    marksHistory.insert(id, [...previousVersions, versionRecord]);

    return res.json({
      success: true,
      message: "Marks updated successfully",
      marks: updatedMarks,
      versionId: versionRecord.id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating marks",
    });
  }
});

//Get marks

app.get("/marks", verifySession, async (req, res) => {
  const marks = studentMarks.values();
  return res.json(marks);
});

// Delete marks endpoint
app.delete("/marks/:id", verifySession, (req, res) => {
  try {
    const user = (req as any).user;
    if (user.role !== Roles.teacher && user.role !== Roles.HOD) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and HODs can delete marks",
      });
    }

    const { id } = req.params;
    const existingMarks = studentMarks.get(id);

    if (!existingMarks) {
      return res.status(404).json({
        success: false,
        message: "Marks not found",
      });
    }

    studentMarks.remove(id);

    return res.json({
      success: true,
      message: "Marks deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting marks",
    });
  }
});

// Get student marks endpoint
app.get("/marks/:regNumber", verifySession, (req, res) => {
  try {
    const { regNumber } = req.params;
    const allMarks = Array.from(studentMarks.values())
      .filter((mark) => mark.studentRegNumber === regNumber)
      .sort((a, b) => b.year - a.year);

    return res.json({
      success: true,
      marks: allMarks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching marks",
    });
  }
});

app.get("/marks/history/:regNumber", verifySession, (req, res) => {
  try {
    const { regNumber } = req.params;
    // Get date filters from query parameters
    const { startDate, endDate, timeZone = "UTC" } = req.query;

    // Get all marks values and their histories
    const allMarks = studentMarks.values();
    const studentRecord = allMarks.find(
      (mark) => mark.studentRegNumber === regNumber
    );

    if (!studentRecord) {
      return res.status(404).json({
        success: false,
        message: "Student marks not found",
      });
    }

    // Get version history for this student
    const versions = marksHistory.get(studentRecord.id) || [];

    // Apply date filtering if provided
    let filteredVersions = versions;

    if (startDate || endDate) {
      // Convert dates to timestamps, handling different formats
      const start = startDate ? new Date(startDate as string).getTime() : 0;
      const end = endDate ? new Date(endDate as string).getTime() : Date.now();

      // Validate date inputs
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid date format. Please use YYYY-MM-DD or ISO 8601 format",
        });
      }

      // Apply the date filter
      filteredVersions = versions.filter((version) => {
        const versionTimestamp = Number(version.timestamp);
        return versionTimestamp >= start && versionTimestamp <= end;
      });

      // Add debugging information if requested
      if (req.query.debug === "true") {
        console.log({
          startDate: new Date(start).toISOString(),
          endDate: new Date(end).toISOString(),
          totalVersions: versions.length,
          filteredVersions: filteredVersions.length,
          dateRange: `${new Date(start).toLocaleDateString()} to ${new Date(
            end
          ).toLocaleDateString()}`,
        });
      }
    }

    // Transform filtered versions for response
    const historyWithChanges = filteredVersions.map((version, index) => {
      return {
        versionId: version.id,
        timestamp: new Date(Number(version.timestamp)).toISOString(),
        changedBy: version.changedBy,
        changeType: version.changeType,
        marksState: version.studentMarks,
        // Add formatted date for easy reading
        formattedDate: new Date(Number(version.timestamp)).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };
    });

    return res.json({
      success: true,
      studentInfo: {
        regNumber: studentRecord.studentRegNumber,
        name: studentRecord.name,
      },
      filterApplied: {
        startDate: startDate
          ? new Date(startDate as string).toISOString()
          : null,
        endDate: endDate ? new Date(endDate as string).toISOString() : null,
        totalRecords: versions.length,
        filteredRecords: filteredVersions.length,
      },
      history: historyWithChanges,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error fetching marks history",
      error: error.message,
    });
  }
});

app.use(express.static("/dist"));
app.listen();
