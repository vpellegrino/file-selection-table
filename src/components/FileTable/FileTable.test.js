import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FileTable from './FileTable';

const SELECT_ALL_CHECKBOX_LABEL = /select all/i;
const SELECT_FILE_CHECKBOX_LABEL = /select the file/i;
const DOWNLOAD_BUTTON_TEXT = 'Download Selected';

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

const selectAllFiles = () => {
  const selectAllCheckbox = screen.getByRole('checkbox', {
    name: SELECT_ALL_CHECKBOX_LABEL,
  });
  fireEvent.click(selectAllCheckbox);
};

const getAllAvailableCheckboxes = () =>
  screen
    .getAllByRole('checkbox', { name: SELECT_FILE_CHECKBOX_LABEL })
    .filter((checkbox) => !checkbox.disabled);

const getNonAvailableCheckboxes = () =>
  screen
    .getAllByRole('checkbox', { name: SELECT_FILE_CHECKBOX_LABEL })
    .filter((checkbox) => checkbox.disabled);

const clickCheckboxes = (checkboxes) =>
  checkboxes.forEach((checkbox) => fireEvent.click(checkbox));

const getDownloadButton = () => screen.getByText(DOWNLOAD_BUTTON_TEXT);

describe('<FileTable />', () => {
  it('displays "None Selected" when no items are selected', () => {
    render(<FileTable files={mockFiles} />);

    expect(screen.getByText(/None Selected/i)).toBeInTheDocument();
  });

  it('selects all available items when "Select All" is clicked', () => {
    render(<FileTable files={mockFiles} />);

    selectAllFiles();

    const availableCheckboxes = getAllAvailableCheckboxes();
    expect(availableCheckboxes.filter((cb) => cb.checked).length).toBe(2);
  });

  it('disables the checkboxes for non-available files', () => {
    render(<FileTable files={mockFiles} />);

    const nonAvailableCheckboxes = getNonAvailableCheckboxes();
    expect(nonAvailableCheckboxes.length).toBe(3);
  });

  it('sets "Select All" to indeterminate when some but not all items are selected', () => {
    render(<FileTable files={mockFiles} />);

    const availableCheckboxes = getAllAvailableCheckboxes();
    fireEvent.click(availableCheckboxes[0]);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: SELECT_ALL_CHECKBOX_LABEL,
    });
    expect(selectAllCheckbox.indeterminate).toBe(true);
  });

  it('removes indeterminate state when all or none of the items are selected', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: SELECT_ALL_CHECKBOX_LABEL,
    });
    const availableCheckboxes = getAllAvailableCheckboxes();

    clickCheckboxes(availableCheckboxes);
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(true);
    });
    expect(selectAllCheckbox.indeterminate).toBe(false);

    clickCheckboxes(availableCheckboxes);
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(false);
    });
    expect(selectAllCheckbox.indeterminate).toBe(false);
  });

  it('disables the Download button when no files are selected', () => {
    render(<FileTable files={mockFiles} />);

    expect(getDownloadButton()).toBeDisabled();
  });

  it('enables the Download button when at least one file is selected', () => {
    render(<FileTable files={mockFiles} />);

    const availableCheckboxes = getAllAvailableCheckboxes();
    fireEvent.click(availableCheckboxes[0]);

    expect(getDownloadButton()).not.toBeDisabled();
  });

  it('shows an alert with selected files when Download is clicked', () => {
    render(<FileTable files={mockFiles} />);

    global.alert = jest.fn();
    const availableCheckboxes = getAllAvailableCheckboxes();

    fireEvent.click(availableCheckboxes[0]); // Select netsh.exe
    fireEvent.click(availableCheckboxes[1]); // Select uxtheme.dll

    fireEvent.click(getDownloadButton());

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Path:'));
  });

  it('reflects the correct count of selected items in the header', () => {
    render(<FileTable files={mockFiles} />);

    const availableCheckboxes = getAllAvailableCheckboxes();
    expect(screen.getByText(/None Selected/i)).toBeInTheDocument();

    fireEvent.click(availableCheckboxes[0]);
    expect(screen.getByText(/Selected 1/i)).toBeInTheDocument();
  });

  it('updates the select-all checkbox state if all files are selected manually', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: SELECT_ALL_CHECKBOX_LABEL,
    });
    const availableCheckboxes = getAllAvailableCheckboxes();

    clickCheckboxes(availableCheckboxes);
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(true);
    });
  });

  it('unchecks the select-all checkbox if files are deselected manually', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: SELECT_ALL_CHECKBOX_LABEL,
    });
    const availableCheckboxes = getAllAvailableCheckboxes();

    clickCheckboxes(availableCheckboxes);
    fireEvent.click(availableCheckboxes[0]);

    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(false);
    });
    expect(selectAllCheckbox.indeterminate).toBe(true);
  });

  it('unchecks the select-all checkbox if all available files are deselected after being selected', async () => {
    render(<FileTable files={mockFiles} />);

    const selectAllCheckbox = screen.getByRole('checkbox', {
      name: SELECT_ALL_CHECKBOX_LABEL,
    });
    const availableCheckboxes = getAllAvailableCheckboxes();

    clickCheckboxes(availableCheckboxes);
    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(true);
    });

    clickCheckboxes(availableCheckboxes);

    await waitFor(() => {
      expect(selectAllCheckbox.checked).toBe(false);
    });
    expect(selectAllCheckbox.indeterminate).toBe(false);
  });
});
