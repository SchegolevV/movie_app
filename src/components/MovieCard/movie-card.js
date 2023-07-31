import { Alert, Rate, Progress } from 'antd'
import { format } from 'date-fns'
import { Component } from 'react'

import CardContent from './card-content'
import CardImage from './card-image'

import './movie-card.css'

export default class MovieCard extends Component {
  createDate = (date) => {
    if (!date) {
      return <Alert type="error" message="unknown date" style={{ width: 'fit-content', fontSize: '0.7rem' }} />
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
      return <Alert type="error" message="poster not found" style={{ fontSize: '0.7rem' }} />
    }
    return <CardImage image={this.props.poster_path} />
  }

  onChangeRate = (rateEvent) => {
    this.props.addRating(rateEvent, this.props.id)
  }

  render() {
    const { title, overview, release_date, genre_ids, rating = 0 } = this.props

    let color = '#66E900'
    if (rating <= 3) {
      color = '#E90000'
    } else if (rating <= 5) {
      color = '#E97E00'
    } else if (rating <= 7) {
      color = '#E9D100'
    }

    const contentData = {
      date: this.createDate(release_date),
      text: this.formatText(overview, 130),
      title: this.formatText(title, 25),
    }
    return (
      <div className="movie-card">
        <CardContent content={contentData} genre_ids={genre_ids} />
        <Rate count={10} allowHalf className="movie-card_rate" value={rating} onChange={this.onChangeRate} />
        <Progress
          type="circle"
          percent={rating * 10}
          format={(percent) => percent / 10}
          size={35}
          className="movie-card_rate-progress"
          strokeColor={color}
        />
        <div className="movie-card_image-container">{this.createImage()}</div>
      </div>
    )
  }
}
