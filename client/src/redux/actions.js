import axios from 'axios'
import Cookies from 'js-cookie'
import * as ActionTypes from './actionTypes'
import store from './stores'
const _token = Cookies.get('_token')
function errorMsg(msg) {
	return { msg, code: 0, type: ActionTypes.ERROR_MSG }
}

export function removeMsg() {
	return { msg: '', type: ActionTypes.REMOVE_MSG }
}

// 加载数据
export function loadData(userinfo) {
	return { type: ActionTypes.LOAD_DATA, payload: userinfo }
}

/* --------------------------------------------------注册-------------------------------------------------------------- */

function authSuccess(obj) {
	const { username, data } = obj
	return { msg: '', type: ActionTypes.AUTH_SUCCESS, payload: data, username, code: 1 }
}

export function register(username, password, repet_pass) {
	if (!username || !password || !repet_pass) {
		return errorMsg('请输入注册的账号的密码')
	}
	if (username.length < 2) {
		return errorMsg('用户名最少2位')
	}
	if (password.length < 6 || password.length >= 14) {
		return errorMsg('密码个数不能少于６位或者大于14位')
	}
	if (password !== repet_pass) {
		return errorMsg('两次密码不一致')
	}
	return async (dispatch) => {
		const email = Cookies.get('email')
		const captcha = Cookies.get('captcha')
		const res = await axios({
			method: 'post',
			url: '/api/users/register',
			headers: {
				captcha: captcha,
			},
			data: {
				username,
				email,
				password,
			},
		})
		if (res.data.code === 1) {
			const data = res.data.data
			Cookies.set('_id', res.data.data.id)
			Cookies.set('_token', res.data.data.token)
			dispatch(authSuccess({ username, password, email, ...data }))
		} else if (res.data.code === -1) {
			dispatch(errorMsg('未知错误'))
		} else if (res.data.code === 102) {
			dispatch(errorMsg('用户已存在'))
		} else if (res.data.code === 104) {
			dispatch(errorMsg('请输入正确的验证码'))
		}
	}
}
/* --------------------------------------------------忘记密码-------------------------------------------------------------- */

function forgetPass(email) {
	return { msg: '', type: ActionTypes.FORGET_PASS, email }
}

export function forgetPassword(forget_email) {
	var regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
	if (!forget_email) {
		return errorMsg('请输入邮箱')
	}
	if (!regex.test(forget_email)) {
		return errorMsg('请输入正确的邮箱格式')
	}
	return async (dispatch) => {
		const res = await axios.post('/user/forget', { forget_email })
		if (res.data.code === 1) {
			dispatch(forgetPass(forget_email))
		} else {
			dispatch(res.data.msg)
		}
	}
}
/* --------------------------------------------------登录-------------------------------------------------------------- */

export function login(username, password) {
	if (!username || !password) {
		return errorMsg('请输入账号或者密码')
	}
	return async (dispatch) => {
		const res = await axios.post('/api/users/login', { username, password })
		if (res.data.code === 1) {
			Cookies.set('_id', res.data.data.id)
			Cookies.set('_token', res.data.data.token)
			dispatch(authSuccess({ username, data: res.data.data }))
		} else if (res.data.code === 100) {
			dispatch(errorMsg('登录失败'))
		} else if (res.data.code === -1) {
			dispatch(errorMsg('未知错误'))
		} else {
			dispatch(errorMsg('后端错误'))
		}
	}
}
/* --------------------------------------------------修改个人信息-------------------------------------------------------------- */

// 修改成功
function updateSuccesss(obj) {
	return { payload: { ...obj }, type: ActionTypes.UPDATE_PERSON_MSG }
}

