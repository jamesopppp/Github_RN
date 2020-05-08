import AsyncStorage from '@react-native-community/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao {
  constructor(flag) {
    this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
  }

  /**
   * 收藏项目，保存收藏的项目
   * @param {string} key 项目id
   * @param {string} value 收藏的项目
   * @param {function} callback
   */
  saveFavoriteItem(key, value, callback) {
    AsyncStorage.setItem(key, value, (error, result) => {
      if (!error) {
        this.updateFavoriteKeys(key, true);
      }
    });
  }

  updateFavoriteKeys(key, isAdd) {
    AsyncStorage.getItem(this.favoriteKey, (error, result) => {
      if (!error) {
        let favoriteKeys = [];
        if (result) {
          favoriteKeys = JSON.parse(result);
        }
        let index = favoriteKeys.indexOf(key);
        if (isAdd) {
          //如果是添加且key不存在则添加到数组中
          if (index === -1) {
            favoriteKeys.push(key);
          }
        } else {
          //如果是删除且key存在则将
          if (index !== -1) {
            favoriteKeys.splice(index, 1);
          }
        }
        AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
      }
    });
  }
}
