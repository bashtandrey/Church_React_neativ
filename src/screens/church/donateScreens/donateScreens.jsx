import React, { useState } from 'react';
import {

SafeAreaView,
View,
Text,
TextInput,
TouchableOpacity,
ScrollView,
StyleSheet,
Alert,
} from 'react-native';

const DonateScreens = ({ navigation }) => {
const [amount, setAmount] = useState('');
const [note, setNote] = useState('');

const presetAmounts = [50, 100, 200];

const handlePreset = (value) => setAmount(String(value));

const handleDonate = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
        Alert.alert('Помилка', 'Введіть суму пожертвування');
        return;
    }
    // TODO: інтегрувати платіжну логіку (Stripe, PayPal і т.д.)
    console.log('Donate:', { amount: parsed, note });
    Alert.alert('Дякуємо!', `Ви пожертвували ${parsed} грн`);
    setAmount('');
    setNote('');
    // navigation.navigate('ThankYou'); // розкоментуйте при наявності екрану подяки
};

return (
    <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Пожертвування</Text>

            <Text style={styles.label}>Оберіть суму</Text>
            <View style={styles.presets}>
                {presetAmounts.map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[
                            styles.presetButton,
                            String(p) === amount && styles.presetButtonActive,
                        ]}
                        onPress={() => handlePreset(p)}
                    >
                        <Text
                            style={[
                                styles.presetText,
                                String(p) === amount && styles.presetTextActive,
                            ]}
                        >
                            {p} грн
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.label}>Інша сума</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Введіть суму у грн"
                value={amount}
                onChangeText={setAmount}
            />

            <Text style={styles.label}>Примітка (необов'язково)</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Наприклад: на потреби церкви"
                value={note}
                onChangeText={setNote}
                multiline
            />

            <TouchableOpacity
                style={[styles.donateButton, !amount && styles.donateButtonDisabled]}
                onPress={handleDonate}
                disabled={!amount}
            >
                <Text style={styles.donateText}>Пожертвувати</Text>
            </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
);
};

export default DonateScreens;

const styles = StyleSheet.create({
container: { flex: 1, backgroundColor: '#fff' },
content: { padding: 20 },
title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#222' },
label: { fontSize: 14, marginTop: 12, marginBottom: 8, color: '#444' },
presets: { flexDirection: 'row', gap: 10 },
presetButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
},
presetButtonActive: { backgroundColor: '#2b6cb0' },
presetText: { color: '#333', fontWeight: '600' },
presetTextActive: { color: '#fff' },
input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
},
textArea: { minHeight: 80, textAlignVertical: 'top' },
donateButton: {
    marginTop: 24,
    backgroundColor: '#2b6cb0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
},
donateButtonDisabled: { backgroundColor: '#a0b4d0' },
donateText: { color: '#fff', fontWeight: '700', fontSize: 16 },
}); 
