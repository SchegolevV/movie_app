import { Image } from 'antd'
const CardImage = ({ image }) => {
  return (
    <Image
      className="movie-card_backdrop"
      preview={false}
      alt="test"
      src={`https://image.tmdb.org/t/p/original${image}`}
    />
  )
}
export default CardImage
