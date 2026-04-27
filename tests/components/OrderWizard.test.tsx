import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderWizard from '@/components/custom-order/OrderWizard';

describe('OrderWizard', () => {
  it('renders step 1 on mount', () => {
    render(<OrderWizard />);
    expect(screen.getByText('What are you looking to engrave?')).toBeInTheDocument();
  });

  it('Next button is disabled when no product type selected', () => {
    render(<OrderWizard />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('Next button enables after selecting a product type', () => {
    render(<OrderWizard />);
    fireEvent.click(screen.getByText('Cutting Board'));
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('advances to step 2 on Next click', () => {
    render(<OrderWizard />);
    fireEvent.click(screen.getByText('Cutting Board'));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Tell us about your engraving')).toBeInTheDocument();
  });

  it('Back button returns to step 1 from step 2', () => {
    render(<OrderWizard />);
    fireEvent.click(screen.getByText('Cutting Board'));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByText('What are you looking to engrave?')).toBeInTheDocument();
  });
});
