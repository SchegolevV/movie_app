import { Component } from 'react'
import debounce from 'lodash.debounce'
import { Input } from 'antd'
import './search-panel.css'
export default class SearchPanel extends Component {
  handleChange = (e) => {
    this.props.getMovies(e.target.value)
  }
  render() {
    if (this.props.tab === 'rated') {
      return null
    }
    return (
      <Input
        size="large"
        placeholder="type to search..."
        className="search-panel"
        onChange={debounce(this.handleChange, 500)}
      />
    )
  }
}
