import React from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../utils/index'

export default function ReloadIcon({ load }) {
  const reloadIconName = Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'
  return (
    <View style={styles.reloadIcon}>
      <Ionicons onPress={load} name={reloadIconName} size={24} color={colors.PRIMARY} />
    </View>
  )
}

const styles = StyleSheet.create({
  reloadIcon: {
    position: 'absolute',
    top: 30,
    right: 20
  }
})
