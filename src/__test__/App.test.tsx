/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders learn react link', () => {
  render(<App />);
  const videoContainer = screen.getByTestId('video-container');
  expect(videoContainer).toBeInTheDocument();

  const videoElement = videoContainer.getElementsByTagName('video')[0];
  expect(videoElement).toBeInTheDocument();

  const canvasElements = videoContainer.getElementsByTagName('canvas');
  expect(canvasElements.length).toBe(1);
});
