export default class MovieDB {
  API_KEY = '871b4ecdce7fbe11b53daefebc619fa4'
  API_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4NzFiNGVjZGNlN2ZiZTExYjUzZGFlZmViYzYxOWZhNCIsInN1YiI6IjY0YjEzMmJiYmE0ODAyMDEwNWRkNDI3NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.yajbc9LeWzrq4KyjLUYMGcD25FO_q3MpCa-8DJPQbJQ'
  API_BASE = 'https://api.themoviedb.org/3/search/'
  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.API_TOKEN}`,
    },
  }
  createPath(type, value, page) {
    return `${this.API_BASE}${type}?query=${value}&api_key=${this.API_KEY}&page=${page}`
  }
  getSource = async (type, value, page) => {
    return await fetch(this.createPath(type, value, page))
      .then((response) => response.json())
      .catch((err) => {
        throw new Error(err)
      })
  }
  async getMovies(keyword, page = 1) {
    try {
      if (!keyword.trim()) {
        throw new Error('required non empty request')
      }

      const body = await this.getSource('movie', keyword, page)

      if (!body.total_results) {
        throw new Error('no results for request')
      }
      return body
    } catch (err) {
      throw new Error(err)
    }
  }
}
