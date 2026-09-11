import { describe, expect, it } from 'vitest';
import { getContrastRatio, meetsNonTextContrast, meetsTextContrast } from '../colorContrast';

describe('colorContrast', () => {
  it('computes maximum contrast for black on white', () => {
    expect(getContrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('computes minimum contrast for identical colors', () => {
    expect(getContrastRatio('#7B209E', '#7B209E')).toBeCloseTo(1, 5);
  });

  it('is symmetric regardless of argument order', () => {
    expect(getContrastRatio('#1C1B1F', '#FFFFFF')).toBeCloseTo(
      getContrastRatio('#FFFFFF', '#1C1B1F'),
      5,
    );
  });

  it('matches the manually computed ratio for the primary text token on white', () => {
    // 1C1B1F on FFFFFF — see the token migration report's contrast audit.
    expect(getContrastRatio('#1C1B1F', '#FFFFFF')).toBeCloseTo(17.1, 0);
  });

  it('flags the pink brand color as failing normal-text contrast on white', () => {
    // FF387B on FFFFFF — a known spec defect (~3.4:1, below the 4.5:1 minimum).
    expect(meetsTextContrast('#FF387B', '#FFFFFF')).toBe(false);
  });

  it('flags the form-field border as failing the non-text minimum on the page background', () => {
    // 8F8F8F on F1F1FF — ~2.9:1, below the 3:1 non-text minimum.
    expect(meetsNonTextContrast('#8F8F8F', '#F1F1FF')).toBe(false);
  });

  it('passes the form-field border against the non-text minimum on white', () => {
    expect(meetsNonTextContrast('#8F8F8F', '#FFFFFF')).toBe(true);
  });
});
