/*
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditableGoals from './EditableGoals';
import type { Goals } from '@/lib/types';

const mockGoals: Goals = {
  shortTerm: ['Reduce pain to 3/10', 'Improve sleep quality'],
  longTerm: ['Return to sports', 'Live pain-free'],
  functionalGoals: ['Walk for 15 minutes', 'Lift light objects']
};

const mockOnSave = jest.fn();

describe('EditableGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial goals data in English', () => {
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText('Short-term Goals (1-4 weeks)')).toBeInTheDocument();
    expect(screen.getByLabelText('Long-term Goals (1-3 months)')).toBeInTheDocument();
    
    // Check if short-term goals are populated
    const shortTermTextarea = screen.getByDisplayValue('Reduce pain to 3/10\nImprove sleep quality');
    expect(shortTermTextarea).toBeInTheDocument();
    
    // Check if long-term goals are populated
    const longTermTextarea = screen.getByDisplayValue('Return to sports\nLive pain-free');
    expect(longTermTextarea).toBeInTheDocument();
  });

  it('renders with initial goals data in Arabic', () => {
    render(
      <EditableGoals
        goals={mockGoals}
        locale="ar"
        onSave={mockOnSave}
      />
    );

    expect(screen.getByLabelText('الأهداف قصيرة المدى (1-4 أسابيع)')).toBeInTheDocument();
    expect(screen.getByLabelText('الأهداف طويلة المدى (1-3 أشهر)')).toBeInTheDocument();
    expect(screen.getByText('حفظ التغييرات')).toBeInTheDocument();
  });

  it('updates short-term goals when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('Short-term Goals (1-4 weeks)');
    
    await user.clear(shortTermTextarea);
    await user.type(shortTermTextarea, 'New short term goal\nAnother goal');

    expect(shortTermTextarea).toHaveValue('New short term goal\nAnother goal');
  });

  it('updates long-term goals when user types', async () => {
    const user = userEvent.setup();
    
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const longTermTextarea = screen.getByLabelText('Long-term Goals (1-3 months)');
    
    await user.clear(longTermTextarea);
    await user.type(longTermTextarea, 'New long term goal\nAnother long goal');

    expect(longTermTextarea).toHaveValue('New long term goal\nAnother long goal');
  });

  it('calls onSave with correct data when save button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('Short-term Goals (1-4 weeks)');
    const longTermTextarea = screen.getByLabelText('Long-term Goals (1-3 months)');
    const saveButton = screen.getByText('Save Changes');

    // Update goals
    await user.clear(shortTermTextarea);
    await user.type(shortTermTextarea, 'Updated short goal 1\nUpdated short goal 2');
    
    await user.clear(longTermTextarea);
    await user.type(longTermTextarea, 'Updated long goal 1\nUpdated long goal 2');

    // Click save
    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      shortTerm: ['Updated short goal 1', 'Updated short goal 2'],
      longTerm: ['Updated long goal 1', 'Updated long goal 2'],
      functionalGoals: ['Updated short goal 1', 'Updated short goal 2', 'Updated long goal 1', 'Updated long goal 2']
    });
  });

  it('filters out empty lines when saving', async () => {
    const user = userEvent.setup();
    
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('Short-term Goals (1-4 weeks)');
    const saveButton = screen.getByText('Save Changes');

    // Add goals with empty lines
    await user.clear(shortTermTextarea);
    await user.type(shortTermTextarea, 'Goal 1\n\n\nGoal 2\n   \nGoal 3');

    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({
        shortTerm: ['Goal 1', 'Goal 2', 'Goal 3']
      })
    );
  });

  it('handles empty goals gracefully', async () => {
    const user = userEvent.setup();
    
    render(
      <EditableGoals
        goals={{ shortTerm: [], longTerm: [], functionalGoals: [] }}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('Short-term Goals (1-4 weeks)');
    const longTermTextarea = screen.getByLabelText('Long-term Goals (1-3 months)');
    const saveButton = screen.getByText('Save Changes');

    expect(shortTermTextarea).toHaveValue('');
    expect(longTermTextarea).toHaveValue('');

    await user.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      shortTerm: [],
      longTerm: [],
      functionalGoals: []
    });
  });

  it('displays correct placeholders in English', () => {
    render(
      <EditableGoals
        goals={{ shortTerm: [], longTerm: [], functionalGoals: [] }}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('Short-term Goals (1-4 weeks)');
    const longTermTextarea = screen.getByLabelText('Long-term Goals (1-3 months)');

    expect(shortTermTextarea).toHaveAttribute('placeholder', 
      'Write each goal on a separate line:\nReduce pain to 3/10\nImprove sleep quality\nWalk for 15 minutes'
    );
    expect(longTermTextarea).toHaveAttribute('placeholder', 
      'Write each goal on a separate line:\nReturn to sports\nLift heavy objects\nLive pain-free'
    );
  });

  it('displays correct placeholders in Arabic', () => {
    render(
      <EditableGoals
        goals={{ shortTerm: [], longTerm: [], functionalGoals: [] }}
        locale="ar"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('الأهداف قصيرة المدى (1-4 أسابيع)');
    const longTermTextarea = screen.getByLabelText('الأهداف طويلة المدى (1-3 أشهر)');

    expect(shortTermTextarea).toHaveAttribute('placeholder', 
      'اكتب كل هدف في سطر منفصل:\nتقليل الألم إلى 3/10\nتحسين النوم\nالمشي لمدة 15 دقيقة'
    );
    expect(longTermTextarea).toHaveAttribute('placeholder', 
      'اكتب كل هدف في سطر منفصل:\nالعودة إلى ممارسة الرياضة\nرفع الأوزان الثقيلة\nالعيش بدون ألم'
    );
  });

  it('has proper scrollable container for overflow content', () => {
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const container = screen.getByText('Short-term Goals (1-4 weeks)').closest('.space-y-4');
    expect(container).toHaveClass('max-h-96', 'overflow-y-auto');
  });

  it('renders textareas with correct row attributes', () => {
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const shortTermTextarea = screen.getByLabelText('Short-term Goals (1-4 weeks)');
    const longTermTextarea = screen.getByLabelText('Long-term Goals (1-3 months)');

    expect(shortTermTextarea).toHaveAttribute('rows', '4');
    expect(longTermTextarea).toHaveAttribute('rows', '4');
  });

  it('save button has correct styling classes', () => {
    render(
      <EditableGoals
        goals={mockGoals}
        locale="en"
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toHaveClass('flex-1', 'bg-teal-600', 'hover:bg-teal-700');
  });
});*/