export function changePersonMsg(username, job, city, sex, signature) {
	const _id = Cookies.get('_id')
	const _token = Cookies.get('_token')
	let sexName
	if (sex === 1) {
		sexName = '男'
	} else if (sex === 0) {
		sexName = '女'
	}
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: '/api/users',
			headers: {
				id: _id,
				token: _token,
			},
			data: {
				nickname: username,
				sex,
				job,
				city,
				signature,
			},
		})
		if (res.data.code === 1) {
			console.log(sexName)
			return dispatch(
				updateSuccesss({
					msg: res.data.msg,
					sex: sexName,
					username,
					job,
					city,
					signature,
				})
			)
		} else {
			return dispatch(errorMsg('修改失败了'))
		}
	}
}
/* --------------------------------------------------注册发送邮件-------------------------------------------------------------- */

// 发送邮箱成功
function sendEmailSuccess() {
	let code = 1
	return { type: ActionTypes.SEND_EMAIL_SUCCESS, code: code }
}

export function RegisterSendEamil(email) {
	if (!email) {
		return errorMsg('请输入邮箱')
	}
	var regex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
	if (!regex.test(email)) {
		return errorMsg('邮箱格式错误')
	}
	return async (dispatch) => {
		const res = await axios.post(`/api/users/email/send/${email}`)
		Cookies.set('email', email)
		if (res.data.code === 1) {
			dispatch(sendEmailSuccess())
		} else if (res.data.code === 103) {
			dispatch(errorMsg('发送验证码太过频发', 0))
		} else {
			dispatch(errorMsg('验证码错误', 0))
		}
	}
}
/* --------------------------------------------------检测是否验证码正确-------------------------------------------------------------- */

// export function checkedCaptcha(captcha) {
//   if (!captcha) {
//     return errorMsg("验证码都不写吗？")
//   }
//   const email = Cookies.get("email")
//   return async dispatch => {
//     const res = await axios({
//       method: "post",
//       url: `/api/users/email/validate/${email}`,
//       headers: {
//         captcha: captcha
//       }
//     })
//     if (res.data.code === 1) {
//       Cookies.set("captcha", captcha)
//     }
//   }
// }
/* --------------------------------------------------登出-------------------------------------------------------------- */

export function logout() {
	Cookies.remove('_id')
	Cookies.remove('_token')
	return { type: ActionTypes.LOGOUT, username: '', id: '' }
}

/* --------------------------------------------------修改头像-------------------------------------------------------------- */
function changeAvatarFunc(id) {
	return { type: ActionTypes.CHANGE_AVATAR, avatar: id }
}

export function changeAvatar(name) {
	return changeAvatarFunc(name)
}
/* --------------------------------------------------更新我的课程-------------------------------------------------------------- */
function updateMyCourseSuccess(courses) {
	return { type: ActionTypes.UPDATE_MY_COURSE, payload: courses }
}

export function updateMyCourse(courses) {
	return (dispatch) => {
		dispatch(updateMyCourseSuccess(courses))
	}
}
/* --------------------------------------------------创建课程-------------------------------------------------------------- */
// 创建课程成功
function createCourseSuccess(course) {
	const code = 1
	return {
		type: ActionTypes.CREATE_COURSE_SUCCESS,
		payload: course,
		code: code,
	}
}

export function createCourse(course) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		try {
			const res = await axios({
				method: 'post',
				url: '/api/courses',
				headers: {
					token: _token,
				},
				data: {
					...course,
				},
			})
			if (res.data.code === 1) {
				dispatch(createCourseSuccess(res.data.data))
			}
		} catch (error) {
			dispatch(errorMsg('服务端错误'))
		}
	}
}
/* --------------------------------------------------获取某个课程-------------------------------------------------------------- */
function fetchOneCourseSuccess(course) {
	return { type: ActionTypes.FETCH_ONE_COUSE, payload: course }
}

export function fetchOneCourse(id) {
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: `/api/courses/${id}`,
		})
		if (res.data.code === 1) {
			dispatch(fetchOneCourseSuccess(res.data.data))
		}
	}
}
/* --------------------------------------------------更新课程-------------------------------------------------------------- */
function updateCourseSuccess(course) {
	return { type: ActionTypes.UPDATE_COURSE, payload: course }
}

