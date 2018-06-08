import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import BackstageAnalyze from '../backstageAnalyze/backstageAnalyze'
import BackstageUser from '../backstageUser/backstateUser'
import BackstageArticle from '../backstageArticle/backstageArticle'
import BackstageCourse from '../backstageCourse/backstageCourse'
import BackstageCourseCreate from '../backstageCourseCreate/backstageCourseCreate'
import AdminBreadcrumb from '../adminBreadcrumb/adminBreadcrumb'

@withRouter
export default class BackstageConent extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    // 如address为多级,用"-"分割
    const page = [
      {
        name: 'BackstageAnalyze',
        component: BackstageAnalyze,
        path: '/admin',
      },
      {
        name: 'BackstageUser',
        component: BackstageUser,
        path: '/admin/user',
        address: '用户列表'
      },
      {
        name: 'BackstageArticle',
        component: BackstageArticle,
        path: '/admin/article'

      },
      {
        name: 'BackstageCourse',
        component: BackstageCourse,
        path: '/admin/course',
        address: '课程列表'
      },
      {
        name: 'BackstageCourseCreate',
        component: BackstageCourseCreate,
        path: '/admin/course/create',
        address: '课程列表-新建课程'
      }
    ]
    return (
      <React.Fragment>
        {
          page.map(v => {
            if (this.props.location.pathname === v.path) {
              if (v.address) {
                const addressArr = v.address.split('-')
                return (
                  <React.Fragment key={v.name}>
                    <AdminBreadcrumb addressArr={addressArr} />
                    <v.component />
                  </React.Fragment>
                )
              }
              return <v.component key={v.component} />
            }
            return null
          })
        }
      </React.Fragment>
    )
  }
}
