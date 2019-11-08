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
	  } catch (error) {
	    console.log('Error saving player', error)
	  }
	};

  _storePlayer = async () => {
  	const currentState = this.props.favorites;
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
	  	<View style={styles.container}>
      	<View style={styles.fixedHeader}>
          <View style={styles.top}>
		   			<Image
		          style={{width: 40, height: 40, paddingTop: 10}}
		          source={{uri: this.state.dataTeam.strTeamBadge}}
		        />
		        <View style={styles.nameText}>
				    	<Text style={{fontSize: 20, color: '#BB86FC', paddingVertical: 5}}>{this.state.dataTeam.strTeam}</Text>
              <Text style={{fontSize: 15, color: '#BB86FC80'}}>({this.state.dataTeam.strTeamShort})</Text>
			      </View>
		        <Ionicons  
				    	name={this.state.heart ? "md-heart" : "md-heart-empty"}
				    	style={{paddingRight: 5, paddingTop: 5}}
				    	size={30}
				    	color="red"
				    	onPress={() => this._setTeam(teamId)}/>
		   		</View>
	   		</View>
	   	<ScrollView>
	    	<View style={styles.eventDisplay}>
	    		<View style={styles.eventHeader}>
            <Text style={styles.upText}>Upcoming</Text>
            <View style={styles.eventHeaderSub}>
  	    			<Text style={ this.state.home ? styles.homeText : styles.homeText2 }>Home</Text>
  	    			<Text style={ this.state.home ? styles.awayText2  : styles.awayText }>Away</Text>
            </View>
	    		</View>
		  		<View>
		  			<CountDown
		          until={this.props.timer}
		          timeLabelStyle={{color: 'white'}}
		          digitStyle={{backgroundColor: 'white', borderWidth: 2, borderColor: '#121212'}}
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
		  	<View style={styles.firstSection}>
		      <View style={styles.infoTeam}>
		      	<Text style={{fontSize: 15, color: '#BB86FC', paddingBottom: 5}}>{this.state.dataTeam.intFormedYear}</Text>
			    	<Text style={{fontSize: 20, color: 'white', paddingBottom: 5}}>Current Manager:  {this.state.dataTeam.strManager}</Text>
			    	<Text style={{fontSize: 20, color: 'white', paddingBottom: 15}}>Current Stadium:  {this.state.dataTeam.strStadium}</Text>
		    	</View>
		    </View>
		  	<View style={styles.players}>
		  		<Text style={{padding: 8, color: '#BB86FC', borderBottomWidth: StyleSheet.hairlineWidth}}>CURRENT ROSTER</Text>
		  		<FlatList
		        data={this.state.dataPlayers}
		        renderItem= {item => this.renderPlayers(item)}
		        />
		  	</View>
	  	</ScrollView>
	  	</View>
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
		    	color="white"
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
		backgroundColor: '#121212',
	},
  fixedHeader: {
    backgroundColor: '#292929',
  },
	top:{
		flexDirection: 'row',
    padding: 8,
    paddingTop: 15,
		justifyContent: 'space-between',
		flexWrap: 'wrap',
	},
	nameText: {
		justifyContent: 'space-between',
		flexWrap: 'wrap',
		flexDirection: 'column',
    alignItems: 'center'
	},
	firstSection: {
		backgroundColor: '#ffffff14',
		margin: 5,
		padding: 8,
		borderRadius: 5,
    alignItems: 'flex-start'
	},
	infoTeam: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	},
	eventDisplay: {
		backgroundColor: '#ffffff14',
		margin: 5,
		padding: 8,
		borderRadius: 5,
		shadowColor: 'black',
		shadowOpacity: 1
	},
	list:{
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		borderBottomWidth: StyleSheet.hairlineWidth,
		borderBottomColor: '#ffffff',
		padding: 8,
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
		justifyContent: 'space-between',
		// alignItems: 'flex-end',
		flexDirection: 'row'
	},
  eventHeaderSub: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },
	homeText: {
		fontSize: 15,
		color: 'white',
		fontWeight: 'bold',
		padding: 8,
    marginHorizontal: 5,
    marginBottom: 5
	},
  homeText2: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    borderColor:'#03DAC5',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 5
  },
	awayText: {
		fontSize: 15,
		color: 'white',
		fontWeight: 'bold',
		padding: 8,
    marginHorizontal: 5,
    marginBottom: 5
	},
  awayText2: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    padding: 8,
    borderColor:'#ffab40',
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 5,
    marginBottom: 5
  },
	upText: {
		fontSize: 20,
		color: '#BB86FC',
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
	players: {
		paddingTop: 30,
	},
	lightText: {
		fontSize: 15,
		color: 'white'
	}
})

export default connect(mapStateToProps, mapDispatchToProps)(TeamDetails);
