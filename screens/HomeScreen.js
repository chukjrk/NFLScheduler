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

let colors = ['#121212', '#ffffff'];

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props){
    super(props);
    this.state = {
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

  renderFlatListStickyHeader(){
    var stickyHeaderView = (
      <View style={styles.headerStyle}>
        <Text style={{textAlign: 'center', color: '#BB86FC', fontSize: 22, }}> NFL </Text>
      </View>
    );
    return stickyHeaderView;
  };

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
            keyExtractor={(item, index) => item.idTeam}
            ItemSeperatorComponent = {this.FlatListItemSeperator}
            renderItem= {(item, index) => this.renderItem(item, index)}
            ListHeaderComponent={this.renderFlatListStickyHeader}
            stickyHeaderIndices={[0]}
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

  renderItem=(data, index)=>{
    console.log('this is an index', index)
    return(
      <View style={{ backgroundColor: colors[index % colors.length] }}>
        <TouchableOpacity style={styles.list} onPress={() => this._gotoTeam(data)}>
          <Text style={styles.teamName}>{data.item.strTeam}</Text> 
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
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
    paddingVertical: 20,
    marginHorizontal: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ffffff50',
  },
  teamName: {
    fontSize: 17,
    color: 'white'
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  headerStyle:{ 
    width: '100%', 
    height: 65, 
    backgroundColor: '#292929', 
    alignItems: 'center', 
    justifyContent: 'center'
  }
});
