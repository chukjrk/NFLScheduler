import * as ActionTypes from '../actions/ActionTypes';

export const timer = (state = 0, action) => {
	switch(action.type) {
		case ActionTypes.SET_TIMER:
			return state = action.d
		default:
			return state;

	}
}