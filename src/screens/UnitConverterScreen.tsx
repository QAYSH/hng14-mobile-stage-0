import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type ConverterType = 'length' | 'weight' | 'temperature' | 'currency';

const conversions = {
  length: {
    units: ['Meters', 'Kilometers', 'Miles', 'Feet', 'Inches'],
    convert: (value: number, from: string, to: string): number => {
      const toMeters: { [key: string]: number } = { Meters: 1, Kilometers: 1000, Miles: 1609.34, Feet: 0.3048, Inches: 0.0254 };
      return (value * toMeters[from]) / toMeters[to];
    }
  },
  weight: {
    units: ['Kilograms', 'Grams', 'Pounds', 'Ounces'],
    convert: (value: number, from: string, to: string): number => {
      const toKg: { [key: string]: number } = { Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495 };
      return (value * toKg[from]) / toKg[to];
    }
  },
  temperature: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    convert: (value: number, from: string, to: string): number => {
      let celsius: number;
      if (from === 'Celsius') celsius = value;
      else if (from === 'Fahrenheit') celsius = (value - 32) * 5/9;
      else celsius = value - 273.15;
      
      if (to === 'Celsius') return celsius;
      if (to === 'Fahrenheit') return (celsius * 9/5) + 32;
      return celsius + 273.15;
    }
  },
  currency: {
    units: ['USD', 'EUR', 'GBP', 'NGN', 'JPY'],
    convert: (value: number, from: string, to: string): number => {
      const rates: { [key: string]: number } = { USD: 1, EUR: 0.92, GBP: 0.79, NGN: 1480, JPY: 149.5 };
      return (value * rates[from]) / rates[to];
    }
  }
};

export default function UnitConverterScreen() {
  const [converterType, setConverterType] = useState<ConverterType>('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(conversions.length.units[0]);
  const [toUnit, setToUnit] = useState(conversions.length.units[1]);
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      Alert.alert('Invalid Input', 'Please enter a valid number');
      return;
    }
    const converted = conversions[converterType].convert(value, fromUnit, toUnit);
    setResult(converted);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (inputValue) handleConvert();
  };

  React.useEffect(() => {
    const units = conversions[converterType].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setResult(null);
  }, [converterType]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.typeSelector}>
        {(['length', 'weight', 'temperature', 'currency'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, converterType === type && styles.typeButtonActive]}
            onPress={() => setConverterType(type)}
          >
            <Text style={[styles.typeText, converterType === type && styles.typeTextActive]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.converterCard}>
        <Text style={styles.label}>Value</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter value..."
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
        />

        <View style={styles.unitRow}>
          <View style={styles.unitColumn}>
            <Text style={styles.label}>From</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={fromUnit} onValueChange={setFromUnit} style={styles.picker}>
                {conversions[converterType].units.map((unit) => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
            <Text style={styles.swapText}>⇄</Text>
          </TouchableOpacity>

          <View style={styles.unitColumn}>
            <Text style={styles.label}>To</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={toUnit} onValueChange={setToUnit} style={styles.picker}>
                {conversions[converterType].units.map((unit) => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        {result !== null && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Result:</Text>
            <Text style={styles.resultValue}>
              {inputValue} {fromUnit} = {result.toFixed(4)} {toUnit}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  typeSelector: { flexDirection: 'row', margin: 20, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  typeButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8 },
  typeButtonActive: { backgroundColor: '#007AFF' },
  typeText: { fontSize: 14, color: '#666', fontWeight: '500' },
  typeTextActive: { color: '#fff' },
  converterCard: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 20 },
  unitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  unitColumn: { flex: 1 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, overflow: 'hidden' },
  picker: { height: 50 },
  swapButton: { marginHorizontal: 15, width: 40, height: 40, borderRadius: 20, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center' },
  swapText: { fontSize: 20, color: '#fff' },
  convertButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  convertButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultContainer: { marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee', alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#666' },
  resultValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF', marginTop: 5 },
});