import { Card, Row, Col, Alert, Rate, Progress } from 'antd'
import { format } from 'date-fns'
import { Component } from 'react'

import CardContent from './card-content'
import CardImage from './card-image'

import './movie-card.css'

export default class MovieCard extends Component {
  state = {
    rate: 0,
  }

  createDate = (date) => {
    if (!date) {
      return <Alert type="error" message="unknown date" />
    }
    const oldDate = new Date(date)
    return format(new Date(oldDate), 'MMMM dd, yyyy')
  }
  formatText = (text, limit) => {
    if (text.length <= limit) return text

    text = text.slice(0, limit)
    const lastSpace = text.lastIndexOf(' ')

    if (lastSpace > 0) {
      text = text.substr(0, lastSpace)
    }
    return text + '...'
  }

  createImage = () => {
    if (!this.props.poster_path) {
      return <Alert type="error" message="poster not found" />
    }
    return <CardImage image={this.props.poster_path} />
  }

  onChangeRate = (rateEvent) => {
    this.setState({ rate: rateEvent })
    console.log(rateEvent)
    this.props.addRated(rateEvent, this.props.id)
  }

  progressColor = () => {
    const { rate } = this.state.rate
    let color = ''
    if (rate <= 3) {
      color = '#E90000'
    } else if (rate <= 5) {
      color = '#E97E00'
    } else if (rate <= 7) {
      color = '#E9D100'
    }
    return color
  }

  render() {
    const { title, overview, release_date, genre_ids } = this.props

    const contentData = {
      date: this.createDate(release_date),
      text: this.formatText(overview, 150),
      title: this.formatText(title, 25),
    }
    return (
      <Card style={{ width: 450, height: 280 }} className="movie-card" bodyStyle={{ padding: 0 }} hoverable>
        <Row>
          <Col span={14} push={10}>
            <CardContent content={contentData} genre_ids={genre_ids} />
            <Rate
              count={10}
              allowHalf
              className="movie-card_rate"
              value={this.state.rate}
              onChange={this.onChangeRate}
            />
            <Progress
              type="circle"
              percent={this.state.rate * 10}
              format={(percent) => percent / 10}
              size={35}
              className="movie-card_rate-progress"
              strokeColor={this.progressColor()}
            />
          </Col>
          <Col span={10} pull={14} style={{ textContent: 'center' }}>
            {this.createImage()}
          </Col>
        </Row>
      </Card>
    )
  }
}
