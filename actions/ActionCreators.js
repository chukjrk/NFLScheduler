import * as ActionTypes from './ActionTypes';

export const postFavorite = (playerId) => (dispatch) => {
	setTimeout(() => {
		dispatch(addFavorite(playerId))
	}, 1000);
}

export const addFavorite = (playerId) => ({
	type: ActionTypes.ADD_FAVORITE,
	payload: playerId
});