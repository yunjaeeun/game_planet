import { createSlice } from '@reduxjs/toolkit'

const TournamentSlice = createSlice({
  name: 'tournament',
  initialState: {
    tournaments: [],
    currentTournament: null,
    loading: false,
    error: null
  },
  reducers: {
    setTournaments: (state, action) => {
      state.tournaments = action.payload;
    },
    setCurrentTournament: (state, action) => {
      state.currentTournament = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
})

export const { setTournaments, setCurrentTournament, setLoading, setError } = TournamentSlice.actions;
export default TournamentSlice.reducer;