import { calculateFinancing } from '@/domains/financing';

const round = (value: unknown, decimals = 2): number => Number(Number(value).toFixed(decimals));

describe('calculateFinancing', () => {
  it('calculates Price installments with a fixed payment', () => {
    const result = calculateFinancing({
      date: '2026-05-25',
      deadline: 12,
      interest: '1',
      type: 'price',
      value: 12000,
    });

    expect(result.installments).toHaveLength(12);
    expect(round(result.installments[0].installment)).toBe(1066.19);
    expect(round(result.installments[1].installment)).toBe(1066.19);
    expect(round(result.installments[0].interest)).toBe(120);
    expect(round(result.installments[0].amortization)).toBe(946.19);
    expect(round(result.installments[11].balance)).toBe(0);
    expect(round(result.total.amortization)).toBe(12000);
    expect(round(result.total.interest)).toBe(794.23);
    expect(round(result.total.installment)).toBe(12794.23);
  });

  it('calculates SAC installments with fixed amortization and decreasing payments', () => {
    const result = calculateFinancing({
      date: '2026-05-25',
      deadline: 12,
      interest: '1',
      type: 'sac',
      value: 12000,
    });

    expect(result.installments).toHaveLength(12);
    expect(round(result.installments[0].amortization)).toBe(1000);
    expect(round(result.installments[0].installment)).toBe(1120);
    expect(round(result.installments[1].installment)).toBe(1110);
    expect(round(result.installments[11].installment)).toBe(1010);
    expect(round(result.installments[11].balance)).toBe(0);
    expect(round(result.total.amortization)).toBe(12000);
    expect(round(result.total.interest)).toBe(780);
    expect(round(result.total.installment)).toBe(12780);
  });

  it('keeps amortization at zero during shortage periods', () => {
    const result = calculateFinancing({
      date: '2026-05-25',
      deadline: 4,
      interest: '1',
      shortage: 1,
      type: 'sac',
      value: 12000,
    });

    expect(round(result.installments[0].amortization)).toBe(0);
    expect(round(result.installments[0].installment)).toBe(120);
    expect(round(result.installments[1].amortization)).toBe(4000);
    expect(round(result.installments[3].balance)).toBe(0);
  });
});
