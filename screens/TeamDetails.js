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
  AsyncStorage,
  TouchableWithoutFeedback,
} from 'react-native';
import { WebBrowser } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { postFavorite, setTimer } from '../actions/ActionCreators';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';

import { MonoText } from '../components/StyledText';

const mapStateToProps = state => {
	return {
		favorites: state.favorites,
		timer: state.timer
	}
}
const mapDispatchToProps = dispatch=> ({
	postFavorite: (playerId) => dispatch(postFavorite(playerId)),
	setTimer: (duration) => dispatch(setTimer(duration))
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
      heart: false,
      home: false,
      totalDuration: 0,
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

	// API call for all listed players on the team
	players(){
		fetch("https://www.thesportsdb.com/api/v1/json/1/lookup_all_players.php?id="+this.props.navigation.state.params.uid)
    .then(response => response.json())
    .then((responseJson)=>{
      this.setState({
        dataPlayers: responseJson.player
      })
    }).catch(error=>console.log(error))
	}

	// API call for the team current information
	team(){
		fetch("https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id="+this.props.navigation.state.params.uid)
    .then(response => response.json())
    .then((responseJson)=>{
      this.setState({
        dataTeam: responseJson.teams[0]
      })
    }).catch(error=>console.log(error))
	}

	// API call for the next 5 games 
	schedule(){
    fetch("https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id="+this.props.navigation.state.params.uid)
    .then(response => response.text()) 
    .then((dataStr) => {
      let responseJson = JSON.parse(dataStr);
      this.setState({
      	dataNext:responseJson.events[0]
      })
      var teamId = this.props.navigation.getParam('uid','');
  		var ownerId = this.state.dataNext.idHomeTeam;
  		if (teamId == ownerId){
	  		this.setState({
	  			home: true
	  		})
	  	}
    }).catch(error=>console.log(error))
	}

	timeTillGame(){
		var date = moment().utcOffset('+05:30').format('YYYY-MM-DD hh:mm:ss');
		var gameDay = this.state.dataNext.dateEvent + ' ' +this.state.dataNext.strTime
		var differ = moment.duration(moment(gameDay).diff(moment(date)));
		var hours = parseInt(differ.asHours());
		var minutes = parseInt(differ.minutes());
		var seconds = parseInt(differ.seconds());
		let d = hours*3600 + minutes*60 + seconds*60
		this.props.setTimer(d)
	}

  // check if the team is users favorite and load information regardless
  componentWillMount() {
  	AsyncStorage.getItem('favoriteTeam')
    .then(req => {
    	if (req == this.props.navigation.state.params.uid){
    		this.setState({
	        heart: true
	      })
    	}
    })

    this.team();
    this.players();
    this.schedule();  	
  }

  componentDidUpdate(){
  	this.timeTillGame();
  }

  // Populate redux state and store the favarite players to local storage
  favoritePlayers(playerId){
  	this.props.postFavorite(playerId)
  	setTimeout(() => {
			this._storePlayer()
		}, 2000);
	}

  render() {
  	const teamId = this.props.navigation.getParam('uid','');
	  return(
	   	<ScrollView style={styles.container}>
	   		<View style={styles.top}>
	   			<Image
	          style={{width: 150, height: 150}}
	          source={{uri: this.state.dataTeam.strTeamBadge}}
	        />
	        <Ionicons  
			    	name={this.state.heart ? "md-heart" : "md-heart-empty"}
			    	style={{paddingRight: 15, paddingTop: 10}}
			    	size={30}
			    	color="red"
			    	onPress={() => this._setTeam(teamId)}/>
	        <Image
	          style={{width: 250, height: 100}}
	          source={{uri: this.state.dataTeam.strTeamLogo}}
	        />
	   		</View>
	   		<View style={styles.nameText}>
		    	<Text style={{fontSize: 20, paddingBottom: 5}}>{this.state.dataTeam.strTeam}</Text>
		    	<Text style={{fontSize: 20, paddingBottom: 5}}>({this.state.dataTeam.strTeamShort})</Text>		    	
	      </View>
	      <View style={styles.infoTeam}>
		    	<Text style={{fontSize: 20, paddingBottom: 5}}>Current Manager:  {this.state.dataTeam.strManager}</Text>
		    	<Text style={{fontSize: 20, paddingBottom: 15}}>Current Stadium:  {this.state.dataTeam.strStadium}</Text>
	    	</View>
	    	<View style={styles.eventDisplay}>
	    		<View style={styles.eventHeader}>
	    			<Text style={styles.homeText}>Home</Text>
	    			<Text style={styles.awayText}>Away</Text>
	    		</View>
		  		<View style={this.state.home ? styles.homeDisplay : styles.awayDisplay}>
		  			<Text style={styles.upText}>Upcoming</Text>
		  			<CountDown
		          until={this.props.timer}
		          timeLabelStyle={{color: 'white'}}
		          digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
		          size={18}
		          timeToShow= {['D', 'H', 'M', 'S']}
		          timeLabels={{d: 'dd',h: 'hh',m: 'mm', s: 'ss'}}
		        />
		  			<View style={styles.eventInfo}>
		  				<Text style={styles.versusText}>{this.state.dataNext.strHomeTeam}</Text>
		  				<Text style={styles.versusText}>VS</Text>
		  				<Text style={styles.versusText}>{this.state.dataNext.strAwayTeam}</Text>
		  			</View>
		      </View>
		  	</View>
		  	<View style={styles.players}>
		  		<Text>CURRENT PLAYERS</Text>
		  		<FlatList
		        data={this.state.dataPlayers}
		        renderItem= {item => this.renderPlayers(item)}
		        />
		  	</View>
	  	</ScrollView>
    );
  }

  renderPlayers =(data)=>{
  	const favorited =  this.props.favorites.some(el => el === data.item.idPlayer);
    return(
      <View style={styles.list}>
        <Image
          style={styles.playerThumb}
          source={{uri: data.item.strThumb}}
        	/>
        <View style={styles.playerInfo}>
		      <Text style={styles.lightText}>{data.item.strPlayer}</Text>
		      <Text style={styles.lightText}>{data.item.strPosition}</Text>
        </View>
        <Ionicons  
		    	name={favorited ? 'md-star' : 'md-star-outline'}
		    	size={30}
		    	color="gold"
		    	onPress={() => this.favoritePlayers(data.item.idPlayer)}/>
      </View>
    );
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
		paddingTop: 25,
		paddingBottom: 25
	},
	nameText: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		alignItems: 'flex-start',
	},
	infoTeam: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	},
	list:{
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
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
	},
	eventHeader:{
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		flexDirection: 'row'
	},
	homeText: {
		fontSize: 15,
		color: 'white',
		fontWeight: 'bold',
		padding: 8,
		backgroundColor: '#73aedb',
		borderColor:'#73aedb',
		borderWidth: 1,
		borderRadius: 10,
	},
	awayText: {
		fontSize: 15,
		color: 'white',
		fontWeight: 'bold',
		padding: 8,
		backgroundColor: '#f29898',
		borderColor:'#f29898',
		borderWidth: 1,
		borderRadius: 50,
	},
	upText: {
		fontSize: 20,
		color: 'white',
		fontWeight: 'bold',
		paddingHorizontal: 5,
	},
	eventInfo: {
		alignItems: 'center'
	},
	versusText: {
		fontSize: 25,
		flexWrap: 'wrap',
		color: 'white',
	},
	homeDisplay: {
		paddingVertical: 5,
		backgroundColor: '#73aedb',
	},
	awayDisplay: {
		paddingVertical: 5,
		backgroundColor: '#f29898',
	},
	players: {
		paddingTop: 30,
	},
	lightText: {
		fontSize: 15,
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetails);
