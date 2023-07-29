import { Typography, Tag } from 'antd'

import { Consumer } from '../../context/context'

const CardContent = ({ content, genre_ids }) => {
  return (
    <Consumer>
      {({ state }) => {
        const { Title, Paragraph } = Typography

        const tags = genre_ids.map((id) => {
          const genre = state.genres.find((genre) => genre.id === id)
          return <Tag key={id}>{genre.name}</Tag>
        })

        return (
          <div className="movie-card_content">
            <Title level={3} className="movie-card_title">
              {content.title}
            </Title>
            <div className="movie-card_date">{content.date}</div>
            {tags}
            <Paragraph className="movie-card_overview">{content.text}</Paragraph>
          </div>
        )
      }}
    </Consumer>
  )
}

export default CardContent