export function updateCourse(id, data) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: `/api/courses/${id}`,
			headers: {
				token: _token,
			},
			data: data,
		})
		if (res.data.code === 1) {
			dispatch(updateCourseSuccess(data))
		}
	}
}
/* --------------------------------------------------获取课程列表-------------------------------------------------------------- */
// 课程列表
function courseList(courses) {
	return { type: ActionTypes.COURSE_LIST, payload: courses }
}
export function getCourseList() {
	return async (dispatch) => {
		const res = await axios.get('/api/courses')
		if (res.data.code === 1) {
			dispatch(courseList(res.data.data))
		}
	}
}
// 单个课程
function courseOne(courses) {
	return { type: ActionTypes.FETCH_ONE_COURSE_VIDEO, data: courses }
}
export function getCourseOne(courseId) {
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: `/api/courses/${courseId}`,
		})
		if (res.data.code === 1) {
			dispatch(courseOne(res.data.data))
		}
	}
}

/* --------------------------------------------------删除课程-------------------------------------------------------------- */
// 课程删除成功
function courseDeleteSuccess() {
	let code = 1
	return { type: ActionTypes.COURSE_DELETE_SUCCESS, code: code }
}
export function deleteCourse(id) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		try {
			const res = await axios({
				method: 'delete',
				url: `/api/courses/${id}`,
				headers: {
					token: _token,
				},
			})

			if (res.data.code === 1) {
				dispatch(courseDeleteSuccess())
			}
		} catch (error) {
			dispatch(errorMsg('服务端错误'))
		}
	}
}
/* ---------------------------------------------------- 创建问题----------------------------------------------------------------------- */
function createProblemSuccess(problem) {
	const code = 1
	return {
		type: ActionTypes.CREATE_PROBLEM_SUCCESS,
		payload: problem,
		code: code,
	}
}

export function createProblem(problem) {
	const _token = Cookies.get('_token')

	return async (dispatch) => {
		try {
			const res = await axios({
				method: 'post',
				url: '/api/issues',
				headers: {
					token: _token,
				},
				data: {
					...problem,
				},
			})
			if (res.data.code === 1) {
				dispatch(createProblemSuccess(res.data.data))
			}
		} catch (error) {
			dispatch(errorMsg('服务端错误'))
		}
	}
}
/* ---------------------------------------------------- 删除问题----------------------------------------------------------------------- */
function deleteProblemSuccess(problems) {
	return { type: ActionTypes.DELETE_PROBLEM_SUCCESS, payload: problems }
}

export function deleteProblem(id) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'delete',
			url: `/api/issues/${id}`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			const problemData = store.getState().problem.problem.filter((item) => item.id !== id)
			dispatch(deleteProblemSuccess(problemData))
		}
	}
}
/* ---------------------------------------------------- 问题审核通过----------------------------------------------------------------------- */
function problemAcceptSuccess(problems) {
	const code = 1
	return { type: ActionTypes.CHECK_PROBLEM_ACCEPT, payload: problems, code }
}

export function problemAccept(id) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: `/api/issues/${id}/status/1`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(problemAcceptSuccess(res.data.data))
		}
	}
}
/* ---------------------------------------------------- 获取问题列表----------------------------------------------------------------------- */
function problemList(problem) {
	return { type: ActionTypes.PROBLEM_LIST, payload: problem }
}

export function getProblemList() {
	return async (dispatch) => {
		const res = await axios.get('/api/issues')
		if (res.data.code === 1) {
			dispatch(problemList(res.data.data))
		}
	}
}
/* ---------------------------------------------------- 通过类型获取问题列表----------------------------------------------------------------------- */
function problemListById(problem) {
	return { type: ActionTypes.PROBLEM_LIST_BY_TYPE, payload: problem }
}

export function getProblemListByType(type) {
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: '/api/issues/fetch/by-tag/intersect',
			data: {
				tags: type,
			},
		})
		if (res.data.code === 1) {
			console.log(res.data.data)
			dispatch(problemListById(res.data.data))
		}
	}
}
/* ---------------------------------------------------- 关注问题----------------------------------------------------------------------- */
function followProblemSuccess(watchIssuesId) {
	return { type: ActionTypes.FOLLOW_PROBLEM, payload: watchIssuesId }
}

