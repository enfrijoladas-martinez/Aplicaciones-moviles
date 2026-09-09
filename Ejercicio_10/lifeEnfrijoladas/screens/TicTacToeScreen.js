import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';

export default function TicTacToeScreen() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);

  const handlePress = (index) => {
    if (board[index] || checkWinner(board)) return;
    const newBoard = [...board];
    newBoard[index] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setIsX(!isX);
  };

  const checkWinner = (squares) => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = checkWinner(board);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.status}>
        {winner ? `Ganador: ${winner}` : `Turno de: ${isX ? 'X' : 'O'}`}
      </Text>
      <View style={styles.grid}>
        {board.map((val, i) => (
          <TouchableOpacity key={i} style={styles.cell} onPress={() => handlePress(i)}>
            <Text style={styles.cellText}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Reiniciar" onPress={() => setBoard(Array(9).fill(null))} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  status: { fontSize: 16, marginBottom: 20 },
  grid: { width: 240, height: 240, flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  cell: { width: 80, height: 80, borderWidth: 1, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  cellText: { fontSize: 32, fontWeight: 'bold' }
});