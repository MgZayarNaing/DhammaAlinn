import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '@theme/colors';

const AudioItem = ({ audio, onToggleSave }) => {
  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {audio.title}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {audio.category}
        </Text>
      </View>
      <TouchableOpacity style={styles.action} onPress={onToggleSave}>
        <Icon name="cloud-off" size={22} color={COLORS.dark} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: COLORS.light,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textColor,
  },
  category: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.dark,
  },
  action: {
    padding: 6,
  },
});

export default AudioItem;
