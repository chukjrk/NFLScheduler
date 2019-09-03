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
  FlatList
} from 'react-native';
import { WebBrowser } from 'expo';
import Book from '../screens/TeamDetails'
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state ={
      loading: true,
      dataSource:[]
    };
  }

  componentDidMount(){
    fetch("https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?l=NFL")
    .then(response => response.json())
    .then((responseJson)=>{
      this.setState({
        loading:false,
        dataSource: responseJson.teams
      })
    })
    .catch(error=>console.log(error))
  }

  render() {
    if(this.state.loading){
      return( 
        <View style={styles.loader}> 
          <ActivityIndicator size="large" color="#0c9"/>
        </View>
    )}
    return (
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <FlatList
            data={this.state.dataSource}
            ItemSeperatorComponent = {this.FlatListItemSeperator}
            renderItem= {item => this.renderItem(item)}
            />
        </View>
      </View>
    );
  }

  _gotoTeam(teamData){
    this.props.navigation.navigate('TeamDetails',{ title:teamData.item.strTeam, uid:teamData.item.idTeam});
  }

  FlatListItemSeparator(){
    return (
      <View style={{
         height: .5,
         width:"100%",
         backgroundColor:"rgba(0,0,0,0.5)"}}
      />
    );
  }

  renderItem=(data)=>{
    return(
      <TouchableOpacity style={styles.list} onPress={() => this._gotoTeam(data)}>
        <Text style={styles.teamName}>{data.item.strTeam}</Text> 
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  loader:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  list:{
    paddingVertical: 4,
    margin: 5,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderRadius: 5
  },
  teamName: {
    fontSize: 17,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  }
});
