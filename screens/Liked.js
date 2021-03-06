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
    title: 'Favorite Players',
    headerStyle: {
      backgroundColor: '#292929',
      borderBottomColor: '#292929',
    },
    headerTitleStyle: {
      alignSelf: 'center',
      color: '#BB86FC'
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      dataPlayers:[],
    };
  }

  _storePlayer = async () => {
  	const currentState = this.props.favorites;
	  try {
	    await AsyncStorage.setItem('favoritePlayers', JSON.stringify(currentState));
	  } catch (error) {
	    console.log('Error saving player', error)
	  }
	};
  
  componentWillMount() {
  	const currentState = this.props.favorites;
  	var i
  	var prelim = [];
  	for (i = 0; i<currentState.length; i++){
	  	fetch("https://www.thesportsdb.com/api/v1/json/1/lookupplayer.php?id="+currentState[i])
	    .then(response => response.json())
	    .then((responseJson)=>{
	    	prelim.push(responseJson.players[0])
	    	this.setState({
		      dataPlayers: prelim
		    })
	    }).catch(error=>console.log(error))
  	}
  }

  favoritePlayers(playerId){
  	this.props.postFavorite(playerId)
  	setTimeout(() => {
			this._storePlayer()
		}, 2000);
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
}


const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
		paddingHorizontal: 5,
		backgroundColor: '#121212',
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
		borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#FFFFFF20',
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
	},
  lightText: {
    color: 'white',

  }

})

export default connect(mapStateToProps, mapDispatchToProps)(Liked);
