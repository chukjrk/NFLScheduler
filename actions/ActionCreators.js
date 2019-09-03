import * as ActionTypes from './ActionTypes';

export const postFavorite = (playerId) => (dispatch) => {
	setTimeout(() => {
		dispatch(addFavorite(playerId))
	}, 500);
}

export const addFavorite = (playerId) => ({
	type: ActionTypes.ADD_FAVORITE,
	payload: playerId
});

export const setTimer = (duration) => ({
	type: ActionTypes.SET_TIMER,
	d: duration
});