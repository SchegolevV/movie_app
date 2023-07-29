import { Tabs, Pagination } from 'antd'
import { Component } from 'react'

import MovieDB from '../../services/MovieDB'
import MoviesList from '../MoviesList/movies-list'
import SearchPanel from '../SearchPanel/search-panel'
import { Provider } from '../../context/context.js'

import './app.css'

export default class App extends Component {
  MovieDB = new MovieDB()

  state = {
    moviesData: [],
    loading: false,
    error: { status: false, text: '' },
    pages: { current: null, total: null },
    keyword: '',
    guestID: '',
    tab: 'search',
    genres: [],
    ratedMovies: [],
  }

  tabs = [
    {
      key: 'search',
      label: 'Search',
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ]

  componentDidMount = () => {
    this.createGuestSession()
    this.getMovies('barbie')
    this.getGenres()
  }

  componentDidUpdate(pP, prevState) {
    if (prevState.pages.current !== this.state.pages.current) {
      this.setNewPage()
    }
    if (prevState.ratedMovies !== this.state.ratedMovies) {
      this.getRatedMovies()
    }
  }

  createGuestSession = () => {
    this.MovieDB.createGuestSession()
      .then((guest) => {
        this.setState({
          guestID: guest.guest_session_id,
        })
      })
      .catch((err) => this.onError(err))
  }

  getMovies = (keyword, page) => {
    this.setState({ loading: true, keyword: keyword })
    this.MovieDB.getMovies(keyword, page)
      .then((data) => {
        this.setMovieData(data)
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  getGenres = () => {
    this.MovieDB.getGenres()
      .then((genres) => {
        this.setState({
          genres: genres,
        })
      })
      .catch((err) => this.onError(err))
  }

  onError = (err) => {
    this.setState({
      error: { status: true, text: err.message },
      loading: false,
      pages: { current: null, total: null },
      keyword: '',
    })
    console.error(err.stack)
  }

  onChangePage = (page) => {
    this.setState(({ pages }) => {
      return { pages: { current: page, total: pages.total } }
    })
  }

  onChangeTab = (activeKey) => {
    const newValue = activeKey === 'search' ? 'search' : 'rated'
    this.setState({
      tab: newValue,
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

  addRated = (rate, movieID) => {
    if (this.state.ratedMovies.find((movie) => movie.id === movieID)) {
      return
    }

    this.MovieDB.addMovieRate(rate, movieID, this.state.guestID)

    this.setState(({ ratedMovies }) => {
      const newMovie = this.state.moviesData.find((movie) => movie.id === movieID)
      const newList = ratedMovies.toSpliced(-1, 0, newMovie)
      return {
        ratedMovies: newList,
      }
    })
  }
  getRatedMovies = () => {
    this.MovieDB.getRatedMovies(this.state.guestID)
  }

  render() {
    return (
      <section className="app">
        <header style={{ backgroundColor: 'white' }}>
          <Tabs
            centered
            activeKey={this.state.tab}
            items={this.tabs}
            onChange={(activeTab) => this.onChangeTab(activeTab)}
            className="app_tabs"
            destroyInactiveTabPane={false}
          />
        </header>
        <main className="app_main">
          <Provider value={{ state: this.state, addRated: this.addRated }}>
            <SearchPanel getMovies={this.getMovies} setData={this.setMovieData} tab={this.state.tab} />
            <MoviesList />
            <Pagination
              style={{ width: 'fit-content', margin: '0 auto' }}
              showSizeChanger={false}
              current={this.state.pages.current}
              total={this.state.pages.total}
              onChange={(page) => this.onChangePage(page)}
            />
          </Provider>
        </main>
      </section>
    )
  }
}
