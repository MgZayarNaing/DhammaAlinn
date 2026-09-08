import { Text, StyleSheet } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { COLORS } from '@theme/colors'
import { name as APP_NAME } from '../../app.json';

const ScreenHeader = ({ title = APP_NAME }) => {
    return (
        <>
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[COLORS.primary, COLORS.secondary, COLORS.primary]}
                locations={[0, 0.5, 1]}
                style={styles.header}
            >
                <Text style={styles.headerTitle} numberOfLines={1}>
                    {title}
                </Text>
            </LinearGradient>
        </>
    )
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.primary,
        fontStyle:'italic'
    },
});

export default ScreenHeader
