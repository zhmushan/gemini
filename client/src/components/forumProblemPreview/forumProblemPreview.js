import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { connect } from 'react-redux'
import { followProblem } from '@/redux/actions'

import './forumProblemPreview.scss'

@connect(
  state => state,
  { followProblem }
)
class ForumProblemPreview extends Component {
  constructor(props) {
    super(props)
    this.state = {
      latestReply: null,
      latestReplyAuthor: null,
      isFollow: false
    }
  }

  componentDidMount() {
    if (this.props.watchers.indexOf(this.props.userstatus.id) !== -1) {
      this.setState({
        isFollow: true
      })
    }
    if (this.props.replys.length > 0) {
      axios.post('/api/issues/reply/ids', [this.props.replys[this.props.replys.length - 1]]).then((res) => {
        this.setState({
          latestReply: res.data.data[0]
        })


        axios.get(`/api/users/${res.data.data[0].authorId}`).then(response => {
          this.setState({
            latestReplyAuthor: response.data.data
          })
        })
      })
      
    }
  }
  
  follow (id) {
    this.props.followProblem(id)
    this.setState({
      isFollow: !this.state.isFollow
    })
  }

  render() {
    const { problemTitle, type, replys, problemId } = this.props
    return (
      <div className='forum-problem-preview'>
        <div className="problem-preview-left">
          <img src={require(`@/assets/forumIcon/${type[0]}.jpg`)} alt=""/>
        </div>
        <div className="problem-preview-right">
          <div className="problem-preview-type">
            来自
            {
              type.map(item => {
                return <Link to={`/forum/type/${item}`} key={item}>{allType[item]}</Link>
              })
            }
          </div>
          <Link className="problem-preview-title" to={`/forum/details/${problemId}`}>
            {problemTitle}
          </Link>
          {
            this.state.latestReply && this.state.latestReplyAuthor ? 
            <React.Fragment>
              <div className="latest-replyer-name">
                <a>{this.state.latestReplyAuthor.username}</a>
                回答:
              </div>
              <div className="latest-replyer-content">
                {this.state.latestReply.content}
              </div>
              <div className="problem-preview-operation">
                <a className="problem-preview-good-count">{this.state.latestReply.upersId.length}人赞同</a>
                <a className="problem-preview-bad-count">{this.state.latestReply.downersId.length}人反对</a>
              </div>
            </React.Fragment>
            :
            <div className="problem-preview-operation">
              <Link className="problem-preview-reply-btn" to={`/forum/details/${problemId}`}>
                我要回答
              </Link>
              <span>{replys.length}个回答</span>
              <a className="problem-preview-follow-btn" onClick={() => this.follow(problemId)}>
                {
                  this.state.isFollow ?
                  "取消关注":
                  "关注"
                }
              </a>
          </div>
          }
        </div>
      </div>
    )
  }
}

const allType = ['JavaScript', 'Node.js', 'Vue', 'React','Html5', 'Html/CSS', 'Angular', 'WebApp', 'Jquery', 'Bootstrap', '前端工具', 'CSS3', 'Sass/Less', 'JAVA', 'Python', 'Go', 'PHP', 'C', 'C++', 'C#', 'MySQL', 'SQL Server', 'Oracle', 'MongoDB', 'Android', 'iOS', 'Unity 3D', 'Cocos2d-x', '大数据', '云计算', '深度学习', '机器学习', '测试', 'Linux', 'Photoshop', 'Maya', 'Premiere', 'ZBrush', '数据结构', 'Ruby']


export default ForumProblemPreview