import { Card, Row, Col, Alert } from 'antd'
import { format } from 'date-fns'

import CardContent from './card-content'
import CardImage from './card-image'
import './movie-card.css'

function MovieCard({ title, poster_path, overview, release_date, loading }) {
  const createDate = (date) => {
    if (!date) {
      return <Alert type="error" message="unknown date" />
    }
    const oldDate = new Date(date)
    return format(new Date(oldDate), 'MMMM dd, yyyy')
  }
  const formatText = (text, limit) => {
    if (text.length <= limit) return text

    text = text.slice(0, limit)
    const lastSpace = text.lastIndexOf(' ')

    if (lastSpace > 0) {
      text = text.substr(0, lastSpace)
    }
    return text + '...'
  }
  let image = <CardImage image={poster_path} loading={loading} />
  let alert
  if (!poster_path) {
    image = null
    alert = <Alert type="error" message="poster path not found" />
  }
  const contentData = {
    date: createDate(release_date),
    text: formatText(overview, 150),
    title: title,
  }

  return (
    <Card style={{ width: 450, height: 280 }} className="movie-card" bodyStyle={{ padding: 0 }} hoverable>
      <Row>
        <Col span={14} push={10}>
          <CardContent content={contentData} />
        </Col>
        <Col span={10} pull={14} style={{ textContent: 'center' }}>
          {image}
          {alert}
        </Col>
      </Row>
    </Card>
  )
}
export default MovieCard
