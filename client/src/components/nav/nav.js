import React from 'react'
import UserStatus from './userStatus/userStatus'
import { Link } from 'react-router-dom'
import { Icon } from 'antd'
import {withRouter, NavLink} from 'react-router-dom'
import classnames from 'classnames'

import './nav.scss'
@withRouter
class Nav extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: 0,
      searchContent: '',
      shoppingCartCount: 0
    }
    this.stateChange = this.stateChange.bind(this)
  }

  stateChange(key, value) {
    this.setState({
      [key]: value
    })
  }
  
  componentDidMount () {
    const { pathname } = this.props.location
    if (pathname === '/onlineStudying') {
      this.setState({
        selected: 1
      })
    } else if (pathname === '/forum') {
      this.setState({
        selected: 2
      })
    } else if (pathname === '/opinion') {
      this.setState({
        selected: 3
      })
    }
  }

  navSectionClick (e) {
    const navActiveBG = document.querySelector('.navActiveBG')
    if(navActiveBG){
      const target = e.target

      this.setState({
        selected: parseInt(target.getAttribute('data-identify'), 10)
      })

      const dataIdentify = target.getAttribute('data-identify')
      navActiveBG.style.transform = `translateX(${dataIdentify}00%)`
    }
  }

  search() {
    if (this.state.searchContent) {
      this.props.history.push(`/search/${this.state.searchContent}`)
    }
  }
  
  render() {
    var is = this.props.location.pathname.split('/')[1]==='personCenter'
    const personCenterNavBgColor=classnames({
      'personCenterNavBgColor':is
    })
    const navList = ['首页', '在线学习', '答疑', '看法']
    const navRoute = ['/home', '/onlineStudying', '/forum', '/opinion']
    const navSections = navList.map((section, index) => {
        if (index === this.state.selected) {
          return (
            <li key={index}>
              <NavLink className={is?'':'selected'} style={is?{'color':'white'}:null} to={navRoute[index]} onClick={(e) => this.navSectionClick(e)} data-identify={index}>{section}</NavLink>
            </li>
          )
        } else {
          return (
            <li key={index}>
              <NavLink to={navRoute[index]} style={is?{'color':'white'}:null}  onClick={(e) => this.navSectionClick(e)} data-identify={index}>{section}</NavLink>
            </li>
          )
        }
    })
    console.log(this.state.shoppingCartCount)
    return (
      <nav style={is?{'boxShadow':'none'}:null } className="allNav">
        <div className="nav-left">
          <div className="nav-logo">
            <img src={require(`@/assets/imgs/logo.png`)} alt=""/>
          </div>
          <div className="nav-sections">
            <ul>
              {navSections}
            </ul>
            {
              is?null:<span style={{transform: `translateX(${this.state.selected}00%)`}} className={`navActiveBG ${personCenterNavBgColor}`}></span>
            }
          </div>
        </div>
        <div className="nav-operation"> 
          <div className="nav-search-wrapper">
            <div className="nav-search">
              <input type="text" onChange={(e) => this.setState({searchContent: e.target.value})}/>
              <span>
                <a onClick={() => this.search()}>
                  <Icon type="search" theme="outlined" />
                </a>
              </span>
            </div>
          </div>
          <div className="nav-shopping-cart-wrapper" style={{paddingTop: 12}}>
            <Link to={`/shoppingCart`} className="nav-shopping-cart">
              <Icon type="shopping-cart" theme="outlined" />
              <span style={{marginLeft: 10}}>购物车</span>
              {
                this.state.shoppingCartCount ?
                <span className="nav-shopping-cart-count">
                  {this.state.shoppingCartCount}
                </span> : null
              }
            </Link>
          </div>
          <div className="nav-message-center-wrapper">
            <Link to={'/messageCenter'} className="nav-message-center">
              <Icon type="bell" theme="filled" />
            </Link>
          </div>
          {
            !is?<UserStatus stateChange={this.stateChange} />:null
          }
        </div>
      </nav>
    )
  }
}

export default Nav
