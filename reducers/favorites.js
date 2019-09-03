import * as ActionTypes from '../actions/ActionTypes';

export const favorites = (state = [], action) => {
	switch(action.type) {
		case ActionTypes.ADD_FAVORITE:
			if (state.some(el => el === action.payload)){
				state.splice(state.indexOf(action.payload),1)
				return state;
			} else {
				return state.concat(action.payload);
			}
		default:
			return state;

	}
}