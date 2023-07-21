import { Typography, Tag } from 'antd'

const CardContent = ({ content }) => {
  const { Title, Paragraph } = Typography
  return (
    <div className="movie-card_content">
      <Title level={3} className="movie-card_title">
        {content.title}
      </Title>
      <div className="movie-card_date">{content.date}</div>
      <Tag>drama</Tag>
      <Paragraph className="movie-card_overview">{content.text}</Paragraph>
    </div>
  )
}

export default CardContent
