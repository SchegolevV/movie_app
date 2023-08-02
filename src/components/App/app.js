import { Tabs, Pagination } from 'antd'
import React, { Component } from 'react'

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
    pages: { current: 1, total: null },
    tab: 'search',
    genres: [],
    ratedMovies: [],
  }

  guestIdRef = React.createRef()
  keywordRef = React.createRef()

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
    console.log(this.guestIdRef)
  }

  componentDidUpdate(pP, prevState) {
    if (prevState.pages.current !== this.state.pages.current) {
      this.setNewPage()
    }
    if (prevState.tab !== this.state.tab) {
      if (this.state.tab === 'rated') {
        this.getRatedMovies(this.guestIdRef.current)
      } else {
        this.getMovies(this.keywordRef.current)
      }
    }
  }

  createGuestSession = async () => {
    await this.MovieDB.createGuestSession()
      .then((guest) => {
        // this.setState({
        //   guestID: guest.guest_session_id,
        // })
        this.guestIdRef.current = guest.guest_session_id
      })
      .catch((err) => this.onError(err))
  }

  getMovies = async (keyword, page) => {
    this.keywordRef.current = keyword
    this.setState({ loading: true })
    console.log(this.keywordRef)
    await this.MovieDB.getMovies(this.keywordRef.current, page)
      .then((data) => {
        data.results.map((movie) => {
          let ratedMovie = this.state.ratedMovies.find((rated) => rated.id === movie.id)
          if (ratedMovie) {
            movie.rating = ratedMovie.rating
          }
        })
        return data
      })
      .then((data) => {
        this.setState({
          moviesData: data.results,
          loading: false,
          error: { status: false, text: '' },
          pages: { current: 1, total: data.total_pages },
        })
      })
      .catch((err) => {
        this.onError(err)
      })
  }

  getGenres = async () => {
    await this.MovieDB.getGenres()
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
      error: { status: false, text: '' },
      loading: true,
    })
  }

  setNewPage = () => {
    if (this.state.tab === 'rated') {
      this.MovieDB.getRatedMovies(this.state.guestID, this.state.pages.current)
        .then((body) => {
          this.setState({
            moviesData: body.results,
          })
        })
        .catch((err) => {
          this.onError(err)
        })
    }
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

  addRating = async (rate, movieID) => {
    await this.MovieDB.addMovieRate(rate, movieID, this.guestIdRef.current)

    this.setState(({ moviesData, ratedMovies }) => {
      const rated = moviesData.find(({ id }) => id === movieID)
      rated.rating = rate
      const newData = moviesData.map((movie) => {
        return movie.id === rated.id ? rated : movie
      })

      const newRatedMovies = ratedMovies.includes(rated) ? ratedMovies : ratedMovies.toSpliced(-1, 0, rated)

      return {
        moviesData: newData,
        ratedMovies: newRatedMovies,
      }
    })
  }
  getRatedMovies = (guest_session_id) => {
    this.MovieDB.getRatedMovies(guest_session_id)
      .then((data) => {
        this.setState({
          ratedMovies: data.results,
          loading: false,
          pages: { current: 1, total: data.total_pages },
        })
      })
      .catch((err) => {
        return this.onError(err)
      })
  }

  render() {
    return (
      <section className="app">
        <header>
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
          <Provider value={{ state: this.state, addRating: this.addRating }}>
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
