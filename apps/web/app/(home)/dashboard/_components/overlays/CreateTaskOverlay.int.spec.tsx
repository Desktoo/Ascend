import "@testing-library/jest-dom/vitest";
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateTaskOverlay from './CreateTaskOverlay';
import { SWRConfig } from 'swr';
import { taskService } from '@/core/services/tasks/tasks.service';

vi.mock('@/core/services/tasks/tasks.service', () => ({
  taskService: {
    createTask: vi.fn(),
  },
}));

describe('Integration: CreateTaskOverlay (Modals & Overlays)', () => {
  const mockOnClose = vi.fn();
  const mockDashboardUrl = '/dashboard';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        {ui}
      </SWRConfig>
    );
  };

  it('renders nothing when isOpen is false', () => {
    renderWithProviders(
      <CreateTaskOverlay 
        isOpen={false} 
        onClose={mockOnClose} 
        todaysTasks={[]} 
        abandonedTasks={[]} 
        dashboardUrl={mockDashboardUrl} 
      />
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal and closes when cancel button or X is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CreateTaskOverlay 
        isOpen={true} 
        onClose={mockOnClose} 
        todaysTasks={[]} 
        abandonedTasks={[]} 
        dashboardUrl={mockDashboardUrl} 
      />
    );

    // Cancel Button
    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelBtn);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

    // In a real browser we would test Escape key, but we need to verify the X button as well
    // Assuming the X button is the first button without explicit text in the header
    const closeButtons = screen.getAllByRole('button');
    // Header close button is typically the first one before the form
    await user.click(closeButtons[0]);
    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('prevents submission if required Task Identifier is empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <CreateTaskOverlay 
        isOpen={true} 
        onClose={mockOnClose} 
        todaysTasks={[]} 
        abandonedTasks={[]} 
        dashboardUrl={mockDashboardUrl} 
      />
    );

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // HTML5 native validation intercepts it
    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it('submits valid task payload, updates UI states, and closes modal', async () => {
    const user = userEvent.setup();
    vi.mocked(taskService.createTask).mockResolvedValueOnce({ id: '123', title: 'Test Task' } as any);

    renderWithProviders(
      <CreateTaskOverlay 
        isOpen={true} 
        onClose={mockOnClose} 
        todaysTasks={[]} 
        abandonedTasks={[]} 
        dashboardUrl={mockDashboardUrl} 
      />
    );

    await user.type(screen.getByPlaceholderText(/finish project report/i), 'New Automated Task');
    
    // Choose High Priority
    await user.click(screen.getByRole('button', { name: /high/i }));

    const submitBtn = screen.getByRole('button', { name: /create task/i });
    await user.click(submitBtn);

    // Validate Mutation
    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith(
        '/tasks/create',
        expect.objectContaining({
          arg: expect.objectContaining({
            title: 'New Automated Task',
            priority: 'HIGH'
          })
        })
      );
    });

    // Validate Closure
    expect(mockOnClose).toHaveBeenCalled();
  });
});
