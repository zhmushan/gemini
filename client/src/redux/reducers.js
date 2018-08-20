//合并所有reducer 并返回
import { combineReducers } from 'redux'
import * as ActionTypes from './actionTypes'

const initState = {
	msg: '',
	username: '',
	password: '',
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
  watchIssuesId:[],
}

const courseInitState = {
	msg: '',
	courses: [],
	code: ''
}

const articleInit = {
	msg: '',
	article: [],
	code: ''
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

const Userinit={

}

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
				...action.password
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
      return { ...state,
        watchTags: action.tags
      }
    case ActionTypes.FOLLOW_PROBLEM:
      return { ...state,
        watchIssuesId: action.payload
      }
		case ActionTypes.FETCH_ONE_USER:
			return {
				...state,
				...action.result
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
				msg: action.msg,
				code: action.code
			}
		case ActionTypes.FETCH_ONE_ARTICLE:
			return {
				article: { ...action.data }
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
		default:
			return state
	}
}

export function problemComment (state = problemCommentInit, action) {
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
        replys: [
          ...state.replys,
          action.payload,
        ],
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
/* ------------------获取单个user------------------------- */
		
export function User(state = Userinit, action) {
	switch (action.type) {
		case ActionTypes.FETCH_ONE_USER:
			return {
				...state,
				...action.data,
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
})
