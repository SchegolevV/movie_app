import { Spin, Alert } from 'antd'
import { Component } from 'react'

import MovieCard from '../MovieCard/movie-card'
import './movies-list.css'
import { Consumer } from '../../context/context'

export default class MoviesList extends Component {
  loadHandler = () => <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  errorHandler = (cause) => (
    <Alert
      style={{ textAlign: 'center', width: 'fit-content', padding: '15px', margin: '50px auto' }}
      type="warning"
      message={cause}
    />
  )

  render() {
    return (
      <Consumer>
        {({ state, addRating }) => {
          const { moviesData, ratedMovies, loading, error, tab } = state

          let currentList = tab === 'rated' ? ratedMovies : moviesData

          const cardList = currentList.map((movieData) => {
            return <MovieCard {...movieData} key={movieData.id} addRating={addRating} />
          })

          if (loading) {
            return this.loadHandler()
          }
          if (error.status) {
            return this.errorHandler(error.text)
          }
          return <ul className="movies-list">{cardList}</ul>
        }}
      </Consumer>
    )
  }
}
