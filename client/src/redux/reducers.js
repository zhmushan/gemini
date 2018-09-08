//合并所有reducer 并返回
import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'

const initState = {
	msg: '',
	username: '',
	email: '',
	re_username: '',
	re_password: '',
	repet_password: '',
	forget_email: '',
	id: '',
	redirectTo: '',
	job: '未设置',
	city: '未设置',
	sex: '未设置',
	signature: '未设置',
	watchTags: [],
	code: '',
	watchIssuesId: [],
	watchUsersId:[],
}

const courseInitState = {
	msg: '',
	courses: [],
	code: ''
}

const articleInit = {
	msg: '',
	article: [],
	code: '',
	comment: []
}

const problemInitState = {
	msg: '',
	problem: [],
	code: ''
}

const problemCommentInit = {
	msg: '',
	replys: [],
	code: ''
}

const reportInit = {
	msg: '',
	reports: [],
	code: ''
}

const Userinit = {}

export function userstatus(state = initState, action) {
	switch (action.type) {
		// case ActionTypes.LOGIN:
		//   return { ...state, msg: action.msg }
		case ActionTypes.AUTH_SUCCESS:
			return {
				...state,
				...action.payload,
				redirectTo: '/home',
				...action.username,
			}
		case ActionTypes.FORGET_PASS:
			return {
				...state,
				email: action.email
			}
		case ActionTypes.ERROR_MSG:
			return {
				...state,
				msg: action.msg,
				code: action.code
			}
		case ActionTypes.REMOVE_MSG:
			return {
				...state,
				msg: action.msg
			}
		case ActionTypes.LOAD_DATA:
			return {
				...state,
				...action.payload
			}
		case ActionTypes.UPDATE_PERSON_MSG:
			return {
				...state,
				job: action.payload.job,
				nickname: action.payload.username,
				msg: action.payload.msg,
				city: action.payload.city,
				signature: action.payload.signature,
				sex: action.payload.sex
			}
		case ActionTypes.CHANGE_AVATAR:
			return {
				...state,
				avatar: action.avatar
			}
		case ActionTypes.SEND_EMAIL_SUCCESS:
			return {
				...state,
				code: action.code
			}
		case ActionTypes.LOGOUT:
			return {
				...initState
			}
		case ActionTypes.UPDATE_FORUM_TAGS:
			return {
				...state,
				watchTags: action.tags
			}
		case ActionTypes.FOLLOW_PROBLEM:
			return {
				...state,
				watchIssuesId: action.payload
			}
		case ActionTypes.FETCH_ONE_USER:
			return {
				...state,
				...action.result
			}
		case ActionTypes.FOCUS_USER:
			const index = [...state.watchUsersId].indexOf(action.data)
			let watch = [...state.watchUsersId]
			if(index!==-1){
				watch.splice(index,1)
				return {
					...state,
					watchUsersId:watch
				}
			}else{
				return {
					...state,
					watchUsersId:[...state.watchUsersId,action.data]
				}
			}
		default:
			return state
	}
}

export function course(state = courseInitState, action) {
	switch (action.type) {
		case ActionTypes.ERROR_MSG:
			return {
				...state,
				msg: action.msg,
				code: action.code
			}
		case ActionTypes.CREATE_COURSE_SUCCESS:
			return {
				...state,
				courses: [ ...state.courses, action.payload ],
				msg: '课程创建成功',
				code: action.code
			}
		case ActionTypes.COURSE_LIST:
			return {
				...state,
				courses: action.payload
			}
		case ActionTypes.COURSE_DELETE_SUCCESS:
			return {
				...state,
				msg: '课程删除成功',
				code: action.code
			}
		default:
			return state
	}
}

export function article(state = articleInit, action) {
	switch (action.type) {
		case ActionTypes.REMOVE_MSG:
			return {
				...state,
				msg: action.msg
			}
		case ActionTypes.CREATE_ARTICLE_SUCCESS:
			return {
				...state,
				code: action.code,
				article: action.article
			}
		case ActionTypes.CREATE_ARTICLE_ERROR:
			return {
				...state,
				msg: action.msg,
				code: action.code
			}
		case ActionTypes.FETCH_ONE_ARTICLE:
			return {
				...state,
				article: { ...action.data }
			}
		case ActionTypes.FETCH_All_ARTICLE:
			return {
				...state,
				articleArray: [ ...action.data ]
			}
		case ActionTypes.FETCH_ARTICLE_CATEGORY:
			return {
				...state,
				articleArray: [ ...action.data ]
			}
		case ActionTypes.FETCH_ARTICLE_UP:
			return {
				...state,
				up: action.data
			}
		case ActionTypes.SEND_ARTICLE_COMMENT:
			return {
				...state,
				comment: [ ...state.comment, action.comment ]
			}
		case ActionTypes.GET_ARTICLE_COMMENT:
			return {
				...state,
				comment: action.commentList
			}
			case ActionTypes.SET_REPLY_COMMENT:
			return {
				...state,
				comment: [ ...state.comment, action.commentReply ]
			}
		default:
			return state
	}
}

export function problem(state = problemInitState, action) {
	switch (action.type) {
		case ActionTypes.ERROR_MSG:
			return {
				...state,
				msg: action.msg,
				code: action.code
			}
		case ActionTypes.CREATE_PROBLEM_SUCCESS:
			return {
				...state,
				problem: [ ...state.problem, action.payload ],
				msg: '提交成功，请等待审核',
				code: action.code
			}
		case ActionTypes.PROBLEM_LIST:
			return {
				...state,
				problem: action.payload
			}
		case ActionTypes.DELETE_PROBLEM_SUCCESS:
			return {
				...state,
				problem: action.payload
			}
		case ActionTypes.CHECK_PROBLEM_ACCEPT:
			return {
				...state,
				problem: action.payload
			}
		default:
			return state
	}
}

export function problemComment(state = problemCommentInit, action) {
	switch (action.type) {
		case ActionTypes.ERROR_MSG:
			return {
				...state,
				msg: action.msg,
				code: action.code
			}
		case ActionTypes.COMMENT_PROBLEM:
			return {
				...state,
				replys: [ ...state.replys, action.payload ],
				code: action.code,
				msg: action.msg
			}
		case ActionTypes.FETCH_COMMENT:
			return {
				...state,
				replys: action.payload
			}

		default:
			return state
	}
}
/* ------------------举报------------------------- */
export function report(state = reportInit, action) {
	switch (action.type) {
		case ActionTypes.GET_REPORTS_LIST:
			return {
				...state,
				reports: action.payload
			}
		default:
			return state
	}
}
/* ------------------获取单个user------------------------- */

export function User(state = Userinit, action) {
	switch (action.type) {
		case ActionTypes.FETCH_ONE_USER:
			return {
				...state,
				...action.data
			}
		default:
			return state
	}
}

export default combineReducers({
	userstatus,
	course,
	article,
	problem,
	User,
	problemComment,
	report
})
