import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { renderHook, render, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useMedicalAnalysis } from '@/hooks/useMedicalAnalysis';
import { HospitalMap } from '@/components/HospitalMap';
import { t } from '@/lib/translations';

describe('ArogyaMitraa Security & Triage Suite', () => {
  it('excludes .env files, private keys, and certificates from git tracking', () => {
    const repoRoot = process.cwd();
    const gitignore = fs.readFileSync(path.join(repoRoot, '.gitignore'), 'utf8');
    expect(gitignore).toContain('.env');
    expect(gitignore).toContain('*.key');
    expect(gitignore).toContain('*.pem');
    expect(gitignore).toContain('*.crt');

    const tracked = execSync('git ls-files', { cwd: repoRoot, encoding: 'utf8' })
      .split(/\r?\n/)
      .filter(Boolean);
    const forbidden = tracked.filter((f) =>
      f === '.env' ||
      (f.startsWith('.env.') && f !== '.env.example') ||
      /\.(key|pem|crt)$/i.test(f)
    );
    expect(forbidden).toEqual([]);
  });

  it('classifies emergency, monitor, and out-of-scope inputs consistently without unsafe evaluation', () => {
    const { result } = renderHook(() => useMedicalAnalysis());

    const emergency = result.current.analyze('I have severe chest pain and cant breathe', 'en');
    expect(emergency.isEmergency).toBe(true);
    expect(emergency.status).toBe('emergency');

    const monitor = result.current.analyze('I have a mild fever and cough', 'en');
    expect(monitor.isEmergency).toBe(false);
    expect(monitor.status).toBe('monitor');

    const outOfScope = result.current.analyze('Who won the cricket match yesterday?', 'en');
    expect(outOfScope.isEmergency).toBe(false);
    expect(outOfScope.status).toBe('safe');
  });

  it('opens external hospital map links with noopener,noreferrer window features', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    const originalGeolocation = navigator.geolocation;
    Object.defineProperty(navigator, 'geolocation', {
      configurable: true,
      value: {
        getCurrentPosition: (_success: PositionCallback, err: PositionErrorCallback) => {
          err({ code: 1, message: 'denied', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 });
        }
      }
    });

    try {
      const { getByText } = render(<HospitalMap isOpen={true} onClose={() => {}} language="en" />);
      fireEvent.click(getByText(t.viewHospitals.en));
      expect(openSpy).toHaveBeenCalledWith(
        expect.stringContaining('https://www.google.com/maps/'),
        '_blank',
        'noopener,noreferrer'
      );
    } finally {
      openSpy.mockRestore();
      Object.defineProperty(navigator, 'geolocation', { configurable: true, value: originalGeolocation });
    }
  });
});
