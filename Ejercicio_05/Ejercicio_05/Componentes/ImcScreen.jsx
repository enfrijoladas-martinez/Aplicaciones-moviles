import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function ImcScreen() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [resultado, setResultado] = useState(null);

  const calcularIMC = () => {
    if (!peso || !altura) return;

    const imc = (
      parseFloat(peso) /
      (parseFloat(altura) * parseFloat(altura))
    ).toFixed(2);

    setResultado(imc);
  };