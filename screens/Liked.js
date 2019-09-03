import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  AsyncStorage
} from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { postFavorite } from '../actions/ActionCreators';
import store from '../store';

import { MonoText } from '../components/StyledText';

const mapStateToProps = state => {
	return {
		favorites: state.favorites
	}
}
const mapDispatchToProps = dispatch=> ({
	postFavorite: (playerId) => dispatch(postFavorite(playerId))
});

class Liked extends React.Component {
  static navigationOptions = {
    header: 'Starred Players',
  };

  constructor(props) {
    super(props);
    this.state = {
      dataPlayers:[],
    };
  }
  
  componentWillMount() {
  	const currentState = store.getState();
  	console.log('====> State <======', currentState);
  	var i
  	var prelim = [];
  	for (i = 0; i<currentState.favorites.length; i++){
	  	fetch("https://www.thesportsdb.com/api/v1/json/1/lookupplayer.php?id="+currentState[i])
	    .then(response => response.json())
	    .then((responseJson)=>{
	    	prelim.push(responseJson)
	    }).catch(error=>console.log(error))
  	}
  	console.log("in the beginning", prelim)
  	this.setState({
      dataPlayers: prelim
    })
  }

  render() {
	  return(
	   	<ScrollView style={styles.container}>	  	
		  	<View>
		  		<FlatList
		        data={this.state.dataPlayers}
		        ItemSeperatorComponent = {this.FlatListItemSeperator}
		        renderItem= {item => this.renderItem(item)}
		        />
		  	</View>
	  	</ScrollView>
    );
  }

  renderItem=(data)=>{
    return(
      <TouchableOpacity style={styles.list} onPress={() => this.favoritePlayers(data.item.idPlayer)}>
        <Image
          style={styles.playerThumb}
          source={{uri: data.item.strThumb}}
        	/>
        <View style={styles.playerInfo}>
		      <Text style={styles.lightText}>{data.item.strPlayer}</Text>
		      <Text style={styles.lightText}>{data.item.strPosition}</Text>
		      <Text style={styles.lightText}>{data.item.strTeam}</Text>
        </View>
        {/*<Image
	          style={{width: 250, height: 50}}
	          source={{uri: this.state.dataTeam.strTeamLogo}}
	        />*/}
      </TouchableOpacity>
    );
  }

  favoritePlayer(playerId){
  	this.props.postFavorite(playerId)
  	this._storePlayer()
  }

}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
		paddingHorizontal: 5,
		backgroundColor: '#fff',
	},
	top:{
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		paddingTop: 25
	},
	nameText: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
	},
	infoText: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
	},
	list:{
		flexDirection: 'row',
		flexWrap: 'wrap',
		// justifyContent: 'space-between',
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingVertical: 8,
	},
	playerThumb: {
		width: 100,
		height: 100,
	},
	playerInfo: {
		paddingHorizontal: 15,
		flexDirection: 'column',
		alignItems: 'flex-start'
	}

})

export default connect(mapStateToProps, mapDispatchToProps)(Liked);
