import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
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

class LoadingScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor() {
    super();
  }

  _teamCheckAsync = async () => {
    try {
      AsyncStorage.getItem('favoriteTeam')
      .then((req) => {
        console.log('======> Its pickle Req <======', req)
        this.props.navigation.navigate(req == null ? 'Home' 
          : 'TeamDetails', {uid:req});
      })
      .catch(error => {
        this.setState({ error })
      })
    } catch (error) {
      console.log('Loading error Team', error)
    }

  };

  _retrievePlayers = async () => {
    try {
      const value = await AsyncStorage.getItem('favoritePlayers');
      if (value !== null) {
        return AsyncStorage.getItem('favoritePlayers')
              .then(req => JSON.parse(req))
              .then(json => {
                console.log('Heres Jason', json)
                this.props.postFavorite(json.favorites)
              });
      }
    } catch (error) {
      console.log('Loading error player', error)
    }
  };


  componentWillMount() {
    console.log('RELOADING')
    this._retrievePlayers();
    this._teamCheckAsync();
  }

  render() {
    return(
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen);
