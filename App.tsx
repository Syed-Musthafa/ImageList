import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

const vpWidth = Dimensions.get('window').width;
const limit = 10;

const App = () => {
  const [imageData, setImageData] = useState([]);
  const [next, setNext] = useState<number>(0);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);


  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let query = `?skip=${next}&limit=${limit}`;

    axios
      .get('https://dummyjson.com/products' + query)
      .then(res => {
        console.log(res.data);
        if (res.data.products.length === 0) {
          setLoadMore(false);
        }
        setImageData([...imageData, ...res.data.products]);
        setNext(next + limit);
        setShowLoader(false)
      })
      .catch(err => {
        console.log(err);
      });
  };

  console.log('imageData', imageData);

  const renderItem = useCallback(({item, index}) => {
    // let min = 50;
    // let max = 200;

    // let img_height = Math.floor(Math.random() * (max - min + 1)) + min;

    return (
      <View style={{flex: 1}}>
        <Image
          source={{uri: item.thumbnail}}
          resizeMode="cover"
          style={{
            width: '100%',
            height: 200,
            // height: parseInt(Math.max(0.5, Math.random()) * vpWidth),
          }}
        />
      </View>
    );
  }, []);

  const keyExtractor = useCallback(item => `${item.id}`, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View style={{height: 20}} />;
  }, []);

  const onEndReached = useCallback(() => {
    if (loadMore) {
      setShowLoader(true)
      getData();
    }
  }, [loadMore, getData]);

  const listFooterComponent = useCallback(() => {
    return <ActivityIndicator style={{marginVertical: 20}} size="large" />;
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <FlatList
          data={imageData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          ItemSeparatorComponent={itemSeparatorComponent}
          onEndReached={onEndReached}
          ListFooterComponent={showLoader && listFooterComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
