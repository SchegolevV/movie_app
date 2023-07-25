import { Spin, Alert, Pagination } from 'antd'
import { Component } from 'react'

import MovieCard from '../MovieCard/movie-card'
import './movies-list.css'

export default class MoviesList extends Component {
  loadHandler = () => <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />

  errorHandler = (cause) => <Alert style={{ textAlign: 'center' }} type="warning" message={cause} />

  render() {
    const { moviesData, loading, error } = this.props.data
    const cardList = moviesData.map((movieData) => {
      return <MovieCard {...movieData} key={movieData.id} />
    })

    if (loading) {
      return this.loadHandler()
    }
    if (error.status) {
      return this.errorHandler(error.text)
    }
    return (
      <>
        <ul className="movies-list">{cardList}</ul>
        <Pagination
          style={{ width: 'fit-content', margin: '0 auto' }}
          showSizeChanger={false}
          current={this.props.data.pages.current}
          total={this.props.data.pages.total}
          onChange={(page) => this.props.onPageChange(page)}
        />
      </>
    )
  }
}
