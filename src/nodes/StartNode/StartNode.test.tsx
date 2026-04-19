// @vitest-environment jsdom
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, vi } from 'vitest';
import { StartNodeComponent } from './index';
import { NodeProps } from 'reactflow';

// Mock the ReactFlow Handle component and useNodeValidation hook
vi.mock('reactflow', () => ({
  Handle: () => <div data-testid="mock-handle"></div>,
  Position: { Right: 'right', Left: 'left' }
}));

vi.mock('../../hooks/useNodeValidation', () => ({
  useNodeValidation: () => ({ isValid: true, errors: {} })
}));

describe('StartNodeComponent RTL Test', () => {
  it('renders the Start Node label properly', () => {
    const mockData = { label: 'Start onboarding', type: 'start' };
    
    const mockProps: NodeProps = {
      id: "node-1",
      data: mockData,
      selected: false,
      zIndex: 1,
      isConnectable: true,
      xPos: 0,
      yPos: 0,
      dragging: false,
      type: "start"
    };

    render(<StartNodeComponent {...mockProps} />);

    expect(screen.getByText('Workflow Start')).toBeInTheDocument();
    expect(screen.getByText('Start onboarding')).toBeInTheDocument();
  });
});
