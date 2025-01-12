import React, { Component, Fragment } from 'react'
import './videoPageContentQuestionList.scss'
import { defaultAvatar } from '../../const'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import {  message} from 'antd'
import { getVideoIssue } from '@/redux/actions.js'
@withRouter
@connect((state) => state.video, { getVideoIssue })
export default class VideoPageContentQuestionList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			cousecomment: [],
			courseId: this.props.match.params.courseId,
		}
	}
	async componentDidMount() {
		await this.props.getVideoIssue(this.state.courseId)
	}
	render() {
		const issues = this.props.issues
		return (
			<Fragment>
				{issues ? (
					issues.map((v) => {
						return (
							<div className='video-wenda-container' key={v.id}>
								<div className='icon-wenda'>
									<img
										src='data:image/png;base64,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'
										alt=''
									/>
								</div>

								<div className='avatar'>
									<img src={v.authorAvatar ? `/avatar/${v.authorAvatar}` : defaultAvatar} alt='' />
								</div>
								<div className='r-content'>
									<h2 onClick={()=>{
										this.props.history.push(`/forum/details/${v.id}`)
									}}>{v.title}</h2>
									<p
										className='con'
										dangerouslySetInnerHTML={{
											__html: v.content,
										}}
									>
									</p>
									<div className='last'>
										<div className='l-box'>
											<span>{v.replysId.id} 回答</span> <span>{v.viewnum} 浏览</span>
										</div>
										<p>{v.createAt}</p>
									</div>
								</div>
							</div>
						)
					})
				) : (
					'暂无数据'
				)}
			</Fragment>
		)
	}
}
