import React, { Component } from 'react'
import { Icon, message } from 'antd'
import CoursePreview from '@/common/coursePreview/coursePreview'
import './articleRight.scss'
import { defaultAvatar } from '@/const'
import axios from 'axios'
import { withRouter, Link } from 'react-router-dom'
import { notSetText } from '@/const.js'
import Cookies from 'js-cookie'
@withRouter
export default class articleRight extends Component {
	constructor(props) {
		super(props)
		this.state = {
			follow: false,
			thisAuthorArticle: [],
		}
	}
	toFollow = async () => {
		let _id = Cookies.get('_id')
		if (_id) {
			const authorId = await this.props.authorId
			await this.props.focusUser(authorId)
			this.setState(
				{
					follow: !this.state.follow,
				},
				() => {
					message.success('成功')
				}
			)
		} else {
			message.warn('请登录')
		}
	}
	componentDidMount() {
		if (this.props.authorId) {
			axios({
				method: 'get',
				url: `/api/articles/author/${this.props.authorId}`,
			}).then((res) => {
				this.setState({
					thisAuthorArticle: res.data.data,
				})
			})
		}
	}
	seeOtherArticle(id) {
		this.props.history.push(`/article/${id}`)
	}

	async componentWillReceiveProps(nextProps) {
		if (nextProps.match.params.id !== this.props.match.params.id) {
			this.props.changeDate()
		}
	}

	render() {
		const { article, watchUsersId, authorId, job } = this.props
		const { thisAuthorArticle } = this.state
		return (
			<div className='right-article-container'>
				<div className='author_info'>
					<img src={article.authorAvatar ? `/avatar/${article.authorAvatar}` : defaultAvatar} alt='' />

					<div className='text-info'>
						<div className='name'>
							<Link to={`/personCenter/${authorId}`}>{article.authorUsername}</Link>
							{/* follow ? '已关注' : '关注' */}
							<span onClick={this.toFollow}>{watchUsersId.indexOf(authorId) === -1 ? '关注' : '已关注'}</span>
						</div>
						<div className='job'>{job ? job : notSetText}</div>
						<div className='contribution'>
							<span>
								{thisAuthorArticle.length}
								片文章
							</span>
							{/* <span>贡献55555字</span> */}
						</div>
					</div>
				</div>
				<div className='other_article'>
					<div className='head'>
						<h2 className='title'>作者相关文章</h2>
						{/* <span className='more'>更多</span> */}
					</div>
					<ul className='content'>
						{this.state.thisAuthorArticle.map((v, i) => {
							return (
								<li className='article-item' key={i} onClick={() => this.seeOtherArticle(v.id)}>
									<Icon type='file-text' />
									{v.title}
								</li>
							)
						})}
					</ul>
				</div>

				<div className='related-lessons'>
					{/* {courses.map((item, index) => {
						return (
							<CoursePreview
								name={item.name}
								level={item.level}
								viewerCount={item.viewerCount}
								rate={item.rate}
								price={item.price}
								img={item.img}
								key={index}
							/>
						)
					})} */}
				</div>
			</div>
		)
	}
}

const courses = [
	{
		name: '区块链入门与去中心化应用实战',
		level: '中级',
		viewerCount: 4236,
		rate: 4.8,
		price: 100,
		img: 'https://img2.mukewang.com/szimg/5af2a67500016b9905400300.jpg',
	},
	{
		name: 'Vue2.5开发去哪儿网App 从零基础入门到实战项目',
		level: '中级',
		viewerCount: 4236,
		rate: 3.0,
		price: 100,
		img: 'https://img1.mukewang.com/szimg/5ac2dfe100014a9005400300.jpg',
	},
	{
		name: 'Java仿抖音短视频小程序开发 全栈式实战项目',
		level: '中级',
		viewerCount: 4236,
		rate: 3.4,
		price: 100,
		img: 'https://img1.mukewang.com/szimg/5afb8aa900014cc705400300.jpg',
	},
	{
		name: 'React Native技术精讲与高质量上线APP开发',
		level: '中级',
		viewerCount: 4236,
		rate: 4.1,
		price: 100,
		img: 'https://img4.mukewang.com/szimg/5adfe05e00012ecd05400300.jpg',
	},
]
