import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Item from 'antd/lib/list/Item';

// get all courses
export const instructorsData = createAsyncThunk(
    'instructor/getAllInstructor',
    async () => {
        const response = await fetch('/api/instructor/getAllInstructor')
        const data = response.json();
        return data;
    }
)

// get single courses
export const singleInstructor = createAsyncThunk(
    'instructor/singleInstructor',
    async (id) => {
        if (id !== undefined) {
            const response = await fetch(`/api/instructor/getInstructorById/${id}`)
            const event = response.json();
            return event;
        }
    }
)

export const instructorsSlice = createSlice({
    name: 'instructors',
    initialState: {
        allInstructors: [],
        searchInstructorsItems: [],
        languageFilter: '',
        categoryFilter: '',
        dayTimerFilter: [],
        timeOfDayTimerFilter: [],
        dateFilter: '',
        instructor: {},
        instructorStatus: ''
    },
    reducers: {
        fiterInstructor: (state, { payload }) => {

            if (payload.type === 'language') {
                state.languageFilter = payload.data;
            }
            else if (payload.type === 'category') {
                state.categoryFilter = payload.data;
            }
            else if (payload.type === 'dayTimer') {
                state.dayTimerFilter = payload.data
            }
            else if (payload.type === 'timeOfDayTimer') {
                state.timeOfDayTimerFilter = payload.data
            }

            let instructorSearch = [...state.allInstructors];
            let weekDayArr = []

            if (state.dayTimerFilter.length > 0) {
                weekDayArr = [...state.dayTimerFilter]
            }
            else if (state.dayTimerFilter.length === 0 && state.timeOfDayTimerFilter.length > 0) { // Truong hop chi filter time of day
                weekDayArr = [{ "value": "0" }, { "value": "1" }, { "value": "2" }, { "value": "3" }, { "value": "4" }, { "value": "5" }, { "value": "6" }]
            }

            if (weekDayArr.length > 0) {
                instructorSearch = []
                weekDayArr.forEach((item) => {
                    if (state.timeOfDayTimerFilter.length > 0) {
                        state.timeOfDayTimerFilter.forEach((item1) => {
                            // neu co search ngay thi filter theo list ngay
                            //Lay nhung ngay co available
                            let itemData = state.allInstructors.filter(instructor => {
                                var timeAvailable = instructor.timeAvailable
                                var dayOfWeek_TimeStart = timeAvailable["dayOfWeek_" + item.value].timeStart
                                var dayOfWeek_TimeEnd = timeAvailable["dayOfWeek_" + item.value].timeEnd

                                return (dayOfWeek_TimeStart >= 0 && dayOfWeek_TimeEnd > 0)
                                    && ((dayOfWeek_TimeStart >= item1.timeStart && dayOfWeek_TimeStart <= item1.timeEnd) ||
                                        (dayOfWeek_TimeEnd <= item1.timeEnd && dayOfWeek_TimeEnd >= item1.timeStart)
                                    )
                            })
                            if (itemData.length > 0) {
                                instructorSearch.push(itemData[0]);
                            }
                        })
                    }
                    else {

                        //Lay nhung ngay co available
                        let itemData = state.allInstructors.filter(instructor => {
                            var timeAvailable = instructor.timeAvailable
                            return timeAvailable["dayOfWeek_" + item.value].timeStart >= 0 && timeAvailable["dayOfWeek_" + item.value].timeEnd > 0
                        })

                        if (itemData.length > 0) {
                            instructorSearch.push(itemData[0]);
                        }
                    }
                })
            }


            console.log('instructorSearch', instructorSearch)

            state.searchInstructorsItems = instructorSearch.filter(instructor =>
                (state.languageFilter !== '' ? instructor.languageTeaching.includes(state.languageFilter) : true)
            )
        }
    },
    extraReducers: (builder) => {
        builder.addCase(instructorsData.fulfilled, (state, action) => {
            console.log(action.payload)
            state.allInstructors = action.payload
            state.status = 'fulfilled'
        }),
            builder.addCase(instructorsData.pending, (state, action) => {
                state.status = 'pending'
            })
        builder.addCase(singleInstructor.fulfilled, (state, action) => {
            state.instructor = action.payload
            state.instructorStatus = 'fulfilled'
        }),
            builder.addCase(singleInstructor.pending, (state, action) => {
                state.instructorStatus = 'pending'
            })
    }
})

export const { fiterInstructor } = instructorsSlice.actions
export default instructorsSlice.reducer