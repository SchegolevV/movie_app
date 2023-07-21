import MovieCard from '../MovieCard/movie-card'

import './movies-list.css'

export default function MoviesList({ data }) {
  const { moviesData, loading } = data

  const cardList = moviesData.map((movieData) => {
    return <MovieCard {...movieData} key={movieData.id} loading={loading} />
  })
  return <ul className="movies-list">{cardList}</ul>
}
