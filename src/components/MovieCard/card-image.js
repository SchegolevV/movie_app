const CardImage = ({ image }) => {
  return <img className="movie-card_image" alt="test" src={`https://image.tmdb.org/t/p/original${image}`} />
}
export default CardImage
