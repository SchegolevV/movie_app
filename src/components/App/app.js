import { Layout } from 'antd'
import { Component } from 'react'

import MovieDB from '../MovieDB'
import MoviesList from '../MoviesList/movies-list'
import SearchPanel from '../SearchPanel/search-panel'

import './app.css'

export default class App extends Component {
  MovieDB = new MovieDB()

  state = {
    moviesData: [],
    loading: false,
    error: { status: false, text: '' },
    pages: { current: null, total: null },
    keyword: '',
  }

  componentDidMount = () => {
    this.getMovies('barbie')
  }

  componentDidUpdate(pP, prevState) {
    if (prevState.pages.current !== this.state.pages.current) {
      this.setNewPage()
    }
  }

  getMovies = async (keyword) => {
    this.setState({ loading: true, keyword: keyword })
    await this.MovieDB.getMovies(keyword)
      .then((data) => {
        this.setMovieData(data)
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  onError = (err) => {
    this.setState({
      error: { status: true, text: err.message },
      loading: false,
      pages: { current: null, total: null },
      keyword: '',
    })
    console.log(err.stack)
  }

  onChangePage = (page) => {
    this.setState(({ pages }) => {
      return { pages: { current: page, total: pages.total } }
    })
  }

  setNewPage = () => {
    this.MovieDB.getMovies(this.state.keyword, this.state.pages.current)
      .then((body) => {
        this.setState({
          moviesData: body.results,
        })
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  setMovieData = (data) => {
    this.setState({
      moviesData: data.results,
      loading: false,
      error: { status: false, text: '' },
      pages: { current: 1, total: data.total_pages },
    })
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
    return (
      <Layout className="app">
        <Header>
          <SearchPanel getMovies={this.getMovies} setData={this.setMovieData} onError={this.onError} />
        </Header>
        <Content className="app_main">
          <MoviesList data={this.state} onPageChange={this.onChangePage} />
        </Content>
      </Layout>
    )
  }
}
