import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FeatureCard from '../../components/common/MentalCard';
import BackButton from '../../components/common/BackButton';
import AppBackgroundWithMascot from '../../components/common/AppBackgroundWithMascot';
import NavBar from '../../components/common/NavBar';

const { width, height } = Dimensions.get('window');

export default function MentalScreen({ navigation }) {
    
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const q = [
            {
                question: "ฉันรู้สึกยากที่จะผ่อนคลาย",
                choices: [
                    "วันนี้ฉันผ่อนคลายได้ดี",
                    "รู้สึกเฉย ๆ ไม่ได้ผ่อนคลายมากนัก",
                    "วันนี้ฉันผ่อนคลายได้นิดหน่อย",
                    "วันนี้ฉันผ่อนคลายไม่ได้เลย",
                ]
            },
            {
                question: "ฉันรู้สึกรับรู้ได้ว่าปากของฉันแห้ง",
                choices: [
                    "ไม่มีอาการปากแห้งเลย",
                    "ปากแห้งบ้างแต่ไม่รบกวน",
                    "ปากค่อนข้างแห้ง รู้สึกได้ชัด",
                    "ปากแห้งมากจนรบกวนมาก",
                ]
            }
        ];
        setQuestions(q);
    }, []);

    if (questions.length === 0) return null;

    const qData = questions[currentIndex];

    const handleSelect = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            navigation.navigate("MentalSummaryScreen");
        }
    };

    return (
        <AppBackgroundWithMascot>
            <BackButton navigation={navigation} />
            <NavBar navigation={navigation} />

            <View style={styles.speechBubble}>

                <View style={styles.speechBubbleTail} />

                <View style={styles.contentWrapper}>

                    <Text style={styles.greeting}>{qData.question}</Text>

                    <View style={styles.grid}>
                        {qData.choices.map((item, index) => (
                            <FeatureCard
                                key={index}
                                title={item}
                                colors={pickColors(index)}
                                onPress={handleSelect}
                            />
                        ))}
                    </View>

                </View>
            </View>

        </AppBackgroundWithMascot>
    );
}

function pickColors(index) {
    const sets = [
        ['#ff616f', '#ff94fc'], 
        ['#fff7ad', '#ffa9f9'], 
        ['#38beef', '#8ce0ff'],
        ['#48ee6c', '#e894ff']
    ];
    return sets[index % sets.length];
}

const styles = StyleSheet.create({
    speechBubble: {
        backgroundColor: '#fff',
        borderRadius: 30,
        width: width * 1,
        alignSelf: 'center',
        height: '100%',
        marginTop: height * 0.45,
        paddingBottom: 30,
        elevation: 8,
    },
    speechBubbleTail: {
        position: 'absolute',
        top: -15,
        left: 40,
        width: 0,
        height: 0,
        borderLeftWidth: 15,
        borderRightWidth: 15,
        borderBottomWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
    },
    contentWrapper: {
        padding: 20,
        paddingTop: 35,
    },
    greeting: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        color: '#333',
        marginBottom: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
});