export function followProblem(problemId) {
	const _token = Cookies.get('_token')

	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: `/api/issues/${problemId}/watch`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(followProblemSuccess(res.data.data.watchIssuesId))
		}
	}
}
/* ---------------------------------------------------- 评论问题----------------------------------------------------------------------- */
function commentProblemSuccess(comment) {
	const code = 1
	const msg = '评论成功'
	return { type: ActionTypes.COMMENT_PROBLEM, payload: comment, code, msg }
}

export function commentProblem(problemId, content) {
	const _token = Cookies.get('_token')

	return async (dispatch) => {
		try {
			const res = await axios({
				method: 'post',
				url: `/api/issues/${problemId}/reply`,
				headers: {
					token: _token,
				},
				data: {
					content: content,
				},
			})
			if (res.data.code === 1) {
				dispatch(commentProblemSuccess(res.data.data))
			}
		} catch (error) {
			dispatch(errorMsg('服务端错误'))
		}
	}
}
/* ---------------------------------------------------- 获取评论----------------------------------------------------------------------- */
function fetchCommentSuccess(comments) {
	return { type: ActionTypes.FETCH_COMMENT, payload: comments }
}

export function fetchComment(problemIds) {
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: '/api/issues/reply/ids',
			data: problemIds,
		})
		if (res.data.code === 1) {
			dispatch(fetchCommentSuccess(res.data.data))
			console.log(problemIds)
		}
	}
}
/* ---------------------------------------------------- 更新讨论区标签----------------------------------------------------------------------- */
function updateForumTagsSuccess(tags) {
	return { type: ActionTypes.UPDATE_FORUM_TAGS, tags: tags }
}

export function updateForumTags(tags) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: '/api/users/tags',
			headers: {
				token: _token,
			},
			data: {
				tags,
			},
		})
		if (res.data.code === 1) {
			dispatch(updateForumTagsSuccess(tags))
			Cookies.set('tags', tags)
		} else {
			dispatch(errorMsg('讨论区关注分类更新失败'))
		}
	}
}
/* ---------------------------------------------------- ARTICLE----------------------------------------------------------------------- */
/* 创建 */
function createArticlError(msg) {
	return { msg, code: 0, type: ActionTypes.CREATE_ARTICLE_ERROR }
}

function createArticleSuccess(article) {
	return {
		type: ActionTypes.CREATE_ARTICLE_SUCCESS,
		article: article,
		code: 1,
		msg: '',
	}
}
export function publishArticle(state) {
	const { articleName, articleContent, articleTag, articleImage, selectValue } = state
	if (!_token) {
		console.log(_token)
		return createArticlError('请先登录')
	} else if (!articleName) {
		return createArticlError('文章没有名字吗？')
	} else if (!articleContent) {
		return createArticlError('文章没有内容吗？')
	} else if (!articleImage) {
		return createArticlError('文章没有图片吗？')
	} else if (typeof selectValue !== 'number') {
		return createArticlError('文章没有类型吗？')
	} else if (articleTag.length === 0) {
		console.log(articleTag.length)
		return createArticlError('文章没有标签吗？')
	}
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: '/api/articles',
			headers: {
				token: _token,
			},
			data: {
				title: articleName,
				coverImg: articleImage,
				type: articleTag,
				content: articleContent,
				category: selectValue,
			},
		})
		if (res.data.code === 1) {
			dispatch(createArticleSuccess(res.data.data))
			console.log(res)
		} else {
			dispatch(createArticlError('服务端错误'))
		}
	}
}

/* fetch all */
function fetchOneArticleAllSuccess(data) {
	return { type: ActionTypes.FETCH_All_ARTICLE, data }
}

