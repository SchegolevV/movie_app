import { Alert, Layout, Spin } from 'antd'
import { Component } from 'react'

import MovieDB from '../MovieDB'
import MoviesList from '../MoviesList/movies-list'
import SearchPanel from '../SearchPanel/search-panel'

import './app.css'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      moviesData: [],
      loading: true,
      error: false,
      online: true,
    }
    this.MovieDB = new MovieDB()
    this.getFilms('drive')
  }

  async getFilms(keyword) {
    try {
      const data = await this.MovieDB.getMovies(keyword)
      this.setState({
        moviesData: data,
        loading: false,
      })
    } catch {
      this.setState({
        error: true,
        loading: false,
      })
    }
  }
  async isOnline() {
    try {
      await fetch('https://google.com')
      return true
    } catch {
      this.setState({
        online: false,
      })
    }
  }
  render() {
    const { Header, Content } = Layout
    let spin
    let errorMessage
    this.state.error
      ? (errorMessage = <Alert style={{ textAlign: 'center' }} type="warning" message="Oops! something go wrong..." />)
      : null
    this.state.loading ? (spin = <Spin size="large" style={{ display: 'block', margin: '0 auto' }} />) : null
    return (
      <Layout className="app">
        <Header>
          <SearchPanel />
        </Header>
        <Content className="app_main">
          <MoviesList data={this.state} />
          {spin}
          {errorMessage}
        </Content>
      </Layout>
    )
  }
}
