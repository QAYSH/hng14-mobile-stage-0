import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Modal, 
  Platform,
  FlatList
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

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
      // Rates relative to 1 USD
      const rates: { [key: string]: number } = { USD: 1, EUR: 0.92, GBP: 0.79, NGN: 1480, JPY: 149.5 };
      // To convert from A to B: (value / rateA) * rateB
      return (value / rates[from]) * rates[to];
    }
  }
};

interface UnitSelectorProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  theme: any;
}

const UnitSelector = ({ label, value, options, onSelect, theme }: UnitSelectorProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.unitColumn}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.selectorButton, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.selectorValue, { color: theme.text }]} numberOfLines={1}>{value}</Text>
        <Ionicons name="chevron-down" size={16} color={theme.subtext} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.optionItem, 
                    item === value && { backgroundColor: '#007AFF15' }
                  ]}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[
                    styles.optionText, 
                    { color: theme.text },
                    item === value && { color: '#007AFF', fontWeight: 'bold' }
                  ]}>
                    {item}
                  </Text>
                  {item === value && <Ionicons name="checkmark" size={20} color="#007AFF" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default function UnitConverterScreen() {
  const { theme, isDarkMode } = useTheme();
  const [converterType, setConverterType] = useState<ConverterType>('length');
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(conversions.length.units[0]);
  const [toUnit, setToUnit] = useState(conversions.length.units[1]);
  const [result, setResult] = useState<number | null>(null);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      if (inputValue !== '') {
        Alert.alert('Invalid Input', 'Please enter a valid number');
      }
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

  useEffect(() => {
    const units = conversions[converterType].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setResult(null);
  }, [converterType]);

  const getTypeIcon = (type: ConverterType) => {
    switch(type) {
      case 'length': return 'resize-outline';
      case 'weight': return 'scale-outline';
      case 'temperature': return 'thermometer-outline';
      case 'currency': return 'cash-outline';
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.typeSelector, { backgroundColor: theme.card }]}>
        {(['length', 'weight', 'temperature', 'currency'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.typeButton, converterType === type && styles.typeButtonActive]}
            onPress={() => setConverterType(type)}
          >
            <Ionicons 
              name={getTypeIcon(type) as any} 
              size={20} 
              color={converterType === type ? '#fff' : theme.subtext} 
              style={{ marginBottom: 4 }}
            />
            <Text style={[styles.typeText, converterType === type ? styles.typeTextActive : { color: theme.subtext }]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.converterCard, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Value</Text>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: isDarkMode ? '#2A2A2A' : '#F9F9F9' }]}
          placeholder="Enter value..."
          placeholderTextColor={theme.subtext}
          keyboardType="numeric"
          value={inputValue}
          onChangeText={(text) => {
            setInputValue(text);
            if (text === '') setResult(null);
          }}
          onBlur={handleConvert}
        />

        <View style={styles.unitRow}>
          <UnitSelector 
            label="From" 
            value={fromUnit} 
            options={conversions[converterType].units} 
            onSelect={(val) => {
              setFromUnit(val);
              if (inputValue) handleConvert();
            }}
            theme={theme}
          />

          <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
            <Ionicons name="swap-horizontal" size={20} color="#fff" />
          </TouchableOpacity>

          <UnitSelector 
            label="To" 
            value={toUnit} 
            options={conversions[converterType].units} 
            onSelect={(val) => {
              setToUnit(val);
              if (inputValue) handleConvert();
            }}
            theme={theme}
          />
        </View>

        <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
          <Text style={styles.convertButtonText}>Convert</Text>
        </TouchableOpacity>

        {result !== null && (
          <View style={[styles.resultContainer, { borderTopColor: theme.border }]}>
            <Text style={[styles.resultLabel, { color: theme.subtext }]}>Result:</Text>
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                {result.toFixed(4)}
              </Text>
              <Text style={[styles.resultUnit, { color: theme.subtext }]}>
                {toUnit}
              </Text>
            </View>
            <Text style={[styles.formulaText, { color: theme.subtext }]}>
              {inputValue} {fromUnit} = {result.toFixed(4)} {toUnit}
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  typeSelector: { 
    flexDirection: 'row', 
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20, 
    padding: 6,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 3 }
    })
  },
  typeButton: { 
    flex: 1, 
    paddingVertical: 14, 
    alignItems: 'center', 
    borderRadius: 16,
    justifyContent: 'center'
  },
  typeButtonActive: { backgroundColor: '#007AFF' },
  typeText: { fontSize: 13, fontWeight: '700' },
  typeTextActive: { color: '#fff' },
  converterCard: { 
    margin: 16, 
    padding: 24, 
    borderRadius: 28,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 16 },
      android: { elevation: 8 }
    })
  },
  label: { fontSize: 12, fontWeight: '800', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  input: { 
    borderWidth: 1.5, 
    borderRadius: 18, 
    padding: 18, 
    fontSize: 24, 
    fontWeight: '700',
    marginBottom: 28 
  },
  unitRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 24 },
  unitColumn: { flex: 1 },
  selectorButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderWidth: 1.5, 
    borderRadius: 14, 
    padding: 14 
  },
  selectorValue: { fontSize: 15, fontWeight: '500', flex: 1 },
  swapButton: { 
    marginHorizontal: 12, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#007AFF', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 2
  },
  convertButton: { 
    backgroundColor: '#007AFF', 
    padding: 18, 
    borderRadius: 16, 
    alignItems: 'center', 
    marginTop: 8,
    ...Platform.select({
      ios: { shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
      android: { elevation: 8 }
    })
  },
  convertButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  resultContainer: { marginTop: 24, paddingTop: 24, borderTopWidth: 1, alignItems: 'center' },
  resultLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  resultValueContainer: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 4 },
  resultValue: { fontSize: 32, fontWeight: '800', color: '#007AFF', marginRight: 8 },
  resultUnit: { fontSize: 18, fontWeight: '600' },
  formulaText: { fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  
  // Modal Styles
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    borderTopLeftRadius: 32, 
    borderTopRightRadius: 32, 
    maxHeight: '60%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20
  },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 24, 
    borderBottomWidth: 1 
  },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  optionItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 16
  },
  optionText: { fontSize: 17, fontWeight: '500' }
});