export function fetchArticleAll() {
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: `/api/articles`,
		})
		if (res.data.code === 1) {
			dispatch(fetchOneArticleAllSuccess(res.data.data))
		} else {
			console.log('服务器出故障了')
		}
	}
}

/* 更具类别返回文章列表 */

function fetchArticleByCategorySuccess(data) {
	return { type: ActionTypes.FETCH_ARTICLE_CATEGORY, data, code: 1 }
}
function fetchArticleByCategoryError() {
	return { type: ActionTypes.FETCH_ARTICLE_CATEGORY, code: 0 }
}

export function fetchArticleByCategory(id) {
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: `/api/articles/category/${id}`,
		})
		if (res.data.code === 1) {
			dispatch(fetchArticleByCategorySuccess(res.data.data))
		} else {
			dispatch(fetchArticleByCategoryError())
		}
	}
}

/* ---------------------------------------------------- 删除文章(审核没通过)---------------------------------------------------------------------- */
function deleteArticleSuccess(article) {
	return { type: ActionTypes.DELETE_ARTICLE_SUCCESS, articleArray: article }
}

export function deleteArticle(id) {
	return async (dispatch) => {
		const res = await axios({
			method: 'delete',
			url: `/api/articles/${id}`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			const articleArray = [ ...store.getState().article.articleArray ]
			articleArray.map((v, i) => {
				if (v.id === id) {
					articleArray.splice(i, 1)
				}
			})
			dispatch(deleteArticleSuccess(articleArray))
		} else {
			console.log('后端出错了')
		}
	}
}
/* ---------------------------------------------------- 文章审核通过----------------------------------------------------------------------- */
function articleAcceptSuccess(article) {
	const code = 1
	return {
		type: ActionTypes.CHECK_ARTICLE_ACCEPT,
		articleArray: article,
		code,
	}
}

export function articleAccept(id) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: `/api/articles/${id}/status/1`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			const articleArray = [ ...store.getState().article.articleArray ]
			articleArray.map((v) => {
				if (v.id === id) {
					v.status = 1
				}
			})
			dispatch(articleAcceptSuccess(articleArray))
		}
	}
}

/* 发表评论 */
function sendArticleCommentSuccess(data) {
	return { type: ActionTypes.SEND_ARTICLE_COMMENT, comment: data }
}
export function sendArticleComment(id, content) {
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: `/api/articles/${id}/comment`,
			headers: {
				token: Cookies.get('_token'),
			},
			data: {
				content: content,
				to: '',
			},
		})
		if (res.data.code === 1) {
			dispatch(sendArticleCommentSuccess(res.data.data))
		} else {
			console.log('服务器出故障了')
		}
	}
}

function getArticleCommentSuccess(data) {
	return { type: ActionTypes.GET_ARTICLE_COMMENT, commentList: data }
}
/* 获取评论 */
export function getArticleComment(ids) {
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: '/api/articles/comment/ids',
			data: ids,
		})
		if (res.data.code === 1) {
			dispatch(getArticleCommentSuccess(res.data.data))
		} else {
			console.log('服务器出故障了')
		}
	}
}
/* 子回复 */

function setReplyCommentSuccess(data) {
	return { type: ActionTypes.SET_REPLY_COMMENT, commentReply: data }
}
export function setReplyComment(articleId, content, to) {
	console.log(articleId, content, to)
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: `/api/articles/${articleId}/comment`,
			headers: {
				token: _token,
			},
			data: {
				content: content,
				to: to,
			},
		})
		if (res.data.code === 1) {
			dispatch(setReplyCommentSuccess(res.data.data))
		}
	}
}

/* 关注用户 */
function setWatchUser(data) {
	return { type: ActionTypes.FOCUS_USER, data }
}
export function focusUser(authorId) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'PUT',
			url: `/api/users/watch/user/${authorId}`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			const watchUsersId = [ ...store.getState().userstatus.watchUsersId ]
			let flag = 0
			watchUsersId.map((v, i) => {
				if (v === authorId) {
					watchUsersId.splice(i, 1)
					flag = 1
				}
			})
			if (flag === 0) {
				watchUsersId.push(authorId)
			}
			dispatch(setWatchUser(watchUsersId))
		}
	}
}

