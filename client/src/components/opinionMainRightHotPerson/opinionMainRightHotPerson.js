import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { focusUser } from '@/redux/actions'
import Cookies from 'js-cookie'
import './opinionMainRightHotPerson.scss'
import { defaultAvatar } from '../../const'
import LazyLoad from 'react-lazyload'
import { message } from 'antd'
@connect((state) => state, { focusUser })
export default class opinionMainRightHotPerson extends Component {
	constructor(props) {
		super(props)
		this.state = {
			follow: false,
			users: [],
		}
	}
	async handleFollow(id) {
		let _id = Cookies.get('_id')
		console.log(_id)
		if (_id) {
			await this.props.focusUser(id)
			// this.setState({
			// 	follow: !this.state.follow,
			// })
		} else {
			message.warn('请登录')
		}
	}
	async componentDidMount() {
		// 获取全部用户
		await axios({
			method: 'GET',
			url: '/api/users',
			headers: {
				token: Cookies.get('_token'),
			},
		}).then((res) => {
			this.setState({
				users: res.data.data,
			})
		})
	}
	render() {
		const { users } = this.state
		const { watchUsersId } = this.props.userstatus
		const _id = Cookies.get('_id')
		return (
			<div className='recommended_author'>
				<div className='top'>
					<h3>推荐作者</h3>
					{/* <div className='more'>更多</div> */}
				</div>
				<ul className='personList'>
					{users.map((v, i) => {
						if (v.id !== _id && i <= 5) {
							return (
								<li className='person' key={v.id}>
									<div className='left'>
										<div className='imgCon avatar'>
											<LazyLoad height={52}>
												<img src={v.avatar ? `/avatar/${v.avatar}` : defaultAvatar} alt='' />
											</LazyLoad>
										</div>
										<div className='text_author'>
											<div className='name'>{v.username}</div>
											<p>{/* <span className='margin-right-40'>40篇文章</span> */}</p>
										</div>
									</div>
									<div className='right'>
										<button className='follow' onClick={() => this.handleFollow(v.id)}>
											{watchUsersId.indexOf(v.id) === -1 ? '关注' : '已关注'}
											{/* {this.state.follow ? '已关注' : '关注'} */}
										</button>
									</div>
								</li>
							)
						}
					})}
				</ul>
			</div>
		)
	}
}
