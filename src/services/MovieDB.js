export default class MovieDB {
  API_KEY = '871b4ecdce7fbe11b53daefebc619fa4'
  API_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzFiNGVjZGNlN2ZiZTExYjUzZGFlZmViYzYxOWZhNCIsInN1YiI6IjY0YjEzMmJiYmE0ODAyMDEwNWRkNDI3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yajbc9LeWzrq4KyjLUYMGcD25FO_q3MpCa-8DJPQbJQ'
  API_BASE = 'https://api.themoviedb.org'
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.API_TOKEN}`,
    },
  }

  getSource = async (url, options = null) => {
    try {
      const response = await fetch(`${this.API_BASE}${url}`, options)
      return await response.json()
    } catch (err) {
      throw new Error(err)
    }
  }
  getMovies = async (keyword, page = 1) => {
    if (!keyword.trim()) {
      throw new Error('gde film? :(')
    }
    const path = `${this.API_BASE}/3/search/movie?api_key=${this.API_KEY}&query=${keyword}&page=${page}`

    try {
      const body = await fetch(path).then((response) => response.json())
      if (!body.total_results) {
        throw new Error('no results for request')
      }
      return body
    } catch (err) {
      throw new Error(err)
    }
  }
  createGuestSession = async () => {
    try {
      const response = await fetch(`${this.API_BASE}/3/authentication/guest_session/new`, this.options)
      return await response.json()
    } catch {
      throw new Error('Failed to create guest session. Try to reload the page.')
    }
  }
  getGenres = async () => {
    try {
      const response = await fetch(`${this.API_BASE}/3/genre/movie/list?api_key=${this.API_KEY}`).then((response) =>
        response.json()
      )
      return await response.genres
    } catch (err) {
      throw new Error(err)
    }
  }
  getRatedMovies = async (id, page = 1) => {
    const path = `${this.API_BASE}/3/guest_session/${id}/rated/movies?page=${page}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.API_TOKEN}`,
      },
    }

    try {
      const response = await fetch(path, options).then((response) => response.json())
      console.log(response)
      return await response
    } catch (err) {
      throw new Error(err)
    }
  }
  addMovieRate = async (rate, movieId, guestSessionId) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.API_TOKEN}`,
      },
      body: JSON.stringify({ value: rate }),
    }
    const path = `${this.API_BASE}/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}'`

    try {
      const response = await fetch(path, options).then((res) => res.json())
      console.log(response)
      return response
    } catch (err) {
      throw new Error(err)
    }
  }
}