/* -------------------------获取举报列表------------------------------------------- */
function getReportsListSuccess(reports) {
	return { type: ActionTypes.GET_REPORTS_LIST, payload: reports }
}

export function getReportsList() {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: '/api/reports',
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(getReportsListSuccess(res.data.data))
		}
	}
}
/* -------------------------获取单个用户信息------------------------------------------- */
function fetchOneUser(data) {
	return { type: ActionTypes.FETCH_ONE_USER, data }
}
export function fetchUser(id) {
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: `/api/users/${id}`,
		})
		if (res.data.code === 1) {
			dispatch(fetchOneUser(res.data.data))
		} else {
			console.log('服务器出故障了')
		}
	}
}

/* ----------------------------------------------video---------------------------------------------- */

/* 发表评论 */
function sendVideoCommentSuccess(data) {
	return { type: ActionTypes.SEND_VIDEO_COMMENT, comment: data }
}
export function sendVideoComment(id, content) {
	console.log(id, content)
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: `/api/courses/${id}/comment`,
			headers: {
				token: Cookies.get('_token'),
			},
			data: {
				content: content,
				to: '',
			},
		})
		if (res.data.code === 1) {
			dispatch(sendVideoCommentSuccess(res.data.data))
		} else {
			console.log('服务器出故障了')
		}
	}
}

function getVideoCommentSuccess(data) {
	return { type: ActionTypes.GET_VIDEO_COMMENT, commentList: data }
}
/* 获取评论 */
export function getVideoComment(ids) {
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: '/api/articles/comment/ids',
			data: ids,
		})
		if (res.data.code === 1) {
			dispatch(getVideoCommentSuccess(res.data.data))
		} else {
			console.log('服务器出故障了')
		}
	}
}
/* 子回复 */

function setVideoReplyCommentSuccess(data) {
	return { type: ActionTypes.SET_VIDEO_REPLY_COMMENT, commentReply: data }
}
export function setVideoReplyComment(courseId, content, to) {
	console.log(courseId, content, to)
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'post',
			url: `/api/courses/${courseId}/comment`,
			headers: {
				token: _token,
			},
			data: {
				content: content,
				to: to,
			},
		})
		if (res.data.code === 1) {
			dispatch(setVideoReplyCommentSuccess(res.data.data))
		}
	}
}
/* 获取video下面的问答 */

function getVideoIssueSuccess(data) {
	return { type: ActionTypes.GET_VIDEO_ISSUE, issues: data }
}
export function getVideoIssue(id) {
	console.log(id)
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: `/api/issues/course/${id}`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(getVideoIssueSuccess(res.data.data))
		}
	}
}

/* 评分 */
function courseRateSuccess(rate, rateComment) {
	var userid = Cookies.get('_id')
	var rateObj = {
		[userid]: rate,
	}
	var rateCommentObj = {
		[userid]: rateComment,
	}
	return { type: ActionTypes.COURSE_RATE, rateObj, rateCommentObj, code: 1 }
}
function courseRateError() {
	return { type: ActionTypes.COURSE_RATE, code: 0 }
}
export function courseRate(courseId, rate, rateComment) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: `/api/courses/rate/${courseId}`,
			headers: {
				token: _token,
			},
			data: {
				rate: rate,
				rateComment: rateComment,
			},
		})
		if (res.data.code === 1) {
			dispatch(courseRateSuccess(rate, rateComment))
		} else {
			dispatch(courseRateError())
		}
	}
}

/* 发送video下面的问答 */

function sendVideoIssueSuccess(data) {
	return { type: ActionTypes.SEND_VIDEO_ISSUE, issues: data }
}
export function sendVideoIssue(data) {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'POST',
			url: `/api/issues`,
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(sendVideoIssueSuccess(res.data.data))
		}
	}
}

