import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Skeleton from './src/components/Skeleton';

const vpWidth = Dimensions.get('window').width;
const limit = 10;

const App = () => {
  const [imageData, setImageData] = useState([]);
  const [next, setNext] = useState<number>(0);
  const [loadMore, setLoadMore] = useState<boolean>(true);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [img, setImg] = useState()


  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    let query = `?skip=${next}&limit=${limit}`;

    axios
      .get('https://dummyjson.com/products' + query)
      .then(res => {
        if (res.data.products.length === 0) {
          setLoadMore(false);
        }
        setImageData([...imageData, ...res.data.products]);
        setNext(next + limit);
        setShowLoader(false)
      })
      .catch(err => {
        console.log("list",err);
      });
  };


  const openModal = useCallback((item) => () => {
    setModalVisible(true)
    setImg(item.thumbnail)
  }, [modalVisible, img])



  const renderItem = useCallback(({ item, index }) => {


    return (
            <TouchableOpacity style={{ flex: 1, }} onPress={openModal(item)}>
       
            <Image
            source={{ uri: item.thumbnail }}
            resizeMode="cover"
            style={{
              width: '100%',
              height: 200,
            }}
          />
      </TouchableOpacity>
       
    );
  }, []);

  const keyExtractor = useCallback(item => `${item.id}`, []);

  const itemSeparatorComponent = useCallback(() => {
    return <View style={{ height: 20 }} />;
  }, []);

  const onEndReached = useCallback(() => {
    if (loadMore) {
      setShowLoader(true)
      getData();
    }
  }, [loadMore, getData]);

  const listFooterComponent = useCallback(() => {

   
      return (
        <View style={{ flex:1, flexDirection:'row'}}>
          <Skeleton height={200} width={180} style={{   }} />
          <Skeleton height={200} width={180} style={{   }} />
        </View>
      )
    
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableOpacity style={styles.centeredView} activeOpacity={1}
            onPress={() => {
              setModalVisible(false);
            }}>
            <View style={styles.modalView}>
              <Image
                source={{ uri: img }}
                resizeMode="stretch"
                style={{
                  width: '100%',
                  height: 300,
                  borderRadius: 20
                }}
              />
            </View>
          </TouchableOpacity>
        </Modal>

      </View>


    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    width: "90%",
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
