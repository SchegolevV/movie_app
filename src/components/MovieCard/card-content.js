import { Tag } from 'antd'

import { Consumer } from '../../context/context'

const CardContent = ({ content, genre_ids }) => {
  return (
    <Consumer>
      {({ state }) => {
        const tags = genre_ids.map((id) => {
          const genre = state.genres.find((genre) => genre.id === id)
          return (
            <Tag key={id} style={{ display: 'inline-block', marginTop: '0.3rem' }}>
              {genre.name}
            </Tag>
          )
        })

        return (
          <>
            <div className="movie-card_content">
              <h3 className="movie-card_title">{content.title}</h3>
              <div className="movie-card_date">{content.date}</div>
              <div className="movie-card_tags">{tags}</div>
            </div>
            <p className="movie-card_overview">{content.text}</p>
          </>
        )
      }}
    </Consumer>
  )
}

CardContent.defaultProps = {
  content: {
    title: '',
    date: '',
    text: '',
  },
  genre_ids: [],
}

export default CardContent
