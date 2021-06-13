import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'

const HelloWorld = () => {
  console.log(process.env)
  return <h1>Hello World!</h1>
}

ReactDOM.render(<HelloWorld />, document.getElementById('root'))
