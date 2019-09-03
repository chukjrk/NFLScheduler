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

class TeamDetails extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataTeam: {},
      dataNext:{},
      dataPlayers:[],
    };
    this._storePlayer = this._storePlayer.bind(this);
  }

  _setTeam = async (teamId) => {
	  try {
	    await AsyncStorage.setItem('favoriteTeam', teamId);
	    console.log('TEAM PICKED')
	  } catch (error) {
	    console.log('Error saving player', error)
	  }
	};

  _storePlayer = async () => {
  	const currentState = this.props.favorites;
  	console.log('====> State <======', currentState);
	  try {
	    await AsyncStorage.setItem('favoritePlayers', JSON.stringify(currentState));
	  } catch (error) {
	    console.log('Error saving player', error)
	  }
	};

  componentWillMount() {
  	fetch("https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id="+this.props.navigation.state.params.uid)
    .then(response => response.json())
    .then((responseJson)=>{
      this.setState({
        dataTeam: responseJson.teams[0]
      })
    }).catch(error=>console.log(error))

    fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_players.php?id="+this.props.navigation.state.params.uid)
    .then(response => response.json())
    .then((responseJson)=>{
      this.setState({
        dataPlayers: responseJson.player
      })
    }).catch(error=>console.log(error))

    fetch("https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id="+this.props.navigation.state.params.uid)
    .then(response => response.text()) 
    .then((dataStr) => {
      let responseJson = JSON.parse(dataStr);
      // console.log(responseJson)
      this.setState({
      	dataNext:responseJson
      })
    }).catch(error=>console.log(error))
  }

  render() {
  	const teamId = this.props.navigation.getParam('uid','');
  	const favorited =  this.props.favorites.some(el => el === teamId);

	  return(
	   	<ScrollView style={styles.container}>
	   		<View style={styles.top}>
	   			<Image
	          style={{width: 150, height: 150}}
	          source={{uri: this.state.dataTeam.strTeamBadge}}
	        />
	        <Ionicons  
			    	name="md-heart" 
			    	size={30}
			    	color="red"
			    	onPress={() => this._setTeam(teamId)}/>
	        <Image
	          style={{width: 250, height: 50}}
	          source={{uri: this.state.dataTeam.strTeamLogo}}
	        />
	   		</View>
	   		<View style={styles.nameText}>
		    	<Text style={{fontSize: 25}}>{this.state.dataTeam.strTeam}</Text>
		    	<Text style={{fontSize: 25}}>({this.state.dataTeam.strTeamShort})</Text>		    	
	      </View>
	      <View style={styles.infoText}>
		    	<Text>Current Manager: {this.state.dataTeam.strManager}</Text>
		    	<Text>Current Stadium: {this.state.dataTeam.strStadium}</Text>
	    	</View>
	  	
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
        </View>
        {/*<Image
	          style={{width: 250, height: 50}}
	          source={{uri: this.state.dataTeam.strTeamLogo}}
	        />*/}
      </TouchableOpacity>
    );
  }


  favoritePlayers(playerId){
  	this.props.postFavorite(playerId)
  	setTimeout(() => {
			this._storePlayer()
		}, 2000);
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetails);