/* ----------------------------------------------搜索---------------------------------------------- */
function searchSuccess(courses, problems, articles) {
	return { type: ActionTypes.SEARCH, payload: { courses, problems, articles } }
}

export function search(content) {
	return async (dispatch) => {
		const res1 = await axios({
			method: 'get',
			url: `/api/courses/search/${content}`,
		})
		const res2 = await axios({
			method: 'get',
			url: `/api/issues/search/${content}`,
		})
		const res3 = await axios({
			method: 'get',
			url: `/api/articles/search/${content}`,
		})
		if (res1.data.code === 1 || res2.data.code === 1 || res3.data.code === 1) {
			dispatch(searchSuccess(res1.data.data, res2.data.data, res3.data.data))
		}
	}
}

/* ----------------------------------------------获取购物车信息---------------------------------------------- */
function getShoppingCartSuccess(courses) {
	return { type: ActionTypes.GET_SHOPPING_CART, payload: courses }
}

export function getShoppingCart() {
	const _id = Cookies.get('_id')
	return async (dispatch) => {
		const res1 = await axios({
			method: 'get',
			url: `/api/users/${_id}`,
		})
		if (res1.data.code === 1) {
			const res2 = await axios({
				method: 'post',
				url: '/api/courses/ids',
				data: res1.data.data.shoppingcart,
			})
			const courses = []
			for (let item of res2.data.data) {
				const course = {}
				course.id = item.id
				course.coverImg = item.coverImg
				course.title = item.title
				course.price = item.price
				courses.push(course)
			}
			dispatch(getShoppingCartSuccess(courses))
		}
	}
}
/* ----------------------------------------------更改userstatus的购物车---------------------------------------------- */
function updateUserShoppingCartSuccess(shoppingcart) {
	return { type: ActionTypes.UPDATE_USER_SHOPPING_CART, payload: shoppingcart }
}

export function updateUserShoppingCart(shoppingcart) {
	return dispatch => {
		dispatch(updateUserShoppingCartSuccess(shoppingcart))
	}
}
/* ----------------------------------------------删除购物车内课程---------------------------------------------- */
export function deleteShoppingCartCourse(courses) {
	const _token = Cookies.get('_token')
	const ids = []
	for (let item of courses) {
		ids.push(item.id)
	}
	return async (dispatch) => {
		const res = await axios({
			method: 'put',
			url: '/api/users/shoppingcart',
			headers: {
				token: _token,
			},
			data: ids,
		})
		if (res.data.code === 1) {
			dispatch(getShoppingCartSuccess(courses))
		}
	}
}
/* ----------------------------------------------获取所有消息---------------------------------------------- */
function fetchMessageSuccess(msgs) {
	console.log(msgs)
	return { type: ActionTypes.FETCH_MESSAGE, payload: msgs }
}

export function fetchMessage() {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: '/api/notices',
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(fetchMessageSuccess(res.data.data))
		}
	}
}
/* ----------------------------------------------更新消息---------------------------------------------- */
export function updateMessage(msgs) {
	return (dispatch) => {
		dispatch(fetchMessageSuccess(msgs))
	}
}
/* ----------------------------------------------获取用户反馈---------------------------------------------- */
function fetchAdviceSuccess(advices) {
	return { type: ActionTypes.FETCH_ADVICE, payload: advices }
}

export function fetchAdvice() {
	const _token = Cookies.get('_token')
	return async (dispatch) => {
		const res = await axios({
			method: 'get',
			url: '/api/suggestions',
			headers: {
				token: _token,
			},
		})
		if (res.data.code === 1) {
			dispatch(fetchAdviceSuccess(res.data.data))
		}
	}
}

export function updateAdvice(advices) {
	return (dispatch) => {
		dispatch(fetchAdviceSuccess(advices))
	}
}
/* ----------------------------------------------倒计时---------------------------------------------- */
function countDownSuccess(count) {
	return { type: ActionTypes.COUNT_DOWN, payload: count }
}

export function countDown(count) {
	return (dispatch) => {
		dispatch(countDownSuccess(count))
	}
}
