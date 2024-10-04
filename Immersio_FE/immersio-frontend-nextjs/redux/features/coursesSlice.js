import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// get all courses
export const coursesData = createAsyncThunk(
  'courses/fetchCourses',
  async () => {
    const response = await fetch('/api/course/getAllCourse')
    const data = response.json();
    return data;
  }
)
// get single courses
export const singleCourse = createAsyncThunk(
  'course/getCourseById',
  async (id) => {
    console.log(id)
    if (id !== undefined) {
      const response = await fetch(`/api/course/getCourseById/${id}`)
      const event = response.json();
      return event;
    }
  }
)

// load Course Type
export const courseType = createAsyncThunk(
  'courses/courseType',
  async () => {
    const response = await fetch('/api/course/courseType');
    const event = await response.json();
    return event;
  }
)

// load Course Level
export const courseLevel = createAsyncThunk(
  'courses/courseLevel',
  async () => {
    const response = await fetch('/api/course/courseLevel', {
      method: 'GET'
    });
    const event = response.json();
    return event;
  }
)

// load Course Tags
export const courseTags = createAsyncThunk(
  'courses/courseTags',
  async () => {
    const response = await fetch('/api/course/courseTags', {
      method: 'GET'
    });
    const event = response.json();
    console.log(event)
    return event;
  }
)

// load Course Language
export const courseLanguage = createAsyncThunk(
  'courses/courseLanguage',
  async () => {
    const response = await fetch('/api/course/courseLanguage', {
      method: 'GET'
    });
    const event = response.json();
    console.log(event)
    return event;
  }
)

// load Course Language
export const allCourseOfStudent = createAsyncThunk(
  'courses/getAllCourseOfStudent',
  async () => {
    const response = await fetch('/api/student/getAllCourseOfStudent', {
      method: 'GET'
    });
    const event = response.json();
    return event;
  }
)

// coursesSlice
export const coursesSlice = createSlice({
  name: 'courses',
  initialState: {
    allCourses: [],
    status: '',
    course: {},
    courseStatus: '',
    searchValue: '',
    searchCoursesItems: [],
    allCourseType: [],
    courseTypeStatus: '',
    allCourseLevel: [],
    courseLevelStatus: '',
    allCourseLanguage: [],
    courseLanguageStatus: '',
    allCourseTags: [],
    courseTagsStatus: '',
    languageFilter: '',
    categoryFilter: '',
    allCoursesOfStudent: []
  },
  reducers: {
    fiterCourse: (state, { payload }) => {
      if (payload.type === 'search') {
        state.searchValue = payload.data;
      }
      else if (payload.type === 'language') {
        state.languageFilter = payload.data;
      }
      else if (payload.type === 'category') {
        state.categoryFilter = payload.data;
      }

      console.log(state.languageFilter)
      console.log(state.categoryFilter)

      state.searchCoursesItems = state.allCourses.filter(course =>
        course.title.toLowerCase().includes(state.searchValue.toLowerCase()) && (state.languageFilter !== '' ? course.language.includes(state.languageFilter) : true)
        && (state.categoryFilter !== '' ? course.category.includes(state.categoryFilter) : true)
      )
    }
  },

  extraReducers: (builder) => {
    // all courses
    builder.addCase(coursesData.fulfilled, (state, action) => {
      state.allCourses = action.payload
      state.status = 'fulfilled'
    }),
      builder.addCase(coursesData.pending, (state, action) => {
        state.status = 'pending'
      })
    // single course
    builder.addCase(singleCourse.fulfilled, (state, action) => {
      state.course = action.payload
      state.courseStatus = 'fulfilled'
    }),
      builder.addCase(singleCourse.pending, (state, action) => {
        state.courseStatus = 'pending'
      })
    //course type
    builder.addCase(courseType.fulfilled, (state, action) => {
      state.allCourseType = action.payload
      state.courseTypeStatus = 'fulfilled'
    }),
      builder.addCase(courseType.pending, (state, action) => {
        state.courseTypeStatus = 'pending'
      })
    //course level
    builder.addCase(courseLevel.fulfilled, (state, action) => {
      state.allCourseLevel = action.payload
      state.courseLevelStatus = 'fulfilled'
    }),
      builder.addCase(courseLevel.pending, (state, action) => {
        state.courseLevelStatus = 'pending'
      })
    //course language
    builder.addCase(courseLanguage.fulfilled, (state, action) => {
      state.allCourseLanguage = action.payload
      state.courseLanguageStatus = 'fulfilled'
    }),
      builder.addCase(courseLanguage.pending, (state, action) => {
        state.courseLanguageStatus = 'pending'
      })
    //course tags
    builder.addCase(courseTags.fulfilled, (state, action) => {
      state.allCourseTags = action.payload
      state.courseTagsStatus = 'fulfilled'
    }),
      builder.addCase(courseTags.pending, (state, action) => {
        state.courseTagsStatus = 'pending'
      })
    // all courses of student
    builder.addCase(allCourseOfStudent.fulfilled, (state, action) => {
      state.allCoursesOfStudent = action.payload
      state.status = 'fulfilled'
    }),
      builder.addCase(allCourseOfStudent.pending, (state, action) => {
        state.status = 'pending'
      })
  },

})


export const { fiterCourse } = coursesSlice.actions
export default coursesSlice.reducer
