import  { Component } from 'react'
import {Outlet} from 'react-router-dom'
import "./App.less"
import Menu from './menus/index'
export default class App extends Component {
  render() {
    return (
      <div>
      
        <div className="layout">
          <div className="left_menu">
           <Menu/>
          </div>
          <div className="right_view">
            <Outlet/>
          </div>
        </div>
      </div>
    )
  }
}
