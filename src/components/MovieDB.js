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
  async getSource(type, value, options = null) {
    return await fetch(`${this.API_BASE}${type}?query=${value}&api_key=${this.API_KEY}`, options)
      .then((response) => response.json())
      .catch((err) => {
        throw new Error(err)
      })
  }
  async getMovies(keyword) {
    try {
      const body = await this.getSource('movie', keyword)
      return body.results
    } catch (err) {
      throw new Error(err)
    }
  }
  async test(type, append = '') {
    return await fetch(
      `https://api.themoviedb.org/3/${type}/157336?api_key=${this.API_KEY}&append_to_response=${append}`
    )
      .then((response) => console.log(response.json()))
      .catch((err) => console.error(err))
  }
}
