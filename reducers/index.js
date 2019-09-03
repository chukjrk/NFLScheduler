import {combineReducers } from 'redux';
import { favorites } from './favorites';
import { timer } from './timer';

export default combineReducers({
	favorites, timer
});