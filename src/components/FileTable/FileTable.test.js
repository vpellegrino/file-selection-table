import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import FileTable from './FileTable';

const mockFiles = [
  {
    name: 'smss.exe',
    device: 'Stark',
    path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe',
    status: 'scheduled',
  },
  {
    name: 'netsh.exe',
    device: 'Targaryen',
    path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe',
    status: 'available',
  },
  {
    name: 'uxtheme.dll',
    device: 'Lannister',
    path: '\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll',
    status: 'available',
  },
  {
    name: 'cryptbase.dll',
    device: 'Martell',
    path: '\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll',
    status: 'scheduled',
  },
  {
    name: '7za.exe',
    device: 'Baratheon',
    path: '\\Device\\HarddiskVolume1\\temp\\7za.exe',
    status: 'scheduled',
  },
];

describe('<FileTable />', () => {
  it('displays "None Selected" when no items are selected', () => {
    render(<FileTable files={mockFiles} />);
    expect(screen.getByText(/None Selected/i)).toBeInTheDocument();
  });

  it('selects all available items when "Select All" is clicked', () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all/i,
    });

    // Clicking the "Select All" checkbox
    fireEvent.click(selectAllCheckbox);

    // Only 2 checkboxes should be checked, corresponding to available files
    const availableCheckboxes = screen.getAllByRole('checkbox', {
      name: /select-/i,
    });
    expect(availableCheckboxes.filter((cb) => cb.checked).length).toBe(2);
  });

  it('disables the checkboxes for non-available files', () => {
    render(<FileTable files={mockFiles} />);

    const nonAvailableCheckboxes = screen
      .getAllByRole('checkbox', { name: /select-/i })
      .filter((checkbox) => checkbox.disabled);

    // Ensure that 3 non-available files have disabled checkboxes
    expect(nonAvailableCheckboxes.length).toBe(3);
  });

  it('sets "Select All" to indeterminate when some but not all items are selected', () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all/i,
    });

    // Select one available file manually
    const availableCheckboxes = screen.getAllByRole('checkbox', {
      name: /select-/i,
    });
    fireEvent.click(availableCheckboxes[0]); // Select first available file

    // Check that the Select All checkbox is indeterminate
    expect(selectAllCheckbox.indeterminate).toBe(true);
  });

  it('removes indeterminate state when all or none of the items are selected', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all/i,
    });
    const availableCheckboxes = screen
      .getAllByRole('checkbox', { name: /select-/i })
      .filter((checkbox) => !checkbox.disabled);

    // Select all available files manually
    availableCheckboxes.forEach((checkbox) => fireEvent.click(checkbox));

    // Wait for the "Select All" checkbox to be fully checked
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(true);
    });
    expect(selectAllCheckbox.indeterminate).toBe(false);

    // Deselect all files manually
    availableCheckboxes.forEach((checkbox) => fireEvent.click(checkbox));

    // Wait for the "Select All" checkbox to be unchecked
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(false);
    });
    expect(selectAllCheckbox.indeterminate).toBe(false);
  });

  it('disables Download button when no files are selected', () => {
    render(<FileTable files={mockFiles} />);
    const downloadButton = screen.getByText(/Download Selected/i);
    expect(downloadButton).toBeDisabled();
  });

  it('enables Download button when at least one file is selected', () => {
    render(<FileTable files={mockFiles} />);

    const availableCheckboxes = screen.getAllByRole('checkbox', {
      name: /select-/i,
    });

    // Select an available file
    fireEvent.click(availableCheckboxes[0]);

    // Assert that the download button is enabled
    const downloadButton = screen.getByText(/Download Selected/i);
    expect(downloadButton).not.toBeDisabled();
  });

  it('shows an alert with selected files when Download is clicked', () => {
    global.alert = jest.fn();
    render(<FileTable files={mockFiles} />);

    // Select the available files
    const checkboxes = screen.getAllByRole('checkbox', { name: /select-/i });
    fireEvent.click(checkboxes[0]); // netsh.exe
    fireEvent.click(checkboxes[1]); // uxtheme.dll

    // Click the download button
    const downloadButton = screen.getByText(/Download Selected/i);
    fireEvent.click(downloadButton);

    // Check that the alert is called with selected paths
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Path:'));
  });

  it('reflects the correct count of selected items in the header', () => {
    render(<FileTable files={mockFiles} />);

    const availableCheckboxes = screen.getAllByRole('checkbox', {
      name: /select-/i,
    });

    // Initially should display "None Selected"
    expect(screen.getByText(/None Selected/i)).toBeInTheDocument();

    // Select an available file
    fireEvent.click(availableCheckboxes[0]);

    // Should now display "Selected 1"
    expect(screen.getByText(/Selected 1/i)).toBeInTheDocument();
  });

  it('updates the select-all checkbox state if all files are selected manually', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all/i,
    });

    // Get all available checkboxes (the ones that are not disabled)
    const availableCheckboxes = screen
      .getAllByRole('checkbox', { name: /select-/i })
      .filter((checkbox) => !checkbox.disabled);

    // Manually select all available checkboxes
    availableCheckboxes.forEach((checkbox) => fireEvent.click(checkbox));

    // Check that the Select All checkbox is fully checked
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(true);
    });
  });

  it('unchecks the select-all checkbox if files are deselected manually', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: /select all/i,
    });
    const availableCheckboxes = screen.getAllByRole('checkbox', {
      name: /select-/i,
    });

    // Select all available checkboxes
    availableCheckboxes.forEach((checkbox) => fireEvent.click(checkbox));

    // Deselect the first available file
    fireEvent.click(availableCheckboxes[0]);

    // Check that the Select All checkbox is unchecked
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(false);
    });
    expect(selectAllCheckbox.indeterminate).toBe(true); // Indeterminate when some but not all are selected
  });
});
