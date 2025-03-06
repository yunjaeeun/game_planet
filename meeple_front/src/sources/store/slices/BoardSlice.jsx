import { createSlice } from '@reduxjs/toolkit'

const BoardSlice = createSlice({
  name: 'board',
  initialState: {
    posts: [],
    currentPost: null,
    loading: false,
    error: null
  },
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
})

export const { setPosts, setCurrentPost, setLoading, setError } = BoardSlice.actions;
export default BoardSlice.reducer;