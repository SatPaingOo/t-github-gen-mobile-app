/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { AppProvider } from '@/contexts/AppContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { createInMemoryAdapter } from './helpers/inMemoryAdapter';
import { NotesScreen } from '@/screens/NotesScreen';
import { TodosScreen } from '@/screens/TodosScreen';

test('NotesScreen renders empty state', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <ThemeProvider>
        <AppProvider adapter={createInMemoryAdapter()}>
          <NotesScreen />
        </AppProvider>
      </ThemeProvider>,
    );
  });
  const texts = tree!.root.findAllByType(Text).map(t => t.props.children);
  expect(texts.some(c => String(c).includes('No notes yet'))).toBe(true);
});

test('TodosScreen renders empty state', async () => {
  let tree: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <ThemeProvider>
        <AppProvider adapter={createInMemoryAdapter()}>
          <TodosScreen />
        </AppProvider>
      </ThemeProvider>,
    );
  });
  const texts = tree!.root.findAllByType(Text).map(t => t.props.children);
  expect(texts.some(c => String(c).includes('All clear'))).toBe(true);
});
