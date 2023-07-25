import { Component } from 'react'
import debounce from 'lodash.debounce'
import { Input } from 'antd'
import './search-panel.css'
export default class SearchPanel extends Component {
  handleChange = (e) => {
    this.props.getMovies(e.target.value)
  }
  render() {
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
