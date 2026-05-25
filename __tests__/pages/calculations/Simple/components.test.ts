describe('Simple module — component imports', () => {
  it('CalcData can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm/CalcData');
    expect(module.default).toBeDefined();
  });

  it('AccountForm orchestrator can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm');
    expect(module.default).toBeDefined();
  });

  it('AccountList can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountList');
    expect(module.default).toBeDefined();
  });

  it('AuthorForm can be imported', () => {
    const module = require('@/pages/calculations/Simple/AuthorForm');
    expect(module.default).toBeDefined();
  });

  it('OccurrenceForm can be imported', () => {
    const module = require('@/pages/calculations/Simple/OccurrenceForm');
    expect(module.default).toBeDefined();
  });

  it('InterestForm can be imported', () => {
    const module = require('@/pages/calculations/Simple/InterestForm');
    expect(module.default).toBeDefined();
  });

  it('FineForm can be imported', () => {
    const module = require('@/pages/calculations/Simple/FineForm');
    expect(module.default).toBeDefined();
  });

  it('ExpenseForm can be imported', () => {
    const module = require('@/pages/calculations/Simple/ExpenseForm');
    expect(module.default).toBeDefined();
  });

  it('FeeForm can be imported', () => {
    const module = require('@/pages/calculations/Simple/FeeForm');
    expect(module.default).toBeDefined();
  });

  it('Art523Modal can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm/Art523Modal');
    expect(module.default).toBeDefined();
  });

  it('CalcSummary can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm/CalcSummary');
    expect(module.default).toBeDefined();
  });

  it('DetailPrint can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm/DetailPrint');
    expect(module.default).toBeDefined();
  });

  it('Tab can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm/Tab');
    expect(module.default).toBeDefined();
  });

  it('TotalsModal can be imported', () => {
    const module = require('@/pages/calculations/Simple/AccountForm/TotalsModal');
    expect(module.default).toBeDefined();
  });

  it('InstallmentDateModal can be imported', () => {
    const module = require('@/pages/calculations/Simple/OccurrenceForm/InstallmentDateModal');
    expect(module.default).toBeDefined();
  });
});
